import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  portfolio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7h-3a2 2 0 0 1-2-2V2H9a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4" />
    </svg>
  ),
  attendance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  ),
  fees: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="7" cy="15" r="1" />
      <circle cx="17" cy="15" r="1" />
    </svg>
  ),
  transport: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 18v2M17 18v2M3 10h18" />
      <circle cx="7.5" cy="14.5" r="1.5" />
      <circle cx="16.5" cy="14.5" r="1.5" />
    </svg>
  ),
  results: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="12" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
    </svg>
  ),
  announcements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  clubs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  internships: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  resume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  achievements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  chevronLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
}

const navConfig = {
  Student: [
    {
      section: 'CORE',
      items: [
        { label: 'Dashboard', to: '/student', icon: 'dashboard', end: true },
        { label: 'My Portfolio', to: '/student/portfolio', icon: 'portfolio' },
        { label: 'Attendance', to: '/student/attendance', icon: 'attendance' },
      ],
    },
    {
      section: 'CAREER & ACTIVITIES',
      items: [
        { label: 'My Activities', to: '/student/activities', icon: 'activity' },
        { label: 'Achievements / Certifications', to: '/student/achievements', icon: 'achievements' },
        { label: 'Internships & Participation', to: '/student/internships', icon: 'internships' },
        { label: 'Resume', to: '/student/resume', icon: 'resume' },
      ],
    },
    {
      section: 'ACADEMICS',
      items: [
        { label: 'Fees', to: '/student/fees', icon: 'fees' },
        { label: 'Transport', to: '/student/transport', icon: 'transport' },
        { label: 'Results', to: '/student/results', icon: 'results' },
      ],
    },
    {
      section: 'CAMPUS',
      items: [
        { label: 'Events', to: '/student/events', icon: 'events' },
        { label: 'Announcements', to: '/student/announcements', icon: 'announcements' },
        { label: 'Clubs & Communities', to: '/student/clubs', icon: 'clubs' },
      ],
    },
  ],
  Faculty: [
    {
      section: 'FACULTY WORKSPACE',
      items: [
        { label: 'Dashboard', to: '/faculty', icon: 'dashboard', end: true },
        { label: 'Students & Academics', to: '/faculty/students', icon: 'students' },
        { label: 'Attendance', to: '/faculty/attendance', icon: 'attendance' },
      ],
    },
  ],
  HOD: [
    {
      section: 'EXECUTIVE ANALYTICS',
      items: [
        { label: 'Overview Dashboard', to: '/hod', icon: 'dashboard', end: true },
        { label: 'Academics & Backlogs', to: '/hod/academics', icon: 'results' },
        { label: 'Placements & Drives', to: '/hod/placements', icon: 'internships' },
        { label: 'Clubs, Hubs & KIOT', to: '/hod/activities', icon: 'clubs' },
        { label: 'Demographics & Transit', to: '/hod/demographics', icon: 'transport' },
      ],
    },
    {
      section: 'DEPARTMENT REGISTERS',
      items: [
        { label: 'Students Directory', to: '/faculty/students', icon: 'students' },
        { label: 'Attendance Register', to: '/faculty/attendance', icon: 'attendance' },
      ],
    },
  ],
  Admin: [
    {
      section: 'GROUP GOVERNANCE',
      items: [
        { label: 'Executive Overview', to: '/admin', icon: 'dashboard', end: true },
        { label: 'Student Demographics (1-4 Yr)', to: '/admin/students', icon: 'students' },
        { label: 'Campus Placements', to: '/admin/placements', icon: 'achievements' },
      ],
    },
    {
      section: 'STAFF & WORKERS',
      items: [
        { label: 'HODs & Faculty Directory', to: '/admin/faculty', icon: 'portfolio' },
        { label: 'Transport Fleet & Drivers', to: '/admin/transport', icon: 'transport' },
        { label: 'Operations & Workers', to: '/admin/workers', icon: 'activity' },
      ],
    },
    {
      section: 'OPERATIONS',
      items: [
        { label: 'Pending Verifications', to: '/admin/approvals', icon: 'results' },
        { label: 'Campus Network & CoE', to: '/admin/overall', icon: 'clubs' },
      ],
    },
  ],
}

export default function Sidebar({
  role = 'Student',
  isCollapsed = false,
  isMobileOpen = false,
  onToggleCollapse,
  onCloseMobile,
}) {
  const { user } = useAuth()
  const effectiveRole = role || user?.role || 'Student'
  const sections = navConfig[effectiveRole] || navConfig.Student

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
        isMobileOpen ? 'mobile-visible' : ''
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Sidebar Header with Small Logo */}
      <div className="sidebar-header">
        <div className="sidebar-brand-lockup">
          <div className="sidebar-logo-frame">
            <img
              src="/images/kiet-logo.png"
              alt="KIET Logo"
              className="sidebar-kiet-logo"
            />
          </div>
          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <strong className="sidebar-college-name">KIET</strong>
              <small className="sidebar-college-sub">ENGAGEMENT DASHBOARD</small>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          className="sidebar-collapse-btn desktop-only-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? icons.chevronRight : icons.chevronLeft}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          className="sidebar-close-btn mobile-only-btn"
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          {icons.close}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {sections.map((sec) => (
          <div className="sidebar-section" key={sec.section}>
            {!isCollapsed && (
              <div className="sidebar-section-title">{sec.section}</div>
            )}
            <div className="sidebar-items-list">
              {sec.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="sidebar-link-icon">
                    {icons[item.icon] || icons.dashboard}
                  </span>
                  {!isCollapsed && (
                    <span className="sidebar-link-label">{item.label}</span>
                  )}
                  {isCollapsed && (
                    <span className="sidebar-collapsed-tooltip">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="sidebar-user-card">
            <div className="user-avatar-badge">
              {(user?.name || effectiveRole).charAt(0).toUpperCase()}
            </div>
            <div className="user-info-text">
              <strong>{user?.name || `${effectiveRole} Portal`}</strong>
              <small>{user?.rollNumber || effectiveRole}</small>
            </div>
          </div>
        ) : (
          <div
            className="sidebar-user-mini"
            title={user?.name || effectiveRole}
          >
            {(user?.name || effectiveRole).charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </aside>
  )
}