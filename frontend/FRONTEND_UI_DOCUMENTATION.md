# C4GT — College Engagement Dashboard
Frontend / UI Documentation — Student, Faculty, HOD & Admin

Prepared by: Gandham Sri Lakshmi · CSE (AI&DS), KIET Women's, Kakinada · Mentor: Abhinaya

## 1. Project Overview
C4GT-College-Engagement-Dashboard keeps track of important student activities during college — hackathons, workshops, projects, internships, certifications, club and leadership activities, sports and cultural activities.

Main Idea
Track student activities, verify them, and present overall college engagement in a single dashboard.

Vision
“Every student activity in one place, turning participation into meaningful insights.”

This document covers the frontend/UI build: a working React interface for Student, Faculty, HOD/Coordinators, and Admin roles. The app runs against mock data in `src/data/mockData.js` so screens are fully interactive and demo-ready.

## 2. Problem Statement
Student activity records are often scattered. C4GT centralizes activities, verification, and analytics so stakeholders can view participation and growth from one place.

## 3. System Architecture (Frontend Scope)
- Frontend: React + Vite — implements all role-specific UIs, routing, and mock-driven flows.
- Backend & Database: planned (Node.js/Express + MongoDB). This repository includes only frontend code and mock data; no backend files are added.

Frontend → (planned) Backend flow: Student/Faculty/HOD/Admin → React Frontend → REST API → Backend → Database → Analytics

The current frontend is designed so swapping `src/data/mockData.js` for API calls is the only change needed to connect a real backend.

## 4. Technology Stack
- Frontend: React 19 + Vite
- Routing: React Router (HashRouter)
- Styling: design tokens in `src/styles/tokens.css`
- Charts: small custom bar chart component
- Fonts: Fraunces (display), IBM Plex Sans/Mono (body)
- Data (demo): `src/data/mockData.js`

## 5. Folder Structure
Root structure (relevant frontend files):

```
c4gt-dashboard/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles/tokens.css
│   ├── data/mockData.js
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── shared/
│   └── pages/
├── index.html
├── package.json
└── README.md
```

## 6. Functional Requirements Covered (Frontend)
- Student: login/logout, profile, add activities, evidence upload (demo), track verification, view analytics
- Faculty: view assigned students, pending verifications, approve/reject activities, analytics
- HOD/Coordinator: department dashboards, filters (year/section), analytics, reports
- Admin: manage users/departments/roles, activity categories, college-wide analytics, reports

## 7. Design System
Direction: academic ledger — deep navy and gold palette with serif display for headings.

Tokens (in `src/styles/tokens.css`):
- Ink navy: #1F3358
- Seal gold: #B8862B
- Verified green: #3F6B4E
- Rejected red: #9C4A3C
- Paper background: #F5F3EE

Signature element: the “Seal” — a rotated wax-seal-style badge used for verification status across the UI.

## 8. Screens Built (by Role)
- Shared: Login, Forgot Password, Profile, Notifications
- Student: Dashboard, My Activities, Add Activity, Activity Details, My Achievements, My Analytics
- Faculty: Dashboard, Assigned Students, Pending Verification, Verification, Student Analytics
- HOD: Department Dashboard, Students, Engagement Analytics, Activity Analytics, Reports
- Admin: Dashboard, Users, Departments, Roles, Activities, College Analytics, Reports, System Settings

Each screen is implemented as a React page under `src/pages/` and is interactive using mock data.

## 9. Security (planned)
- JWT-based auth, password hashing, role-based authorization, upload validation — to be implemented when the backend is connected. No backend code is included here.

## 10. Testing Approach
- Unit tests for UI components (Seal, DataTable, BarChart)
- Integration tests for end-to-end flows once backend is connected

## 11. How to Run This Project
Requires Node.js. From inside the `c4gt-dashboard` folder:

```bash
npm install
npm run dev
```

The dev server opens (usually at http://localhost:5173). On the Login screen, use “Log in as [role]” to preview any role.

For production:

```bash
npm run build
```

## 12. Next Steps (Frontend-focused)
- Replace `src/data/mockData.js` with real API calls to a Node.js/Express backend.
- Implement real authentication (JWT) replacing the demo role-picker.
- Wire file uploads to cloud storage (S3/Cloudinary) when backend supports uploads.
- Add Geo/ML/RAG features after core dashboard stabilization.

---
Note: This repository contains only frontend code and mock data. No backend or database files were added.
