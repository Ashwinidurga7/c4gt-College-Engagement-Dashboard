import React from 'react'

export default function ProfileModal({ profile, onClose }) {
  if (!profile) return null

  const {
    name = 'Authorized Member',
    role = 'Academic Faculty / Leader',
    title = '',
    department = 'KIET Group of Institutions',
    campus = 'KIET Main Campus',
    email = 'contact@kietgroup.com',
    phone = '+91 884 230 4567',
    office = 'Administrative Wing, Room 102',
    bio = 'Committed to academic excellence, innovative technological research, and student mentorship at KIET Group of Institutions.',
    specializations = ['Artificial Intelligence', 'Embedded Systems', 'Institutional Governance'],
    achievements = [
      'Published 15+ Scopus Indexed Research Papers',
      'Lead Principal Investigator for AICTE/MSME Sponsored Projects',
      'Mentored University SIH Grand Finale Teams',
    ],
    avatar,
  } = profile

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card profile-dossier-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="profile-dossier-avatar">
              {avatar ? (
                <img src={avatar} alt={name} onError={e => (e.currentTarget.style.display = 'none')} />
              ) : (
                <span>{initials || 'KP'}</span>
              )}
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: 19 }}>
                {name}
              </h3>
              <span className="profile-dossier-badge">
                {title || role} • {campus}
              </span>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body profile-dossier-body">
          {/* Quick Contact & Department Grid */}
          <div className="profile-dossier-grid">
            <div className="profile-info-pill">
              <span className="pill-label">DEPARTMENT / CELL</span>
              <strong>🏫 {department}</strong>
            </div>
            <div className="profile-info-pill">
              <span className="pill-label">OFFICIAL EMAIL</span>
              <strong>✉️ {email}</strong>
            </div>
            <div className="profile-info-pill">
              <span className="pill-label">CAMPUS OFFICE</span>
              <strong>📍 {office}</strong>
            </div>
            <div className="profile-info-pill">
              <span className="pill-label">CONTACT DIRECTORY</span>
              <strong>📞 {phone}</strong>
            </div>
          </div>

          {/* Bio Overview */}
          <div className="profile-bio-box">
            <span className="profile-section-title">PROFILE SUMMARY</span>
            <p>{bio}</p>
          </div>

          {/* Domain Specializations */}
          {specializations && specializations.length > 0 && (
            <div className="profile-skills-section">
              <span className="profile-section-title">DOMAINS &amp; FOCUS AREAS</span>
              <div className="profile-tag-list">
                {specializations.map((s, idx) => (
                  <span key={idx} className="profile-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Milestones */}
          {achievements && achievements.length > 0 && (
            <div className="profile-achievements-box">
              <span className="profile-section-title">NOTABLE MILESTONES &amp; RECORD</span>
              <ul className="profile-achieve-list">
                {achievements.map((a, idx) => (
                  <li key={idx}>
                    <span className="achieve-bullet">✓</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <a
            href={`mailto:${email}`}
            className="btn-modal-action"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            ✉️ Contact via Email
          </a>
          <button className="btn-modal-close-secondary" onClick={onClose}>
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  )
}
