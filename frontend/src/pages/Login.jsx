import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/Toast'
import Icon from '../components/ui/Icon'

const portalRoles = [
  {
    id: 'Student',
    icon: 'student',
    label: 'Student Portal',
    shortLabel: 'Student',
    tag: 'B.Tech & Degree ERP',
    inputLabel: 'University Roll Number or College Email',
    placeholder: 'Enter Roll Number (e.g. 23JN1A4533)',
    desc: 'Access attendance tracking, semester SGPA results, fee receipts, and digital portfolio.',
    accent: '#1e40af',
    accentBg: '#eff6ff',
    demoId: '23JN1A4533',
    demoPass: '23JN1A4533',
    demoName: 'G. Sai Vamsi (3rd Year AIDS)',
  },
  {
    id: 'Faculty',
    icon: 'faculty',
    label: 'Faculty Portal',
    shortLabel: 'Faculty',
    tag: 'Academic Instruction',
    inputLabel: 'Institutional Faculty Email',
    placeholder: 'Enter College Email (e.g. faculty@kiet.edu)',
    desc: 'Manage lecture attendance, review student co-curricular activities, and mentor projects.',
    accent: '#0d9488',
    accentBg: '#f0fdfa',
    demoId: 'faculty@kiet.edu',
    demoPass: 'faculty123',
    demoName: 'Dr. K. V. Ramana (AI & Data Science)',
  },
  {
    id: 'HOD',
    icon: 'school',
    label: 'HOD Portal',
    shortLabel: 'HOD',
    tag: 'Department Administration',
    inputLabel: 'Department Head Email',
    placeholder: 'Enter Department Email (e.g. hod@kiet.edu)',
    desc: 'Department attendance analytics, faculty instruction oversight, and verification approvals.',
    accent: '#7c3aed',
    accentBg: '#f5f3ff',
    demoId: 'hod@kiet.edu',
    demoPass: 'hod123',
    demoName: 'Prof. M. S. R. Prasad (Head of Department)',
  },
  {
    id: 'Admin',
    icon: 'institution',
    label: 'Admin Portal',
    shortLabel: 'Admin',
    tag: 'Campus Administration',
    inputLabel: 'Administrator Email / Username',
    placeholder: 'Enter Admin Email (e.g. admin@kiet.edu)',
    desc: 'Central campus governance, multi-branch academic registries, and institutional audits.',
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

  // Strictly isolate Login and Gateway pages to clean, modern, high-contrast light mode
  useEffect(() => {
    const prevTheme = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', 'light')
    document.body.setAttribute('data-theme', 'light')
    document.documentElement.classList.remove('dark-theme')
    document.body.classList.remove('dark-theme')

    return () => {
      const saved = localStorage.getItem('kiet_theme_mode') || prevTheme || 'light'
      document.documentElement.setAttribute('data-theme', saved)
      document.body.setAttribute('data-theme', saved)
      if (saved === 'dark') {
        document.documentElement.classList.add('dark-theme')
        document.body.classList.add('dark-theme')
      }
    }
  }, [])

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
    showToast(`Test credentials loaded for ${demoRole} portal.`, 'info')
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

      showToast(`Welcome, ${result.user?.name || role}!`, 'success')
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
    showToast('Password recovery instructions dispatched to your institutional email.', 'info')
  }

  return (
    <div className="login-page institutional-portal">
      {step === 'select' ? (
        /* STEP 1: PORTAL OPTION GATEWAY */
        <div className="gateway-shell">
          {/* Institutional Top Crest Header */}
          <header className="gateway-top-header">
            <div className="gateway-header-left">
              <div className="gateway-logo-wrap">
                <img
                  src="/images/kiet-logo.png"
                  alt="KIET Logo"
                  className="gateway-kiet-logo"
                />
              </div>
              <div className="gateway-branding">
                <h1 className="gateway-institution-title">College Engagement Dashboard</h1>
                <p className="gateway-institution-subtitle">
                  KIET Group of Institutions • Affiliated to JNTUK Kakinada
                </p>
              </div>
            </div>
            <div className="gateway-header-actions">
              <button
                type="button"
                className="gateway-header-signup-btn"
                onClick={() => navigate('/signup')}
              >
                <span>Create Account</span>
              </button>
            </div>
          </header>

          {/* Gateway Title Box */}
          <div className="gateway-intro">
            <h2>Select Portal</h2>
            <p>
              Choose your institutional role to access attendance, academics, and portal services.
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
                <div className="gateway-card-header">
                  <div className="gateway-icon-box" style={{ background: item.accentBg, color: item.accent }}>
                    <span><Icon name={item.icon} /></span>
                  </div>
                  <span className="gateway-role-badge">{item.shortLabel}</span>
                </div>

                <h3 className="gateway-card-title">{item.label}</h3>
                <p className="gateway-card-desc">{item.desc}</p>

                <div className="gateway-card-action">
                  <button
                    type="button"
                    className="gateway-card-btn"
                    style={{ '--card-accent': item.accent }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectRole(item.id)
                    }}
                  >
                    <span>Sign In</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Minimal Footer */}
          <footer className="gateway-footer">
            <div className="gateway-footer-left">
              <span>KIET Group of Institutions • Affiliated to JNTUK Kakinada • AICTE Approved</span>
            </div>
            <div className="gateway-footer-right">
              <button
                type="button"
                className="footer-ghost-btn"
                onClick={() => setShowDemoModal(true)}
              >
                Test Accounts
              </button>
              <span className="footer-sep">•</span>
              <a href="mailto:itdesk@kiet.edu" className="footer-support-link">IT Support</a>
            </div>
          </footer>
        </div>
      ) : (
        /* STEP 2: DESIGNATED ROLE LOGIN FORM */
        <div className="portal-auth-container">
          <div className="auth-center-shell">
            {/* Top Navigation Row */}
            <div className="auth-card-top-nav">
              <button
                type="button"
                className="back-gateway-btn"
                onClick={() => setStep('select')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>All Portals</span>
              </button>

              <span className="auth-institution-tag">KIET Kakinada</span>
            </div>

            {/* Seamless Portal Switcher Tabs */}
            <div className="login-role-tabs" role="tablist">
              {portalRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={role === r.id}
                  className={`login-role-tab ${role === r.id ? 'active' : ''}`}
                  onClick={() => handleSwitchRoleInLogin(r.id)}
                >
                  <span className="tab-icon"><Icon name={r.icon} /></span>
                  <span className="tab-label">{r.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Card Content Header */}
            <div className="auth-card-header">
              <div className="auth-card-logo-wrap">
                <img src="/images/kiet-logo.png" alt="KIET Official" className="auth-card-logo" />
              </div>
              <h2 className="auth-portal-title">Sign in to {activeRoleConfig.label}</h2>
              <p className="auth-portal-subtitle">
                Enter your institutional credentials to access the portal.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form-body">
              <div className="auth-input-group">
                <label className="auth-label">
                  {activeRoleConfig.inputLabel}
                </label>
                <div className="auth-input-wrap">
                  <input
                    type={role === 'Student' ? 'text' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={activeRoleConfig.placeholder}
                    autoFocus
                    autoComplete={role === 'Student' ? 'username' : 'email'}
                    spellCheck="false"
                    required
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <div className="auth-label-split">
                  <label className="auth-label">Portal Password</label>
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-wrap password-wrap">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your portal password"
                    autoComplete="current-password"
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-pwd-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {error && (
                <div className="login-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span>Signing in…</span>
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

              {/* Instant One-Click Demo Fill Pill */}
              <div className="auth-quick-demo">
                <button
                  type="button"
                  className="quick-demo-pill"
                  onClick={() => handleFillDemo(activeRoleConfig.id, activeRoleConfig.demoId, activeRoleConfig.demoPass)}
                >
                  <span className="quick-demo-icon"><Icon name="bolt" /></span>
                  <span>Quick Demo: <strong>{activeRoleConfig.demoId}</strong></span>
                </button>
              </div>

              <div className="auth-footer-redirect">
                <span>Need an account?</span>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => navigate('/signup', { state: { role } })}
                >
                  Register here <Icon name="arrow-right" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discrete Demo Credentials Guide Modal */}
      {showDemoModal && (
        <div className="modal-backdrop" onClick={() => setShowDemoModal(false)}>
          <div className="modal-card demo-credentials-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-kicker">INSTITUTIONAL TEST ACCOUNTS</span>
                <h3>Authorized Demo Profiles</h3>
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
                Select any authorized test profile below to auto-populate credentials and test role-specific functionalities.
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
                    {portalRoles.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span className="role-table-badge">
                            <span><Icon name={r.icon} /></span> {r.shortLabel}
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
                            Fill & Test <Icon name="arrow-right" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="demo-modal-footer">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowDemoModal(false)}
                >
                  Close
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
                <span className="modal-kicker">CREDENTIAL RECOVERY</span>
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
                Enter your registered University Roll Number or official college email to receive password reset instructions.
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
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
