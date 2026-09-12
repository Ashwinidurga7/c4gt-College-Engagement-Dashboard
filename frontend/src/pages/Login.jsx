import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/Toast'

const portalRoles = [
  {
    id: 'Student',
    icon: '🎓',
    label: 'Student Portal',
    shortLabel: 'Student',
    tag: 'B.Tech & Degree ERP',
    inputLabel: 'University Roll Number or College Email',
    placeholder: 'Enter 10-digit Roll No. (e.g. 23JN1A4533)',
    desc: 'Unified academic services: 12-month attendance, semester SGPA results, fee clearance, bus pass and portfolio.',
    features: ['Real-time Attendance Tracking', 'Semester Results & SGPA', 'Online Fee Receipts & Bus Pass', 'Digital Portfolio & Resume'],
    accent: '#1e40af',
    accentBg: '#eff6ff',
    demoId: '23JN1A4533',
    demoPass: '23JN1A4533',
    demoName: 'G. Sai Vamsi (3rd Year AIDS)',
  },
  {
    id: 'Faculty',
    icon: '👩‍🏫',
    label: 'Faculty Portal',
    shortLabel: 'Faculty',
    tag: 'Academic Instruction',
    inputLabel: 'Institutional Faculty Email',
    placeholder: 'Enter College Email (e.g. faculty@kiet.edu)',
    desc: 'Academic teaching tools: lecture attendance entry, student activity validation, and internal assessments.',
    features: ['Lecture Attendance Entry', 'Student Activity Verification', 'Internal Mark Entry & Grades', 'Department Mentorship'],
    accent: '#0d9488',
    accentBg: '#f0fdfa',
    demoId: 'faculty@kiet.edu',
    demoPass: 'faculty123',
    demoName: 'Dr. K. V. Ramana (AI & Data Science)',
  },
  {
    id: 'HOD',
    icon: '🏫',
    label: 'HOD Portal',
    shortLabel: 'HOD',
    tag: 'Department Administration',
    inputLabel: 'Department Head Email',
    placeholder: 'Enter Department Email (e.g. hod@kiet.edu)',
    desc: 'Branch administration: department attendance monitoring, faculty workload review, and executive approvals.',
    features: ['Department Attendance Analytics', 'Faculty Teaching Oversight', 'Student Verification Approvals', 'Curriculum Monitoring'],
    accent: '#7c3aed',
    accentBg: '#f5f3ff',
    demoId: 'hod@kiet.edu',
    demoPass: 'hod123',
    demoName: 'Prof. M. S. R. Prasad (Head of Department)',
  },
  {
    id: 'Admin',
    icon: '🏛️',
    label: 'Admin Portal',
    shortLabel: 'Admin',
    tag: 'Campus Administration',
    inputLabel: 'Administrator Email / Username',
    placeholder: 'Enter Admin Email (e.g. admin@kiet.edu)',
    desc: 'Central college operations: examination cell records, multi-campus governance, and institutional audits.',
    features: ['Central Campus Ecosystem Overview', 'Multi-Branch Academic Registry', 'Campus Facilities & Network', 'Master Data Audits'],
    accent: '#d97706',
    accentBg: '#fffbeb',
    demoId: 'admin@kiet.edu',
    demoPass: 'admin123',
    demoName: 'Central Administration Office (KIET)',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  // Two-step flow: 'select' -> 'login'
  const [step, setStep] = useState('select')
  const [role, setRole] = useState('Student')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [showDemoModal, setShowDemoModal] = useState(false)

  const activeRoleConfig = portalRoles.find((r) => r.id === role) || portalRoles[0]

  function handleSelectRole(selectedRole) {
    setRole(selectedRole)
    setStep('login')
    setError('')
    setIdentifier('')
    setPassword('')
  }

  function handleSwitchRoleInLogin(newRole) {
    setRole(newRole)
    setError('')
    setIdentifier('')
    setPassword('')
  }

  function handleFillDemo(demoRole, demoId, demoPass) {
    setRole(demoRole)
    setIdentifier(demoId)
    setPassword(demoPass)
    setStep('login')
    setError('')
    setShowDemoModal(false)
    showToast(`Test credentials populated for ${demoRole} portal.`, 'info')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const trimmedId = identifier.trim()
    const trimmedPass = password.trim()

    if (!trimmedId || !trimmedPass) {
      setError(
        role === 'Student'
          ? 'University Roll Number and password are required'
          : 'Institutional email and password are required'
      )
      return
    }

    setLoading(true)
    try {
      const result = await login(trimmedId, trimmedPass, role)
      if (!result.ok) {
        setError(result.error || (role === 'Student' ? 'Invalid roll number or password' : 'Invalid email or password'))
        return
      }

      showToast(`Welcome to College Engagement Dashboard, ${result.user?.name || role}!`, 'success')
      const targetRole = (result.user?.role || role).toLowerCase()
      navigate(`/${targetRole}`)
    } catch {
      setError('Unable to sign in right now. Please check your network connection.')
    } finally {
      setLoading(false)
    }
  }

  function handleForgotSubmit(e) {
    e.preventDefault()
    if (!forgotEmail) return
    setShowForgotModal(false)
    setForgotEmail('')
    showToast('Password recovery instructions sent to your institutional email.', 'info')
  }

  return (
    <div className="login-page institutional-portal">
      {step === 'select' ? (
        /* STEP 1: PORTAL OPTION GATEWAY */
        <div className="gateway-shell">
          {/* Institutional Top Crest Header */}
          <header className="gateway-top-header">
            <div className="gateway-logo-wrap">
              <img
                src="/images/kiet-logo.png"
                alt="KIET Logo"
                className="gateway-kiet-logo"
              />
            </div>
            <div className="gateway-branding">
              <div className="gateway-brand-top-row">
                <span className="gateway-eyebrow">KIET GROUP OF INSTITUTIONS</span>
                <span className="gateway-project-pill">
                  <span className="project-pill-dot" />
                  College-Engagement-Dashboard
                </span>
              </div>
              <h1 className="gateway-institution-title">College Engagement Dashboard</h1>
              <p className="gateway-institution-subtitle">
                Kakinada Institute of Engineering & Technology • Institutional ERP & Engagement Gateway
              </p>
              <p className="gateway-institution-meta">
                <span>📍 Korangi, Kakinada Dist. • Andhra Pradesh</span>
                <span className="meta-sep">•</span>
                <span>Affiliated to JNTUK Kakinada</span>
                <span className="meta-sep">•</span>
                <span>AICTE Approved</span>
              </p>
            </div>
          </header>

          {/* Gateway Title Box */}
          <div className="gateway-intro">
            <div className="gateway-badge">
              <span className="gateway-pulse-dot" />
              <span>COLLEGE ENGAGEMENT DASHBOARD • AY 2025–26</span>
            </div>
            <h2>Select Portal Access</h2>
            <p>
              Welcome to the official <strong>College-Engagement-Dashboard</strong>. Please select your designated institutional portal option below to proceed to the secure single sign-on authentication portal.
            </p>
          </div>

          {/* 4 Official Portal Gateway Cards */}
          <div className="gateway-grid">
            {portalRoles.map((item) => (
              <div
                key={item.id}
                className="gateway-card"
                onClick={() => handleSelectRole(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelectRole(item.id)}
              >
                <div className="gateway-card-top">
                  <div className="gateway-icon-box" style={{ background: item.accentBg, color: item.accent }}>
                    <span>{item.icon}</span>
                  </div>
                  <span className="gateway-tag">{item.tag}</span>
                </div>

                <h3 className="gateway-card-title">{item.label}</h3>
                <p className="gateway-card-desc">{item.desc}</p>

                <ul className="gateway-feature-list">
                  {item.features.map((feat, idx) => (
                    <li key={idx}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="gateway-card-btn"
                  style={{ '--card-accent': item.accent }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectRole(item.id)
                  }}
                >
                  <span>Enter {item.shortLabel} Login</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Institutional Trust Footer */}
          <footer className="gateway-footer">
            <div className="gateway-security-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted Campus ERP • Affiliated to JNTUK Kakinada • ISO 9001:2015</span>
            </div>
            <div className="gateway-help-row">
              <span>Need technical assistance? </span>
              <a href="mailto:itdesk@kiet.edu" className="help-link">KIET Campus IT Cell</a>
              <span className="meta-sep">•</span>
              <button
                type="button"
                className="text-helper-btn"
                onClick={() => setShowDemoModal(true)}
              >
                Institutional Test Credentials Guide
              </button>
            </div>
          </footer>
        </div>
      ) : (
        /* STEP 2: DESIGNATED ROLE LOGIN FORM */
        <div className="portal-auth-container">
          {/* Top Return / Breadcrumb Bar */}
          <div className="portal-auth-nav">
            <button
              type="button"
              className="back-gateway-btn"
              onClick={() => setStep('select')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Switch Portal Option</span>
            </button>

            <div className="portal-session-status">
              <span className="status-dot" />
              <span>COLLEGE ENGAGEMENT DASHBOARD • {role.toUpperCase()} GATEWAY</span>
            </div>
          </div>

          {/* Unified Two-Panel Login Shell */}
          <main className="login-shell auth-split-shell">
            {/* Left Panel: Institutional Credentials & Security Info */}
            <section className="login-brand auth-info-panel">
              <div className="brand-top-block">
                <div className="kiet-logo-badge">
                  <img
                    src="/images/kiet-logo.png"
                    alt="KIET Logo"
                    className="kiet-official-logo"
                  />
                </div>

                <div className="kiet-institution-block">
                  <div className="gateway-brand-top-row" style={{ marginBottom: '4px' }}>
                    <span className="kiet-abbr-tag">KIET GROUP OF INSTITUTIONS</span>
                    <span className="gateway-project-pill sm">
                      College-Engagement-Dashboard
                    </span>
                  </div>
                  <h2 className="kiet-institution-name">
                    College Engagement Dashboard
                  </h2>
                  <p className="kiet-location">
                    Kakinada Institute of Engineering & Technology • <span className="location-pin">📍</span> Korangi
                  </p>
                </div>
              </div>

              {/* Role-Specific Institutional Brief */}
              <div className="auth-role-summary-card">
                <div className="role-summary-head">
                  <span className="role-avatar-circle">{activeRoleConfig.icon}</span>
                  <div>
                    <span className="role-sub-pill">{activeRoleConfig.tag}</span>
                    <h3 className="role-header-title">{activeRoleConfig.label}</h3>
                  </div>
                </div>
                <p className="role-summary-desc">{activeRoleConfig.desc}</p>

                <div className="role-guidelines-box">
                  <strong>Access Guidelines:</strong>
                  <ul>
                    {role === 'Student' ? (
                      <>
                        <li>Use your 10-digit University Roll Number (e.g. 23JN1A4533).</li>
                        <li>Keep your ERP portal password confidential at all times.</li>
                        <li>For password recovery, contact the Examination / Academic Cell.</li>
                      </>
                    ) : role === 'Faculty' ? (
                      <>
                        <li>Sign in using your official @kiet.edu institutional faculty ID.</li>
                        <li>Ensure attendance is submitted within 15 minutes of lecture commencement.</li>
                        <li>Review pending student activity verifications regularly.</li>
                      </>
                    ) : role === 'HOD' ? (
                      <>
                        <li>Sign in using your verified Department Head credentials.</li>
                        <li>Access real-time branch attendance summaries & faculty logs.</li>
                        <li>Approve pending co-curricular student activity submissions.</li>
                      </>
                    ) : (
                      <>
                        <li>Authorized administrative personnel access only.</li>
                        <li>Session activity is encrypted, logged and audited.</li>
                        <li>Comply with KIET IT institutional security guidelines.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="brand-security-seal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>256-Bit SSL Encrypted Campus ERP • Affiliated to JNTUK Kakinada • ISO 9001:2015</span>
              </div>
            </section>

            {/* Right Panel: Official Authentication Form */}
            <section className="login-panel auth-form-panel">
              <div className="mobile-login-brand">
                <img src="/images/kiet-logo.png" alt="KIET" className="mobile-kiet-logo" />
                <div className="mobile-brand-text">
                  <strong>College Engagement Dashboard</strong>
                  <small>{activeRoleConfig.label} • KIET Kakinada</small>
                </div>
              </div>

              <div className="login-head">
                <div className="portal-badge" style={{ color: activeRoleConfig.accent, borderColor: activeRoleConfig.accentBg, background: activeRoleConfig.accentBg }}>
                  <span className="portal-live-dot" style={{ background: activeRoleConfig.accent }} />
                  <span>{activeRoleConfig.icon} {activeRoleConfig.tag.toUpperCase()}</span>
                </div>
                <h2>Sign in to {activeRoleConfig.label}</h2>
                <p>Enter your institutional login credentials to access the College Engagement Dashboard.</p>
              </div>

              {/* Secure Login Form - Dedicated Strictly to Selected Portal */}
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-field-group">
                  <div className="input-label-row">
                    <span>{activeRoleConfig.inputLabel}</span>
                  </div>
                  <input
                    type={role === 'Student' ? 'text' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={activeRoleConfig.placeholder}
                    autoFocus
                    autoComplete={role === 'Student' ? 'username' : 'email'}
                    spellCheck="false"
                    required
                  />
                </div>

                <div className="input-field-group">
                  <div className="input-label-row">
                    <span>Portal Password</span>
                    <button
                      type="button"
                      className="forgot-link-btn"
                      onClick={() => setShowForgotModal(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="password-box">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your portal password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="login-options-row">
                  <label className="remember-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>

                {error && (
                  <div className="login-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="login-submit" disabled={loading}>
                  {loading ? (
                    <span className="login-spinner">Verifying credentials…</span>
                  ) : (
                    <>
                      <span>Sign In to {activeRoleConfig.shortLabel} Portal</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="login-footer-help">
                  <span>Having trouble signing in? Contact </span>
                  <a href="mailto:itdesk@kiet.edu">KIET IT Operations</a>
                  <span className="footer-bullet">•</span>
                  <button
                    type="button"
                    className="text-helper-btn"
                    onClick={() => setShowDemoModal(true)}
                  >
                    View Test Accounts
                  </button>
                </div>
              </form>
            </section>
          </main>
        </div>
      )}

      {/* Discrete Demo Credentials Guide Modal (Clean & Hidden from main UI) */}
      {showDemoModal && (
        <div className="modal-backdrop" onClick={() => setShowDemoModal(false)}>
          <div className="modal-card demo-credentials-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-kicker">COLLEGE ENGAGEMENT DASHBOARD • TEST ENVIRONMENT</span>
                <h3>{step === 'login' ? `Authorized ${activeRoleConfig.label} Test Account` : 'Authorized Institutional Test Accounts'}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowDemoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body-content">
              <p className="modal-desc">
                {step === 'login'
                  ? `Authorized test account profile configured for the ${activeRoleConfig.label}.`
                  : 'Select any authorized test profile below to auto-populate credentials and test role-specific functionalities.'}
              </p>

              <div className="demo-accounts-table-wrap">
                <table className="demo-accounts-table">
                  <thead>
                    <tr>
                      <th>Portal Role</th>
                      <th>Identifier</th>
                      <th>Password</th>
                      <th>Account Profile</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(step === 'login' ? portalRoles.filter((r) => r.id === role) : portalRoles).map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span className="role-table-badge">
                            <span>{r.icon}</span> {r.shortLabel}
                          </span>
                        </td>
                        <td>
                          <code className="demo-code">{r.demoId}</code>
                        </td>
                        <td>
                          <code className="demo-code">{r.demoPass}</code>
                        </td>
                        <td>
                          <span className="demo-profile-name">{r.demoName}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="button button-primary button-sm"
                            onClick={() => handleFillDemo(r.id, r.demoId, r.demoPass)}
                          >
                            Fill & Test →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="demo-modal-footer">
                <p>
                  * Note: In production mode, authentication requires active LDAP credentials verified by JNTUK campus servers.
                </p>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowDemoModal(false)}
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-card small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-kicker">COLLEGE ENGAGEMENT DASHBOARD • CREDENTIAL RECOVERY</span>
                <h3>Reset Portal Password</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowForgotModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleForgotSubmit} className="modal-body-form">
              <p className="modal-desc">
                Enter your registered University Roll Number or official college email. We will dispatch a secure reset OTP to your registered institutional contact.
              </p>
              <label>
                <span>Roll Number or College Email Address</span>
                <input
                  type="text"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. 23JN1A4533 or name@kiet.edu"
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Send Recovery OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
