# College Engagement Dashboard (College-Engagement-Dashboard)

A unified institutional fullstack platform for **KIET Group of Institutions**.

---

## 📁 Repository Structure

- **[`/frontend`](./frontend)** — **College Engagement Dashboard**
  - **Framework**: React 18, Vite, React Router, Recharts
  - **Features**: 
    - Institutional SSO Gateway with designated portal options for **Student**, **Faculty**, **HOD**, and **Admin**
    - Student workspace: 12-month attendance, semester results (SGPA), fee clearance receipts, digital bus pass, co-curricular activity verification, and Resume Builder
    - Faculty workspace: Lecture attendance entry, student verification queue, and mentorship analytics
    - HOD & Admin workspaces: Branch demographics, department approvals, campus facility directory, and centralized campus metrics
- **Root Directory** — **Student Management Backend API**
  - **Framework**: Node.js, Express.js, MongoDB (Mongoose), JWT authentication
  - **Features**: RESTful endpoints for student records, club activities, attendance logs, and institutional role authorization
  - API documentation: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) and [`college-management.postman_collection.json`](./college-management.postman_collection.json)

---

## 🚀 Getting Started

### 1. Frontend (College Engagement Dashboard)
```bash
cd frontend
npm install
npm run dev
```
Runs the Vite development server locally (default: `http://localhost:5173`).

### 2. Backend Server
```bash
npm install
npm run dev
```
Starts the Node/Express backend with auto-reload (default: `http://localhost:5000`).