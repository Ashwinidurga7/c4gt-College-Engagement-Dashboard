# KIET — College Engagement Dashboard (College-Engagement-Dashboard)

## Entry flow
- `/` → role-first login: Student, Faculty, HOD, Admin.
- After authentication, users are routed only to their own role workspace.
- Student login is tied to a roll number from `src/data/academicData.js`; one student record is loaded at a time.

## Student workspace
- Portfolio dashboard
- Attendance (subject-wise + overall)
- Academic updates: fees, transport, exam results
- My Activities / internships / participation
- Resume editor + live preview
- Achievements and analytics

## Faculty workspace
- Student register
- Campus → branch → year → section → search filters
- Attendance register with student-specific persistence
- Student detail view with attendance, fee, transport and results

## Admin workspace
- Group overview for KIET, KIET II / KIET+, and KIEW
- C4GT Hub, Global Coding Club, Hackathons, Smart City Lab, Robotics Lab, Toastmasters
- Internships, events and notices overview

## Data / state
- `src/data/academicData.js` — demo student master data.
- `src/contexts/AuthContext.jsx` — role authentication and session state.
- `localStorage:c4gt_attendance_v2` — faculty-published attendance by roll number.
- `localStorage:c4gt_resume_<studentId>` — student resume data.

## UI
- `src/components/layout/` — sidebar, topbar and protected dashboard shell.
- `src/styles/tokens.css` — institutional visual system and responsive styles.
- Official KIET website imagery is referenced where available; image fallbacks keep layouts usable if an external image is unavailable.

## Official structure checked
The public KIET Group website currently presents KIET, KIET II and KIEW, and highlights academic programs, placements, Robotics, Toastmasters, Smart City Lab, internships/training, events and other collaborations. The portal mirrors those as separate modules instead of mixing them into the student-only workspace.
