import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import {
  campusProfiles,
  yearWiseDemographics,
  campusPlacementData,
  institutionalHods,
  institutionalFaculty,
  transportDrivers,
  campusWorkers,
  getAdminStats,
} from '../../data/adminData'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../components/ui/Toast'

// Two subtle, un-highlighted neutral tones across all graphs
const GRAPH_TONE_1 = '#334155' // Deep Slate / Charcoal
const GRAPH_TONE_2 = '#64748b' // Muted Steel / Slate

const CAMPUS_COLORS = {
  KIET: GRAPH_TONE_1,
  'KIET+': GRAPH_TONE_2,
  "KIET Women's": '#475569',
}

const YEAR_COLORS = {
  '1st Year': GRAPH_TONE_1,
  '2nd Year': GRAPH_TONE_2,
  '3rd Year': GRAPH_TONE_1,
  'Final Year': GRAPH_TONE_2,
}

// Resilient institutional staff avatar with executive monogram profiles
function StaffAvatar({ name, photo = null, campus, size = 64, showBadge = true, className = '', forceMonogram = true }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [photo])

  const initials = useMemo(() => {
    if (!name) return 'KI'
    const cleaned = name
      .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Sri)\s*/gi, '')
      .replace(/\(.*?\)/g, '')
      .trim()
    const parts = cleaned.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'KI'
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    const firstChar = parts[0].replace(/[^a-zA-Z]/g, '')[0] || ''
    const lastChar = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '')[0] || ''
    return (firstChar + lastChar).toUpperCase() || 'KI'
  }, [name])

  const gradient = useMemo(() => {
    if (campus === 'KIET+') {
      return 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)'
    }
    if (campus === "KIET Women's") {
      return 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
    }
    return 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)'
  }, [campus])

  const hasPhoto = Boolean(!forceMonogram && photo && !imgError)

  return (
    <div
      className={`staff-avatar-container ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        position: 'relative',
        borderRadius: 12,
        flexShrink: 0,
      }}
    >
      {hasPhoto ? (
        <img
          src={photo}
          alt=""
          className="staff-avatar-img"
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            objectFit: 'cover',
            border: '1.5px solid rgba(0,0,0,0.08)',
            display: 'block',
          }}
        />
      ) : (
        <div
          className="staff-avatar-monogram"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            background: gradient,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: size >= 60 ? 20 : 13,
            letterSpacing: '0.5px',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.1)',
            userSelect: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          title={name}
        >
          {initials}
        </div>
      )}
      {showBadge && campus && (
        <span
          className="hod-campus-badge"
          style={{
            backgroundColor: CAMPUS_COLORS[campus] || '#0284c7',
          }}
        >
          {campus}
        </span>
      )}
    </div>
  )
}

export default function AdminDashboard({ defaultTab = 'overview' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { activities, updateActivityStatusWithMeta } = useData()

  // Tab state synced with URL or prop
  const getTabFromPath = () => {
    const path = location.pathname
    if (path.includes('/admin/students')) return 'students'
    if (path.includes('/admin/placements')) return 'placements'
    if (path.includes('/admin/faculty')) return 'faculty'
    if (path.includes('/admin/transport')) return 'transport'
    if (path.includes('/admin/workers')) return 'workers'
    if (path.includes('/admin/approvals')) return 'approvals'
    return defaultTab || 'overview'
  }

  const [activeTab, setActiveTab] = useState(getTabFromPath)

  useEffect(() => {
    setActiveTab(getTabFromPath())
  }, [location.pathname, defaultTab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'overview') navigate('/admin')
    else if (tabId === 'students') navigate('/admin/students')
    else if (tabId === 'placements') navigate('/admin/placements')
    else if (tabId === 'faculty') navigate('/admin/faculty')
    else if (tabId === 'transport') navigate('/admin/transport')
    else if (tabId === 'workers') navigate('/admin/workers')
    else if (tabId === 'approvals') navigate('/admin/approvals')
  }

  // Campus Scope Filter: 'ALL' (Overall Group) vs 'KIET' vs 'KIET+' vs 'KIET Women\'s'
  const [selectedCampusScope, setSelectedCampusScope] = useState('ALL')

  // Search and sub-filters
  const [searchQuery, setSearchQuery] = useState('')
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('ALL')
  const [workerCategoryFilter, setWorkerCategoryFilter] = useState('ALL')
  const [yearLevelFilter, setYearLevelFilter] = useState('ALL')
  const [selectedItemModal, setSelectedItemModal] = useState(null)

  // Current stats object based on campus scope
  const stats = useMemo(() => {
    return getAdminStats(selectedCampusScope)
  }, [selectedCampusScope])

  // Filtered lists based on campus scope and search queries
  const filteredHods = useMemo(() => {
    return institutionalHods.filter((h) => {
      if (selectedCampusScope !== 'ALL' && h.campus !== selectedCampusScope) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          h.name.toLowerCase().includes(q) ||
          h.department.toLowerCase().includes(q) ||
          h.campus.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedCampusScope, searchQuery])

  const filteredFaculty = useMemo(() => {
    return institutionalFaculty.filter((f) => {
      if (selectedCampusScope !== 'ALL' && f.campus !== selectedCampusScope) return false
      if (facultyDeptFilter !== 'ALL' && f.department !== facultyDeptFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          f.name.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.campus.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedCampusScope, facultyDeptFilter, searchQuery])

  const filteredDrivers = useMemo(() => {
    return transportDrivers.filter((d) => {
      if (selectedCampusScope !== 'ALL' && d.campus !== selectedCampusScope) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          d.driverName.toLowerCase().includes(q) ||
          d.busNumber.toLowerCase().includes(q) ||
          d.route.toLowerCase().includes(q) ||
          d.destination.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedCampusScope, searchQuery])

  const filteredWorkers = useMemo(() => {
    return campusWorkers.filter((w) => {
      if (selectedCampusScope !== 'ALL' && w.campus !== selectedCampusScope) return false
      if (workerCategoryFilter !== 'ALL' && w.category !== workerCategoryFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          w.name.toLowerCase().includes(q) ||
          w.role.toLowerCase().includes(q) ||
          w.block.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedCampusScope, workerCategoryFilter, searchQuery])

  // Chart 1: Campus Student Population (Pie)
  const campusStudentPieData = useMemo(() => [
    { name: 'KIET Main Campus', value: 1960, color: CAMPUS_COLORS['KIET'] },
    { name: 'KIET+ Advanced Tech', value: 1380, color: CAMPUS_COLORS['KIET+'] },
    { name: "KIET Women's (KIEW)", value: 990, color: CAMPUS_COLORS["KIET Women's"] },
  ], [])

  // Chart 2: Year-wise Strength Bar
  const yearStrengthBarData = useMemo(() => [
    { name: '1st Year (Freshers)', count: stats.firstYear, fill: YEAR_COLORS['1st Year'] },
    { name: '2nd Year', count: stats.secondYear, fill: YEAR_COLORS['2nd Year'] },
    { name: '3rd Year', count: stats.thirdYear, fill: YEAR_COLORS['3rd Year'] },
    { name: 'Final Year', count: stats.finalYear, fill: YEAR_COLORS['Final Year'] },
  ], [stats])

  // Chart 3: Campus Placements Comparison Bar
  const campusPlacementsBarData = useMemo(() => [
    { name: 'KIET Main', placed: 389, eligible: 440, rate: 88.4, fill: CAMPUS_COLORS['KIET'] },
    { name: 'KIET+ Tech', placed: 244, eligible: 290, rate: 84.1, fill: CAMPUS_COLORS['KIET+'] },
    { name: "KIET Women's", placed: 199, eligible: 230, rate: 86.5, fill: CAMPUS_COLORS["KIET Women's"] },
  ], [])

  // Chart 4: Human Resources Breakdown Bar
  const staffBreakdownBarData = useMemo(() => [
    { name: 'Faculty Members', count: stats.totalFaculty, fill: GRAPH_TONE_1 },
    { name: 'Campus Workers', count: stats.totalWorkers, fill: GRAPH_TONE_2 },
    { name: 'Bus Drivers', count: stats.totalDrivers, fill: GRAPH_TONE_1 },
    { name: 'Department HODs', count: stats.totalHODs, fill: GRAPH_TONE_2 },
  ], [stats])

  // Pending Verifications queue
  const pendingApprovals = activities.filter((a) => a.status === 'Pending')

  const handleApprove = (id) => {
    updateActivityStatusWithMeta(id, 'Verified')
    addToast('Institutional certificate submission approved successfully.', 'success')
  }

  const handleReject = (id) => {
    const reason = window.prompt('Enter rejection reason:')
    if (reason) {
      updateActivityStatusWithMeta(id, 'Rejected', { reason })
      addToast(`Submission rejected with reason: "${reason}"`, 'warning')
    }
  }

  // Export CSV Helper
  const handleExportCSV = () => {
    let headers = []
    let rows = []
    let fileName = `KIET_Admin_Export_${activeTab}_${selectedCampusScope}`

    if (activeTab === 'transport') {
      headers = ['Bus Number', 'Driver Name', 'Phone', 'License ID', 'Route Coverage', 'Destination', 'Campus', 'Capacity', 'Status']
      rows = filteredDrivers.map(d => [
        d.busNumber, `"${d.driverName}"`, d.phone, d.license, `"${d.route}"`, `"${d.destination}"`, d.campus, d.capacity, `"${d.status}"`
      ])
    } else if (activeTab === 'workers') {
      headers = ['Emp ID', 'Name', 'Role', 'Category', 'Campus', 'Block/Building', 'Phone', 'Shift', 'Status']
      rows = filteredWorkers.map(w => [
        w.empId, `"${w.name}"`, `"${w.role}"`, `"${w.category}"`, w.campus, `"${w.block}"`, w.phone, `"${w.shift}"`, w.status
      ])
    } else if (activeTab === 'faculty') {
      headers = ['Name', 'Designation', 'Department', 'Campus', 'Qualification', 'Experience', 'Phone', 'Email']
      rows = filteredFaculty.map(f => [
        `"${f.name}"`, `"${f.designation}"`, f.department, f.campus, `"${f.qualification}"`, `"${f.experience}"`, f.phone, f.email
      ])
    } else {
      headers = ['Campus', 'Total Students', '1st Year', '2nd Year', '3rd Year', 'Final Year', 'Day Scholars', 'Hostelers', 'Placed Count', 'Placement Rate', 'Total HODs', 'Total Faculty', 'Total Drivers', 'Total Workers']
      rows = [
        [
          selectedCampusScope, stats.totalStudents, stats.firstYear, stats.secondYear, stats.thirdYear, stats.finalYear, stats.dayScholars, stats.hostelers, stats.totalPlaced, `${stats.placementRate}%`, stats.totalHODs, stats.totalFaculty, stats.totalDrivers, stats.totalWorkers
        ]
      ]
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast(`Exported ${fileName}.csv successfully!`, 'success')
  }

  return (
    <div className="admin-governance-container">
      {/* 1. Clean Institutional Header */}
      <div className="admin-header-card">
        <div className="admin-header-meta">
          <span className="admin-governance-tag">🏛️ CENTRAL ADMINISTRATIVE GOVERNANCE</span>
          <h1 className="admin-portal-title maven-black">
            Multi-Campus Administrative Command
          </h1>
          <p className="admin-portal-subtitle">
            Consolidated operations and telemetry for <strong>KIET Main Autonomous</strong>, <strong>KIET+</strong>, and <strong>KIET Women's</strong> campuses.
          </p>
        </div>

        <div className="admin-header-actions">
          <button className="btn-admin-export" onClick={handleExportCSV}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Compact, Balanced Campus Scope Selector */}
      <div className="admin-scope-card">
        <div className="admin-scope-header">
          <span className="scope-indicator-dot" />
          <span className="scope-title">INSTITUTIONAL SCOPE:</span>
        </div>

        <div className="admin-scope-pills">
          <button
            type="button"
            className={`admin-scope-pill ${selectedCampusScope === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCampusScope('ALL')}
          >
            <span className="scope-pill-icon">🏛️</span>
            <span className="pill-name">All 3 Campuses</span>
            <span className="pill-count">4,330</span>
          </button>

          {campusProfiles.map((cp) => {
            const isActive = selectedCampusScope === cp.code
            return (
              <button
                key={cp.code}
                type="button"
                className={`admin-scope-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCampusScope(cp.code)}
              >
                <span className="scope-pill-dot" style={{ backgroundColor: cp.color }} />
                <span className="pill-name">{cp.shortName}</span>
                <span className="pill-count">{cp.totalStudents}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Streamlined, Balanced Slide Tabs Navigation */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <span className="tab-icon">🏛️</span>
          <span className="tab-title">Overview</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => handleTabChange('students')}
        >
          <span className="tab-icon">🎓</span>
          <span className="tab-title">Students (1st–4th Yr)</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
          onClick={() => handleTabChange('placements')}
        >
          <span className="tab-icon">💼</span>
          <span className="tab-title">Placements</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
          onClick={() => handleTabChange('faculty')}
        >
          <span className="tab-icon">👨‍🏫</span>
          <span className="tab-title">Faculty &amp; HODs</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'transport' ? 'active' : ''}`}
          onClick={() => handleTabChange('transport')}
        >
          <span className="tab-icon">🚌</span>
          <span className="tab-title">Transport Fleet</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'workers' ? 'active' : ''}`}
          onClick={() => handleTabChange('workers')}
        >
          <span className="tab-icon">🔧</span>
          <span className="tab-title">Operations &amp; Staff</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => handleTabChange('approvals')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-title">Approvals</span>
          {pendingApprovals.length > 0 && (
            <span className="tab-badge badge-warning">{pendingApprovals.length}</span>
          )}
        </button>
      </div>

      {/* 4. Slide 1: Group Executive Overview */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content fade-in">
          {/* Executive KPI Grid */}
          <div className="admin-kpi-grid">
            <div className="admin-kpi-card accent-sky">
              <div className="kpi-top">
                <span className="kpi-label">Total Student Strength</span>
                <span className="kpi-tag">{selectedCampusScope === 'ALL' ? 'All 3 Campuses' : selectedCampusScope}</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black">{stats.totalStudents}</span>
                <span className="kpi-subtext">Students Registered</span>
              </div>
              <div className="kpi-footer">
                <span>Day Scholars: <strong>{stats.dayScholars}</strong> ({stats.dayScholarsPct}%)</span>
                <span>•</span>
                <span>Hostelers: <strong>{stats.hostelers}</strong></span>
              </div>
            </div>

            <div className="admin-kpi-card accent-emerald">
              <div className="kpi-top">
                <span className="kpi-label">Campus Placements</span>
                <span className="kpi-tag status-clear">{stats.placementRate}% Placed</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black text-emerald">{stats.totalPlaced}</span>
                <span className="kpi-subtext">out of {stats.eligiblePlaced} final years</span>
              </div>
              <div className="kpi-footer">
                <span>Highest: <strong>{stats.highestPackage}</strong></span>
                <span>•</span>
                <span>Avg: <strong>{stats.avgPackage}</strong></span>
              </div>
            </div>

            <div className="admin-kpi-card accent-purple">
              <div className="kpi-top">
                <span className="kpi-label">Academic Leadership &amp; Faculty</span>
                <span className="kpi-tag">{stats.totalHODs} Departments</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black text-purple">{stats.totalHODs + stats.totalFaculty}</span>
                <span className="kpi-subtext">HODs &amp; Professors</span>
              </div>
              <div className="kpi-footer">
                <span>HODs: <strong>{stats.totalHODs}</strong></span>
                <span>•</span>
                <span>Professors &amp; Faculty: <strong>{stats.totalFaculty}</strong></span>
              </div>
            </div>

            <div className="admin-kpi-card accent-amber">
              <div className="kpi-top">
                <span className="kpi-label">Transport &amp; Operations Staff</span>
                <span className="kpi-tag">24 Bus Fleet</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black text-amber">{stats.totalDrivers + stats.totalWorkers}</span>
                <span className="kpi-subtext">Drivers &amp; Workers</span>
              </div>
              <div className="kpi-footer">
                <span>Drivers: <strong>{stats.totalDrivers}</strong></span>
                <span>•</span>
                <span>Technicians &amp; Staff: <strong>{stats.totalWorkers}</strong></span>
              </div>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="admin-charts-grid">
            {/* Chart 1: Campus Distribution Pie */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Student Strength Distribution by Campus</h3>
                  <p className="chart-subtitle">Proportional enrollment across KIET, KIET+, and KIET Women's</p>
                </div>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campusStudentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {campusStudentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} Students (${((val / 4330) * 100).toFixed(1)}%)`, name]}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-footer-metrics">
                <span className="metric-chip chip-kiet">KIET Main: <strong>1,960</strong> (45.3%)</span>
                <span className="metric-chip chip-kietplus">KIET+: <strong>1,380</strong> (31.9%)</span>
                <span className="metric-chip chip-kiew">KIEW: <strong>990</strong> (22.8%)</span>
              </div>
            </div>

            {/* Chart 2: Year-wise Student Strength Bar */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Student Population by Academic Year</h3>
                  <p className="chart-subtitle">1st Year (Freshers), 2nd Year, 3rd Year, and Final Year cohorts</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('students')}>
                  View Year Details →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearStrengthBarData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val) => [`${val} Students`, 'Enrolled']}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {yearStrengthBarData.map((entry, index) => (
                        <Cell key={`year-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-footer-metrics">
                <span>1st Yr: <strong>{stats.firstYear}</strong></span>
                <span>2nd Yr: <strong>{stats.secondYear}</strong></span>
                <span>3rd Yr: <strong>{stats.thirdYear}</strong></span>
                <span>Final Yr: <strong>{stats.finalYear}</strong></span>
              </div>
            </div>

            {/* Chart 3: Campus Placements Comparison */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Placement Success by Campus</h3>
                  <p className="chart-subtitle">Students placed out of final year graduating eligible cohort</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('placements')}>
                  Explore Placements →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campusPlacementsBarData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val, name, item) => [`${val} Placed (${item.payload.rate}%)`, 'Placed']}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Bar dataKey="placed" radius={[6, 6, 0, 0]}>
                      {campusPlacementsBarData.map((entry, index) => (
                        <Cell key={`p-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-note-bar">
                ⚡ <strong>{stats.totalPlaced} Students Placed</strong> ({stats.placementRate}%) across TCS, AWS, Infosys, and Tech Mahindra.
              </div>
            </div>

            {/* Chart 4: Human Resources Allocation */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Human Resources &amp; Staff Deployment</h3>
                  <p className="chart-subtitle">Teaching faculty, HODs, transport drivers, and campus operational staff</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('faculty')}>
                  Staff Directory →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffBreakdownBarData} layout="vertical" margin={{ top: 15, right: 30, left: 25, bottom: 15 }}>
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 600 }} />
                    <Tooltip
                      formatter={(val) => [`${val} Personnel`, 'Count']}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {staffBreakdownBarData.map((entry, index) => (
                        <Cell key={`s-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-note-bar">
                👥 Total Staff Count: <strong>{stats.totalStaff} Personnel</strong> deployed across all three institutional campuses.
              </div>
            </div>
          </div>

          {/* 3 Campus Profiles Showcase */}
          <div className="campus-spotlight-section">
            <h3 className="spotlight-section-title maven-black">Institutional Campus Profiles &amp; Leadership</h3>
            <div className="campus-cards-grid">
              {campusProfiles.map((cp) => (
                <div key={cp.code} className="admin-campus-profile-card">
                  <div className="profile-img-wrap">
                    <img
                      src={cp.image}
                      alt={cp.name}
                      className="profile-img"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <span className="profile-code-badge" style={{ backgroundColor: cp.color }}>{cp.code}</span>
                  </div>
                  <div className="profile-card-body">
                    <h4 className="profile-name maven-black">{cp.name}</h4>
                    <span className="profile-tag">{cp.tag}</span>
                    <p className="profile-location">📍 {cp.location} • {cp.campusArea}</p>

                    <div className="profile-leadership">
                      <div><strong>Director:</strong> {cp.director}</div>
                      <div><strong>Dean:</strong> {cp.dean}</div>
                    </div>

                    <div className="profile-quick-stats">
                      <div className="stat-pill">
                        <span className="stat-num maven-black">{cp.totalStudents}</span>
                        <span className="stat-label">Students</span>
                      </div>
                      <div className="stat-pill">
                        <span className="stat-num maven-black">{cp.totalFaculty}</span>
                        <span className="stat-label">Faculty</span>
                      </div>
                      <div className="stat-pill">
                        <span className="stat-num maven-black">{cp.totalBuses}</span>
                        <span className="stat-label">Buses</span>
                      </div>
                      <div className="stat-pill">
                        <span className="stat-num maven-black">{cp.placementRate}</span>
                        <span className="stat-label">Placed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Slide 2: Student Demographics by Year (1st, 2nd, 3rd, Final Year) */}
      {activeTab === 'students' && (
        <div className="admin-tab-content fade-in">
          <div className="admin-section-header">
            <div>
              <h2 className="section-title maven-black">Student Cohorts by Academic Year (1st to 4th Year)</h2>
              <p className="section-desc">
                Comprehensive demographics covering <strong>{stats.totalStudents} Students</strong> across <strong>1st Year (Freshers)</strong>, <strong>2nd Year</strong>, <strong>3rd Year</strong>, and <strong>Final Year</strong>.
                Showing full details for <strong>KIET</strong>, <strong>KIET+</strong>, and <strong>KIET Women's</strong>.
              </p>
            </div>
            <div className="section-actions">
              <button className="btn-admin-action" onClick={handleExportCSV}>
                Export Year Demographics
              </button>
            </div>
          </div>

          {/* 4 Year Cards Grid */}
          <div className="year-cohort-cards-grid">
            <div className="year-cohort-card card-1st">
              <div className="year-card-header">
                <span className="year-badge">Batch 2025–29</span>
                <span className="year-title maven-black">1st Year (Freshers)</span>
              </div>
              <div className="year-card-count maven-black">{stats.firstYear}</div>
              <div className="year-card-sub">Enrolled Scholars</div>
              <div className="year-campus-breakdown">
                <span>KIET: <strong>540</strong></span>
                <span>KIET+: <strong>380</strong></span>
                <span>KIEW: <strong>260</strong></span>
              </div>
            </div>

            <div className="year-cohort-card card-2nd">
              <div className="year-card-header">
                <span className="year-badge">Batch 2024–28</span>
                <span className="year-title maven-black">2nd Year (Sophomores)</span>
              </div>
              <div className="year-card-count maven-black">{stats.secondYear}</div>
              <div className="year-card-sub">Enrolled Scholars</div>
              <div className="year-campus-breakdown">
                <span>KIET: <strong>500</strong></span>
                <span>KIET+: <strong>350</strong></span>
                <span>KIEW: <strong>260</strong></span>
              </div>
            </div>

            <div className="year-cohort-card card-3rd">
              <div className="year-card-header">
                <span className="year-badge">Batch 2023–27</span>
                <span className="year-title maven-black">3rd Year (Juniors)</span>
              </div>
              <div className="year-card-count maven-black">{stats.thirdYear}</div>
              <div className="year-card-sub">Core Specialization</div>
              <div className="year-campus-breakdown">
                <span>KIET: <strong>480</strong></span>
                <span>KIET+: <strong>360</strong></span>
                <span>KIEW: <strong>240</strong></span>
              </div>
            </div>

            <div className="year-cohort-card card-4th">
              <div className="year-card-header">
                <span className="year-badge">Batch 2022–26</span>
                <span className="year-title maven-black">Final Year (Graduating)</span>
              </div>
              <div className="year-card-count maven-black">{stats.finalYear}</div>
              <div className="year-card-sub">Drive &amp; Capstone Phase</div>
              <div className="year-campus-breakdown">
                <span>KIET: <strong>440</strong></span>
                <span>KIET+: <strong>290</strong></span>
                <span>KIEW: <strong>230</strong></span>
              </div>
            </div>
          </div>

          {/* Detailed Branch Breakdown Table across Campuses */}
          <div className="admin-table-card">
            <div className="table-header-wrap">
              <h3 className="maven-black">Year-Wise Branch Enrollment Matrix ({selectedCampusScope === 'ALL' ? 'All Campuses' : selectedCampusScope})</h3>
              <span className="text-muted">Includes 1st, 2nd, 3rd, Final Year, and Day Scholar / Hosteler counts</span>
            </div>

            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Campus</th>
                  <th>Branch &amp; Specialization</th>
                  <th>1st Year</th>
                  <th>2nd Year</th>
                  <th>3rd Year</th>
                  <th>Final Year</th>
                  <th>Total Enrolled</th>
                  <th>Day Scholars</th>
                  <th>Hostelers</th>
                </tr>
              </thead>
              <tbody>
                {['KIET', 'KIET+', "KIET Women's"]
                  .filter(c => selectedCampusScope === 'ALL' || selectedCampusScope === c)
                  .flatMap(c => {
                    const campusData = yearWiseDemographics.byCampus[c]
                    return campusData.branches.map((b, idx) => (
                      <tr key={`${c}-${b.branch}`}>
                        {idx === 0 && (
                          <td rowSpan={campusData.branches.length} className="campus-cell">
                            <strong>{c}</strong>
                          </td>
                        )}
                        <td>
                          <strong>{b.branch}</strong> — {
                            b.branch === 'AIDS' ? 'Artificial Intelligence & Data Science' :
                            b.branch === 'CSM' ? 'Computer Science & AI / ML' :
                            b.branch === 'CAI' ? 'Computer Science & AI' :
                            b.branch === 'CSC' ? 'Cyber Security' : 'Data Science'
                          }
                        </td>
                        <td>{b.firstYear}</td>
                        <td>{b.secondYear}</td>
                        <td>{b.thirdYear}</td>
                        <td>{b.finalYear}</td>
                        <td><strong>{b.total}</strong></td>
                        <td><span className="residence-tag day-scholar">{b.dayScholars}</span></td>
                        <td><span className="residence-tag hosteler">{b.hostelers}</span></td>
                      </tr>
                    ))
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Slide 3: Campus Placements */}
      {activeTab === 'placements' && (
        <div className="admin-tab-content fade-in">
          <div className="admin-section-header">
            <div>
              <h2 className="section-title">Institutional Campus Placements &amp; Recruitment Drives</h2>
              <p className="section-desc">
                Placement statistics across all 3 campuses with package spectrums, top recruiters (Amazon, TCS, Infosys, Tech Mahindra), and graduating batch records.
              </p>
            </div>
            <div className="section-actions">
              <button className="btn-admin-action" onClick={handleExportCSV}>
                Export Placements Roster
              </button>
            </div>
          </div>

          {/* Campus Placement Summary Cards */}
          <div className="placement-campus-grid">
            {campusPlacementData.byCampus
              .filter(c => selectedCampusScope === 'ALL' || selectedCampusScope === c.campus)
              .map((cp) => (
                <div key={cp.campus} className="placement-campus-card">
                  <div className="placement-card-top">
                    <span className="campus-name-title">{cp.campus}</span>
                    <span className="placement-pct-badge">{cp.placementRate} Placed</span>
                  </div>
                  <div className="placement-count-row">
                    <span className="placed-number">{cp.placed}</span>
                    <span className="placed-sub">placed out of {cp.eligible} eligible</span>
                  </div>

                  <div className="placement-packages-row">
                    <div className="package-box">
                      <span className="pkg-label">Highest Package</span>
                      <span className="pkg-val text-emerald">{cp.highestPackage}</span>
                    </div>
                    <div className="package-box">
                      <span className="pkg-label">Average Package</span>
                      <span className="pkg-val">{cp.avgPackage}</span>
                    </div>
                  </div>

                  <div className="placement-offers-footer">
                    Total Offers Received: <strong>{cp.offersCount} Offers</strong>
                  </div>
                </div>
              ))}
          </div>

          {/* Top Recruiting Partners Grid */}
          <div className="recruiting-partners-card">
            <h3 className="card-inner-title maven-black">Top Institutional Recruitment Partners</h3>
            <div className="partners-grid">
              {campusPlacementData.topHiringPartners.map((partner, idx) => (
                <div key={idx} className="partner-item">
                  <span className="partner-logo">{partner.logo}</span>
                  <div>
                    <h4 className="partner-name maven-black">{partner.name}</h4>
                    <span className="partner-cat">{partner.category} • {partner.packages}</span>
                    <div className="partner-hired">
                      <strong>{partner.hiredCount} Students Hired</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placements Search Bar */}
          <div className="admin-filter-bar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search placed students by name, roll number, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Recent Placed Students Roster */}
          <div className="admin-table-card">
            <div className="table-header-wrap">
              <h3 className="maven-black">Recent Campus Placement Confirmations (Graduating Batch)</h3>
              <span className="text-muted">Official offer letters verified by KIET Central Placement Cell</span>
            </div>

            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Campus</th>
                  <th>Branch</th>
                  <th>Recruiting Company</th>
                  <th>Designation / Role</th>
                  <th>Package (CTC)</th>
                  <th>Confirmation Date</th>
                </tr>
              </thead>
              <tbody>
                {campusPlacementData.recentPlacedStudents
                  .filter(s => {
                    if (selectedCampusScope !== 'ALL' && selectedCampusScope !== s.campus) return false
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase()
                      return (
                        s.name.toLowerCase().includes(q) ||
                        s.roll.toLowerCase().includes(q) ||
                        s.company.toLowerCase().includes(q) ||
                        s.role.toLowerCase().includes(q) ||
                        s.branch.toLowerCase().includes(q)
                      )
                    }
                    return true
                  })
                  .map((s, idx) => (
                    <tr key={idx}>
                      <td><code>{s.roll}</code></td>
                      <td><strong>{s.name}</strong></td>
                      <td><span className="campus-badge-small">{s.campus}</span></td>
                      <td>{s.branch}</td>
                      <td><strong>{s.company}</strong></td>
                      <td>{s.role}</td>
                      <td><strong style={{ color: '#059669' }}>{s.package}</strong></td>
                      <td>{s.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Slide 4: HODs & Academic Faculty Directory */}
      {activeTab === 'faculty' && (
        <div className="admin-tab-content fade-in">
          <div className="admin-section-header">
            <div>
              <h2 className="section-title maven-black">Department Heads (HODs) &amp; Academic Faculty Directory</h2>
              <p className="section-desc">
                Monitoring <strong>{stats.totalHODs} Heads of Departments</strong> and <strong>{stats.totalFaculty} Teaching Faculty</strong> across <strong>KIET</strong>, <strong>KIET+</strong>, and <strong>KIET Women's</strong>.
              </p>
            </div>
            <div className="section-actions">
              <button className="btn-admin-action" onClick={handleExportCSV}>
                Export Faculty Directory
              </button>
            </div>
          </div>

          {/* HODs Leadership Cards */}
          <div className="hods-leadership-section">
            <h3 className="section-subtitle maven-black">Department Heads &amp; Academic Leadership ({filteredHods.length} HODs)</h3>
            <div className="hods-grid">
              {filteredHods.map((hod) => (
                <div key={hod.id} className="admin-hod-card" onClick={() => setSelectedItemModal({ type: 'HOD', data: hod })}>
                  <StaffAvatar
                    name={hod.name}
                    photo={hod.photo}
                    campus={hod.campus}
                    size={64}
                    showBadge={true}
                  />
                  <div className="hod-details">
                    <h4 className="hod-name maven-black">{hod.name}</h4>
                    <span className="hod-title">{hod.title}</span>
                    <span className="hod-dept">{hod.department}</span>
                    <p className="hod-office">📍 {hod.office} • {hod.phone}</p>
                    <div className="hod-meta-row">
                      <span>Publications: <strong>{hod.publications}</strong></span>
                      <span>•</span>
                      <span>{hod.qualification}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Search & Filter Bar */}
          <div className="admin-filter-bar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search faculty by name, department, or campus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="admin-select"
              value={facultyDeptFilter}
              onChange={(e) => setFacultyDeptFilter(e.target.value)}
            >
              <option value="ALL">All Departments (AIDS, CSM, CAI, CSC, CSD)</option>
              <option value="AIDS">AIDS</option>
              <option value="CSM">CSM</option>
              <option value="CAI">CAI</option>
              <option value="CSC">CSC</option>
              <option value="CSD">CSD</option>
            </select>
          </div>

          {/* Faculty Roster Table */}
          <div className="admin-table-card">
            <div className="table-header-wrap">
              <h3 className="maven-black">Teaching Faculty Directory ({filteredFaculty.length} Faculty Members)</h3>
              <span className="text-muted">Showing professors and assistant professors across active campus scope</span>
            </div>

            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Campus</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Contact Number</th>
                  <th>Institutional Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((f) => (
                  <tr key={f.id} onClick={() => setSelectedItemModal({ type: 'Faculty', data: f })}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <StaffAvatar name={f.name} photo={null} campus={f.campus} size={32} showBadge={false} />
                        <strong>{f.name}</strong>
                      </div>
                    </td>
                    <td>{f.designation}</td>
                    <td><span className="dept-pill">{f.department}</span></td>
                    <td><span className="campus-badge-small">{f.campus}</span></td>
                    <td>{f.qualification}</td>
                    <td>{f.experience}</td>
                    <td>{f.phone}</td>
                    <td><code>{f.email}</code></td>
                    <td>
                      <button className="btn-table-action" onClick={(e) => { e.stopPropagation(); setSelectedItemModal({ type: 'Faculty', data: f }); }}>
                        View Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Slide 5: Transport Fleet & Drivers */}
      {activeTab === 'transport' && (
        <div className="admin-tab-content fade-in">
          <div className="admin-section-header">
            <div>
              <h2 className="section-title maven-black">Transport Fleet, College Buses &amp; Drivers</h2>
              <p className="section-desc">
                Managing <strong>{stats.totalDrivers} Fleet Buses &amp; Commercial Drivers</strong> across <strong>KIET</strong> (12 Buses), <strong>KIET+</strong> (7 Buses), and <strong>KIET Women's</strong> (5 Buses).
                All buses are equipped with real-time GPS tracking and emergency SOS telemetry.
              </p>
            </div>
            <div className="section-actions">
              <button className="btn-admin-action" onClick={handleExportCSV}>
                Export Transport Fleet
              </button>
            </div>
          </div>

          {/* Transport KPI Row */}
          <div className="fleet-kpi-row">
            <div className="fleet-kpi-box">
              <span className="fleet-num maven-black">{stats.totalDrivers}</span>
              <span className="fleet-label maven-black">Active College Buses</span>
              <span className="fleet-sub">Full GPS Live Tracking</span>
            </div>
            <div className="fleet-kpi-box">
              <span className="fleet-num maven-black">{stats.dayScholars}</span>
              <span className="fleet-label maven-black">Registered Day Scholars</span>
              <span className="fleet-sub">Boarding across 24 routes</span>
            </div>
            <div className="fleet-kpi-box">
              <span className="fleet-num maven-black">100%</span>
              <span className="fleet-label maven-black">On-Time Dispatch Rate</span>
              <span className="fleet-sub">Kakinada • Yanam • Samalkota</span>
            </div>
          </div>

          {/* Transport Fleet Search & Filter Bar */}
          <div className="admin-filter-bar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search fleet by bus ID, driver name, route, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Driver Fleet Table */}
          <div className="admin-table-card">
            <div className="table-header-wrap">
              <h3 className="maven-black">College Bus Drivers &amp; Route Telemetry Roster ({filteredDrivers.length} Buses)</h3>
              <span className="text-muted">Direct operational logistics for East Godavari &amp; Yanam (Puducherry)</span>
            </div>

            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Bus ID &amp; Reg. Number</th>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                  <th>Commercial License</th>
                  <th>Route Coverage</th>
                  <th>Main Destination</th>
                  <th>Assigned Campus</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((d) => (
                  <tr key={d.busId} onClick={() => setSelectedItemModal({ type: 'Driver', data: d })}>
                    <td>
                      <div>
                        <strong>{d.busId}</strong>
                        <div style={{ fontSize: 11, color: '#64748b' }}><code>{d.busNumber}</code></div>
                      </div>
                    </td>
                    <td><strong>{d.driverName}</strong></td>
                    <td>{d.phone}</td>
                    <td><code>{d.license}</code></td>
                    <td>{d.route}</td>
                    <td>{d.destination}</td>
                    <td><span className="campus-badge-small">{d.campus}</span></td>
                    <td>{d.studentsAssigned} / {d.capacity} Seats</td>
                    <td><span className="tag-live-fleet">✓ {d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. Slide 6: Operations, Workers & Campus Support Staff */}
      {activeTab === 'workers' && (
        <div className="admin-tab-content fade-in">
          <div className="admin-section-header">
            <div>
              <h2 className="section-title maven-black">Operations, Campus Workers &amp; Support Staff</h2>
              <p className="section-desc">
                Monitoring <strong>{stats.totalWorkers} Operational Workers</strong> including Lab Technicians, Hostel Wardens, Facility Engineers, Electricians, Security Personnel, and Mess Coordinators across all 3 campuses.
              </p>
            </div>
            <div className="section-actions">
              <button className="btn-admin-action" onClick={handleExportCSV}>
                Export Workers Roster
              </button>
            </div>
          </div>

          {/* Workers Category Filter */}
          <div className="admin-filter-bar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search workers by name, role, block, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="admin-select"
              value={workerCategoryFilter}
              onChange={(e) => setWorkerCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Laboratory Technical">Laboratory Technical</option>
              <option value="Hostel Administration">Hostel Administration</option>
              <option value="Facilities & Power">Facilities &amp; Power</option>
              <option value="Security & Safety">Security &amp; Safety</option>
              <option value="Sanitation & Housekeeping">Sanitation &amp; Housekeeping</option>
              <option value="Hostel & Food">Hostel &amp; Food</option>
              <option value="IT Systems & Network">IT Systems &amp; Network</option>
            </select>
          </div>

          {/* Workers Table */}
          <div className="admin-table-card">
            <div className="table-header-wrap">
              <h3 className="maven-black">Campus Operations &amp; Support Staff Directory ({filteredWorkers.length} Personnel)</h3>
              <span className="text-muted">Showing work location, shifts, and duty assignments</span>
            </div>

            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Staff Name</th>
                  <th>Designation / Role</th>
                  <th>Category</th>
                  <th>Assigned Campus</th>
                  <th>Building / Block</th>
                  <th>Contact Phone</th>
                  <th>Shift Schedule</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((w) => (
                  <tr key={w.empId} onClick={() => setSelectedItemModal({ type: 'Worker', data: w })}>
                    <td><code>{w.empId}</code></td>
                    <td><strong>{w.name}</strong></td>
                    <td>{w.role}</td>
                    <td><span className="category-pill">{w.category}</span></td>
                    <td><span className="campus-badge-small">{w.campus}</span></td>
                    <td>{w.block}</td>
                    <td>{w.phone}</td>
                    <td>{w.shift}</td>
                    <td><span className="tag-active-worker">✓ {w.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. Slide 7: Pending Approvals & Verification Queue */}
      {activeTab === 'approvals' && (
        <div className="admin-tab-content fade-in">
          <div className="admin-section-header">
            <div>
              <h2 className="section-title maven-black">Institutional Approvals &amp; Activity Verification Queue</h2>
              <p className="section-desc">
                Review and certify student activity submissions, hackathon prizes, industrial internship certificates, and placement clearances.
              </p>
            </div>
            <div className="section-actions">
              <button
                className="btn-admin-action"
                onClick={() => {
                  pendingApprovals.forEach(a => updateActivityStatusWithMeta(a.id, 'Verified'))
                  addToast('All pending submissions certified successfully.', 'success')
                }}
              >
                Approve All Pending ({pendingApprovals.length})
              </button>
            </div>
          </div>

          <div className="admin-table-card">
            <div className="table-header-wrap">
              <h3 className="maven-black">Pending Submissions Awaiting Central Approval ({pendingApprovals.length} Items)</h3>
              <span className="text-muted">Synchronized with JNTUK accreditation repository</span>
            </div>

            {pendingApprovals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <h4 className="maven-black" style={{ color: 'var(--text)' }}>All Submissions Verified!</h4>
                <p>There are no outstanding student activity submissions awaiting admin review.</p>
              </div>
            ) : (
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Activity Title</th>
                    <th>Category</th>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Date Submitted</th>
                    <th>Evidence / Documentation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.title}</strong></td>
                      <td><span className="dept-pill">{item.category}</span></td>
                      <td>{item.studentName || item.user}</td>
                      <td><code>{item.rollNumber || '23JN1A4533'}</code></td>
                      <td>{item.date || 'Recent'}</td>
                      <td>
                        {item.evidenceData ? (
                          <a href={item.evidenceData} target="_blank" rel="noreferrer" className="btn-view-evidence">
                            📄 View File
                          </a>
                        ) : (
                          <span className="text-muted">Digital Record</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-approve-sm" onClick={() => handleApprove(item.id)}>Approve</button>
                          <button className="btn-reject-sm" onClick={() => handleReject(item.id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 11. Modal Detail Viewer for Staff / Driver / Worker / HOD */}
      {selectedItemModal && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedItemModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title maven-black">{selectedItemModal.type} Operational Record</h3>
                <span className="modal-subtitle">KIET Central Administration Registry</span>
              </div>
              <button className="btn-modal-close" onClick={() => setSelectedItemModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              {selectedItemModal.type === 'HOD' && (
                <div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, padding: 14, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <StaffAvatar
                      name={selectedItemModal.data.name}
                      photo={selectedItemModal.data.photo}
                      campus={selectedItemModal.data.campus}
                      size={72}
                    />
                    <div>
                      <h4 className="maven-black" style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>{selectedItemModal.data.name}</h4>
                      <div style={{ color: '#0284c7', fontWeight: 700, fontSize: 13, marginTop: 2 }}>{selectedItemModal.data.title}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2 }}>{selectedItemModal.data.department} • <strong>{selectedItemModal.data.campusTag}</strong></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 13 }}>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Office &amp; Cabin Hours</span>
                      <strong>📍 {selectedItemModal.data.office}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>🕒 {selectedItemModal.data.cabinHours}</div>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Direct Contact</span>
                      <strong>📞 {selectedItemModal.data.phone}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>✉️ {selectedItemModal.data.email}</div>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Qualifications &amp; Experience</span>
                      <strong>🎓 {selectedItemModal.data.qualification}</strong>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Research Publications</span>
                      <strong style={{ color: '#0284c7' }}>📚 {selectedItemModal.data.publications} International Papers</strong>
                    </div>
                  </div>
                  {selectedItemModal.data.specialization && (
                    <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 8, fontSize: 12.5, color: '#10b981' }}>
                      <strong>Core Specialization:</strong> {selectedItemModal.data.specialization}
                    </div>
                  )}
                </div>
              )}

              {selectedItemModal.type === 'Faculty' && (
                <div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14, padding: 14, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <StaffAvatar
                      name={selectedItemModal.data.name}
                      photo={null}
                      campus={selectedItemModal.data.campus}
                      size={60}
                    />
                    <div>
                      <h4 className="maven-black" style={{ margin: 0, fontSize: 17, color: 'var(--text)' }}>{selectedItemModal.data.name}</h4>
                      <div style={{ color: '#0284c7', fontWeight: 700, fontSize: 13, marginTop: 2 }}>{selectedItemModal.data.designation}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2 }}>{selectedItemModal.data.department} • <strong>{selectedItemModal.data.campus}</strong></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 13 }}>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Direct Contact</span>
                      <strong>📞 {selectedItemModal.data.phone}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>✉️ {selectedItemModal.data.email}</div>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Experience &amp; Qualification</span>
                      <strong>{selectedItemModal.data.experience}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{selectedItemModal.data.qualification}</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItemModal.type === 'Driver' && (
                <div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14, padding: 14, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, color: '#fff' }}>
                      🚌
                    </div>
                    <div>
                      <h4 className="maven-black" style={{ margin: 0, fontSize: 17, color: 'var(--text)' }}>{selectedItemModal.data.driverName}</h4>
                      <div style={{ color: '#0284c7', fontWeight: 700, fontSize: 13, marginTop: 2 }}>{selectedItemModal.data.busId} • {selectedItemModal.data.busNumber}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2 }}>Assigned Campus: <strong>{selectedItemModal.data.campus}</strong></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 13 }}>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Route &amp; Destination</span>
                      <strong>📍 {selectedItemModal.data.route}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>To: {selectedItemModal.data.destination}</div>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Driver Contact &amp; License</span>
                      <strong>📞 {selectedItemModal.data.phone}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>License: <code>{selectedItemModal.data.license}</code></div>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Bus Seating Capacity</span>
                      <strong>👥 {selectedItemModal.data.studentsAssigned} / {selectedItemModal.data.capacity} Seats</strong>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Fleet Operating Status</span>
                      <strong style={{ color: '#059669' }}>✓ {selectedItemModal.data.status} (GPS Live)</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedItemModal.type === 'Worker' && (
                <div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14, padding: 14, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, color: '#fff' }}>
                      🔧
                    </div>
                    <div>
                      <h4 className="maven-black" style={{ margin: 0, fontSize: 17, color: 'var(--text)' }}>{selectedItemModal.data.name}</h4>
                      <div style={{ color: '#0284c7', fontWeight: 700, fontSize: 13, marginTop: 2 }}>{selectedItemModal.data.role} ({selectedItemModal.data.empId})</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2 }}>Category: {selectedItemModal.data.category} • <strong>{selectedItemModal.data.campus}</strong></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 13 }}>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Building / Work Station</span>
                      <strong>📍 {selectedItemModal.data.block}</strong>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Duty Shift Schedule</span>
                      <strong>🕒 {selectedItemModal.data.shift}</strong>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Phone Contact</span>
                      <strong>📞 {selectedItemModal.data.phone}</strong>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 11, display: 'block' }}>Registry Status</span>
                      <strong style={{ color: '#16a34a' }}>✓ {selectedItemModal.data.status}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-modal-action" onClick={() => { addToast(`Notice dispatched to ${selectedItemModal.data.name || selectedItemModal.data.driverName}`, 'info'); setSelectedItemModal(null); }}>
                Send Official Admin Notice
              </button>
              <button className="btn-modal-close-secondary" onClick={() => setSelectedItemModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
