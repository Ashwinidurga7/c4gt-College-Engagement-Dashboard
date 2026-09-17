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
  campuses,
  branchesByCampus,
  students,
  kietHubsMeta,
  getDepartmentStats,
} from '../../data/academicData'
import { useToast } from '../../components/ui/Toast'

// Two subtle, un-highlighted neutral tones across all graphs
const GRAPH_TONE_1 = '#334155' // Deep Slate / Charcoal
const GRAPH_TONE_2 = '#64748b' // Muted Steel / Slate

const RESIDENCE_COLORS = {
  'Day Scholar': GRAPH_TONE_1,
  'Hosteler': GRAPH_TONE_2,
}

const BACKLOG_COLORS = {
  'Zero Backlogs': GRAPH_TONE_1,
  '1 Backlog': GRAPH_TONE_2,
  '2 Backlogs': GRAPH_TONE_1,
  '3 Backlogs': GRAPH_TONE_2,
  '4+ Backlogs': GRAPH_TONE_1,
}

export default function HodDashboard({ defaultTab = 'overview' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()

  // Determine active slide / tab based on route or prop
  const getTabFromPath = () => {
    const path = location.pathname
    if (path.includes('/hod/academics')) return 'academics'
    if (path.includes('/hod/placements')) return 'placements'
    if (path.includes('/hod/activities')) return 'activities'
    if (path.includes('/hod/demographics')) return 'demographics'
    return defaultTab || 'overview'
  }

  const [activeTab, setActiveTab] = useState(getTabFromPath)

  useEffect(() => {
    setActiveTab(getTabFromPath())
  }, [location.pathname, defaultTab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'overview') navigate('/hod')
    else if (tabId === 'academics') navigate('/hod/academics')
    else if (tabId === 'placements') navigate('/hod/placements')
    else if (tabId === 'activities') navigate('/hod/activities')
    else if (tabId === 'demographics') navigate('/hod/demographics')
  }

  // Multi-campus and branch state
  const [selectedCampus, setSelectedCampus] = useState('KIET')
  const availableBranches = branchesByCampus[selectedCampus] || []
  const [selectedBranch, setSelectedBranch] = useState('AIDS')

  // When campus changes, ensure selected branch is valid for that campus
  const handleCampusSelect = (c) => {
    setSelectedCampus(c)
    const branches = branchesByCampus[c] || []
    if (!branches.some(b => b.code === selectedBranch)) {
      setSelectedBranch(branches[0]?.code || 'AIDS')
    }
  }

  // Filtered cohort of students for the selected campus & branch
  const cohort = useMemo(() => {
    return students.filter(
      (s) => s.campus === selectedCampus && s.branch === selectedBranch
    )
  }, [selectedCampus, selectedBranch])

  // Department aggregate statistics
  const stats = useMemo(() => {
    return getDepartmentStats(selectedCampus, selectedBranch)
  }, [selectedCampus, selectedBranch])

  // Interactive filters inside tabs
  const [searchQuery, setSearchQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('ALL')
  const [backlogFilter, setBacklogFilter] = useState('ALL') // 'ALL', '0', '1', '2', '3', '4+'
  const [residenceFilter, setResidenceFilter] = useState('ALL') // 'ALL', 'Day Scholar', 'Hosteler'
  const [activeHubFilter, setActiveHubFilter] = useState('ALL') // 'ALL', 'toastmasters', 'robotics', etc.
  const [selectedStudent, setSelectedStudent] = useState(null) // Modal details

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return cohort.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesQuery =
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          (s.teamId && s.teamId.toLowerCase().includes(q))
        if (!matchesQuery) return false
      }
      // Section
      if (sectionFilter !== 'ALL' && s.section !== sectionFilter) return false
      // Backlogs
      if (backlogFilter !== 'ALL') {
        if (backlogFilter === '0' && s.activeBacklogs !== 0) return false
        if (backlogFilter === '1' && s.activeBacklogs !== 1) return false
        if (backlogFilter === '2' && s.activeBacklogs !== 2) return false
        if (backlogFilter === '3' && s.activeBacklogs !== 3) return false
        if (backlogFilter === '4+' && s.activeBacklogs < 4) return false
      }
      // Residence
      if (residenceFilter !== 'ALL' && s.residence !== residenceFilter) return false
      // Hub / Club
      if (activeHubFilter !== 'ALL') {
        if (activeHubFilter === 'coding' && !s.codingMember) return false
        if (activeHubFilter === 'c4gt' && !s.c4gtMember) return false
        if (activeHubFilter === 'smartcity' && !s.smartCityMember) return false
        if (activeHubFilter === 'ncc_nss' && !s.nccNssMember) return false
        if (activeHubFilter === 'toastmasters' && !s.toastmastersMember) return false
        if (activeHubFilter === 'sports' && !s.sportsMember) return false
        if (activeHubFilter === 'hackathons' && !s.hackathonAttended) return false
        if (activeHubFilter === 'robotics' && !s.roboticsMember) return false
        if (activeHubFilter === 'cybersecurity' && !s.cyberSecurityMember) return false
      }
      return true
    })
  }, [cohort, searchQuery, sectionFilter, backlogFilter, residenceFilter, activeHubFilter])

  // Chart 1: Residence Data (Day Scholar vs Hosteler)
  const residencePieData = useMemo(() => [
    { name: 'Day Scholar', value: stats.dayScholarsCount, color: RESIDENCE_COLORS['Day Scholar'] },
    { name: 'Hosteler', value: stats.hostelersCount, color: RESIDENCE_COLORS['Hosteler'] },
  ], [stats])

  // Chart 2: Backlog Spectrum Data (Zero Backlogs, 1, 2, 3, 4+)
  const backlogBarData = useMemo(() => [
    { name: 'Zero Backlogs', count: stats.zeroBacklogsCount, fill: BACKLOG_COLORS['Zero Backlogs'] },
    { name: '1 Backlog', count: stats.backlogs1Count, fill: BACKLOG_COLORS['1 Backlog'] },
    { name: '2 Backlogs', count: stats.backlogs2Count, fill: BACKLOG_COLORS['2 Backlogs'] },
    { name: '3 Backlogs', count: stats.backlogs3Count, fill: BACKLOG_COLORS['3 Backlogs'] },
    { name: '4+ Backlogs', count: stats.backlogs4PlusCount, fill: BACKLOG_COLORS['4+ Backlogs'] },
  ], [stats])

  // Chart 3: Placement Drive Readiness Data
  const driveReadinessData = useMemo(() => [
    { name: 'Drive Eligible', count: stats.driveEligibleCount, fill: GRAPH_TONE_1 },
    { name: 'Active Interns', count: stats.inInternshipsCount, fill: GRAPH_TONE_2 },
    { name: 'Needs Clearance', count: stats.driveIneligibleCount, fill: GRAPH_TONE_1 },
  ], [stats])

  // Chart 4: Clubs & Hubs Enrollment Data
  const clubsBarData = useMemo(() => [
    { name: 'Coding Club', count: stats.codingCount, fill: GRAPH_TONE_1 },
    { name: 'C4GT Club', count: stats.c4gtCount, fill: GRAPH_TONE_2 },
    { name: 'Smart City', count: stats.smartCityCount, fill: GRAPH_TONE_1 },
    { name: 'NCC / NSS', count: stats.nccNssCount, fill: GRAPH_TONE_2 },
    { name: 'Toastmasters', count: stats.toastmastersCount, fill: GRAPH_TONE_1 },
    { name: 'KPL Sports', count: stats.sportsCount, fill: GRAPH_TONE_2 },
    { name: 'Hackathons', count: stats.hackathonsCount, fill: GRAPH_TONE_1 },
    { name: 'Robotics', count: stats.roboticsCount, fill: GRAPH_TONE_2 },
    { name: 'Cyber Sec', count: stats.cyberSecurityCount, fill: GRAPH_TONE_1 },
  ], [stats])

  // CSV Export helper
  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Name',
      'Campus',
      'Branch',
      'Section',
      'Residence',
      'Bus Route / Hostel',
      'Backlogs',
      'CGPA',
      'Attendance %',
      'Drive Eligible',
      'Internship',
      'Clubs',
    ]

    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      `"${s.name}"`,
      s.campus,
      s.branch,
      s.section,
      s.residence,
      s.residence === 'Hosteler' ? `"${s.hostelBlock || ''}"` : `"${s.busRoute || ''}"`,
      s.activeBacklogs,
      s.cgpa,
      s.attendance,
      s.driveEligible ? 'Yes' : 'No',
      s.internship ? `"${s.internship.company} (${s.internship.role})"` : 'None',
      `"${(s.clubs || []).join(', ')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `KIET_HOD_${selectedCampus}_${selectedBranch}_Cohort_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('Cohort roster exported successfully to CSV!', 'success')
  }

  return (
    <div className="hod-analytics-container">
      {/* 1. Clean Institutional Header */}
      <div className="hod-header-card">
        <div className="hod-header-meta">
          <span className="hod-governance-tag">🎓 DEPARTMENT ACADEMIC COMMAND</span>
          <h1 className="hod-portal-title maven-black">
            Department Head Analytics &amp; Student Insights
          </h1>
          <p className="hod-portal-subtitle">
            Executive cockpit for <strong>Prof. M. S. R. Prasad</strong> (HOD &amp; Academic Dean) overseeing cohort performance, backlogs, placements, and innovation hubs.
          </p>
        </div>

        <div className="hod-header-actions">
          <button className="btn-hod-export" onClick={handleExportCSV}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Cohort CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Compact, Balanced Multi-Campus & Branch Scope Selectors */}
      <div className="hod-selectors-card">
        {/* Campus Selection */}
        <div className="hod-selector-group">
          <div className="hod-selector-header">
            <span className="scope-indicator-dot" />
            <span className="scope-title">INSTITUTIONAL CAMPUS:</span>
          </div>
          <div className="hod-pills-row">
            {campuses.map((c) => {
              const isActive = selectedCampus === c
              const campusTotal = students.filter((s) => s.campus === c).length
              return (
                <button
                  key={c}
                  type="button"
                  className={`hod-campus-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleCampusSelect(c)}
                >
                  <span className="pill-dot" />
                  <span className="pill-name">{c}</span>
                  <span className="pill-count">{campusTotal}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Branch Selection */}
        <div className="hod-selector-group">
          <div className="hod-selector-header">
            <span className="scope-indicator-dot" style={{ backgroundColor: '#10b981' }} />
            <span className="scope-title">DEPARTMENT BRANCH:</span>
          </div>
          <div className="hod-pills-row">
            {availableBranches.map((b) => {
              const isActive = selectedBranch === b.code
              const branchCount = students.filter(
                (s) => s.campus === selectedCampus && s.branch === b.code
              ).length
              return (
                <button
                  key={b.code}
                  type="button"
                  className={`hod-branch-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedBranch(b.code)}
                >
                  <span className="branch-code-badge">{b.code}</span>
                  <span className="pill-name">{b.name}</span>
                  <span className="pill-count">{branchCount}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Streamlined Slide Tabs Navigation */}
      <div className="hod-tabs-bar">
        <button
          className={`hod-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-title">Overview</span>
        </button>
        <button
          className={`hod-tab-btn ${activeTab === 'academics' ? 'active' : ''}`}
          onClick={() => handleTabChange('academics')}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-title">Academics &amp; Backlogs</span>
        </button>
        <button
          className={`hod-tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
          onClick={() => handleTabChange('placements')}
        >
          <span className="tab-icon">💼</span>
          <span className="tab-title">Placements</span>
        </button>
        <button
          className={`hod-tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => handleTabChange('activities')}
        >
          <span className="tab-icon">🚀</span>
          <span className="tab-title">Clubs &amp; Hubs</span>
        </button>
        <button
          className={`hod-tab-btn ${activeTab === 'demographics' ? 'active' : ''}`}
          onClick={() => handleTabChange('demographics')}
        >
          <span className="tab-icon">🚌</span>
          <span className="tab-title">Demographics &amp; Transit</span>
        </button>
      </div>

      {/* 4. Tab 1: Executive Overview Slide */}
      {activeTab === 'overview' && (
        <div className="hod-tab-content fade-in">
          {/* Executive Metrics Strip */}
          <div className="hod-kpi-grid">
            <div className="hod-kpi-card accent-blue">
              <div className="kpi-top">
                <span className="kpi-label">Total Department Cohort</span>
                <span className="kpi-tag">{selectedCampus} • {selectedBranch}</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black">{stats.total}</span>
                <span className="kpi-subtext">Students Registered</span>
              </div>
              <div className="kpi-footer">
                <span>Avg CGPA: <strong>{stats.avgCgpa}</strong></span>
                <span>•</span>
                <span>Avg Attendance: <strong>{stats.avgAttendance}%</strong></span>
              </div>
            </div>

            <div className="hod-kpi-card accent-cyan">
              <div className="kpi-top">
                <span className="kpi-label">Residence Breakdown</span>
                <span className="kpi-tag">12 Bus Routes</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black">{stats.dayScholarsCount} <small style={{fontSize: 16, color: '#64748b'}}>/ {stats.hostelersCount}</small></span>
                <span className="kpi-subtext">Day Scholars vs Hostelers</span>
              </div>
              <div className="kpi-progress-bar">
                <div className="kpi-progress-fill" style={{ width: `${stats.dayScholarsRatio}%`, backgroundColor: '#0284c7' }} />
              </div>
              <div className="kpi-footer">
                <span>Day Scholars: <strong>{stats.dayScholarsRatio}%</strong></span>
                <span>Hostelers: <strong>{stats.hostelersRatio}%</strong></span>
              </div>
            </div>

            <div className="hod-kpi-card accent-green">
              <div className="kpi-top">
                <span className="kpi-label">Zero Backlogs (All Clear)</span>
                <span className="kpi-tag status-clear">Clean Record</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black text-green">{stats.zeroBacklogsCount}</span>
                <span className="kpi-subtext">{stats.zeroBacklogsRatio}% of Cohort</span>
              </div>
              <div className="kpi-progress-bar">
                <div className="kpi-progress-fill" style={{ width: `${stats.zeroBacklogsRatio}%`, backgroundColor: '#10b981' }} />
              </div>
              <div className="kpi-footer">
                <span>With Backlogs: <strong>{stats.total - stats.zeroBacklogsCount} students</strong></span>
              </div>
            </div>

            <div className="hod-kpi-card accent-purple">
              <div className="kpi-top">
                <span className="kpi-label">Placement Drive Eligible</span>
                <span className="kpi-tag">≥7.0 CGPA &amp; 0 BL</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-number maven-black text-purple">{stats.driveEligibleCount}</span>
                <span className="kpi-subtext">{stats.driveEligibleRatio}% Campus Ready</span>
              </div>
              <div className="kpi-footer">
                <span>Active Internships: <strong>{stats.inInternshipsCount} students</strong></span>
              </div>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="hod-charts-grid">
            {/* Chart 1: Residence Chart */}
            <div className="hod-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Day Scholars vs. Hostelers Distribution</h3>
                  <p className="chart-subtitle">Logistical residence split and transport allocation</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('demographics')}>
                  View Transit Details →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={residencePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {residencePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} Students (${((val / stats.total) * 100).toFixed(1)}%)`, name]}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-data-legend-row">
                <div className="legend-chip">
                  <span className="chip-dot" style={{ backgroundColor: RESIDENCE_COLORS['Day Scholar'] }} />
                  <span>Day Scholars: <strong>{stats.dayScholarsCount}</strong> ({stats.dayScholarsRatio}%)</span>
                </div>
                <div className="legend-chip">
                  <span className="chip-dot" style={{ backgroundColor: RESIDENCE_COLORS['Hosteler'] }} />
                  <span>Hostelers: <strong>{stats.hostelersCount}</strong> ({stats.hostelersRatio}%)</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Backlog Spectrum Bar Chart */}
            <div className="hod-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Backlog Distribution (0, 1, 2, 3, 4+)</h3>
                  <p className="chart-subtitle">Academic health and remediation requirements</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('academics')}>
                  Inspect Backlogs →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={backlogBarData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val) => [`${val} Students`, 'Total']}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {backlogBarData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="backlog-pills-summary">
                <span className="badge-backlog-zero">0 Backlogs: {stats.zeroBacklogsCount}</span>
                <span className="badge-backlog-1">1 BL: {stats.backlogs1Count}</span>
                <span className="badge-backlog-2">2 BL: {stats.backlogs2Count}</span>
                <span className="badge-backlog-3">3 BL: {stats.backlogs3Count}</span>
                <span className="badge-backlog-danger">4+ BL: {stats.backlogs4PlusCount}</span>
              </div>
            </div>

            {/* Chart 3: Placement Drive Readiness */}
            <div className="hod-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">Placement Drive Readiness &amp; Internships</h3>
                  <p className="chart-subtitle">Eligibility metrics for tier-1 IT &amp; Core recruitment</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('placements')}>
                  View Candidate List →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={driveReadinessData} layout="vertical" margin={{ top: 15, right: 30, left: 35, bottom: 15 }}>
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip
                      formatter={(val) => [`${val} Students (${((val / stats.total) * 100).toFixed(1)}%)`, 'Count']}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {driveReadinessData.map((entry, index) => (
                        <Cell key={`drive-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-note-bar">
                ⚡ <strong>{stats.driveEligibleCount}</strong> candidates are cleared for incoming tier-1 software &amp; core recruitment drives.
              </div>
            </div>

            {/* Chart 4: Official KIET Hubs & Activities */}
            <div className="hod-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-title maven-black">KIET Korangi Hubs, Clubs &amp; KIOT</h3>
                  <p className="chart-subtitle">Active student participation across innovation modules</p>
                </div>
                <button className="btn-chart-action" onClick={() => handleTabChange('activities')}>
                  Explore Hubs →
                </button>
              </div>
              <div className="chart-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clubsBarData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val) => [`${val} Students`, 'Enrolled']}
                      contentStyle={{ background: '#0b1e3b', borderRadius: 8, color: '#fff', border: 'none' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {clubsBarData.map((entry, index) => (
                        <Cell key={`club-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-note-bar">
                🎯 Official data from KIET Multi-Campus Governance (Google Coding Club, C4GT, Smart City Lab, NCC &amp; NSS, Toastmasters, KPL Sports, Hackathons, Robotics, Cyber Security).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Academics & Backlogs Slide */}
      {activeTab === 'academics' && (
        <div className="hod-tab-content fade-in">
          <div className="hod-section-header">
            <div>
              <h2 className="section-title maven-black">Backlog Analysis &amp; Academic Health Audit</h2>
              <p className="section-desc">
                Review students with <strong>Zero Backlogs (All Clear)</strong>, <strong>1, 2, 3, and 4+ Backlogs</strong>.
                Click on any tier below to instantly filter the student roster.
              </p>
            </div>
            <div className="section-actions">
              <button
                className="btn-condonation"
                onClick={() => addToast('Remedial class schedules dispatched to all students with 1+ backlogs.', 'warning')}
              >
                Schedule Remedial Classes
              </button>
            </div>
          </div>

          {/* Backlog Tier Clickable Cards */}
          <div className="backlog-filter-cards-grid">
            <button
              className={`backlog-tier-card ${backlogFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setBacklogFilter('ALL')}
            >
              <div className="tier-header">All Students</div>
              <div className="tier-count maven-black">{stats.total}</div>
              <div className="tier-pct">100% of Cohort</div>
            </button>

            <button
              className={`backlog-tier-card tier-zero ${backlogFilter === '0' ? 'active' : ''}`}
              onClick={() => setBacklogFilter('0')}
            >
              <div className="tier-header">Zero Backlogs (All Clear)</div>
              <div className="tier-count maven-black text-green">{stats.zeroBacklogsCount}</div>
              <div className="tier-pct">{stats.zeroBacklogsRatio}% of Cohort</div>
            </button>

            <button
              className={`backlog-tier-card tier-one ${backlogFilter === '1' ? 'active' : ''}`}
              onClick={() => setBacklogFilter('1')}
            >
              <div className="tier-header">1 Backlog</div>
              <div className="tier-count maven-black text-blue">{stats.backlogs1Count}</div>
              <div className="tier-pct">{((stats.backlogs1Count / stats.total) * 100).toFixed(1)}% of Cohort</div>
            </button>

            <button
              className={`backlog-tier-card tier-two ${backlogFilter === '2' ? 'active' : ''}`}
              onClick={() => setBacklogFilter('2')}
            >
              <div className="tier-header">2 Backlogs</div>
              <div className="tier-count maven-black text-amber">{stats.backlogs2Count}</div>
              <div className="tier-pct">{((stats.backlogs2Count / stats.total) * 100).toFixed(1)}% of Cohort</div>
            </button>

            <button
              className={`backlog-tier-card tier-three ${backlogFilter === '3' ? 'active' : ''}`}
              onClick={() => setBacklogFilter('3')}
            >
              <div className="tier-header">3 Backlogs</div>
              <div className="tier-count maven-black text-orange">{stats.backlogs3Count}</div>
              <div className="tier-pct">{((stats.backlogs3Count / stats.total) * 100).toFixed(1)}% of Cohort</div>
            </button>

            <button
              className={`backlog-tier-card tier-danger ${backlogFilter === '4+' ? 'active' : ''}`}
              onClick={() => setBacklogFilter('4+')}
            >
              <div className="tier-header">4+ Backlogs</div>
              <div className="tier-count maven-black text-red">{stats.backlogs4PlusCount}</div>
              <div className="tier-pct">{((stats.backlogs4PlusCount / stats.total) * 100).toFixed(1)}% (Action Required)</div>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="hod-table-filter-bar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by student name, roll number, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>

            <div className="filter-controls">
              <select
                className="hod-select"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="ALL">All Sections (A, B, C)</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>

              <select
                className="hod-select"
                value={residenceFilter}
                onChange={(e) => setResidenceFilter(e.target.value)}
              >
                <option value="ALL">All Residences</option>
                <option value="Day Scholar">Day Scholars Only</option>
                <option value="Hosteler">Hostelers Only</option>
              </select>
            </div>
          </div>

          {/* Filtered Student Table */}
          <div className="hod-table-wrap">
            <table className="hod-data-table">
              <thead>
                <tr>
                  <th>Roll Number &amp; Name</th>
                  <th>Section</th>
                  <th>Residence</th>
                  <th>Backlog Status</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th>Drive Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="student-row" onClick={() => setSelectedStudent(s)}>
                      <td>
                        <div className="student-name-lockup">
                          <div className="student-avatar-circle">
                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="student-name-text">{s.name}</div>
                            <div className="student-roll-text">{s.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="section-badge">Sec {s.section}</span>
                      </td>
                      <td>
                        <span className={`residence-pill ${s.residence === 'Hosteler' ? 'hosteler' : 'day-scholar'}`}>
                          {s.residence}
                        </span>
                      </td>
                      <td>
                        {s.activeBacklogs === 0 ? (
                          <span className="badge-backlog-zero">✓ Zero Backlogs</span>
                        ) : s.activeBacklogs === 1 ? (
                          <span className="badge-backlog-1">1 Backlog</span>
                        ) : s.activeBacklogs === 2 ? (
                          <span className="badge-backlog-2">2 Backlogs</span>
                        ) : s.activeBacklogs === 3 ? (
                          <span className="badge-backlog-3">3 Backlogs</span>
                        ) : (
                          <span className="badge-backlog-danger">{s.activeBacklogs} Backlogs (Remedial)</span>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: Number(s.cgpa) >= 8.0 ? '#059669' : Number(s.cgpa) >= 7.0 ? '#0284c7' : '#d97706' }}>
                          {s.cgpa}
                        </strong>
                      </td>
                      <td>
                        <span className={`attendance-tag ${s.attendance >= 75 ? 'tag-good' : 'tag-shortage'}`}>
                          {s.attendance}%
                        </span>
                      </td>
                      <td>
                        {s.driveEligible ? (
                          <span className="tag-drive-eligible">✓ Eligible</span>
                        ) : (
                          <span className="tag-drive-ineligible">Ineligible</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-table-view"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedStudent(s)
                          }}
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Placements & Internships Slide */}
      {activeTab === 'placements' && (
        <div className="hod-tab-content fade-in">
          <div className="hod-section-header">
            <div>
              <h2 className="section-title maven-black">Campus Placement Drive Eligibility &amp; Active Internships</h2>
              <p className="section-desc">
                Recruitment eligibility matrix verified against JNTUK Autonomous accreditation guidelines.
                Includes active industrial interns across TCS, AWS, Infosys, and AP Innovation Society.
              </p>
            </div>
            <div className="section-actions">
              <button
                className="btn-drive-dispatch"
                onClick={() => addToast('Drive eligibility list dispatched to KIET Training & Placement Cell.', 'success')}
              >
                Dispatch to T&amp;P Cell
              </button>
            </div>
          </div>

          {/* Drive Stats Row */}
          <div className="placements-kpi-row">
            <div className="placement-metric-box metric-eligible">
              <div className="box-title">Recruitment Drive Cleared</div>
              <div className="box-count maven-black">{stats.driveEligibleCount}</div>
              <div className="box-sub">
                Students meeting <strong>CGPA ≥ 7.0</strong>, <strong>0 active backlogs</strong>, and <strong>≥ 75% attendance</strong>.
              </div>
            </div>

            <div className="placement-metric-box metric-interns">
              <div className="box-title">Active Industrial Interns</div>
              <div className="box-count maven-black">{stats.inInternshipsCount}</div>
              <div className="box-sub">
                Undergoing 6-month live industry projects across cloud, AI, and IoT centers.
              </div>
            </div>

            <div className="placement-metric-box metric-remedial">
              <div className="box-title">Remedial Improvement Pool</div>
              <div className="box-count maven-black">{stats.driveIneligibleCount}</div>
              <div className="box-sub">
                Short of criteria due to backlogs or attendance. Enrolled in special condonation batches.
              </div>
            </div>
          </div>

          {/* Internships Showcase */}
          <div className="internship-companies-card">
            <h3 className="subcard-title maven-black">Active Industrial Internship Partners</h3>
            <div className="company-badges-grid">
              <div className="company-badge-item">
                <span className="comp-name">Tata Consultancy Services</span>
                <span className="comp-role">AI &amp; Data Science Research</span>
                <span className="comp-stipend">₹18,000 / mo</span>
              </div>
              <div className="company-badge-item">
                <span className="comp-name">AWS Cloud Center of Excellence</span>
                <span className="comp-role">DevOps &amp; Cloud Associate</span>
                <span className="comp-stipend">₹16,000 / mo</span>
              </div>
              <div className="company-badge-item">
                <span className="comp-name">Infosys Springboard</span>
                <span className="comp-role">Full Stack &amp; MERN Intern</span>
                <span className="comp-stipend">₹14,000 / mo</span>
              </div>
              <div className="company-badge-item">
                <span className="comp-name">Tech Mahindra</span>
                <span className="comp-role">IoT &amp; Smart Sensors Lab</span>
                <span className="comp-stipend">₹12,000 / mo</span>
              </div>
              <div className="company-badge-item">
                <span className="comp-name">AP Innovation Society</span>
                <span className="comp-role">Govt. Startup Fellowship</span>
                <span className="comp-stipend">₹10,000 / mo</span>
              </div>
            </div>
          </div>

          {/* Drive Eligible Students Roster */}
          <div className="hod-table-wrap" style={{ marginTop: 20 }}>
            <div className="table-inner-header">
              <h3 className="maven-black">Drive Eligible Candidates Roster ({stats.driveEligibleCount} Students)</h3>
              <span className="text-muted">Cleared for upcoming Tier-1 On-Campus Placement Drives</span>
            </div>
            <table className="hod-data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Section</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th>Class Team</th>
                  <th>Active Internship</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cohort
                  .filter((s) => s.driveEligible)
                  .map((s) => (
                    <tr key={s.id} onClick={() => setSelectedStudent(s)}>
                      <td><strong>{s.rollNumber}</strong></td>
                      <td>{s.name}</td>
                      <td>Sec {s.section}</td>
                      <td><strong style={{ color: '#059669' }}>{s.cgpa}</strong></td>
                      <td>{s.attendance}%</td>
                      <td>{s.teamId || 'Open Cohort'}</td>
                      <td>
                        {s.internship ? (
                          <span className="intern-pill">
                            🏢 {s.internship.company}
                          </span>
                        ) : (
                          <span className="text-muted">Drive Ready</span>
                        )}
                      </td>
                      <td>
                        <span className="tag-drive-eligible">✓ Cleared for Drives</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Official Clubs, Hubs & KIOT Slide */}
      {activeTab === 'activities' && (
        <div className="hod-tab-content fade-in">
          <div className="hod-section-header">
            <div>
              <h2 className="section-title maven-black">KIET Korangi Official Hubs, Clubs &amp; KIOT Immersion</h2>
              <p className="section-desc">
                Live co-curricular engagement synchronized from the official KIET Korangi &amp; Yanam portal.
                Select any hub below to inspect enrolled students, meeting schedules, and faculty leads.
              </p>
            </div>
          </div>

          {/* Hub Filter Chips */}
          <div className="hub-chips-row">
            <button
              className={`hub-chip-btn ${activeHubFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveHubFilter('ALL')}
            >
              All Hubs &amp; Clubs
            </button>
            {kietHubsMeta.map((h) => (
              <button
                key={h.id}
                className={`hub-chip-btn ${activeHubFilter === h.id ? 'active' : ''}`}
                onClick={() => setActiveHubFilter(h.id)}
              >
                {h.shortName}
              </button>
            ))}
          </div>

          {/* Official Hub Cards Showcase */}
          <div className="kiet-hubs-grid">
            {kietHubsMeta.map((hub) => {
              // Count members in this branch
              const memberCount = cohort.filter((s) => {
                if (hub.id === 'coding') return s.codingMember
                if (hub.id === 'c4gt') return s.c4gtMember
                if (hub.id === 'smartcity') return s.smartCityMember
                if (hub.id === 'ncc_nss') return s.nccNssMember
                if (hub.id === 'toastmasters') return s.toastmastersMember
                if (hub.id === 'sports') return s.sportsMember
                if (hub.id === 'hackathons') return s.hackathonAttended
                if (hub.id === 'robotics') return s.roboticsMember
                if (hub.id === 'cybersecurity') return s.cyberSecurityMember
                return false
              }).length

              const isSelected = activeHubFilter === hub.id

              return (
                <div
                  key={hub.id}
                  className={`kiet-hub-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setActiveHubFilter(isSelected ? 'ALL' : hub.id)}
                >
                  <div className="hub-cover-wrapper">
                    <img src={hub.coverImage || hub.image} alt={hub.name} className="hub-cover-img" />
                    <span className="hub-badge-pill" style={{ backgroundColor: hub.color }}>
                      {hub.badge}
                    </span>
                  </div>

                  <div className="hub-card-body">
                    <div className="hub-logo-row">
                      <img src={hub.image} alt={hub.shortName} className="hub-thumbnail-img" />
                      <div>
                        <h4 className="hub-name maven-black">{hub.name}</h4>
                        <span className="hub-category">{hub.category}</span>
                      </div>
                    </div>

                    <p className="hub-desc">{hub.description}</p>

                    <div className="hub-meta-list">
                      <div className="hub-meta-item">
                        <span className="meta-icon">👨‍🏫</span>
                        <span>Lead: <strong>{hub.facultyLead}</strong></span>
                      </div>
                      <div className="hub-meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>Schedule: <strong>{hub.meetingTime}</strong></span>
                      </div>
                    </div>

                    <div className="hub-card-footer">
                      <span className="hub-enrollment-tag">
                        <strong>{memberCount}</strong> {selectedBranch} Students Enrolled
                      </span>
                      <button className="btn-view-hub-members">
                        {isSelected ? 'Viewing Roster ✓' : 'Filter Roster →'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Enrolled Students for Selected Hub */}
          <div className="hod-table-wrap" style={{ marginTop: 24 }}>
            <div className="table-inner-header">
              <h3 className="maven-black">
                {activeHubFilter === 'ALL'
                  ? 'All Co-Curricular & Hub Participants'
                  : `${kietHubsMeta.find(h => h.id === activeHubFilter)?.name || 'Hub'} Student Roster`}
              </h3>
              <span className="text-muted">
                Showing {filteredStudents.length} of {cohort.length} students
              </span>
            </div>

            <table className="hod-data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Section</th>
                  <th>Enrolled Hubs / Clubs</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} onClick={() => setSelectedStudent(s)}>
                    <td><strong>{s.rollNumber}</strong></td>
                    <td>{s.name}</td>
                    <td>Sec {s.section}</td>
                    <td>
                      <div className="clubs-badges-row">
                        {s.clubs && s.clubs.length > 0 ? (
                          s.clubs.map((c, cIdx) => {
                            let badgeClass = 'default'
                            if (c.includes('Coding')) badgeClass = 'coding'
                            else if (c.includes('C4GT')) badgeClass = 'c4gt'
                            else if (c.includes('Smart City')) badgeClass = 'smartcity'
                            else if (c.includes('NCC') || c.includes('Nss')) badgeClass = 'ncc_nss'
                            else if (c.includes('Toastmasters')) badgeClass = 'toastmasters'
                            else if (c.includes('sports') || c.includes('kpl')) badgeClass = 'sports'
                            else if (c.includes('Hackathon')) badgeClass = 'hackathons'
                            else if (c.includes('Robotics')) badgeClass = 'robotics'
                            else if (c.includes('Cyber')) badgeClass = 'cybersecurity'
                            return (
                              <span key={cIdx} className={`badge-club ${badgeClass}`}>
                                {c}
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-muted" style={{ fontSize: 11 }}>No clubs</span>
                        )}
                      </div>
                    </td>
                    <td><strong>{s.cgpa}</strong></td>
                    <td>{s.attendance}%</td>
                    <td>
                      <button className="btn-table-view" onClick={(e) => { e.stopPropagation(); setSelectedStudent(s); }}>
                        Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Demographics & Transit Slide */}
      {activeTab === 'demographics' && (
        <div className="hod-tab-content fade-in">
          <div className="hod-section-header">
            <div>
              <h2 className="section-title maven-black">Demographics, Residence &amp; Transit Logistics</h2>
              <p className="section-desc">
                Monitoring <strong>{stats.dayScholarsCount} Day Scholars</strong> across 12 college bus routes and <strong>{stats.hostelersCount} Hostelers</strong> across campus residential blocks.
              </p>
            </div>
            <div className="section-actions">
              <button
                className="btn-transit-alert"
                onClick={() => addToast('Transit status verified. All 12 fleet bus routes on schedule.', 'info')}
              >
                Transit Telemetry Check
              </button>
            </div>
          </div>

          {/* Residence Summary Cards */}
          <div className="demographics-kpi-grid">
            <div className="demographic-card day-scholars-box">
              <div className="demo-header">
                <span className="demo-icon">🚌</span>
                <div>
                  <h3 className="demo-title maven-black">Day Scholars Fleet</h3>
                  <span className="demo-sub">Kakinada • Yanam • Samalkota • Draksharamam</span>
                </div>
              </div>
              <div className="demo-count-row">
                <span className="demo-big-num maven-black">{stats.dayScholarsCount}</span>
                <span className="demo-ratio">({stats.dayScholarsRatio}% of Cohort)</span>
              </div>
              <p className="demo-desc">
                Transported daily via 12 scheduled institutional GPS-tracked buses with boarding checkpoints at Bhanugudi, RTC Complex, and Yanam Bridge.
              </p>
            </div>

            <div className="demographic-card hostelers-box">
              <div className="demo-header">
                <span className="demo-icon">🏢</span>
                <div>
                  <h3 className="demo-title maven-black">Campus Residential Hostelers</h3>
                  <span className="demo-sub">
                    {selectedCampus === "KIET Women's" ? 'Sarada Girls Hostel (Blocks A & B)' : 'Godavari Boys Hostel (Blocks A & B)'}
                  </span>
                </div>
              </div>
              <div className="demo-count-row">
                <span className="demo-big-num maven-black">{stats.hostelersCount}</span>
                <span className="demo-ratio">({stats.hostelersRatio}% of Cohort)</span>
              </div>
              <p className="demo-desc">
                Full-time campus residents enjoying 24/7 high-speed Wi-Fi, biometric hostel curfew tracking, and access to nighttime lab sessions.
              </p>
            </div>
          </div>

          {/* 12 Bus Routes Distribution */}
          <div className="hod-table-wrap" style={{ marginTop: 24 }}>
            <div className="table-inner-header">
              <h3 className="maven-black">Day Scholar Bus Route Distribution (12 Routes)</h3>
              <span className="text-muted">Direct connectivity across East Godavari &amp; Puducherry (Yanam)</span>
            </div>
            <table className="hod-data-table">
              <thead>
                <tr>
                  <th>Route ID</th>
                  <th>Route Coverage</th>
                  <th>Bus Number</th>
                  <th>Driver &amp; Dispatch</th>
                  <th>Registered Scholars</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { route: 'Route 01', path: 'Samalkota Railway Station to Korangi', bus: 'AP 05 TJ 4501', driver: 'K. Subba Rao (+91 98480 11201)', count: Math.ceil(stats.dayScholarsCount / 12) },
                  { route: 'Route 02', path: 'Yanam Ferry Point to Korangi Campus', bus: 'AP 05 TJ 4502', driver: 'M. Venkatesh (+91 98480 11202)', count: Math.floor(stats.dayScholarsCount / 12) },
                  { route: 'Route 03', path: 'Kakinada Bhanugudi Junction & RTC Complex', bus: 'AP 05 TJ 4503', driver: 'K. Appa Rao (+91 94401 22891)', count: Math.ceil(stats.dayScholarsCount / 12) },
                  { route: 'Route 04', path: 'Ramachandrapuram Bus Stand to Korangi', bus: 'AP 05 TJ 4504', driver: 'Ch. Prasad (+91 98480 11204)', count: Math.floor(stats.dayScholarsCount / 12) },
                  { route: 'Route 05', path: 'Draksharamam Temple Gate to Campus', bus: 'AP 05 TJ 4505', driver: 'P. Satyanarayana (+91 98480 11205)', count: Math.ceil(stats.dayScholarsCount / 12) },
                  { route: 'Route 06', path: 'Peddapuram Main Road to Korangi', bus: 'AP 05 TJ 4506', driver: 'G. Suresh (+91 98480 11206)', count: Math.floor(stats.dayScholarsCount / 12) },
                  { route: 'Route 07', path: 'Kakinada Jagannaickpur Bridge to Campus', bus: 'AP 05 TJ 4507', driver: 'V. Srinivas (+91 98480 11207)', count: Math.ceil(stats.dayScholarsCount / 12) },
                  { route: 'Route 08', path: 'Coromandel Gate & Port Road Kakinada', bus: 'AP 05 TJ 4508', driver: 'T. Rama Rao (+91 98480 11208)', count: Math.floor(stats.dayScholarsCount / 12) },
                  { route: 'Route 09', path: 'Thallarevu & Georgepet to Korangi', bus: 'AP 05 TJ 4509', driver: 'B. Krishna (+91 98480 11209)', count: Math.ceil(stats.dayScholarsCount / 12) },
                  { route: 'Route 10', path: 'Kakinada Indrapalem & Madhavapatnam', bus: 'AP 05 TJ 4510', driver: 'S. Nageswara Rao (+91 98480 11210)', count: Math.floor(stats.dayScholarsCount / 12) },
                  { route: 'Route 11', path: 'Gollapalem & Matlapalem Junction', bus: 'AP 05 TJ 4511', driver: 'Y. Veerabhadra Rao (+91 98480 11211)', count: Math.ceil(stats.dayScholarsCount / 12) },
                  { route: 'Route 12', path: 'Yanam Bypass & Pillaraya Temple', bus: 'AP 05 TJ 4512', driver: 'A. Rambabu (+91 98480 11212)', count: Math.floor(stats.dayScholarsCount / 12) },
                ].map((r, idx) => (
                  <tr key={idx}>
                    <td><strong>{r.route}</strong></td>
                    <td>{r.path}</td>
                    <td><code>{r.bus}</code></td>
                    <td>{r.driver}</td>
                    <td><strong>{r.count} Students</strong></td>
                    <td><span className="tag-good">Active Fleet</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. Student Detail Modal */}
      {selectedStudent && (
        <div className="hod-modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="hod-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-student-title">
                <div className="modal-avatar">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="modal-name maven-black">{selectedStudent.name}</h3>
                  <div className="modal-roll-campus">
                    <span>{selectedStudent.rollNumber}</span> • <span>{selectedStudent.campus}</span> • <span>{selectedStudent.branch}</span>
                  </div>
                </div>
              </div>
              <button className="btn-modal-close" onClick={() => setSelectedStudent(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-grid-two">
                {/* Academic Highlights */}
                <div className="modal-info-panel">
                  <h4 className="panel-title maven-black">Academic &amp; Backlog Profile</h4>
                  <div className="info-row">
                    <span className="info-label">Active Backlogs:</span>
                    <span className="info-value">
                      {selectedStudent.activeBacklogs === 0 ? (
                        <span className="badge-backlog-zero">✓ Zero Backlogs (All Clear)</span>
                      ) : (
                        <span className="badge-backlog-danger">{selectedStudent.activeBacklogs} Active Backlogs</span>
                      )}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Cumulative CGPA:</span>
                    <span className="info-value"><strong>{selectedStudent.cgpa} / 10.0</strong></span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Overall Attendance:</span>
                    <span className="info-value"><strong>{selectedStudent.attendance}%</strong></span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Placement Drive Cleared:</span>
                    <span className="info-value">
                      {selectedStudent.driveEligible ? (
                        <span className="tag-drive-eligible">✓ Eligible</span>
                      ) : (
                        <span className="tag-drive-ineligible">Ineligible (Remedial Required)</span>
                      )}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Practical Team:</span>
                    <span className="info-value">{selectedStudent.teamId || 'Not Assigned'} ({selectedStudent.teamRole || 'Member'})</span>
                  </div>
                </div>

                {/* Residence & Transit */}
                <div className="modal-info-panel">
                  <h4 className="panel-title maven-black">Residence &amp; Logistics</h4>
                  <div className="info-row">
                    <span className="info-label">Residence Type:</span>
                    <span className="info-value">
                      <span className={`residence-pill ${selectedStudent.residence === 'Hosteler' ? 'hosteler' : 'day-scholar'}`}>
                        {selectedStudent.residence}
                      </span>
                    </span>
                  </div>
                  {selectedStudent.residence === 'Hosteler' ? (
                    <div className="info-row">
                      <span className="info-label">Hostel Block &amp; Room:</span>
                      <span className="info-value">{selectedStudent.hostelBlock}</span>
                    </div>
                  ) : (
                    <>
                      <div className="info-row">
                        <span className="info-label">College Bus Route:</span>
                        <span className="info-value">{selectedStudent.busRoute}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Boarding Point:</span>
                        <span className="info-value">{selectedStudent.boardingPoint}</span>
                      </div>
                    </>
                  )}
                  <div className="info-row">
                    <span className="info-label">Industrial Internship:</span>
                    <span className="info-value">
                      {selectedStudent.internship ? (
                        <strong>{selectedStudent.internship.company} ({selectedStudent.internship.role})</strong>
                      ) : (
                        <span className="text-muted">None currently active</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clubs & Hubs Enrollment */}
              <div className="modal-full-panel">
                <h4 className="panel-title maven-black">KIET Hubs &amp; Clubs Participations</h4>
                <div className="clubs-badges-row">
                  {selectedStudent.clubs && selectedStudent.clubs.length > 0 ? (
                    selectedStudent.clubs.map((c, cIdx) => {
                      let badgeClass = 'default'
                      if (c.includes('Coding')) badgeClass = 'coding'
                      else if (c.includes('C4GT')) badgeClass = 'c4gt'
                      else if (c.includes('Smart City')) badgeClass = 'smartcity'
                      else if (c.includes('NCC') || c.includes('Nss')) badgeClass = 'ncc_nss'
                      else if (c.includes('Toastmasters')) badgeClass = 'toastmasters'
                      else if (c.includes('sports') || c.includes('kpl')) badgeClass = 'sports'
                      else if (c.includes('Hackathon')) badgeClass = 'hackathons'
                      else if (c.includes('Robotics')) badgeClass = 'robotics'
                      else if (c.includes('Cyber')) badgeClass = 'cybersecurity'
                      return (
                        <span key={cIdx} className={`badge-club ${badgeClass}`}>
                          {c}
                        </span>
                      )
                    })
                  ) : (
                    <span className="text-muted">No co-curricular hub registrations.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-action" onClick={() => { addToast(`Notice dispatched to ${selectedStudent.name}.`, 'info'); setSelectedStudent(null); }}>
                Send Official Department Notice
              </button>
              <button className="btn-modal-close-secondary" onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
