# Deployment

The frontend stays on Vercel. The backend needs a normal, always-on Node host.

**Why not Vercel for the backend?** `server.js` is a long-running Express server, and `/api/realtime/events` keeps Server-Sent Events connections open. Vercel functions are short-lived and per request: in-memory state (SSE clients, the login rate limiter) would not be shared, and open streams are cut off at the function timeout. Use a small VPS (DigitalOcean, Hetzner, AWS Lightsail, Oracle Cloud free tier) with pm2 and nginx, as below. Render or Railway also work if you'd rather not manage a server, but skip the nginx and certbot steps there.

The steps assume Ubuntu 22.04/24.04, an API domain `api.example.com` (replace with yours) pointing at the server's IP with a DNS A record, and the frontend at `https://your-frontend.vercel.app`.

## 1. MongoDB Atlas

1. Create a cluster and a database user with a strong password (Database Access → Add user, role "Read and write to any database").
2. Network Access → Add IP Address → the server's public IP. Avoid `0.0.0.0/0` in production; if you must allow it temporarily, remove it once the server IP is added.
3. Connect → Drivers → copy the connection string. Put the database name before the `?`, e.g. `.../kiet-portal?retryWrites=true&w=majority`.

## 2. Server setup

```bash
# Node.js 22 LTS, git, nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx
sudo npm install -g pm2

git clone https://github.com/Ashwinidurga7/c4gt-College-Engagement-Dashboard.git kiet-portal
cd kiet-portal
npm ci --omit=dev

cp .env.example .env
nano .env    # fill in the values below
```

`.env` for production:

```ini
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/kiet-portal?retryWrites=true&w=majority
JWT_SECRET=<output of: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))">
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

The server refuses to start without `JWT_SECRET` (and in production, with one shorter than 32 characters). Changing `JWT_SECRET` signs everyone out.

Create the login accounts once (safe to re-run; it never deletes data):

```bash
npm run seed:users
```

It prints each account's password once. Share them privately, then clear the terminal. Run with `-- --reset-passwords` to issue new ones, and add `-- --save ~/kiet-logins.csv` to also get them as a spreadsheet (saved outside the repository only; delete it once everyone has their password).

## 3. Run with pm2

```bash
pm2 start server.js --name kiet-api
pm2 save
pm2 startup        # run the command it prints, so the API starts again after a reboot
pm2 logs kiet-api  # follow the logs
```

Run it as a single process (not `-i max` cluster mode): SSE clients and the login rate limiter live in memory.

## 4. nginx reverse proxy

`/etc/nginx/sites-available/kiet-api`:

```nginx
server {
    listen 80;
    server_name api.example.com;

    # Resume PDFs are up to 5 MB (nginx allows 1 MB by default)
    client_max_body_size 6m;

    # Server-Sent Events: no buffering, long-lived connection
    location /api/realtime/events {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 24h;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/kiet-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

The API trusts the proxy on the same machine (`TRUST_PROXY=loopback` by default), so the login rate limit sees real client IPs. Keep port 5000 closed to the internet:

```bash
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
```

## 5. HTTPS with certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.example.com
```

Certbot adds the 443 server block and renews automatically. Check with `sudo certbot renew --dry-run`.

Then check: `curl https://api.example.com/api/health` should return `"database":"connected"` (it answers 503 while MongoDB is unreachable).

## 6. Frontend on Vercel

Project → Settings → Environment Variables (Production), then redeploy:

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://api.example.com` (no `/api`, no trailing slash) |
| `VITE_USE_MOCK` | `true` |
| `VITE_REAL_MODULES` | `auth,resume` |

Sign-in and the resume module (uploads, builder draft, history) then use the database, and the other modules keep their mock data until their endpoints are ready. Once every module is real, set `VITE_USE_MOCK=false` and drop `VITE_REAL_MODULES`.

`CORS_ORIGIN` on the server must match the Vercel URL exactly (scheme and host, no trailing slash). Add preview or custom domains comma separated.

## Updating

```bash
cd ~/kiet-portal
git pull
npm ci --omit=dev
pm2 restart kiet-api
```

## Troubleshooting

- **Browser shows a CORS error:** the page's origin is not in `CORS_ORIGIN`. Fix `.env`, then `pm2 restart kiet-api`.
- **`MongoServerSelectionError`:** the server's IP is not in the Atlas Network Access list, or the URI or password is wrong.
- **Resume upload fails with 413:** `client_max_body_size` is missing from the nginx config.
- **Realtime updates arrive late or in bursts:** `proxy_buffering off` is missing on `/api/realtime/events`.
- **Everyone was signed out:** `JWT_SECRET` changed.
