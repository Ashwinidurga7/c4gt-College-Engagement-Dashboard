# Assumptions log

Decisions made where the implementation plan, the reference images and the available inputs did not settle a question. Each entry says what was assumed and what would change it.

## Inputs available at Phase 0

| Input | Status | Consequence |
| --- | --- | --- |
| `refLogin.png` | Supplied as a JPEG (`docs/references/refLogin.jpeg`) | Used as the login reference |
| `refDashboard.png` | Not supplied under that name. The attendance screen (`docs/references/refDashboard.png`) is the most detailed dashboard reference | Used as the dashboard reference; `refScreens1.png`, `refScreens2.png` and `refClubPage.png` are supporting references |
| `src/styles/tokens.css` from PR #21 | Not available | Tokens built from the plan's fallback values, adjusted to the reference images (below) |
| `college-management.postman_collection.json`, Swagger `/api-docs` | Not available (no backend in this workspace) | Request/response shapes are guessed defensively in service adapters and **must be confirmed** (see "Backend contracts") |
| `/public/kietlogo.png` | Missing | `BrandLogo` renders a neutral text wordmark; drop the file in `public/` and it is used automatically |
| `/public/campus.jpg` | Missing | `CampusImage` renders a neutral placeholder; drop the file in `public/` and it is used automatically |
| Existing `/frontend` folder and repository | Not available | A new git repository was initialised on branch `feat/frontend-rewrite` with the app in `frontend/` |

## Reference image descriptions

- **Login (`refLogin.jpeg`)**: brand block top-left (logo, "KIET Group of Institutions", "Performance • Excellence • Character"); "Learn / Participate / Grow" with a short blue rule and subtitle on the left; centred white card with "College All-Activities Dashboard", email, password with eye toggle, Remember me, Forgot password, full-width blue Sign In, and an "Access for" row of role icons in tinted circles; campus building photo fading in on the right; two overlapping blue waves at the bottom-left.
- **Dashboard (`refDashboard.png`)**: dark navy sidebar with white text and a bright-blue active pill; white topbar with hamburger, title, notification bell with red dot and a profile chip; page header with a blue icon tile, bold navy title and muted subtitle; white cards with thin borders and 12px radius on a very light blue canvas; tinted stat tiles (green present, red absent, blue working days); tables with pill-shaped status badges that pair an icon with text; a "Demo Data" badge and sample-data footnote.
- **Screen grids and club page**: the same shell applied to results, projects, certificates, clubs, sports, NCC/NSS and a rich club detail page (hero banner, social links, stats, gallery, upcoming events).

## Design tokens (final)

All values live in `src/styles/tokens.css`; components use only token-backed Tailwind classes.

| Token | Light | Dark | Source |
| --- | --- | --- | --- |
| Brand blue `--kiet-blue` | `#1b4594` | `#7fa8f5` | Plan |
| Headings `--text-heading` | `#0f2557` | `#e3ebfd` | Plan |
| Brand red `--kiet-red` | `#df2927` | `#f26b69` | Plan; alerts and the logo dot only |
| Canvas `--canvas` | `#f3f6fb` | `#0b1220` | Images (light blue-white) instead of the plan's mint `#f0f7f5`; the plan allows "mint or light-blue" |
| Action blue `--action-primary` | `#1d58c7` | `#2f63cf` | Images: buttons and the active nav item are a brighter blue than `#1b4594`. White text on it is 6.4:1 (light) and 5.5:1 (dark) |
| Sidebar `--sidebar-bg` | `#0f2557` | `#0a1224` | Images (navy sidebar) |
| Border / muted / success / warning | `#e2e8f0` / `#64748b` / `#16a34a` / `#d97706` | Dark equivalents | Plan |
| Input border `--border-input` | `#8391a8` | `#5a6d90` | Chosen for about 3:1 contrast against the card, so field outlines meet WCAG 1.4.11 |
| Card radius / control radius | 12px / 8px | same | Plan |
| Font | Maven Pro (Google Fonts), system-ui fallback | | Plan |

## Conflicts between the plan and the images

1. **Login identifier**: images say "Email / Student ID"; the plan says email only. **Email only** (functionality: the plan wins).
2. **Portal selector**: images show 4 roles; the plan requires 5. **CTPO added** as a fifth option.
3. **Login composition**: the plan text describes a left panel with the campus image; `refLogin` puts the card in the centre and the photo on the right. **The reference composition is used**, because the plan says the login should closely follow it. The plan's heading sits in the card (as in the image) and the plan's subtitle sits under "Learn / Participate / Grow" (it shows under the heading on screens narrower than `xl`).
4. **Icon colours**: the plan says icons are navy or blue; the images use tinted multi-colour tiles for roles and stats. **Tinted tiles follow the images** (images win for colour), limited to five token tones (`--tone-*`). Standalone icons (topbar, headers, nav) stay navy or blue. Revisit if strict blue-only is preferred.
5. **Gradients**: the images use gradient hero banners on club and sports pages. The plan allows two gradients in total, on the login page only. The two are the front login wave and the campus photo fade. Future banners will be flat navy.
6. **Two taglines**: "Performance • Excellence • Character" is the brand motto in the brand block; "Learn • Participate • Grow" is the product tagline on the login page and the sidebar footer.
7. **Sidebar items only in the images** (Sports, NCC, NSS, Assignments, Co-Curricular, Achievements, Internships): no routes in the plan. NCC, NSS and technical clubs (C4GT, GCC and others) will be handled as clubs under Clubs (Phase 2). Achievements and Internships are portfolio tabs. Sports and Assignments are left out until endpoints or plan entries exist.
8. **Club "Join" actions**: there is no endpoint; they will render as disabled Preview actions when clubs are built.

## Behaviour decisions

- **Registration fields**: a student registers with name, email, password, role, college and department. Faculty adds `assignedYears` (numbers 1–4), HOD adds `academicYear` (`YYYY-YY`), CTPO adds `year` (number) and `section` (A–D). `role` is sent only to `/api/auth/register`; the HOD and CTPO endpoints imply it. **Confirm against Postman.**
- **Student registration is not approval-gated** (the plan lists only Faculty, HOD and CTPO as pending). If the API returns `approvalStatus: "pending"` for any role, the Awaiting approval screen is shown.
- **Pending accounts at login**: if the login response carries `approvalStatus: "pending"`, or the API answers 403 with a message mentioning approval, the user is shown the pending state instead of signing in.
- **Portal mismatch**: after a successful login whose role differs from the selected portal, the session is **not** stored until the user chooses "Continue to {role} dashboard".
- **Remember me** is unchecked by default (as in the reference). Checked stores the token in `localStorage`; unchecked uses `sessionStorage`.
- **Session restore**: a 401/403 from `/api/auth/me` clears the token. A network failure keeps it and shows a retry screen, so a backend restart does not log everyone out.
- **Forgot password**: a dialog tells the user to contact their college admin office (no endpoint exists).
- **Global search** searches the pages available to the signed-in role and jumps to the match. Content search needs endpoints and is out of scope.
- **Notification bell** appears for roles with a Notifications page (student, faculty). Its unread count arrives in Phase 2.
- **Favicon**: one KIET monogram favicon for the whole app. Page titles are set per route (`{Page} · KIET Portal`).
- **Campus photo** is shown on the login page at `lg` and wider only; smaller screens prioritise the form.

## Mock mode

- `VITE_USE_MOCK=true` routes auth (and later every service) to `src/mocks/`. Demo accounts use the password `Kiet@2026`, which is mock-only and never sent to a real API:
  - Student `ashwini.durga@kiet.edu`, Faculty `ramesh.varma@kiet.edu`, HOD `hod.cse@kiet.edu`, CTPO `srinivasa.rao@kiet.edu`, Admin `admin@kiet.edu`.
- Mock mode shows a "Demo accounts" helper under the login form that fills in the credentials.
- Mock registrations live in memory until the page reloads.
- The mock domain `@kiet.edu` is a placeholder; replace it with the real institutional domain when known.

## Backend contracts to confirm (Postman / Swagger)

- Login returns `{ user: { id, name, email, role }, token }` inside the `{ success, message, data }` envelope.
- `/api/auth/me` returns the user directly or as `{ user }`. The adapter accepts both, plus `_id` or `id`.
- Registration responses include `approvalStatus`.
- Error bodies carry a human-readable `message`, used verbatim in the UI.

## Technical notes

- **React 18 and shadcn/ui**: the shadcn CLI (v4) generates React 19-style components that take `ref` as a prop. For React 18, the generated components in `src/components/ui/` were wrapped in `React.forwardRef`; without this, form registration and Radix `asChild` triggers break and React logs warnings. Re-apply this after adding new shadcn components.
- The shadcn CLI also added an unrelated npm package named `cn` and rewrote imports to it; that was reverted to the standard `@/lib/utils` helper.
- Vite 8 builds with Rolldown; vendor libraries are split into long-lived chunks and pages are lazy-loaded per route.
