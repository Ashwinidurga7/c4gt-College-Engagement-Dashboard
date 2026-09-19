# KIET College Portal: Frontend

Engagement and management portal for KIET Group of Institutions (KIET, KIET+, KIEW).
React 18, Vite, Tailwind CSS v4, shadcn/ui, React Router, TanStack Query.

> A full README (folder guide, mock versus real endpoints) is part of Phase 7. See `ASSUMPTIONS.md` for current decisions.

## Quick start

```bash
npm install
cp .env.example .env      # set VITE_USE_MOCK=true to run without the backend
npm run dev               # http://localhost:5173
npm run build && npm run preview
npm run lint
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:5000` | Backend origin; the client adds `/api` |
| `VITE_USE_MOCK` | `false` | `true` serves every module from `src/mocks/` |

In mock mode, sign in with any demo account listed under the login form (password `Kiet@2026`).

## Brand assets

Place `kietlogo.png` and `campus.jpg` in `public/`. Until then, neutral placeholders are shown.
