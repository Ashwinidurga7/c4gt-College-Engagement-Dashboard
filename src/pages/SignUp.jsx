import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
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

  // Calculate password strength
  function getPasswordStrength(pass) {
    if (!pass) return { score: 0, label: '', color: '#cbd5e1' }
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' }
    if (score === 3) return { score: 3, label: 'Good', color: '#0ea5e9' }
    return { score: 4, label: 'Strong', color: '#10b981' }
  }

  const pwStrength = getPasswordStrength(password)

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
      <div className="portal-auth-container signup-container">
        {/* Top Return / Breadcrumb Bar */}
        <div className="portal-auth-nav">
          <button
            type="button"
            className="back-gateway-btn"
            onClick={() => navigate('/')}
          >
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Sign In</span>
          </button>

          <div className="portal-session-status">
            <span className="status-dot" />
            <span>COLLEGE ENGAGEMENT DASHBOARD • REGISTRATION PORTAL</span>
          </div>
        </div>

        {/* Split Shell Registration Container */}
        <main className="login-shell auth-split-shell signup-shell">
          {/* Left Panel: Institutional Credentials & Benefits */}
          <section className="login-brand auth-info-panel signup-info-panel">
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
                  <span className="gateway-project-pill sm">College-Engagement-Dashboard</span>
                </div>
                <h2 className="kiet-institution-name">
                  Create Institutional Account
                </h2>
                <p className="kiet-location">
                  Kakinada Institute of Engineering & Technology • <span className="location-pin">📍</span> Korangi
                </p>
              </div>
            </div>

            {/* Registration Benefits & Summary */}
            <div className="auth-role-summary-card">
              <div className="role-summary-head">
                <span className="role-avatar-circle">
                  {role === 'Student' ? '🎓' : '👩‍🏫'}
                </span>
                <div>
                  <span className="role-sub-pill">
                    {role === 'Student' ? 'Undergraduate & Degree ERP' : 'Academic Instruction'}
                  </span>
                  <h3 className="role-header-title">
                    {role === 'Student' ? 'Student Enrollment' : 'Faculty Onboarding'}
                  </h3>
                </div>
              </div>
              <p className="role-summary-desc">
                {role === 'Student'
                  ? 'Register your student credentials to automatically sync your 12-month attendance, semester SGPA results, fee clearance, and verified digital portfolio.'
                  : 'Register your faculty institutional profile to submit lecture attendance, mentor students, and review pending co-curricular activity submissions.'}
              </p>

              <div className="role-guidelines-box">
                <strong>Portal Capabilities:</strong>
                <ul>
                  {role === 'Student' ? (
                    <>
                      <li>Instant digital portfolio & automated resume generator.</li>
                      <li>Live attendance ledger with monthly breakdown.</li>
                      <li>Semester marksheet, SGPA credits & fee payment records.</li>
                      <li>Co-curricular activity submission with faculty verification.</li>
                    </>
                  ) : (
                    <>
                      <li>Submit hourly lecture attendance records.</li>
                      <li>Review & approve student co-curricular submissions.</li>
                      <li>Track branch-wide student performance metrics.</li>
                      <li>Official institutional mentor communication channel.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="brand-security-seal">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted Campus ERP • Affiliated to JNTUK Kakinada • ISO 9001:2015</span>
            </div>
          </section>

          {/* Right Panel: Official Registration Form */}
          <section className="login-panel auth-form-panel signup-form-panel">
            <div className="login-head">
              <div className="signup-header-top">
                <div
                  className="portal-badge"
                  style={{ color: '#1e40af', borderColor: '#dbeafe', background: '#eff6ff' }}
                >
                  <span className="portal-live-dot" style={{ background: '#1e40af' }} />
                  <span>NEW ACCOUNT REGISTRATION</span>
                </div>
                <button
                  type="button"
                  onClick={handlePrefillDemo}
                  className="prefill-demo-badge-btn"
                  title="Click to automatically fill demo data for quick evaluation"
                >
                  <span>⚡ Pre-fill Demo {role}</span>
                </button>
              </div>

              <h2>Enroll in Campus Portal</h2>
              <p>Select your designation and fill in your official details to create your dashboard account.</p>

              {/* Role Toggle Selector */}
              <div className="signup-role-tabs">
                <button
                  type="button"
                  className={`signup-role-tab ${role === 'Student' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('Student')}
                >
                  <span className="tab-icon">🎓</span>
                  <span>Student Portal</span>
                </button>
                <button
                  type="button"
                  className={`signup-role-tab ${role === 'Faculty' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('Faculty')}
                >
                  <span className="tab-icon">👩‍🏫</span>
                  <span>Faculty Portal</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-grid-two-col">
                {/* Full Name */}
                <div className="input-field-group">
                  <label className="field-label">
                    <span>Full Legal Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'Student' ? 'e.g. G. Sai Vamsi' : 'e.g. Dr. K. V. Ramana'}
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Institutional Email */}
                <div className="input-field-group">
                  <label className="field-label">
                    <span>Institutional / Official Email</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'Student' ? 'student@kiet.edu' : 'faculty@kiet.edu'}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Role Specific Identifier: Roll No or Faculty ID */}
                {role === 'Student' ? (
                  <div className="input-field-group">
                    <label className="field-label">
                      <span>University Roll Number (10-Digit)</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 23JN1A4533"
                      maxLength={10}
                      required
                    />
                  </div>
                ) : (
                  <div className="input-field-group">
                    <label className="field-label">
                      <span>Faculty ID / Employee Code</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                      placeholder="e.g. FAC-2024-09"
                      required
                    />
                  </div>
                )}

                {/* Campus Selector */}
                <div className="input-field-group">
                  <label className="field-label">
                    <span>KIET Campus Unit</span>
                    <span className="required-star">*</span>
                  </label>
                  <select
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
                  <div className="input-field-group">
                    <label className="field-label">
                      <span>Academic Branch</span>
                      <span className="required-star">*</span>
                    </label>
                    <select
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
                  <div className="input-field-group">
                    <label className="field-label">
                      <span>Department</span>
                      <span className="required-star">*</span>
                    </label>
                    <select
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
                  <div className="form-sub-grid">
                    <div className="input-field-group">
                      <label className="field-label">
                        <span>Year</span>
                        <span className="required-star">*</span>
                      </label>
                      <select value={year} onChange={(e) => setYear(e.target.value)}>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-field-group">
                      <label className="field-label">
                        <span>Section</span>
                        <span className="required-star">*</span>
                      </label>
                      <select value={section} onChange={(e) => setSection(e.target.value)}>
                        {sections.map((s) => (
                          <option key={s} value={s}>
                            Sec {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="input-field-group">
                    <label className="field-label">
                      <span>Academic Designation</span>
                      <span className="required-star">*</span>
                    </label>
                    <select
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
                <div className="input-field-group">
                  <div className="input-label-row">
                    <span className="field-label">
                      <span>Create Portal Password</span>
                      <span className="required-star">*</span>
                    </span>
                  </div>
                  <div className="password-box">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
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
                  {password && (
                    <div className="password-strength-container">
                      <div className="strength-bars">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className="strength-bar-seg"
                            style={{
                              background:
                                pwStrength.score >= step ? pwStrength.color : '#e2e8f0',
                            }}
                          />
                        ))}
                      </div>
                      <span className="strength-text" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="input-field-group">
                  <div className="input-label-row">
                    <span className="field-label">
                      <span>Confirm Portal Password</span>
                      <span className="required-star">*</span>
                    </span>
                  </div>
                  <div className="password-box">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="password-toggle-btn"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <span className="field-hint-error">Passwords do not match</span>
                  )}
                </div>
              </div>

              {/* Honor Code Checkbox */}
              <div className="signup-terms-row">
                <label className="remember-label terms-label">
                  <input
                    type="checkbox"
                    checked={agreeHonor}
                    onChange={(e) => setAgreeHonor(e.target.checked)}
                  />
                  <span>
                    I certify that my academic information is authentic and agree to adhere to the{' '}
                    <strong>KIET Institutional Honor Code & IT Policy</strong>.
                  </span>
                </label>
              </div>

              {/* Error Box */}
              {error && (
                <div className="login-error">
                  <svg
                    width="16"
                    height="16"
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
                className="login-submit signup-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner">Registering account…</span>
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

              {/* Footer navigation */}
              <div className="login-footer-help signup-footer-help">
                <span>Already have an institutional account?</span>
                <Link to="/" className="signin-link-prominent">
                  Sign In to Portal →
                </Link>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  )
}
