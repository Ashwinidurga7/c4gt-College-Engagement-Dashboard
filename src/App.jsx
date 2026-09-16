import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { ThemeProvider } from './contexts/ThemeContext'

import Login from './pages/Login'
import SignUp from './pages/SignUp'

import DashboardLayout from './components/layout/DashboardLayout'

import StudentDashboard from './pages/student/StudentDashboard'
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import HodDashboard from './pages/hod/HodDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

import MyActivities from './pages/student/MyActivities'
import StudentProjects from './pages/student/StudentProjects'
import StudentInternships from './pages/student/StudentInternships'
import AddActivity from './pages/student/AddActivity'
import ActivityDetails from './pages/student/ActivityDetails'
import MyAchievements from './pages/student/MyAchievements'
import MyAnalytics from './pages/student/MyAnalytics'
import CampusPages from './pages/student/CampusPages'
import StudentPortfolio from './pages/student/StudentPortfolio'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentResume from './pages/student/StudentResume'
import StudentAcademics from './pages/student/StudentAcademics'
import FacultyStudents from './pages/faculty/FacultyStudents'
import FacultyAttendance from './pages/faculty/FacultyAttendance'
import OverallCampus from './pages/admin/OverallCampus'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <DashboardLayout role="Student">
                <StudentDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <DashboardLayout role="Student">
                <StudentDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/portfolio"
            element={
              <DashboardLayout role="Student">
                <StudentPortfolio />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <DashboardLayout role="Student">
                <StudentAttendance />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/fees"
            element={
              <DashboardLayout role="Student">
                <StudentAcademics initialTab="fees" />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/transport"
            element={
              <DashboardLayout role="Student">
                <StudentAcademics initialTab="transport" />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/results"
            element={
              <DashboardLayout role="Student">
                <StudentAcademics initialTab="results" />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/academics"
            element={
              <DashboardLayout role="Student">
                <StudentAcademics />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/resume"
            element={
              <DashboardLayout role="Student">
                <StudentResume />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/activities"
            element={
              <DashboardLayout role="Student">
                <MyActivities />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/projects"
            element={
              <DashboardLayout role="Student">
                <StudentProjects />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/internships"
            element={
              <DashboardLayout role="Student">
                <StudentInternships />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/add"
            element={
              <DashboardLayout role="Student">
                <AddActivity />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/activity/:id"
            element={
              <DashboardLayout role="Student">
                <ActivityDetails />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/achievements"
            element={
              <DashboardLayout role="Student">
                <MyAchievements />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/analytics"
            element={
              <DashboardLayout role="Student">
                <MyAnalytics />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/events"
            element={
              <DashboardLayout role="Student">
                <CampusPages type="events" />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/announcements"
            element={
              <DashboardLayout role="Student">
                <CampusPages type="announcements" />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/hub"
            element={
              <DashboardLayout role="Student">
                <CampusPages type="hub" />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/clubs"
            element={
              <DashboardLayout role="Student">
                <CampusPages type="clubs" />
              </DashboardLayout>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="/faculty"
            element={
              <DashboardLayout role="Faculty">
                <FacultyDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/faculty/students"
            element={
              <DashboardLayout role="Faculty">
                <FacultyStudents />
              </DashboardLayout>
            }
          />
          <Route
            path="/faculty/attendance"
            element={
              <DashboardLayout role="Faculty">
                <FacultyAttendance />
              </DashboardLayout>
            }
          />

          {/* HOD Routes */}
          <Route
            path="/hod"
            element={
              <DashboardLayout role="HOD">
                <HodDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/hod/academics"
            element={
              <DashboardLayout role="HOD">
                <HodDashboard defaultTab="academics" />
              </DashboardLayout>
            }
          />
          <Route
            path="/hod/placements"
            element={
              <DashboardLayout role="HOD">
                <HodDashboard defaultTab="placements" />
              </DashboardLayout>
            }
          />
          <Route
            path="/hod/activities"
            element={
              <DashboardLayout role="HOD">
                <HodDashboard defaultTab="activities" />
              </DashboardLayout>
            }
          />
          <Route
            path="/hod/demographics"
            element={
              <DashboardLayout role="HOD">
                <HodDashboard defaultTab="demographics" />
              </DashboardLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="overview" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/students"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="students" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/placements"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="placements" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/faculty"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="faculty" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/transport"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="transport" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/workers"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="workers" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard defaultTab="approvals" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/overall"
            element={
              <DashboardLayout role="Admin">
                <OverallCampus />
              </DashboardLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  </ThemeProvider>
  )
}