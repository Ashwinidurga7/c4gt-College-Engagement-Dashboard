import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const pageTitles = {
  '/student': 'Dashboard Overview',
  '/student/dashboard': 'Dashboard Overview',
  '/student/portfolio': 'My Portfolio',
  '/student/attendance': 'Attendance Register',
  '/student/fees': 'Fee Payments & Dues',
  '/student/transport': 'Transport & Bus Routes',
  '/student/results': 'Semester Results & SGPA',
  '/student/academics': 'Academic Overview',
  '/student/activities': 'My Activities',
  '/student/internships': 'Internships & Projects',
  '/student/resume': 'Resume Builder',
  '/student/achievements': 'Achievements & Certifications',
  '/student/events': 'Campus Events',
  '/student/announcements': 'Notice Board',
  '/student/clubs': 'Student Clubs & Societies',
  '/faculty': 'Faculty Portal',
  '/faculty/students': 'Student Directory',
  '/faculty/attendance': 'Attendance Register',
  '/hod': 'HOD Department Portal',
  '/admin': 'Admin Control Portal',
  '/admin/overall': 'Campus Group Overview'
}

export default function Topbar({ onToggleCollapse, onToggleMobile, isCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  const rollNumber = user?.rollNumber || user?.roll_no || (user?.email?.split('@')[0])
  const roleLabel = (user?.role || 'Portal User').toUpperCase()

  return (
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
        {/* Status Indicator */}
        <div className="status-chip" title="Connected to College Engagement Dashboard ERP System">
          <span className="status-pulse" />
          <span className="status-text">Campus Live</span>
        </div>

        {/* Profile Pill */}
        <div className="profile-chip">
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
  )
}
