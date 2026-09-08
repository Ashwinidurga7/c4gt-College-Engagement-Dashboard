# College Management & Student Portfolio Dashboard - API Documentation

## Overview
This document details the RESTful API endpoints for the College Management & Student Portfolio Dashboard backend.

- **Base URL**: `http://localhost:5000`
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Postman Collection**: `backend/college-management.postman_collection.json`
- **Authentication**: JWT Bearer Token in HTTP Header:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Response Format**: JSON standard format:
  ```json
  {
    "success": true,
    "message": "Operation description",
    "data": { ... }
  }
  ```

---

## 1. System & Root Endpoints

### 1.1 Root Info
- **Endpoint**: `/`
- **Method**: `GET`
- **Auth**: None
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Student Management API is running",
    "version": "1.0.0",
    "swaggerDocs": "/api-docs",
    "healthCheck": "/api/health"
  }
  ```

### 1.2 Health Check
- **Endpoint**: `/api/health`
- **Method**: `GET`
- **Auth**: None
- **Response**: `200 OK`
  ```json
  {
    "status": "UP",
    "timestamp": "2026-09-07T17:50:00.000Z",
    "uptime": 120.5
  }
  ```

### 1.3 Interactive Swagger Docs
- **Endpoint**: `/api-docs`
- **Method**: `GET`
- **Auth**: None
- **Description**: Full OpenAPI / Swagger interactive UI in the browser.

---

## 2. Authentication APIs (`/api/auth`)

### 2.1 User Login
- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "alice@student.edu",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "name": "Alice Johnson",
        "email": "alice@student.edu",
        "role": "student"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### 2.2 Get Current User Details
- **Endpoint**: `/api/auth/me`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`

### 2.3 Student Registration
- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "New Student",
    "email": "newstudent@college.edu",
    "password": "password123",
    "role": "student"
  }
  ```
- **Response**: `201 Created`

### 2.4 Faculty Registration (Pending Admin Approval)
- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "Dr. Alan Turing",
    "email": "alan.turing@college.edu",
    "password": "password123",
    "role": "faculty",
    "department": "Computer Science",
    "college": "KIET",
    "assignedYears": [1, 2]
  }
  ```
- **Response**: `201 Created` (`approvalStatus: "pending"`)

### 2.5 HOD Registration (Pending Admin Approval)
- **Endpoint**: `/api/auth/register/hod`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "Dr. Claude Shannon",
    "email": "shannon.hod@college.edu",
    "password": "password123",
    "department": "Computer Science",
    "college": "KIET",
    "academicYear": 2026
  }
  ```
- **Response**: `201 Created` (`approvalStatus: "pending"`)

### 2.6 CTPO Registration (Pending HOD Approval)
- **Endpoint**: `/api/auth/register/ctpo`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "Prof. Ada Lovelace",
    "email": "lovelace.ctpo@college.edu",
    "password": "password123",
    "department": "Computer Science",
    "college": "KIET",
    "year": 3,
    "section": "A"
  }
  ```
- **Response**: `201 Created` (`approvalStatus: "pending"`)

---

## 3. Student Dashboard & Portfolio APIs (`/api/students`)

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/students/dashboard` | `GET` | Student | Complete student dashboard with stats, recent activities, events |
| `/api/students/profile` | `GET` | Student | Logged-in student's full profile details |
| `/api/students/profile` | `PUT` | Student | Update student profile fields (contact, location, bio) |
| `/api/students/academic` | `GET` | Student | Academic info (batch, regulation, semester, CGPA) |
| `/api/students/courses` | `GET` | Student | Enrolled courses for current student |
| `/api/students/certificates` | `GET` | Student | Institutional certificates list |
| `/api/students/certifications` | `GET` | Student | Student's external certifications list |
| `/api/students/projects` | `GET` | Student | Student's personal and academic projects |
| `/api/students/internships` | `GET` | Student | Student's internships list |
| `/api/students/achievements` | `GET` | Student | Student's honors and achievements |
| `/api/students/activities` | `GET` | Student | Student's extracurricular activities |
| `/api/students/portfolio` | `GET` | Student | Consolidated student portfolio summary with total points |
| `/api/students/resume` | `GET` | Student | Primary active resume |
| `/api/students/attendance` | `GET` | Student | Monthly breakdown, subjects, and percentage |
| `/api/students/academic-report` | `GET` | Student | Semester-wise SGPA, CGPA, and course grades |
| `/api/students/notifications` | `GET` | Student | User-scoped notification list |
| `/api/students/upcoming-events` | `GET` | Student | Upcoming college & departmental events |
| `/api/students` | `GET` | Faculty/HOD/Admin | Scoped roster of students |

---

## 4. Student Portfolio Artifacts

### 4.1 External Certifications (`/api/certifications`)
- **Note**: Managed directly by students. **No faculty approval workflow**.
- `GET /api/certifications`: List student's certifications.
- `POST /api/certifications`: Add certification.
  ```json
  {
    "title": "AWS Certified Solutions Architect",
    "issuingOrganization": "Amazon Web Services",
    "issueDate": "2026-03-01",
    "credentialUrl": "https://aws.amazon.com/verify/12345"
  }
  ```
- `GET /api/certifications/:id`: Get single certification.
- `PUT /api/certifications/:id`: Update certification.
- `DELETE /api/certifications/:id`: Delete certification.

### 4.2 Institutional Certificates (`/api/certificates`)
- **Note**: Requires faculty/admin verification.
- `GET /api/certificates`: List student's certificates.
- `POST /api/certificates`: Upload certificate.
- `GET /api/certificates/:id`: Get certificate details.
- `PUT /api/certificates/:id/verify`: Verify certificate (Faculty/Admin).
- `DELETE /api/certificates/:id`: Remove certificate.

### 4.3 Projects (`/api/projects`)
- `GET /api/projects`: List projects.
- `POST /api/projects`: Create project.
  ```json
  {
    "title": "Autonomous Drone Navigation",
    "description": "Embedded ROS and OpenCV platform",
    "techStack": ["Python", "C++", "ROS"],
    "projectUrl": "https://github.com/alice/drone-nav"
  }
  ```
- `GET /api/projects/:id`: Get project details.
- `PUT /api/projects/:id`: Update project.
- `DELETE /api/projects/:id`: Delete project.

### 4.4 Internships (`/api/internships`)
- `GET /api/internships`: List internships.
- `POST /api/internships`: Add internship record.
  ```json
  {
    "companyName": "Google DeepMind",
    "role": "AI Research Intern",
    "startDate": "2026-01-01",
    "endDate": "2026-06-30",
    "stipend": 50000,
    "description": "Agentic coding and evaluation pipelines."
  }
  ```
- `DELETE /api/internships/:id`: Delete internship.

### 4.5 Resumes (`/api/resumes`)
- `GET /api/resumes`: List student resumes.
- `POST /api/resumes`: Upload new resume.
- `PATCH /api/resumes/:id/primary`: Set as primary resume.
- `DELETE /api/resumes/:id`: Delete resume.

---

## 5. Faculty APIs (`/api/faculty`)

- `GET /api/faculty`: List all faculty members.
- `GET /api/faculty/me`: Get current faculty profile.
- `GET /api/students`: Get student roster **strictly scoped** by faculty's college, department, and assigned years.

---

## 6. HOD (Head of Department) APIs (`/api/hod`)

- `GET /api/hod/dashboard`: Department dashboard with aggregated metrics.
- `GET /api/hod/students`: Department students scoped by college, department, and academic year.
- `GET /api/hod/ctpos/pending`: View CTPOs pending HOD approval.
- `PUT /api/hod/ctpos/:id/approve`: Approve a CTPO.
- `PUT /api/hod/ctpos/:id/reject`: Reject a CTPO.
- `GET /api/hod/attendance`: Aggregated departmental attendance analytics.
- `GET /api/hod/academic-report`: Aggregated academic grade distributions.

---

## 7. CTPO (Class Teacher / Placement Officer) APIs (`/api/ctpo`)

- `GET /api/ctpo/dashboard`: Class dashboard scoped to college, department, year, and section.
- `GET /api/ctpo/students`: Students enrolled in the CTPO's assigned section.
- `GET /api/ctpo/attendance`: Section-specific student attendance.
- `GET /api/ctpo/academic-report`: Section-specific academic reports.

---

## 8. Admin APIs (`/api/admin`)

- `GET /api/admin/dashboard`: Institution-wide summary metrics.
- `GET /api/admin/users`: Manage all users in the system.
- `GET /api/admin/hods/pending`: View HODs pending approval.
- `PUT /api/admin/hods/:id/approve`: Approve an HOD.
- `PUT /api/admin/hods/:id/reject`: Reject an HOD.
- `GET /api/admin/faculty/pending`: View Faculty pending approval.
- `PUT /api/admin/faculty/:id/approve`: Approve a Faculty member.
- `PUT /api/admin/faculty/:id/reject`: Reject a Faculty member.
- `GET /api/admin/pending`: View pending activity verifications.

---

## 9. Notification & Event APIs

- `GET /api/notifications`: Get all user notifications.
- `GET /api/notifications/unread`: Get unread notifications only.
- `PUT /api/notifications/:id/read`: Mark single notification as read.
- `PUT /api/notifications/read-all`: Mark all notifications as read.
- `GET /api/events`: List college events.
- `GET /api/events/:id`: View event details.

---

## 10. College Club APIs (`/api/clubs`)

### Core Visibility Rule:
> **IMPORTANT**: All active college clubs must be visible to students from all three colleges (**KIET**, **KIET+**, **KIEW**).
> The backend does **NOT** filter clubs based on the student's college (`student.college == club.college` is strictly NOT applied).
> The `college` field represents the originating college and administrative scope, but never restricts student visibility.

- `GET /api/clubs`:
  - **Auth**: Authenticated (`student`, `faculty`, `hod`, `ctpo`, `admin`)
  - **Behavior**: Returns all active clubs across all three colleges (KIET, KIET+, KIEW) for students. Admins can also see inactive clubs or filter by status.
  - **Query Parameters**:
    - `college`: (Optional) Filter by college (`KIET`, `KIET+`, `KIEW`)
    - `category`: (Optional) Filter by category (e.g., `Technical`, `Open Source`, `Literary & Leadership`, `Social Service & Defense`)
    - `search`: (Optional) Keyword search by club name, code, or description
    - `status`: (Admin only) Filter by `active` or `inactive`
- `GET /api/clubs/:id`:
  - **Auth**: Authenticated
  - **Description**: Get single club details by ID.
- `POST /api/clubs`:
  - **Auth**: Admin only
  - **Description**: Create a new club for any of the 3 colleges (`KIET`, `KIET+`, `KIEW`).
- `PUT /api/clubs/:id`:
  - **Auth**: Admin only
  - **Description**: Update club information, coordinator, schedule, or details.
- `DELETE /api/clubs/:id`:
  - **Auth**: Admin only
  - **Description**: Delete a club.
- `PATCH /api/clubs/:id/status`:
  - **Auth**: Admin only
  - **Description**: Toggle or set club status (`active` / `inactive`).
- `PUT /api/clubs/:id/activate`:
  - **Auth**: Admin only
  - **Description**: Activate club.
- `PUT /api/clubs/:id/deactivate`:
  - **Auth**: Admin only
  - **Description**: Deactivate club.

