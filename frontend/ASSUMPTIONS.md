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
| Border / muted / success / warning | `#e2e8f0` / `#55657a` / `#16a34a` / `#d97706` | Dark equivalents | Plan; muted text darkened from `#64748b` in Phase 7 (see below) |
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
- **Notification bell** appears for roles with a Notifications page (student, faculty) and shows the unread count.
- **Favicon**: one KIET monogram favicon for the whole app. Page titles are set per route (`{Page} · KIET Portal`).
- **Campus photo** is shown on the login page at `lg` and wider only; smaller screens prioritise the form.

## Mock mode

- `VITE_USE_MOCK=true` routes every service to `src/mocks/`. Demo accounts use the password `Kiet@2026`, which is mock-only and never sent to a real API:
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

## Phase 1: Student core

### Endpoints used
`GET /api/students/dashboard`, `profile`, `academic`, `courses`, `attendance`, `academic-report`, `upcoming-events`, and `PUT /api/students/profile`. Response shapes are unconfirmed, so every one goes through an adapter in `services/studentAdapters.js` that accepts common field-name variants (`_id`/`id`, `rollNumber`/`rollNo`, `conducted`/`total`, `attended`/`present`, and so on) and derives anything missing:
- **Attendance**: if the API returns only class records, the subject, monthly and overall totals are computed from them (`lib/attendanceSummary.js`).
- **Academic report**: SGPA and CGPA are computed from course credits and grade points when not supplied.
- **Dashboard**: stats are read from `stats.*` or from the top level; activities from `recentActivities`/`activities`; announcements from `announcements`/`notices`/`updates`.

### Decisions
- **Editable profile fields**: mobile, guardian name, guardian mobile, address and bio. Identity and academic fields are read-only ("managed by the college office"). Mobile numbers must be 10-digit Indian numbers starting with 6–9. **Confirm which fields `PUT profile` accepts.**
- **Grading scale**: R23-style: O (90+) = 10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, F (below 40) = 0. Marks are internal (out of 30) plus external (out of 70).
- **Low attendance** is below 75%. The alert names each subject below the line and how many consecutive classes would bring it back to 75%.
- **Courses list**: search (`search`), filter (`type`), sort (`sortBy`, `order`) and paging (`page`, `limit`) are sent as query parameters. If the API returns a bare array instead of a paginated object, the list is filtered and paged locally, since a student's course list is small.
- **Campus updates** on the dashboard come from the dashboard response (announcements), not from personal notifications; notifications arrive in Phase 2.
- **Programme length**: 8 semesters and 160 credits (mock value, shown as "of 160 required").
- **Motion**: skeletons are static (no pulse) and chart animations are off, per the motion rule. The only moving elements are button spinners during a submit, kept as essential feedback.
- **Charts** are hidden from screen readers and replaced by a text summary of the same numbers. The donut is plain SVG (`ProgressRing`); bar charts use Recharts with token colours.

### Mock data
- The demo student is B. Ashwini Durga, CSE 3rd year, section A, R23, semester 5. Mock "today" is 19 Sep 2026.
- Attendance comes from about 145 seeded class records (1 Jul – 18 Sep 2026, Monday–Saturday, excluding holidays). Every total on the dashboard, attendance page and alert is derived from those records, so they always agree.
- Semester 1–4 results use seeded marks; grades, SGPA, CGPA, credits earned and backlogs are all derived from them.

## Phase 2: Portfolio and campus

### Endpoints used
Certifications (`/api/certifications`, full CRUD), certificates (`/api/certificates`: list, upload, delete), projects (`/api/projects`, full CRUD), internships (`/api/internships`: list, add, delete), resumes (`/api/resumes`: list, upload, `PATCH /:id/primary`, delete), `GET /api/students/achievements` and `/activities`, clubs (`GET /api/clubs`, `/:id`), events (`GET /api/events`, `/:id`), notifications (`GET /api/notifications`, `/unread`, `PUT /:id/read`, `PUT /read-all`). Lists are read from `items`, `docs`, `results` or `data`, or from a named key (`certifications`, `projects`, `clubs`, `events`, `notifications`, …), or from a bare array.

### Decisions to confirm against Postman
- **Upload field names**: certificates are sent as multipart with the file in `certificate`, resumes in `resume`. Other certificate fields: `title`, `category`, `issuedBy`, `date`. Limits enforced in the UI: 5 MB; PDF/JPG/PNG for certificates, PDF for resumes.
- **Field names** the forms send: certification `name, issuer, issueDate, expiryDate, credentialId, credentialUrl`; project `title, description, techStack[], status (ongoing|completed), startDate, endDate, repoUrl, liveUrl`; internship `company, role, mode (Onsite|Remote|Hybrid), startDate, endDate, stipend (₹ per month), description`. The adapters also read common alternatives (`issuingOrganization`, `githubUrl`, `companyName`, `position`, …).
- **Certificate verification** status is read from `status`/`verificationStatus` (`pending|verified|rejected`) or from a boolean `isVerified`. `PUT /:id/verify` is wired in the service for Phase 3.
- **Project review**: if the API returns `approvalStatus`, it is shown as a second badge ("Review pending" or "Approved").
- **Query parameters**: clubs `status=active`, `college`, `category`, `search`; events `when=upcoming|past`, `category`, `college`, `clubId`, `search`; notifications `unread=true`; plus `page`/`limit` everywhere. If the API ignores these and returns a plain array, the list is filtered locally as a fallback.
- **Unread count**: `/notifications/unread` may return a number, `{ count }` or the unread list. The bell polls it every 60 seconds and on any notification change.
- **Club and event categories** are fixed option lists (`lib/campus.js`) until the API exposes them.

### Behaviour
- Portfolio tabs live at `/student/portfolio?tab=…`, so each tab has a shareable URL. Radix Tabs provides arrow-key navigation.
- Deletes always go through a confirmation dialog. Deleting the primary resume warns the user to choose another.
- Internships cannot be edited (no `PUT` endpoint), and the add dialog says so.
- **Club detail** is at `/student/clubs/:clubId`. "Join club" is shown disabled with a Preview note because no join endpoint exists (plan conflict 8).
- Club hero banners are flat navy, not gradients (plan conflict 5).
- Opening a notification's link marks it as read.

### Mock data
Eight clubs (seven active, one inactive) across the three colleges; eight events (six upcoming, two past); eleven notifications (three unread); portfolio records for the demo student. Mock uploads use browser object URLs, so "View" works until the page reloads.

## Phase 3: Faculty and CTPO

### Endpoints used
`GET /api/faculty/me`, `GET /api/students` (roster, scoped by the backend to the caller), `GET /api/certificates` with `status` filter plus `PUT /api/certificates/:id/verify`, and `GET /api/ctpo/dashboard`, `/students`, `/attendance`, `/academic-report`.

### Decisions to confirm against Postman
- **Verify body**: `PUT /certificates/:id/verify` is sent `{ status: 'verified' | 'rejected', remarks }`. Rejecting requires a reason (at least 5 characters). If the backend only supports verifying, the Reject button can be removed in one place (`CertificateQueuePage`).
- **Roster query parameters**: `search`, `year`, `section`, `attendanceBelow=75`, `sortBy`/`order`, `page`/`limit`. Student fields read: `name, rollNumber, email, college, department, year, section, attendancePercentage, cgpa, sgpas[], backlogs, subjects[]` (with common alternatives).
- **CTPO analytics**: the adapter (`toCohortAnalytics`) accepts summary figures (`summary.total/averageAttendance/averageCgpa/lowAttendance`), band counts, subject averages, SGPA trend, top performers and low-attendance lists from the API. Anything missing is derived from the `students` array, so a response carrying only students still renders every chart.
- **Faculty dashboard counts** come from paginated totals (`pageSize=1`) of scoped roster and certificate queries, so the numbers are always backend-scoped and never counted on the client.

### Behaviour
- Roster rows open a read-only student summary (attendance ring, CGPA, subject attendance where provided); no extra request is made.
- CTPO section attendance and academic report pages sort and filter the section's students locally. A section is small (tens of students), and those endpoints return the whole section.
- Attendance and CGPA bands: below 65 / 65–75 / 75–85 / 85+ %, and 9+ / 8–9 / 7–8 / 6–7 / below 6. Bars carry their counts as labels, so colour is not the only cue.
- "Take Attendance" (formerly "Lecture Attendance") remains a Phase 6 preview module.

### Mock data
A seeded roster of 984 students (KIET, KIET+ and KIEW; every offered department; years 1–4; sections A and B). KIET CSE year 3 sections have 20 students each and carry subject-level attendance on the same timetable as the demo student. The demo student's own record uses her real attendance and results, so she matches across the student, faculty and CTPO views. Mock scoping mirrors the backend: faculty see KIET CSE years 2–3, the CTPO sees KIET CSE 3-A, the HOD sees KIET CSE, and the admin sees everyone. Faculty certificate queue: 14 generated uploads plus the demo student's own.

## Phase 4: HOD

### Endpoints used
`GET /api/hod/dashboard`, `/students`, `/attendance`, `/academic-report`, `/ctpos/pending`, and `PUT /api/hod/ctpos/:id/approve` and `/reject` (no request body).

### Decisions to confirm against Postman
- **Department analytics** (`toDepartmentAnalytics`) reads optional `byYear` and `bySection` arrays (`year, section, total, averageAttendance, averageCgpa, lowAttendance, withBacklogs`) and a `pendingCtpos` count. If the groups are missing but a `students` array is present, they are derived from it.
- **Pending CTPO records** are read as users (`name, email, college, department, year, section, createdAt`), from a bare array or from `ctpos`/`items`.

### Behaviour
- Approve and reject both go through a confirmation dialog stating what the decision means (can sign in to which portal and scope, or cannot sign in).
- The HOD dashboard shows a callout with the number of pending CTPO registrations and a link to the queue.
- Section bars on charts are labelled `3A` (year and section). The description explains this, tooltips and screen-reader summaries use the full label, and value labels are hidden when there are more than six bars because the table below lists every value.
- Toasts appear at the bottom-right so they never cover the account menu or notification bell.

### Mock data
Pending registrations: two CTPOs for KIET CSE (visible to the HOD), one CTPO for KIET ECE (not visible to the CSE HOD), two faculty and one HOD (for the admin in Phase 5). Approved accounts can sign in with `Kiet@2026`; rejected ones see "Your registration was not approved". Accounts created on the registration page join the same queues.

## Phase 5: Admin

### Endpoints used
`GET /api/admin/dashboard`, `/users`, `/hods/pending`, `/faculty/pending`, `/pending`; clubs `POST /api/clubs`, `PUT /:id`, `DELETE /:id`, `PUT /:id/activate`, `PUT /:id/deactivate`; `GET /api/events`; certificate verification through `PUT /api/certificates/:id/verify`.

### Decisions to confirm against Postman
- **Approval mutations** (the plan only says "approval mutations for HODs and Faculty"): assumed `PUT /api/admin/hods/:id/approve|reject` and `PUT /api/admin/faculty/:id/approve|reject` with no body. The paths live in one map (`APPROVAL_PATHS` in `adminService.js`).
- **`GET /api/admin/pending`** is treated as the institution-wide verification queue (certificates awaiting verification), read from `certificates`, `pending` or a bare array. Verifying uses the certificate verify endpoint, as for faculty. If `/admin/pending` instead means pending *registrations*, the Verifications page can switch to `GET /api/certificates?status=pending`.
- **Dashboard fields** are read from `totals`/`stats` or the top level: `students, faculty, hods, ctpos, activeClubs, upcomingEvents, pendingApprovals, pendingVerifications`, plus optional `byCollege` and `recentRegistrations` arrays.
- **Users list parameters**: `search`, `role`, `college`, `approvalStatus`, `sortBy`/`order`, `page`/`limit`. Status is shown as Active, Pending or Rejected.
- **Club payload**: `name, fullName, tagline, category, college, coordinator, email, founded, description, focusAreas[]`. Activation uses the dedicated `activate`/`deactivate` endpoints; `PATCH /:id/status` is not used.

### Behaviour
- Admin approves faculty and HOD registrations (tabs, with the tab in the URL). CTPO approvals stay with the HOD.
- Deactivating a club hides it from students without deleting it; deleting is permanent. Both are confirmed, and the dialogs explain the difference.
- "Join club" is shown only to students. The admin can open any club's detail page from the clubs table.
- The Events page is shared with students; the admin sees the same filters.

### Mock data
The institution directory holds 1,098 users: 984 students, generated approved staff (a HOD per college department, three faculty and three CTPOs each), the demo accounts and the pending registrations. Admin actions (approvals, verifications, club changes) persist in memory until a full page reload.

## Phase 6: Preview modules

All ten mock-only modules go through `services/previewService.js` to `mocks/preview/`, **regardless of `VITE_USE_MOCK`**. Each shows a Preview badge in the sidebar and page header, plus a sample-data note at the foot of the page. When an endpoint ships, only the service function changes.

| Module | Roles | Notes |
| --- | --- | --- |
| Timetable | all | Monday–Saturday; rows 09:00, 10:00, 11:00, 12:00, Lunch, 02:00, 03:00, 04:00. Students and CTPOs see their section, faculty see their own teaching schedule, HOD and admin choose a section. |
| Exam schedule | student, admin | Mid-term I, 6–10 October 2026. Students see their department and year; admin filters by department and year. |
| Fees | student, admin | Admin: Total, Collected, Pending and Overdue in ₹, all summed from the same payment records as the table (verified to add up). Student: own items, dues and receipts; "Pay online" disabled. |
| Departments | admin | HOD, faculty, CTPO and student counts plus averages, derived from the directory and roster. |
| Course catalog | HOD (own department), admin | R23. Semesters 1–2 are common to all departments; CSE carries semesters 3–6 in this preview. |
| Reports | HOD (own department), admin | Attendance summary, critical attendance list (below 65%), results analysis, and fee collection (admin only). Generated in the browser with a CSV download. |
| Settings | all | Theme applies immediately. Notification preferences are stored per user in this browser. Admin also edits the institution calendar. |
| Bus pass | student | Digital pass with route stops. No QR code is drawn, to avoid a fake scannable code. |
| Facilities | student, faculty | Open/closed is computed from the current time and each facility's hours. |
| Take attendance | faculty | Pick a class from your timetable and a date; everyone starts present, tap to mark absent, then submit. Sessions stay in the preview and do not update student records. |

### Timetable conflicts
- **Detect conflicts** (HOD, admin, CTPO) finds any faculty member or room booked twice in the same slot **across all sections**. It highlights the clashing cells (red border plus warning icon plus screen-reader text) and lists them.
- **Resolve** picks the class to move (the one in the section being viewed) and suggests the nearest slot where the section, the faculty member and the room are all free: the same day first (closest hour), then the following days. The move happens only after the confirmation dialog, and conflicts are re-evaluated immediately.
- The seeded week has exactly three deliberate clashes: Mrs. K. Sirisha on Monday 11:00 (3A and 2A), Mr. Ch. Ravi Kumar on Tuesday 10:00 (3A and 3B), and Lab 2 on Thursday 02:00 (3A and 2A).
- Lunch is shown as 12:50 – 1:50 pm (assumed from 50-minute periods).

## Phase 7: Polish

### Accessibility
- **Focus return**: dialogs opened from state (confirmations, form modals) return focus to the control that opened them (`hooks/useReturnFocus.js`). If that control no longer exists, for example after its row was deleted, focus moves to the main region.
- **Scrollable tables**: wide tables and the timetable are focusable, labelled regions, so keyboard users can scroll them (WCAG 2.1.1).
- **Charts**: Recharts' keyboard layer is turned off, because charts are hidden from screen readers and a focusable element inside hidden content is announced as nothing. The text summary beside each chart carries the same numbers.
- **Contrast**: muted text is `#55657a` (was `#64748b`) and success text `#137333` (was `#15803d`), so small text on the tinted canvas and on tone tiles stays above 4.5:1.

### Responsive and dark-mode audit
Every role route (52 in total) was loaded at 375px, 768px and 1280px in both light and dark themes, in mock mode. Each load was checked for page-level horizontal scrolling, error screens, unexpected redirects and the applied theme. Every token in `tokens.css` has a dark value, and no component uses a hardcoded colour.

### Empty and error states
Every data view goes through `QueryView` or `DataTable`, which render the shared loading, error (with retry) and empty states. Two gaps were closed: the bus pass page shows "No bus pass on record" when the student has none, and the timetable shows an empty state for a faculty member with no classes or a section with no timetable, instead of an empty grid. The notification bell and the faculty year filter fall back silently (count 0, all years) when their request fails, because neither is the main content of the page.

### Clean-up
- Removed unused shadcn components (`alert`, `badge`, `card`, `select`, `separator`, `skeleton`, `tooltip`) and the Phase 0 `PlaceholderPage`, which no route uses any more.
- Helpers and constants used only inside their own file are no longer exported.
- The router throws a named error at start-up if a navigation item has no registered page, so the sidebar and the routes cannot drift apart.
- "Join club" is wrapped in `RoleGate` (students only) instead of a prop passed through the hero.
