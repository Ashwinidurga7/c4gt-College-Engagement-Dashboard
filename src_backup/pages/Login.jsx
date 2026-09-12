import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const roles = [
  {
    id: 'Student',
    label: 'Student',
    icon: '🎓',
    description: 'Login using Roll Number',
  },
  {
    id: 'Faculty',
    label: 'Faculty',
    icon: '👩‍🏫',
    description: 'Login using college email',
  },
  {
    id: 'HOD',
    label: 'HOD',
    icon: '🏫',
    description: 'Department administration',
  },
  {
    id: 'Admin',
    label: 'Admin',
    icon: '⚙️',
    description: 'College administration',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role, setRole] = useState('Student')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    const value = identifier.trim()
    const pass = password.trim()

    if (!value || !pass) {
      setError(
        role === 'Student'
          ? 'Roll Number and password are required'
          : 'Email and password are required'
      )
      return
    }

    setLoading(true)

    try {
      // FRONTEND-ONLY STUDENT LOGIN
      // Student password is the same as Roll Number.
      if (role === 'Student') {
        const rollNumber = value.toUpperCase()

        if (pass !== value) {
          setError('Student password must be the same as the Roll Number')
          setLoading(false)
          return
        }

        const student = {
          id: `student_${rollNumber}`,
          name: 'Student',
          rollNumber,
          email: '',
          role: 'Student',
          department: '',
          emailVerified: true,
        }

        localStorage.setItem('c4gt_user', JSON.stringify(student))

        // Small delay so the loading state feels natural.
        await new Promise((resolve) => setTimeout(resolve, 300))

        navigate('/student')
        return
      }

      // FACULTY / HOD / ADMIN
      const result = await login(value, pass)

      if (!result.ok) {
        setError(result.error || 'Invalid email or password')
        setLoading(false)
        return
      }

      const actualRole = result.user?.role || role

      navigate(`/${actualRole.toLowerCase()}`)
    } catch (err) {
      setError('Unable to sign in. Please try again.')
      setLoading(false)
    }
  }

  function handleClear() {
    setIdentifier('')
    setPassword('')
    setError('')
  }

  const isStudent = role === 'Student'

  return (
    <div style={styles.page}>
      <div style={styles.backgroundShapeOne} />
      <div style={styles.backgroundShapeTwo} />

      <main style={styles.container}>
        {/* BRAND */}
        <section style={styles.brandSection}>
          <div style={styles.logo}>
            C4GT
          </div>

          <div>
            <div style={styles.brandEyebrow}>
              COLLEGE ENGAGEMENT
            </div>

            <h1 style={styles.brandTitle}>
              Dashboard
            </h1>

            <p style={styles.brandSubtitle}>
              A digital space for students, faculty and college activities.
            </p>
          </div>
        </section>

        {/* LOGIN CARD */}
        <section style={styles.loginCard}>
          <div style={styles.heading}>
            <span style={styles.welcome}>
              Welcome back
            </span>

            <h2 style={styles.loginTitle}>
              Sign in to your account
            </h2>

            <p style={styles.loginSubtitle}>
              Select your role and continue to your dashboard.
            </p>
          </div>

          {/* ROLE SELECTOR */}
          <div style={styles.roleGrid}>
            {roles.map((item) => {
              const active = role === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRole(item.id)
                    setIdentifier('')
                    setPassword('')
                    setError('')
                  }}
                  style={{
                    ...styles.roleButton,
                    ...(active
                      ? styles.roleButtonActive
                      : {}),
                  }}
                >
                  <span style={styles.roleIcon}>
                    {item.icon}
                  </span>

                  <span>
                    <strong style={styles.roleLabel}>
                      {item.label}
                    </strong>

                    <small style={styles.roleDescription}>
                      {item.description}
                    </small>
                  </span>
                </button>
              )
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >
            {/* IDENTIFIER */}
            <label style={styles.field}>
              <span style={styles.label}>
                {isStudent ? 'Roll Number' : 'Email Address'}
              </span>

              <input
                value={identifier}
                onChange={(event) =>
                  setIdentifier(event.target.value)
                }
                placeholder={
                  isStudent
                    ? 'Enter your roll number'
                    : 'name@college.edu'
                }
                autoComplete="username"
                style={styles.input}
              />
            </label>

            {/* PASSWORD */}
            <label style={styles.field}>
              <span style={styles.label}>
                Password
              </span>

              <div style={styles.passwordWrap}>
                <input
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder={
                    isStudent
                      ? 'Enter Roll Number'
                      : 'Enter password'
                  }
                  autoComplete="current-password"
                  style={{
                    ...styles.input,
                    paddingRight: 80,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  style={styles.showButton}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {isStudent && (
                <span style={styles.helperText}>
                  Student password is the same as your Roll Number.
                </span>
              )}
            </label>

            {/* ERROR */}
            {error && (
              <div style={styles.errorBox}>
                <span>!</span>
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div style={styles.actionRow}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={styles.signInButton}
              >
                {loading
                  ? 'Signing in...'
                  : `Sign in as ${role}`}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>

          {/* EXTRA LINKS */}
          <div style={styles.bottomArea}>
            <button
              type="button"
              style={styles.linkButton}
              onClick={() =>
                alert(
                  isStudent
                    ? 'Please contact your college administration for account assistance.'
                    : 'Please contact the college administrator to reset your password.'
                )
              }
            >
              Forgot password?
            </button>

            {isStudent && (
              <div style={styles.signupRow}>
                <span>
                  New student?
                </span>

                <Link
                  to="/signup"
                  style={styles.signupLink}
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section style={styles.features}>
          <Feature
            icon="📢"
            title="Campus Updates"
            text="Announcements and important college information."
          />

          <Feature
            icon="🎯"
            title="Activities"
            text="Discover workshops, clubs, events and opportunities."
          />

          <Feature
            icon="📊"
            title="Engagement"
            text="Track your participation and achievements."
          />
        </section>

        <footer style={styles.footer}>
          C4GT College Engagement Dashboard
        </footer>
      </main>
    </div>
  )
}

function Feature({ icon, title, text }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>
        {icon}
      </div>

      <div>
        <div style={styles.featureTitle}>
          {title}
        </div>

        <div style={styles.featureText}>
          {text}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #f4f8fd 0%, #ffffff 52%, #eef5ff 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '40px 20px',
  },

  backgroundShapeOne: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'rgba(37, 99, 235, 0.06)',
    top: -120,
    right: -80,
  },

  backgroundShapeTwo: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'rgba(15, 118, 110, 0.05)',
    bottom: -130,
    left: -80,
  },

  container: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 1060,
    margin: '0 auto',
  },

  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginBottom: 28,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background:
      'linear-gradient(135deg, #12325b, #2563eb)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 19,
    fontWeight: 900,
    letterSpacing: 1,
    boxShadow:
      '0 8px 20px rgba(37, 99, 235, 0.18)',
  },

  brandEyebrow: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.8,
  },

  brandTitle: {
    margin: '3px 0 2px',
    color: '#12325b',
    fontSize: 27,
    fontWeight: 850,
  },

  brandSubtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: 13,
  },

  loginCard: {
    width: '100%',
    maxWidth: 760,
    margin: '0 auto',
    background: '#ffffff',
    border: '1px solid #dce5ef',
    borderRadius: 20,
    padding: 30,
    boxShadow:
      '0 14px 40px rgba(15, 23, 42, 0.08)',
  },

  heading: {
    marginBottom: 22,
  },

  welcome: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: 800,
  },

  loginTitle: {
    margin: '5px 0 5px',
    color: '#12325b',
    fontSize: 24,
    fontWeight: 800,
  },

  loginSubtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: 13,
  },

  roleGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10,
    marginBottom: 22,
  },

  roleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    textAlign: 'left',
    padding: 12,
    borderRadius: 12,
    border: '1px solid #dce5ef',
    background: '#fff',
    cursor: 'pointer',
  },

  roleButtonActive: {
    border: '1px solid #2563eb',
    background: '#eff6ff',
  },

  roleIcon: {
    fontSize: 19,
  },

  roleLabel: {
    display: 'block',
    color: '#12325b',
    fontSize: 12,
  },

  roleDescription: {
    display: 'block',
    marginTop: 2,
    color: '#64748b',
    fontSize: 9,
  },

  form: {
    display: 'grid',
    gap: 17,
  },

  field: {
    display: 'grid',
    gap: 7,
  },

  label: {
    color: '#334155',
    fontSize: 12,
    fontWeight: 700,
  },

  input: {
    width: '100%',
    height: 46,
    border: '1px solid #d6e0eb',
    borderRadius: 10,
    outline: 'none',
    padding: '0 13px',
    background: '#fbfdff',
    color: '#172033',
    fontSize: 13,
  },

  passwordWrap: {
    position: 'relative',
  },

  showButton: {
    position: 'absolute',
    right: 8,
    top: 7,
    height: 32,
    padding: '0 10px',
    border: 'none',
    borderRadius: 7,
    background: '#eef4fb',
    color: '#2563eb',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },

  helperText: {
    color: '#64748b',
    fontSize: 10,
  },

  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 9,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: 600,
  },

  actionRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },

  signInButton: {
    flex: 1,
    minHeight: 44,
  },

  bottomArea: {
    marginTop: 21,
    paddingTop: 18,
    borderTop: '1px solid #edf2f7',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#2563eb',
    padding: 0,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },

  signupRow: {
    display: 'flex',
    gap: 5,
    color: '#64748b',
    fontSize: 12,
  },

  signupLink: {
    color: '#12325b',
    fontWeight: 800,
  },

  features: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
    marginTop: 18,
  },

  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 11,
    padding: 15,
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid #dce5ef',
    borderRadius: 13,
  },

  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  featureTitle: {
    color: '#12325b',
    fontSize: 12,
    fontWeight: 800,
  },

  featureText: {
    marginTop: 3,
    color: '#64748b',
    fontSize: 10,
    lineHeight: 1.5,
  },

  footer: {
    textAlign: 'center',
    marginTop: 22,
    color: '#94a3b8',
    fontSize: 10,
  },
}