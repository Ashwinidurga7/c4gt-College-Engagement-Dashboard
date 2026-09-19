# KIET College Portal: Frontend

Engagement and management portal for KIET Group of Institutions (KIET, KIET+, KIEW), with separate workspaces for students, faculty, CTPOs, HODs and admins.

React 18, Vite, Tailwind CSS v4, shadcn/ui (Radix), React Router, TanStack Query, React Hook Form with Zod, Recharts.

Design and behaviour decisions, plus every backend contract that still needs confirming, are recorded in [`ASSUMPTIONS.md`](ASSUMPTIONS.md).

## Quick start

Requires Node.js 20 or later.

```bash
npm install
cp .env.example .env      # set VITE_USE_MOCK=true to run without the backend
npm run dev               # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:5000` | Backend origin. The client adds `/api`, so do not include it. A trailing slash is ignored. |
| `VITE_USE_MOCK` | `false` | `true` serves every module from `src/mocks/` and needs no backend |

Vite reads these at build time, so restart `npm run dev` (or rebuild) after changing them.

## Mock versus real endpoints

**Switching.** Set `VITE_USE_MOCK=true` in `.env` to run the whole app against local mock data, or `false` to call the backend at `VITE_API_URL`. Nothing else changes: pages and hooks never know which source they are using.

**How it works.** Every request goes through a service in `src/services/`. Each service function chooses its source in one line:

```js
const raw = env.useMock ? await eventsMock.list(query) : await apiClient.get('/events', { params: toListParams(query) })
return toPage(raw?.events ?? raw, query, toEvent)
```

Both sources return raw data, which the adapters (`*Adapters.js`) turn into the shapes the UI uses. The adapters accept common field-name variants, so a small difference in the backend response usually needs a change in one adapter only.

**Demo accounts (mock mode).** The login page shows a "Demo accounts" helper that fills in the credentials. All use the password `Kiet@2026`:

| Role | Email |
| --- | --- |
| Student | `ashwini.durga@kiet.edu` |
| Faculty | `ramesh.varma@kiet.edu` |
| HOD | `hod.cse@kiet.edu` |
| CTPO | `srinivasa.rao@kiet.edu` |
| Admin | `admin@kiet.edu` |

Changes made in mock mode (registrations, approvals, uploads, club edits) are kept in memory and reset when the page reloads.

**Preview modules are always mock.** Timetable, exam schedule, fees, departments, course catalog, reports, settings, bus pass, facilities and take attendance have no backend endpoints yet. They go through `services/previewService.js` to `src/mocks/preview/` whatever `VITE_USE_MOCK` says, and carry a Preview badge. When an endpoint ships, replace the matching `previewService` function with an `apiClient` call and remove the `preview` flag from its entry in `lib/navigation.js`.

**Real API behaviour.** `services/apiClient.js` adds the bearer token, unwraps the `{ success, message, data }` envelope, and turns failures into an `ApiError` with a readable message. A 401 on any request ends the session.

## Folder guide

```
frontend/
├─ public/                  favicon; place kietlogo.png and campus.jpg here
├─ ASSUMPTIONS.md           decisions log and backend contracts to confirm
└─ src/
   ├─ main.jsx              entry point
   ├─ app/                  providers (auth, theme, React Query) and the router
   ├─ components/
   │  ├─ ui/                shadcn/ui primitives (wrapped in forwardRef for React 18)
   │  ├─ layout/            app shell: sidebar, topbar, mobile drawer, search, menus
   │  └─ common/            shared building blocks: DataTable, QueryView, dialogs,
   │                        empty/error states, stat cards, badges, form fields
   ├─ features/<module>/    one folder per screen area (student, faculty, hod, admin,
   │                        clubs, timetable, fees, ...), holding its pages and parts
   ├─ hooks/                React Query hooks per area (useStudent, useStaff, useAdmin,
   │                        usePreview, ...) plus UI hooks (useListQuery, useReturnFocus)
   ├─ services/             API calls and response adapters; the only code that
   │                        talks to the backend or the mocks
   ├─ mocks/                seeded mock data and handlers; mocks/preview/ for
   │                        mock-only modules
   ├─ lib/                  pure helpers: navigation and roles, query keys, formatting,
   │                        attendance and grade calculations, CSV, env
   └─ styles/               tokens.css (every colour, light and dark) and globals
```

**Adding a page.** Add the item to the role's section in `lib/navigation.js` (the sidebar, breadcrumbs and search read from it), then register the page component in `app/router.jsx`. The router refuses to start if a navigation item has no page, so the two cannot drift apart.

**Styling.** Colours come only from `src/styles/tokens.css` through Tailwind classes such as `bg-card`, `text-heading` or `bg-tone-blue`. Do not write hex values in components. Every token has a light and a dark value.

## Brand assets

Place `kietlogo.png` and `campus.jpg` in `public/`. Until then, a neutral text wordmark and a campus placeholder are shown.

## Accessibility and responsiveness

- Every page is designed for 375px, 768px and 1280px widths. Wide tables and the timetable scroll inside their own card, which can also be scrolled with the keyboard.
- Light and dark themes follow the system setting until the user picks one; the choice is remembered.
- Charts are hidden from screen readers and paired with a text summary of the same numbers.
- Dialogs return focus to the control that opened them. Motion is limited to essential feedback.
