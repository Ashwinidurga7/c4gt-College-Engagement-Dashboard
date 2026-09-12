import React from 'react'
import { NavLink } from 'react-router-dom'

const linksByRole = {
  Student: [
    {
      section: 'MAIN',
      items: [
        ['Dashboard', '/student', 'dashboard'],
        ['My Activities', '/student/activities', 'activity'],
      ],
    },
    {
      section: 'CAMPUS',
      items: [
        ['Events', '/student/events', 'events'],
        ['Announcements', '/student/announcements', 'announcements'],
        ['C4GT Hub @ KIET', '/student/hub', 'hub'],
        ['Clubs & Communities', '/student/clubs', 'clubs'],
      ],
    },
    {
      section: 'MY SPACE',
      items: [
        ['Achievements', '/student/achievements', 'achievements'],
        ['Analytics', '/student/analytics', 'analytics'],
      ],
    },
  ],

  Faculty: [
    {
      section: 'MAIN',
      items: [
        ['Dashboard', '/faculty', 'dashboard'],
        ['Activities', '/faculty/activities', 'activity'],
        ['Announcements', '/faculty/announcements', 'announcements'],
        ['Events', '/faculty/events', 'events'],
      ],
    },
  ],

  HOD: [
    {
      section: 'MAIN',
      items: [
        ['Dashboard', '/hod', 'dashboard'],
        ['Department Activities', '/hod/activities', 'activity'],
        ['Announcements', '/hod/announcements', 'announcements'],
        ['Analytics', '/hod/analytics', 'analytics'],
      ],
    },
  ],

  Admin: [
    {
      section: 'MAIN',
      items: [
        ['Dashboard', '/admin', 'dashboard'],
        ['Activities', '/admin/activities', 'activity'],
        ['Events', '/admin/events', 'events'],
        ['Announcements', '/admin/announcements', 'announcements'],
        ['Analytics', '/admin/analytics', 'analytics'],
      ],
    },
  ],
}

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  ),

  activity: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h4l2-7 4 14 2-7h4" />
    </svg>
  ),

  events: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M7 3.5v4M17 3.5v4M3.5 9h17" />
    </svg>
  ),

  announcements: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4M7 9l10-4v14L7 15z" />
      <path d="M17 9.5c1.5.8 2.5 2 2.5 3.5s-1 2.7-2.5 3.5" />
    </svg>
  ),

  hub: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="2.3" />
      <circle cx="5" cy="18" r="2.3" />
      <circle cx="19" cy="18" r="2.3" />
      <path d="M10.7 6.9 6.3 16M13.3 6.9l4.4 9.1M7.3 18h9.4" />
    </svg>
  ),

  clubs: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 20c.6-3.4 2.5-5 5.5-5s4.9 1.6 5.5 5M14 16c3.2-.7 5.5.8 6.5 4" />
    </svg>
  ),

  achievements: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4h8v5c0 3-1.8 5-4 5s-4-2-4-5z" />
      <path d="M8 7H5c0 3 1.5 4.5 4 4.5M16 7h3c0 3-1.5 4.5-4 4.5M12 14v4M8.5 20h7" />
    </svg>
  ),

  analytics: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V10M12 19V5M19 19v-7" />
      <path d="M3.5 19.5h17" />
    </svg>
  ),
}

function SidebarItem({ label, to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? 'active' : ''}`
      }
    >
      <span className="sidebar-link-icon">
        {icons[icon]}
      </span>

      <span className="sidebar-link-label">
        {label}
      </span>
    </NavLink>
  )
}

export default function Sidebar({ role = 'Student' }) {
  const sections = linksByRole[role] || linksByRole.Student

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          C4
        </div>

        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title">
            C4GT
          </div>

          <div className="sidebar-brand-subtitle">
            KIET Engagement
          </div>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div
            className="sidebar-section"
            key={section.section}
          >
            <div className="sidebar-section-title">
              {section.section}
            </div>

            <div className="sidebar-section-items">
              {section.items.map(([label, to, icon]) => (
                <SidebarItem
                  key={to}
                  label={label}
                  to={to}
                  icon={icon}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-campus-card">
          <div className="sidebar-campus-label">
            C4GT HUB @ KIET
          </div>

          <div className="sidebar-campus-text">
            Innovation • Projects • Community
          </div>
        </div>
      </div>
    </aside>
  )
}