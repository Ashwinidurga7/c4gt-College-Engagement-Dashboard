import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import SignUp from './pages/SignUp'

import DashboardLayout from './components/layout/DashboardLayout'

import StudentDashboard from './pages/student/StudentDashboard'
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import HodDashboard from './pages/hod/HodDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

import MyActivities from './pages/student/MyActivities'
import AddActivity from './pages/student/AddActivity'
import ActivityDetails from './pages/student/ActivityDetails'
import MyAchievements from './pages/student/MyAchievements'
import MyAnalytics from './pages/student/MyAnalytics'
import CampusPages from './pages/student/CampusPages'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/student"
          element={
            <DashboardLayout role="Student">
              <StudentDashboard />
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

        <Route
          path="/faculty"
          element={
            <DashboardLayout role="Faculty">
              <FacultyDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/hod"
          element={
            <DashboardLayout role="HOD">
              <HodDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <DashboardLayout role="Admin">
              <AdminDashboard />
            </DashboardLayout>
          }
        />
      </Routes>
    </HashRouter>
  )
}