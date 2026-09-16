import React, { useState, useMemo } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import {
  campuses,
  branchesByCampus,
  sections,
  students,
  classTeamsMeta,
  capstoneTeams,
} from '../../data/academicData'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const { activities, updateActivityStatus, updateActivityStatusWithMeta } = useData()
  const { showToast } = useToast()

  // Primary Campus & Branch Filter States
  const [selectedCampus, setSelectedCampus] = useState('KIET')
  const [selectedBranch, setSelectedBranch] = useState('AIDS')
  const [activeTab, setActiveTab] = useState('teams') // 'teams' | 'roster' | 'reviews' | 'shortage'

  // Register & Team Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [residenceFilter, setResidenceFilter] = useState('All')
  const [teamFilter, setTeamFilter] = useState('All')
  const [teamSectionFilter, setTeamSectionFilter] = useState('All')

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedTeamModal, setSelectedTeamModal] = useState(null)
  const [rejectItem, setRejectItem] = useState(null)
  const [rejectReason, setReason] = useState('')

  // Branches available for the selected campus
  const branchList = useMemo(() => {
    return branchesByCampus[selectedCampus] || []
  }, [selectedCampus])

  // Filter pending activities from DataContext
  const pendingActivities = useMemo(() => {
    return activities.filter((a) => a.status === 'Pending')
  }, [activities])

  // Cohort Students for Current Campus & Branch
  const cohortStudents = useMemo(() => {
    return students.filter(
      (s) => s.campus === selectedCampus && s.branch === selectedBranch
    )
  }, [selectedCampus, selectedBranch])

  // Class Teams for Current Campus & Branch (Teams 1 to N, 5 members each)
  const currentTeams = useMemo(() => {
    const teams = []
    const maxTeams = Math.min(14, Math.max(1, Math.floor(cohortStudents.length / 5)))
    for (let t = 1; t <= maxTeams; t++) {
      const teamId = `Team ${String(t).padStart(2, '0')}`
      const members = cohortStudents.filter((s) => s.teamId === teamId).slice(0, 5)
      const meta = (classTeamsMeta || [])[t - 1] || {
        id: `team-${t}`,
        teamId,
        name: `Class Team ${String(t).padStart(2, '0')}`,
        section: members[0]?.section || (t <= 5 ? 'A' : t <= 10 ? 'B' : 'C'),
        title: `Class Practical & Lab Project Team ${t}`,
        status: 'Active Class Team',
        guide: 'Dr. K. V. Ramana (Faculty Advisor)',
      }
      const hostelerCount = members.filter((m) => m.residence === 'Hosteler').length
      const dayScholarCount = members.filter((m) => m.residence === 'Day Scholar').length
      const avgAttendance = members.length
        ? Number((members.reduce((acc, m) => acc + m.attendance, 0) / members.length).toFixed(1))
        : 85.0
      const avgCgpa = members.length
        ? Number((members.reduce((acc, m) => acc + Number(m.cgpa), 0) / members.length).toFixed(2))
        : 8.2
      teams.push({
        ...meta,
        members,
        hostelerCount,
        dayScholarCount,
        avgAttendance,
        avgCgpa,
        memberCount: members.length,
      })
    }
    return teams
  }, [cohortStudents])

  // Cohort Demographics Metrics
  const cohortMetrics = useMemo(() => {
    const total = cohortStudents.length
    const secA = cohortStudents.filter((s) => s.section === 'A').length
    const secB = cohortStudents.filter((s) => s.section === 'B').length
    const secC = cohortStudents.filter((s) => s.section === 'C').length
    const hostelers = cohortStudents.filter((s) => s.residence === 'Hosteler').length
    const dayScholars = cohortStudents.filter((s) => s.residence === 'Day Scholar').length
    const avgAttendance = total
      ? Number(
          (cohortStudents.reduce((acc, s) => acc + s.attendance, 0) / total).toFixed(1)
        )
      : 88.2
    const shortageStudents = cohortStudents.filter((s) => s.attendance < 75)
    const eligibleStudents = cohortStudents.filter((s) => s.attendance >= 75)
    const teamsCount = currentTeams.length

    return {
      total,
      secA,
      secB,
      secC,
      hostelers,
      dayScholars,
      avgAttendance,
      shortageCount: shortageStudents.length,
      shortageStudents,
      eligibleCount: eligibleStudents.length,
      teamsCount,
    }
  }, [cohortStudents, currentTeams])

  // Filtered Class Teams
  const filteredTeams = useMemo(() => {
    return currentTeams.filter((team) => {
      const matchSection =
        teamSectionFilter === 'All' || team.section === teamSectionFilter
      const matchSearch =
        !searchQuery ||
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.teamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members.some(
          (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
      const matchResidence =
        residenceFilter === 'All' ||
        (residenceFilter === 'Hosteler' && team.hostelerCount > 0) ||
        (residenceFilter === 'Day Scholar' && team.dayScholarCount > 0)

      return matchSection && matchSearch && matchResidence
    })
  }, [currentTeams, teamSectionFilter, searchQuery, residenceFilter])

  // Filtered Student Register (180 students)
  const filteredRegister = useMemo(() => {
    return cohortStudents.filter((s) => {
      const matchSection = sectionFilter === 'All' || s.section === sectionFilter
      const matchResidence = residenceFilter === 'All' || s.residence === residenceFilter
      const matchTeam =
        teamFilter === 'All'
          ? true
          : teamFilter === 'Unassigned'
          ? !s.teamId
          : s.teamId === teamFilter
      const matchSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())

      return matchSection && matchResidence && matchTeam && matchSearch
    })
  }, [cohortStudents, sectionFilter, residenceFilter, teamFilter, searchQuery])

  // Approval Handlers
  function handleApprove(id, title, student) {
    updateActivityStatus(id, 'Verified')
    if (showToast) {
      showToast(`Approved "${title}" for ${student || 'Student'}! Verified with official credits.`, 'success')
    }
  }

  function handleRejectClick(item) {
    setRejectItem(item)
    setReason('')
  }

  function confirmReject() {
    if (!rejectItem) return
    updateActivityStatusWithMeta(rejectItem.id, 'Rejected', {
      rejectionReason: reason || 'Documentation incomplete or invalid proof submitted.',
      rejectedBy: user?.name || 'Dr. K. V. Ramana (Faculty Advisor)',
      reviewedAt: Date.now(),
    })
    if (showToast) {
      showToast(`Submission rejected. Feedback recorded for student.`, 'warning')
    }
    setRejectItem(null)
    setReason('')
  }

  function handleExportRegister() {
    const headers = 'Roll Number,Name,Campus,Branch,Section,Residence,Team,Attendance,CGPA\n'
    const rows = filteredRegister
      .map(
        (s) =>
          `"${s.rollNumber}","${s.name}","${s.campus}","${s.branch}","Sec ${s.section}","${s.residence}","${s.teamId || 'Unassigned'}","${s.attendance}%","${s.cgpa}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `KIET_${selectedBranch}_Cohort_Register_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    if (showToast) {
      showToast(`Exported ${filteredRegister.length} student records to CSV successfully!`, 'success')
    }
  }

  function handleSendNotice(student) {
    if (showToast) {
      showToast(`Parent SMS Alert sent to ${student.name}'s guardian regarding ${student.attendance}% attendance.`, 'info')
    }
  }

  return (
    <div className="faculty-workspace">
      {/* 1. Clean Institutional Header */}
      <div className="faculty-hero-banner">
        <div className="faculty-header-meta">
          <span className="faculty-governance-tag">👨‍🏫 FACULTY ACADEMIC WORKSPACE</span>
          <h1 className="faculty-title maven-black">
            Faculty Overview &amp; Cohort Management
          </h1>
          <p className="faculty-subtitle">
            Welcome, <strong>{user?.name || 'Dr. K. V. Ramana'}</strong> • Monitoring active student cohort for <strong>{selectedCampus} ({selectedBranch})</strong>, practical lab teams, and attendance.
          </p>
        </div>

        <div className="faculty-hero-actions">
          <button type="button" className="btn-faculty-action" onClick={handleExportRegister}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Register</span>
          </button>
          <button
            type="button"
            className="btn-faculty-broadcast"
            onClick={() => {
              if (showToast) {
                showToast(`Broadcast notice drafted for ${selectedCampus} ${selectedBranch} cohort.`, 'info')
              }
            }}
          >
            <span>📢 Broadcast</span>
          </button>
        </div>
      </div>

      {/* 2. Compact, Balanced Campus & Branch Scope Selectors */}
      <div className="faculty-selector-card">
        {/* Campus Selection */}
        <div className="faculty-selector-group">
          <div className="faculty-selector-header">
            <span className="scope-indicator-dot" />
            <span className="scope-title">INSTITUTIONAL CAMPUS:</span>
          </div>
          <div className="faculty-pills-row">
            {campuses.map((camp) => {
              const isActive = selectedCampus === camp
              return (
                <button
                  key={camp}
                  type="button"
                  className={`faculty-scope-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCampus(camp)
                    const available = (branchesByCampus[camp] || []).map((b) => b.code)
                    if (!available.includes(selectedBranch)) {
                      setSelectedBranch(available[0] || 'AIDS')
                    }
                  }}
                >
                  <span className="pill-dot" />
                  <span className="pill-name">{camp}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Branch Selection */}
        <div className="faculty-selector-group">
          <div className="faculty-selector-header">
            <span className="scope-indicator-dot" style={{ backgroundColor: '#10b981' }} />
            <span className="scope-title">ACADEMIC BRANCH:</span>
          </div>
          <div className="faculty-pills-row">
            {branchList.map((br) => {
              const isActive = selectedBranch === br.code
              const count = students.filter(
                (s) => s.campus === selectedCampus && s.branch === br.code
              ).length
              return (
                <button
                  key={br.code}
                  type="button"
                  className={`faculty-branch-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedBranch(br.code)}
                >
                  <span className="branch-code-badge">{br.code}</span>
                  <span className="pill-name">{br.name}</span>
                  <span className="pill-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. COHORT EXECUTIVE METRICS */}
      <section className="cohort-metrics-grid">
        {/* Total Students Card */}
        <div className="cohort-kpi-card card-blue">
          <div className="kpi-icon-box">👥</div>
          <div className="kpi-info-box">
            <span className="kpi-label">TOTAL COHORT STUDENTS</span>
            <div className="kpi-value-row">
              <strong className="kpi-main-val maven-black">{cohortMetrics.total}</strong>
              <span className="kpi-tag-sub">3 Sections</span>
            </div>
            <p className="kpi-breakdown">
              <strong>Sec A:</strong> {cohortMetrics.secA} • <strong>Sec B:</strong> {cohortMetrics.secB} • <strong>Sec C:</strong> {cohortMetrics.secC}
            </p>
          </div>
        </div>

        {/* Day Scholars Card */}
        <div className="cohort-kpi-card card-teal">
          <div className="kpi-icon-box">🚌</div>
          <div className="kpi-info-box">
            <span className="kpi-label">DAY SCHOLARS</span>
            <div className="kpi-value-row">
              <strong className="kpi-main-val maven-black">{cohortMetrics.dayScholars}</strong>
              <span className="kpi-tag-sub">
                {Math.round((cohortMetrics.dayScholars / cohortMetrics.total) * 100)}% Cohort
              </span>
            </div>
            <p className="kpi-breakdown">
              Availing 12 active college bus routes from Kakinada, Rajahmundry &amp; Ramachandrapuram.
            </p>
          </div>
        </div>

        {/* Hostelers Card */}
        <div className="cohort-kpi-card card-purple">
          <div className="kpi-icon-box">🏢</div>
          <div className="kpi-info-box">
            <span className="kpi-label">HOSTELERS</span>
            <div className="kpi-value-row">
              <strong className="kpi-main-val maven-black">{cohortMetrics.hostelers}</strong>
              <span className="kpi-tag-sub">
                {Math.round((cohortMetrics.hostelers / cohortMetrics.total) * 100)}% Cohort
              </span>
            </div>
            <p className="kpi-breakdown">
              Campus Hostels (Godavari Boys Block A &amp; B, Sarada Girls Block C).
            </p>
          </div>
        </div>

        {/* Class Teams Card */}
        <div className="cohort-kpi-card card-amber">
          <div className="kpi-icon-box">👥</div>
          <div className="kpi-info-box">
            <span className="kpi-label">CLASS TEAMS (1 TO {cohortMetrics.teamsCount})</span>
            <div className="kpi-value-row">
              <strong className="kpi-main-val maven-black">{cohortMetrics.teamsCount} Teams</strong>
              <span className="kpi-tag-sub">5 Members / Team</span>
            </div>
            <p className="kpi-breakdown">
              {cohortMetrics.teamsCount * 5} Students assigned across Sections (5 Students each).
            </p>
          </div>
        </div>

        {/* Class Attendance Card */}
        <div className="cohort-kpi-card card-emerald">
          <div className="kpi-icon-box">📊</div>
          <div className="kpi-info-box">
            <span className="kpi-label">CLASS AVG ATTENDANCE</span>
            <div className="kpi-value-row">
              <strong className="kpi-main-val maven-black">{cohortMetrics.avgAttendance}%</strong>
              <span className="kpi-tag-sub status-pill-safe">Safe Standing</span>
            </div>
            <p className="kpi-breakdown">
              {cohortMetrics.eligibleCount} Eligible (≥75%) • {cohortMetrics.shortageCount} on Shortage Watch
            </p>
          </div>
        </div>

        {/* Pending Activity Approvals Card */}
        <div className="cohort-kpi-card card-rose">
          <div className="kpi-icon-box">⚡</div>
          <div className="kpi-info-box">
            <span className="kpi-label">PENDING APPROVALS</span>
            <div className="kpi-value-row">
              <strong className="kpi-main-val maven-black">{pendingActivities.length}</strong>
              <span className="kpi-tag-sub">Submissions</span>
            </div>
            <p className="kpi-breakdown">
              AWS, SIH 2026, NPTEL, and OpenVINO student certificates to review.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WORKSPACE TABS */}
      <div className="faculty-tabs-container">
        <div className="faculty-tabs-header">
          <button
            type="button"
            className={`faculty-tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-title">Class Teams</span>
            <span className="tab-count-pill">{currentTeams.length} Teams</span>
          </button>

          <button
            type="button"
            className={`faculty-tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
            onClick={() => setActiveTab('roster')}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-title">Class Register</span>
            <span className="tab-count-pill">{cohortMetrics.total} Students</span>
          </button>

          <button
            type="button"
            className={`faculty-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <span className="tab-icon">⚡</span>
            <span className="tab-title">Pending Submissions</span>
            {pendingActivities.length > 0 && (
              <span className="tab-alert-pill">{pendingActivities.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`faculty-tab-btn ${activeTab === 'shortage' ? 'active' : ''}`}
            onClick={() => setActiveTab('shortage')}
          >
            <span className="tab-icon">⚠️</span>
            <span className="tab-title">Shortage Watchlist</span>
            {cohortMetrics.shortageCount > 0 && (
              <span className="tab-warning-pill">{cohortMetrics.shortageCount}</span>
            )}
          </button>
        </div>

        {/* TAB 1 CONTENT: CLASS TEAMS (1 TO 14 • 5 MEMBERS EACH) */}
        {activeTab === 'teams' && (
          <div className="tab-view-content">
            {/* Filter Sub-bar */}
            <div className="tab-controls-bar">
              <div className="controls-left">
                <label className="f-filter-label">
                  <span>Class Section</span>
                  <select
                    value={teamSectionFilter}
                    onChange={(e) => setTeamSectionFilter(e.target.value)}
                  >
                    <option value="All">All Class Teams (Teams 1 – {currentTeams.length})</option>
                    <option value="A">Section A (Teams 01 – 05)</option>
                    <option value="B">Section B (Teams 06 – 10)</option>
                    <option value="C">Section C (Teams 11 – 14)</option>
                  </select>
                </label>

                <label className="f-filter-label">
                  <span>Residence Filter</span>
                  <select
                    value={residenceFilter}
                    onChange={(e) => setResidenceFilter(e.target.value)}
                  >
                    <option value="All">All Teams</option>
                    <option value="Day Scholar">Includes Day Scholars</option>
                    <option value="Hosteler">Includes Hostelers</option>
                  </select>
                </label>
              </div>

              <div className="controls-right">
                <div className="f-search-wrap">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by team (e.g. Team 1), student name or roll number..."
                  />
                </div>
              </div>
            </div>

            {/* Teams Grid (14 Teams) */}
            <div className="faculty-teams-grid">
              {filteredTeams.map((team) => (
                <div key={team.id} className="team-project-card">
                  {/* Card Header */}
                  <div className="team-card-header">
                    <div className="team-id-badge-col">
                      <span className="team-badge-primary">{team.teamId}</span>
                      <span className="team-sec-tag">Section {team.section}</span>
                    </div>
                    <div className="residence-ratio-badge">
                      🚌 {team.dayScholarCount} Day Scholars • 🏢 {team.hostelerCount} Hostelers
                    </div>
                  </div>

                  {/* Project Title */}
                  <div className="team-project-body">
                    <h3 className="team-project-title maven-black">{team.title}</h3>
                    <div className="team-meta-row">
                      <span className="meta-guide">
                        Faculty Advisor: <strong>{team.guide}</strong>
                      </span>
                      <span className="meta-stats">
                        Avg Att: <strong>{team.avgAttendance}%</strong> • Avg CGPA: <strong>{team.avgCgpa}</strong>
                      </span>
                    </div>
                  </div>

                  {/* 5 TEAM MEMBERS LIST */}
                  <div className="team-members-container">
                    <div className="members-header-row">
                      <span className="members-sec-title">
                        Team Roster ({team.members.length} Members)
                      </span>
                      <span className="residence-ratio-badge">
                        🚌 {team.dayScholarCount} Day Scholars • 🏢 {team.hostelerCount} Hostelers
                      </span>
                    </div>

                    <div className="team-members-list">
                      {team.members.map((m, mIdx) => {
                        const isLead = mIdx === 0
                        const isPremierDemo = m.rollNumber === '23JN1A4533'
                        return (
                          <div
                            key={m.rollNumber}
                            className={`member-row-item ${isLead ? 'is-lead' : ''} ${
                              isPremierDemo ? 'premier-member' : ''
                            }`}
                            onClick={() => setSelectedStudent(m)}
                            title="Click to view full student profile"
                          >
                            <div className="member-avatar">
                              {m.name.slice(0, 1).toUpperCase()}
                            </div>

                            <div className="member-info-col">
                              <div className="member-name-row">
                                <strong className="member-name">{m.name}</strong>
                                {isLead && <span className="lead-tag">Team Lead</span>}
                                {isPremierDemo && <span className="demo-tag">Logged In</span>}
                              </div>
                              <span className="member-roll">{m.rollNumber}</span>
                            </div>

                            <div className="member-role-badge">
                              {m.teamRole || (isLead ? 'Lead Architect' : 'Developer')}
                            </div>

                            <div className="member-residence-badge">
                              <span
                                className={`residence-pill ${
                                  m.residence === 'Hosteler' ? 'hosteler' : 'dayscholar'
                                }`}
                              >
                                {m.residence === 'Hosteler' ? '🏢 Hosteler' : '🚌 Day Scholar'}
                              </span>
                            </div>

                            <div className="member-metrics-col">
                              <span className="m-cgpa">
                                CGPA: <strong>{m.cgpa}</strong>
                              </span>
                              <span
                                className={`m-att ${
                                  m.attendance >= 75 ? 'att-good' : 'att-low'
                                }`}
                              >
                                Att: {m.attendance}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="team-card-footer">
                    <button
                      type="button"
                      className="f-card-btn f-btn-secondary"
                      onClick={() => setSelectedTeamModal(team)}
                    >
                      Project Milestones
                    </button>
                    <button
                      type="button"
                      className="f-card-btn f-btn-ghost"
                      onClick={() => {
                        if (showToast) {
                          showToast(`Review feedback sent to ${team.teamId} lead!`, 'success')
                        }
                      }}
                    >
                      Review Codebase
                    </button>
                  </div>
                </div>
              ))}

              {!filteredTeams.length && (
                <div className="empty-state-box">
                  <span className="empty-icon">🔍</span>
                  <h3>No Capstone Teams match the criteria</h3>
                  <p>Try resetting the search query or residence filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: COHORT CLASS REGISTER (180 STUDENTS) */}
        {activeTab === 'roster' && (
          <div className="tab-view-content">
            {/* Filter Cascade for 180 Students */}
            <div className="tab-controls-bar">
              <div className="controls-left">
                <label className="f-filter-label">
                  <span>Section</span>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                  >
                    <option value="All">All Sections (180 Students)</option>
                    <option value="A">Section A ({cohortMetrics.secA} Students)</option>
                    <option value="B">Section B ({cohortMetrics.secB} Students)</option>
                    <option value="C">Section C ({cohortMetrics.secC} Students)</option>
                  </select>
                </label>

                <label className="f-filter-label">
                  <span>Residence Type</span>
                  <select
                    value={residenceFilter}
                    onChange={(e) => setResidenceFilter(e.target.value)}
                  >
                    <option value="All">All Students (180)</option>
                    <option value="Day Scholar">
                      Day Scholars ({cohortMetrics.dayScholars} - 66.7%)
                    </option>
                    <option value="Hosteler">
                      Hostelers ({cohortMetrics.hostelers} - 33.3%)
                    </option>
                  </select>
                </label>

                <label className="f-filter-label">
                  <span>Capstone Team</span>
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                  >
                    <option value="All">All Teams (Teams 01 - 14)</option>
                    {capstoneTeams.map((t) => (
                      <option key={t.teamId} value={t.teamId}>
                        {t.teamId} · {t.name.split('·')[1]?.trim() || t.teamId}
                      </option>
                    ))}
                    <option value="Unassigned">General Cohort (No Team)</option>
                  </select>
                </label>
              </div>

              <div className="controls-right">
                <div className="f-search-wrap">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student name or roll number (e.g. 23JN1A4533)..."
                  />
                </div>
              </div>
            </div>

            {/* Roster Summary Bar */}
            <div className="roster-meta-bar">
              <span>
                Showing <strong>{filteredRegister.length}</strong> of{' '}
                <strong>{cohortMetrics.total}</strong> students in{' '}
                <strong>{selectedCampus} • {selectedBranch}</strong> cohort
              </span>
              <div className="roster-counts-chips">
                <span className="chip-dayscholar">
                  🚌 {filteredRegister.filter((s) => s.residence === 'Day Scholar').length} Day Scholars
                </span>
                <span className="chip-hosteler">
                  🏢 {filteredRegister.filter((s) => s.residence === 'Hosteler').length} Hostelers
                </span>
                <span className="chip-eligible">
                  ✓ {filteredRegister.filter((s) => s.attendance >= 75).length} Eligible
                </span>
              </div>
            </div>

            {/* 180 Students Data Table */}
            <div className="register-table-wrapper">
              <table className="faculty-data-table">
                <thead>
                  <tr>
                    <th>Roll Number & Name</th>
                    <th>Sec</th>
                    <th>Residence Status</th>
                    <th>Assigned Team & Role</th>
                    <th className="text-center">CGPA</th>
                    <th className="text-center">Attendance %</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegister.map((student) => {
                    const isPremier = student.rollNumber === '23JN1A4533'
                    const isShortage = student.attendance < 75
                    return (
                      <tr
                        key={student.id}
                        className={`faculty-student-row ${isPremier ? 'row-highlight' : ''}`}
                      >
                        <td>
                          <div className="stu-name-cell">
                            <div className="stu-avatar">
                              {student.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <strong className="stu-name">
                                {student.name}
                                {isPremier && <span className="demo-marker">STAR STUDENT</span>}
                              </strong>
                              <div className="stu-roll">{student.rollNumber}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="sec-tag">Sec {student.section}</span>
                        </td>

                        <td>
                          <span
                            className={`residence-pill ${
                              student.residence === 'Hosteler' ? 'hosteler' : 'dayscholar'
                            }`}
                          >
                            {student.residence === 'Hosteler' ? '🏢 Hosteler' : '🚌 Day Scholar'}
                          </span>
                        </td>

                        <td>
                          {student.teamId ? (
                            <div className="assigned-team-box">
                              <span className="team-pill">{student.teamId}</span>
                              <span className="role-text">{student.teamRole || 'Member'}</span>
                            </div>
                          ) : (
                            <span className="unassigned-text">General Cohort</span>
                          )}
                        </td>

                        <td className="text-center">
                          <strong className="cgpa-val">{student.cgpa}</strong>
                        </td>

                        <td className="text-center">
                          <strong
                            className={`att-val ${isShortage ? 'att-danger' : 'att-success'}`}
                          >
                            {student.attendance}%
                          </strong>
                        </td>

                        <td className="text-center">
                          <span
                            className={`status-chip-reg ${
                              isShortage ? 'chip-shortage' : 'chip-safe'
                            }`}
                          >
                            {isShortage ? 'Shortage Warning' : 'Eligible'}
                          </span>
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            className="btn-table-inspect"
                            onClick={() => setSelectedStudent(student)}
                          >
                            Inspect Profile →
                          </button>
                        </td>
                      </tr>
                    )
                  })}

                  {!filteredRegister.length && (
                    <tr>
                      <td colSpan={8} className="text-center empty-table-cell">
                        No students match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3 CONTENT: PENDING ACTIVITY REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="tab-view-content">
            <div className="reviews-header-banner">
              <div>
                <h2 className="maven-black">Student Credential &amp; Activity Review Desk</h2>
                <p>
                  Verify certifications, hackathon awards, workshops and technical achievements submitted by students.
                  Approved credentials award academic credit points and show on their official resume.
                </p>
              </div>
              <span className="pending-badge-large">
                {pendingActivities.length} Pending Verifications
              </span>
            </div>

            <div className="pending-cards-grid">
              {pendingActivities.map((act) => (
                <div key={act.id} className="pending-review-card">
                  <div className="review-card-top">
                    <div>
                      <span className="category-tag-review">{act.category}</span>
                      <h3 className="review-title maven-black">{act.title}</h3>
                      <div className="review-issuer">
                        Issued by <strong>{act.issuer}</strong> • {act.issuerType || 'Accredited'}
                      </div>
                    </div>
                    <div className="points-award-pill">
                      +{act.points || 20} Points
                    </div>
                  </div>

                  <p className="review-desc">{act.description}</p>

                  <div className="review-skills-row">
                    {(act.skills || []).map((sk) => (
                      <span key={sk} className="skill-pill-sm">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="review-student-strip">
                    <div className="student-profile-mini">
                      <div className="mini-avatar">
                        {(act.studentName || act.user || 'S').slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <strong>{act.studentName || act.user}</strong>
                        <small>
                          {act.rollNumber} • Sec {act.section || 'A'} • {act.residence || 'Day Scholar'}
                        </small>
                      </div>
                    </div>

                    <div className="review-actions-group">
                      <button
                        type="button"
                        className="btn-review-reject"
                        onClick={() => handleRejectClick(act)}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn-review-approve"
                        onClick={() => handleApprove(act.id, act.title, act.studentName || act.user)}
                      >
                        ✓ Verify & Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!pendingActivities.length && (
                <div className="empty-state-box">
                  <span className="empty-icon">🎉</span>
                  <h3>All student submissions have been reviewed!</h3>
                  <p>New submissions from student portfolios will appear here for verification.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4 CONTENT: ATTENDANCE SHORTAGE WATCHLIST */}
        {activeTab === 'shortage' && (
          <div className="tab-view-content">
            <div className="shortage-header-banner">
              <div>
                <h2 className="maven-black">Mandatory Attendance Shortage Watchlist (&lt; 75%)</h2>
                <p>
                  As per KIET Autonomous regulations, students below 75% aggregate attendance require condonation or parent notification.
                  Immediate faculty interventions are recorded below.
                </p>
              </div>
              <div className="shortage-count-box">
                <strong>{cohortMetrics.shortageCount}</strong>
                <span>Students at Risk</span>
              </div>
            </div>

            <div className="shortage-table-wrapper">
              <table className="faculty-data-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Residence</th>
                    <th className="text-center">Section</th>
                    <th className="text-center">Current Attendance</th>
                    <th className="text-center">Deficit</th>
                    <th>Guardian Contact Action</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortMetrics.shortageStudents.map((stu) => {
                    const deficitDays = Math.ceil(((75 - stu.attendance) / 100) * 120)
                    return (
                      <tr key={stu.id} className="shortage-table-row">
                        <td>
                          <div className="stu-name-cell">
                            <div className="stu-avatar avatar-danger">
                              {stu.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <strong className="stu-name">{stu.name}</strong>
                              <div className="stu-roll">{stu.rollNumber}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`residence-pill ${
                              stu.residence === 'Hosteler' ? 'hosteler' : 'dayscholar'
                            }`}
                          >
                            {stu.residence === 'Hosteler' ? '🏢 Hosteler' : '🚌 Day Scholar'}
                          </span>
                        </td>

                        <td className="text-center">
                          <span className="sec-tag">Sec {stu.section}</span>
                        </td>

                        <td className="text-center">
                          <strong className="att-danger-bold">{stu.attendance}%</strong>
                        </td>

                        <td className="text-center">
                          <span className="deficit-badge">Needs ~{deficitDays} classes</span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn-sms-alert"
                            onClick={() => handleSendNotice(stu)}
                          >
                            📱 Send Parent SMS Notice
                          </button>
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            className="btn-table-inspect"
                            onClick={() => setSelectedStudent(stu)}
                          >
                            View Record →
                          </button>
                        </td>
                      </tr>
                    )
                  })}

                  {!cohortMetrics.shortageStudents.length && (
                    <tr>
                      <td colSpan={7} className="text-center empty-table-cell">
                        Great news! All students in this cohort meet or exceed the 75% attendance threshold.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* STUDENT FULL PROFILE INSPECTION MODAL */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">KIET AUTONOMOUS STUDENT DOSSIER</span>
                <h2 className="modal-title maven-black">{selectedStudent.name}</h2>
                <p className="modal-subtitle">
                  {selectedStudent.rollNumber} • {selectedStudent.campus} • {selectedStudent.branch} • 3rd Year Sec {selectedStudent.section}
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Top Highlights Grid */}
              <div className="modal-stats-grid">
                <div className="modal-stat-card">
                  <span>Residence Category</span>
                  <strong className={selectedStudent.residence === 'Hosteler' ? 'text-purple' : 'text-teal'}>
                    {selectedStudent.residence === 'Hosteler' ? '🏢 On-Campus Hosteler' : '🚌 Day Scholar (Bus)'}
                  </strong>
                  <small>
                    {selectedStudent.residence === 'Hosteler'
                      ? selectedStudent.hostelBlock || 'Godavari Hostel Complex'
                      : selectedStudent.busRoute || 'College Bus Route 03'}
                  </small>
                </div>

                <div className="modal-stat-card">
                  <span>Aggregate Attendance</span>
                  <strong className={selectedStudent.attendance >= 75 ? 'text-success' : 'text-danger'}>
                    {selectedStudent.attendance}%
                  </strong>
                  <small>{selectedStudent.attendance >= 75 ? 'Eligible for End Exams' : 'Requires Condonation'}</small>
                </div>

                <div className="modal-stat-card">
                  <span>Current CGPA</span>
                  <strong className="text-blue">{selectedStudent.cgpa}</strong>
                  <small>Across 4 Completed Semesters</small>
                </div>

                <div className="modal-stat-card">
                  <span>Capstone Assignment</span>
                  <strong className="text-amber">{selectedStudent.teamId || 'General Cohort'}</strong>
                  <small>{selectedStudent.teamRole || 'Team Member'}</small>
                </div>
              </div>

              {/* Semester Results */}
              <h3 className="modal-section-title">Academic Semester SGPA Record</h3>
              <div className="modal-sgpa-table">
                <table className="kiet-data-table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th className="text-center">SGPA</th>
                      <th className="text-center">Credits Earned</th>
                      <th className="text-center">Backlogs</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedStudent.results || []).map((r) => (
                      <tr key={r.semester}>
                        <td><strong>Semester {r.semester}</strong></td>
                        <td className="text-center"><strong>{r.sgpa}</strong></td>
                        <td className="text-center">{r.credits}</td>
                        <td className="text-center">{r.backlogs}</td>
                        <td className="text-center">
                          <span className={`status-tag ${r.status === 'Pass' ? 'tag-success' : 'tag-warning'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fee & Transport Status */}
              <h3 className="modal-section-title" style={{ marginTop: 24 }}>Administrative & Logistics Status</h3>
              <div className="modal-admin-grid">
                <div className="admin-status-box">
                  <span className="box-title">Tuition & Exam Fees</span>
                  <div className="box-values">
                    <span>Paid: ₹{(selectedStudent.fees?.paid || 0).toLocaleString('en-IN')}</span>
                    <strong className={selectedStudent.fees?.due > 0 ? 'text-danger' : 'text-success'}>
                      Due: ₹{(selectedStudent.fees?.due || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="admin-status-box">
                  <span className="box-title">Transport / Logistics</span>
                  <div className="box-values">
                    <span>Point: {selectedStudent.boardingPoint || 'Campus Gate'}</span>
                    <strong className="text-teal">{selectedStudent.transport?.status || 'Active'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-light"
                onClick={() => setSelectedStudent(null)}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAPSTONE TEAM MILESTONES MODAL */}
      {selectedTeamModal && (
        <div className="modal-overlay" onClick={() => setSelectedTeamModal(null)}>
          <div className="modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CAPSTONE INNOVATION BRIEF</span>
                <h2 className="modal-title maven-black">{selectedTeamModal.name}</h2>
                <p className="modal-subtitle">{selectedTeamModal.title}</p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedTeamModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-stats-grid">
                <div className="modal-stat-card">
                  <span>Domain</span>
                  <strong className="text-blue">{selectedTeamModal.domain}</strong>
                </div>
                <div className="modal-stat-card">
                  <span>Faculty Mentor</span>
                  <strong className="text-purple">{selectedTeamModal.guide}</strong>
                </div>
                <div className="modal-stat-card">
                  <span>Sprint Status</span>
                  <strong className="text-success">{selectedTeamModal.status}</strong>
                </div>
                <div className="modal-stat-card">
                  <span>Team Composition</span>
                  <strong>5 Members ({selectedTeamModal.dayScholarCount} Day, {selectedTeamModal.hostelerCount} Hosteler)</strong>
                </div>
              </div>

              <h3 className="modal-section-title" style={{ marginTop: 20 }}>Assigned 5 Team Members</h3>
              <div className="team-members-list modal-roster">
                {selectedTeamModal.members.map((m, idx) => (
                  <div key={m.rollNumber} className="member-row-item">
                    <div className="member-avatar">{m.name.slice(0, 1)}</div>
                    <div className="member-info-col">
                      <strong>{m.name} {idx === 0 ? '(Team Lead)' : ''}</strong>
                      <span>{m.rollNumber} • Sec {m.section}</span>
                    </div>
                    <span className={`residence-pill ${m.residence === 'Hosteler' ? 'hosteler' : 'dayscholar'}`}>
                      {m.residence === 'Hosteler' ? '🏢 Hosteler' : '🚌 Day Scholar'}
                    </span>
                    <span className="m-cgpa">CGPA: {m.cgpa}</span>
                    <span className="m-att">Att: {m.attendance}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-light"
                onClick={() => setSelectedTeamModal(null)}
              >
                Close Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT SUBMISSION MODAL */}
      {rejectItem && (
        <div className="modal-overlay" onClick={() => setRejectItem(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Return Activity Submission</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setRejectItem(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-subtitle">
                Provide constructive reason for returning <strong>"{rejectItem.title}"</strong> to{' '}
                <strong>{rejectItem.studentName || rejectItem.user}</strong>.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g., Certificate ID could not be validated on the issuing portal, or uploaded image is blurry."
                rows={4}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  marginTop: 10,
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="button button-light"
                onClick={() => setRejectItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button-danger"
                onClick={confirmReject}
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
