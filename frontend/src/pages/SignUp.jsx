import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/Toast'
import { campuses, branchesByCampus, years, sections } from '../data/academicData'

const facultyDepartments = [
  'Artificial Intelligence & Data Science',
  'Computer Science & Engineering',
  'Computer Science & AI / Machine Learning',
  'Cyber Security',
  'Information Technology',
  'Electronics & Communication Engineering',
]

const facultyDesignations = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Senior Lecturer',
  'Department Lab Mentor',
]

export default function SignUp() {
  const { signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Strictly isolate SignUp page to clean, modern, high-contrast light mode
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

  const initialRole = location.state?.role || 'Student'
  const [role, setRole] = useState(initialRole)

  // Common Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [campus, setCampus] = useState('KIET')
  const [agreeHonor, setAgreeHonor] = useState(true)

  // Student specific
  const [rollNumber, setRollNumber] = useState('')
  const [branch, setBranch] = useState('AIDS')
  const [year, setYear] = useState('3rd Year')
  const [section, setSection] = useState('A')

  // Faculty specific
  const [facultyId, setFacultyId] = useState('')
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science')
  const [designation, setDesignation] = useState('Assistant Professor')

  // Form states
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Available branches based on selected campus
  const availableBranches = branchesByCampus[campus] || branchesByCampus['KIET']

  function handleRoleChange(newRole) {
    setRole(newRole)
    setError('')
  }

  function handlePrefillDemo() {
    if (role === 'Student') {
      setName('P. Rajesh Varma')
      setEmail('rajesh.varma@kiet.edu')
      setRollNumber('23JN1A4588')
      setCampus('KIET')
      setBranch('AIDS')
      setYear('3rd Year')
      setSection('A')
      setPassword('Password@123')
      setConfirmPassword('Password@123')
      setAgreeHonor(true)
      setError('')
      showToast('Pre-filled student registration profile.', 'info')
    } else {
      setName('Dr. S. N. Murthy')
      setEmail('sn.murthy@kiet.edu')
      setFacultyId('FAC-2024-88')
      setCampus('KIET')
      setDepartment('Artificial Intelligence & Data Science')
      setDesignation('Associate Professor')
      setPassword('Password@123')
      setConfirmPassword('Password@123')
      setAgreeHonor(true)
      setError('')
      showToast('Pre-filled faculty registration profile.', 'info')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPass = password.trim()
    const trimmedConfirm = confirmPassword.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      setError('Please fill in all required fields.')
      return
    }

    if (trimmedPass.length < 6) {
      setError('Password must be at least 6 characters in length.')
      return
    }

    if (trimmedPass !== trimmedConfirm) {
      setError('Passwords do not match. Please verify.')
      return
    }

    if (!agreeHonor) {
      setError('You must agree to the KIET Institutional Academic & IT Honor Code.')
      return
    }

    if (role === 'Student') {
      const trimmedRoll = rollNumber.trim()
      if (!trimmedRoll) {
        setError('University Roll Number is required for student registration.')
        return
      }
      if (trimmedRoll.length < 6) {
        setError('Please enter a valid University Roll Number (e.g. 23JN1A4588).')
        return
      }

      const branchObj = availableBranches.find((b) => b.code === branch) || availableBranches[0]

      setLoading(true)
      try {
        const res = await signup({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPass,
          role: 'Student',
          rollNumber: trimmedRoll,
          campus,
          branch: branchObj.code,
          branchName: branchObj.name,
          year,
          semester:
            year === '1st Year'
              ? 'I Semester'
              : year === '2nd Year'
              ? 'III Semester'
              : year === '3rd Year'
              ? 'VI Semester'
              : 'VII Semester',
          section,
        })

        if (!res.ok) {
          setError(res.error || 'Unable to complete student registration.')
          setLoading(false)
          return
        }

        showToast(`Registration successful! Welcome to KIET ERP, ${res.user.name}.`, 'success')
        navigate('/student')
      } catch {
        setError('An unexpected error occurred during registration. Please try again.')
        setLoading(false)
      }
    } else {
      // Faculty
      const trimmedFacId = facultyId.trim()
      if (!trimmedFacId) {
        setError('Faculty ID / Employee Code is required.')
        return
      }

      setLoading(true)
      try {
        const res = await signup({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPass,
          role: 'Faculty',
          facultyId: trimmedFacId,
          campus,
          department,
          designation,
        })

        if (!res.ok) {
          setError(res.error || 'Unable to complete faculty registration.')
          setLoading(false)
          return
        }

        showToast(`Registration successful! Welcome to KIET ERP, ${res.user.name}.`, 'success')
        navigate('/faculty')
      } catch {
        setError('An unexpected error occurred during registration. Please try again.')
        setLoading(false)
      }
    }
  }

  return (
    <div className="login-page institutional-portal">
      <div className="portal-auth-container">
        <div className="auth-center-shell signup-center-shell">
          {/* Top Return / Navigation Row */}
          <div className="auth-card-top-nav">
            <button
              type="button"
              className="back-gateway-btn"
              onClick={() => navigate('/')}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Sign In</span>
            </button>

            <span className="auth-institution-tag">KIET Kakinada</span>
          </div>

          {/* Role Toggle Selector */}
          <div className="signup-role-tabs">
            <button
              type="button"
              className={`signup-role-tab ${role === 'Student' ? 'active' : ''}`}
              onClick={() => handleRoleChange('Student')}
            >
              <span className="tab-icon">🎓</span>
              <span>Student Registration</span>
            </button>
            <button
              type="button"
              className={`signup-role-tab ${role === 'Faculty' ? 'active' : ''}`}
              onClick={() => handleRoleChange('Faculty')}
            >
              <span className="tab-icon">👩‍🏫</span>
              <span>Faculty Registration</span>
            </button>
          </div>

          {/* Card Content Header */}
          <div className="auth-card-header">
            <div className="auth-card-logo-wrap">
              <img src="/images/kiet-logo.png" alt="KIET Official" className="auth-card-logo" />
            </div>
            <h2 className="auth-portal-title">
              {role === 'Student' ? 'Student Portal Registration' : 'Faculty Portal Registration'}
            </h2>
            <p className="auth-portal-subtitle">
              {role === 'Student'
                ? 'Enroll your University Roll Number to access attendance & academic records.'
                : 'Register your faculty profile for lecture attendance and academic instruction.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-body">
            <div className="form-grid-two-col">
              {/* Full Name */}
              <div className="auth-input-group">
                <label className="auth-label">Full Legal Name *</label>
                <input
                  type="text"
                  className="auth-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'Student' ? 'e.g. G. Sai Vamsi' : 'e.g. Dr. K. V. Ramana'}
                  autoComplete="name"
                  required
                />
              </div>

              {/* Institutional Email */}
              <div className="auth-input-group">
                <label className="auth-label">Official College Email *</label>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'Student' ? 'student@kiet.edu' : 'faculty@kiet.edu'}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Role Specific Identifier: Roll No or Faculty ID */}
              {role === 'Student' ? (
                <div className="auth-input-group">
                  <label className="auth-label">University Roll Number (10-Digit) *</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 23JN1A4533"
                    maxLength={10}
                    required
                  />
                </div>
              ) : (
                <div className="auth-input-group">
                  <label className="auth-label">Faculty ID / Employee Code *</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                    placeholder="e.g. FAC-2024-09"
                    required
                  />
                </div>
              )}

              {/* Campus Selector */}
              <div className="auth-input-group">
                <label className="auth-label">Campus Unit *</label>
                <select
                  className="auth-input"
                  value={campus}
                  onChange={(e) => {
                    setCampus(e.target.value)
                    const list = branchesByCampus[e.target.value] || []
                    if (list.length > 0 && !list.some((b) => b.code === branch)) {
                      setBranch(list[0].code)
                    }
                  }}
                >
                  {campuses.map((c) => (
                    <option key={c} value={c}>
                      {c} Campus
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch / Department Selector */}
              {role === 'Student' ? (
                <div className="auth-input-group">
                  <label className="auth-label">Academic Branch *</label>
                  <select
                    className="auth-input"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    {availableBranches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code} — {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="auth-input-group">
                  <label className="auth-label">Department *</label>
                  <select
                    className="auth-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {facultyDepartments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Student: Year & Section / Faculty: Designation */}
              {role === 'Student' ? (
                <div className="auth-input-group">
                  <label className="auth-label">Year & Section *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <select className="auth-input" value={year} onChange={(e) => setYear(e.target.value)}>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <select className="auth-input" value={section} onChange={(e) => setSection(e.target.value)}>
                      {sections.map((s) => (
                        <option key={s} value={s}>
                          Sec {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="auth-input-group">
                  <label className="auth-label">Academic Designation *</label>
                  <select
                    className="auth-input"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    {facultyDesignations.map((des) => (
                      <option key={des} value={des}>
                        {des}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password Input */}
              <div className="auth-input-group">
                <label className="auth-label">Create Password *</label>
                <div className="auth-input-wrap password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                    required
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

              {/* Confirm Password Input */}
              <div className="auth-input-group">
                <label className="auth-label">Confirm Password *</label>
                <div className="auth-input-wrap password-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="auth-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="auth-pwd-toggle"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            {/* Honor Code Checkbox */}
            <div className="auth-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={agreeHonor}
                  onChange={(e) => setAgreeHonor(e.target.checked)}
                />
                <span>
                  I certify my details are authentic and agree to the <strong>KIET Honor Code</strong>.
                </span>
              </label>
            </div>

            {/* Error Box */}
            {error && (
              <div className="login-error">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Registering account…</span>
              ) : (
                <>
                  <span>Create {role} Account & Enter Dashboard</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            {/* One-Click Quick Demo Pre-fill */}
            <div className="auth-quick-demo">
              <button
                type="button"
                className="quick-demo-pill"
                onClick={handlePrefillDemo}
              >
                <span className="quick-demo-icon">⚡</span>
                <span>Pre-fill Demo {role} Profile</span>
              </button>
            </div>

            {/* Footer navigation */}
            <div className="auth-footer-redirect">
              <span>Already have an institutional account?</span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => navigate('/')}
              >
                Sign In to Portal →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
