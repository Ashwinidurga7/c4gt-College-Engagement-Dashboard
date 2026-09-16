import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import ProfileModal from '../ui/ProfileModal'

const pageTitles = {
  '/student': 'Dashboard Overview',
  '/student/dashboard': 'Dashboard Overview',
  '/student/portfolio': 'My Portfolio',
  '/student/attendance': 'Attendance Register',
  '/student/fees': 'Fee Payments & Dues',
  '/student/transport': 'Transport & Bus Routes',
  '/student/results': 'Semester Results & SGPA',
  '/student/academics': 'Academic Overview',
  '/student/activities': 'My Activities & Credentials',
  '/student/projects': 'Technical Projects & GitHub',
  '/student/internships': 'Industry Internships',
  '/student/resume': 'Resume Builder',
  '/student/achievements': 'Achievements & Certifications',
  '/student/events': 'Campus Events',
  '/student/announcements': 'Notice Board',
  '/student/clubs': 'Student Clubs & Societies',
  '/student/hub': 'KIET Innovation Hubs',
  '/faculty': 'Faculty Portal',
  '/faculty/students': 'Student Directory',
  '/faculty/attendance': 'Attendance Register',
  '/hod': 'HOD Department Portal',
  '/admin': 'Admin Control Portal',
  '/admin/overall': 'Campus Group Overview',
}

export default function Topbar({ onToggleCollapse, onToggleMobile, isCollapsed }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const currentTitle = pageTitles[location.pathname] || 'College Engagement Dashboard'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      if (onToggleMobile) onToggleMobile()
    } else {
      if (onToggleCollapse) onToggleCollapse()
    }
  }

  const rollNumber = user?.rollNumber || user?.roll_no || user?.email?.split('@')[0]
  const roleLabel = (user?.role || 'Portal User').toUpperCase()

  const userProfileData = {
    name: user?.name || (user?.role === 'Student' ? 'G. Sai Vamsi' : 'Dr. Authorized Faculty'),
    role: user?.role || 'Student',
    title: user?.role === 'Student' ? `Scholar • Roll: ${rollNumber || '23JN1A4533'}` : 'Faculty Member',
    department: user?.department || 'Department of Artificial Intelligence & Data Science',
    campus: user?.campus || 'KIET Main Autonomous Campus',
    email: user?.email || (user?.role === 'Student' ? 'saivamsi.g@kiet.ac.in' : 'faculty@kietgroup.com'),
    phone: '+91 98480 12345',
    office: user?.role === 'Student' ? 'Turing Lab Block 3 • AI & DS Section A' : 'Department Faculty Cabins, Room 204',
    bio:
      user?.role === 'Student'
        ? 'Passionate full-stack developer and AI enthusiast at KIET Group of Institutions. Active contributor to open-source GovTech and competitive programming.'
        : 'Dedicated educator and researcher mentoring students in enterprise cloud computing, algorithms, and applied machine learning.',
    specializations:
      user?.role === 'Student'
        ? ['Full-Stack Web (React/Node.js)', 'Python & PyTorch', 'Cloud & DevOps (AWS)', 'Competitive Algorithms']
        : ['Curriculum Coordination', 'Scopus Research', 'Institutional Accreditation', 'Project Mentorship'],
    achievements:
      user?.role === 'Student'
        ? [
            'Smart India Hackathon Finalist — Autonomous Navigation',
            'AWS Certified Cloud Practitioner (CLF-C02)',
            'Completed 3-Month Industry Internship at AWS Academy & EduSkills',
            '88.5% Aggregate Semester Academic Score',
          ]
        : [
            'Supervised 25+ Capstone Engineering Projects',
            'Published 8 Peer-Reviewed Research Papers in IEEE/Springer',
            'Department Industry-Academia Placement Coordinator',
          ],
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          {/* Toggle Sidebar Button */}
          <button
            type="button"
            className="topbar-toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle navigation menu"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="topbar-headings">
            <div className="topbar-kicker">
              <span>KIET GROUP OF INSTITUTIONS</span>
              <span className="kicker-sep">•</span>
              <span>COLLEGE ENGAGEMENT DASHBOARD</span>
              <span className="kicker-badge">AFFILIATED TO JNTUK</span>
            </div>
            <h1 className="topbar-title">{currentTitle}</h1>
          </div>
        </div>

        <div className="topbar-right">
          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            className="topbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <span className="theme-toggle-content">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="theme-toggle-label">Dark</span>
              </span>
            ) : (
              <span className="theme-toggle-content light">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span className="theme-toggle-label">Light</span>
              </span>
            )}
          </button>

          {/* Status Indicator */}
          <div className="status-chip" title="Connected to College Engagement Dashboard ERP System">
            <span className="status-pulse" />
            <span className="status-text">Campus Live</span>
          </div>

          {/* Interactive Profile Pill (Clickable) */}
          <div
            className="profile-chip clickable"
            onClick={() => setShowProfileModal(true)}
            title="Click to view your profile details and credentials"
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowProfileModal(true)
            }}
          >
            <div className="profile-avatar">
              {(user?.name || user?.role || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className="profile-copy">
              <strong className="profile-name">{user?.name || 'Authorized User'}</strong>
              <small className="profile-role">
                {roleLabel} {rollNumber && rollNumber !== 'student' ? `• ${rollNumber}` : ''}
              </small>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            className="topbar-logout"
            onClick={handleLogout}
            title="Sign out of your session"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-text">Sign out</span>
          </button>
        </div>
      </header>

      {/* Profile Dossier Modal */}
      {showProfileModal && (
        <ProfileModal
          profile={userProfileData}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  )
}
