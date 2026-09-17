import React, { useEffect, useMemo, useState } from 'react'
import {
  campuses,
  branchesByCampus,
  sections,
  students,
  years,
  months,
  calcAttendanceStats,
  residenceTypes,
  capstoneTeams,
} from '../../data/academicData'
import { useToast } from '../../components/ui/Toast'
import Icon from '../../components/ui/Icon'

export default function FacultyAttendance() {
  const { showToast } = useToast()
  const [campus, setCampus] = useState('All Campuses')
  const [branch, setBranch] = useState('All Branches')
  const [year, setYear] = useState('All Years')
  const [section, setSection] = useState('All Sections')
  const [residence, setResidence] = useState('All Residence')
  const [team, setTeam] = useState('All Teams')
  const [query, setQuery] = useState('')

  // Local overrides stored under clean KIET key
  const [attendanceOverrides, setAttendanceOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kiet_attendance_register_v1')) || {}
    } catch {
      return {}
    }
  })

  // Selected student for detailed 12-month modal
  const [activeModalStudent, setActiveModalStudent] = useState(null)

  // Branch filter cascade
  const branchOptions = useMemo(() => {
    if (campus === 'All Campuses') {
      return [...new Set(Object.values(branchesByCampus).flat().map((x) => x.code))]
    }
    return branchesByCampus[campus]?.map((x) => x.code) || []
  }, [campus])

  // Filtered rows
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchCampus = campus === 'All Campuses' || s.campus === campus
      const matchBranch = branch === 'All Branches' || s.branch === branch
      const matchYear = year === 'All Years' || s.year === year
      const matchSection = section === 'All Sections' || s.section === section
      const matchResidence = residence === 'All Residence' || s.residence === residence
      const matchTeam =
        team === 'All Teams'
          ? true
          : team === 'Unassigned'
          ? !s.teamId
          : s.teamId === team
      const matchQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(query.toLowerCase())
      return (
        matchCampus &&
        matchBranch &&
        matchYear &&
        matchSection &&
        matchResidence &&
        matchTeam &&
        matchQuery
      )
    })
  }, [campus, branch, year, section, residence, team, query])

  // Helper to get student's active monthly attendance (with overrides)
  const getStudentMonthly = (student) => {
    if (attendanceOverrides[student.rollNumber]) {
      return attendanceOverrides[student.rollNumber]
    }
    return student.monthlyAttendance || []
  }

  // Helper to get student's stats
  const getStudentStats = (student) => {
    const monthly = getStudentMonthly(student)
    return calcAttendanceStats(monthly)
  }

  // Update a student's present days for a specific month
  const handleUpdateMonthAttendance = (rollNumber, monthIdx, newPresentDays) => {
    const student = students.find((s) => s.rollNumber === rollNumber)
    if (!student) return

    const currentMonthly = getStudentMonthly(student)
    const updatedMonthly = currentMonthly.map((m, idx) => {
      if (idx === monthIdx) {
        const working = m.workingDays || 22
        const present = Math.max(0, Math.min(working, Number(newPresentDays)))
        return {
          ...m,
          presentDays: present,
          absentDays: working - present,
        }
      }
      return m
    })

    const nextOverrides = {
      ...attendanceOverrides,
      [rollNumber]: updatedMonthly,
    }

    setAttendanceOverrides(nextOverrides)
    try {
      localStorage.setItem('kiet_attendance_register_v1', JSON.stringify(nextOverrides))
    } catch {}

    if (showToast) {
      showToast(`Attendance updated for ${student.name} (${student.rollNumber})`, 'success')
    }
  }

  // Mark all filtered students present today
  const handleMarkAllPresent = () => {
    const nextOverrides = { ...attendanceOverrides }
    filteredStudents.forEach((student) => {
      const currentMonthly = getStudentMonthly(student)
      const currentMonth = currentMonthly[8] // Sep
      if (currentMonth) {
        const working = currentMonth.workingDays || 22
        const updatedMonthly = currentMonthly.map((m, idx) => {
          if (idx === 8) {
            return {
              ...m,
              presentDays: working,
              absentDays: 0,
            }
          }
          return m
        })
        nextOverrides[student.rollNumber] = updatedMonthly
      }
    })
    setAttendanceOverrides(nextOverrides)
    try {
      localStorage.setItem('kiet_attendance_register_v1', JSON.stringify(nextOverrides))
    } catch {}
    if (showToast) {
      showToast(`Marked all ${filteredStudents.length} students present for current session`, 'success')
    }
  }

  // Overall class averages
  const overallAvg = useMemo(() => {
    if (!filteredStudents.length) return 0
    const total = filteredStudents.reduce((acc, s) => acc + getStudentStats(s).percentage, 0)
    return Number((total / filteredStudents.length).toFixed(1))
  }, [filteredStudents, attendanceOverrides])

  const eligibleCount = useMemo(() => {
    return filteredStudents.filter((s) => getStudentStats(s).percentage >= 75).length
  }, [filteredStudents, attendanceOverrides])

  const shortageCount = filteredStudents.length - eligibleCount
  const dayScholarCount = filteredStudents.filter((s) => s.residence === 'Day Scholar').length
  const hostelerCount = filteredStudents.filter((s) => s.residence === 'Hosteler').length

  return (
    <div className="student-dashboard faculty-view">
      {/* 1. Clean Institutional Header */}
      <div className="faculty-hero-banner" style={{ marginBottom: 20 }}>
        <div className="faculty-header-meta">
          <span className="faculty-governance-tag"><Icon name="faculty" /> FACULTY • ATTENDANCE COMMAND</span>
          <h1 className="faculty-title maven-black">
            Student Attendance Management
          </h1>
          <p className="faculty-subtitle">
            Monitor and record 12-month working-days attendance across KIET campuses. Track Day Scholars vs. Hostelers and Capstone Teams.
          </p>
        </div>
        <div className="faculty-hero-actions">
          <button type="button" className="btn-faculty-broadcast" onClick={handleMarkAllPresent}>
            <span><Icon name="check" /> Mark Section Present Today</span>
          </button>
        </div>
      </div>

      {/* Filter Cascade */}
      <section className="surface-card filter-panel">
        <div className="filter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          <label>
            <span className="filter-label">Campus</span>
            <select
              value={campus}
              onChange={(e) => {
                setCampus(e.target.value)
                setBranch('All Branches')
              }}
            >
              <option>All Campuses</option>
              {campuses.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Branch</span>
            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
              <option>All Branches</option>
              {branchOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Academic Year</span>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>All Years</option>
              {years.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Section</span>
            <select value={section} onChange={(e) => setSection(e.target.value)}>
              <option>All Sections</option>
              {sections.map((x) => (
                <option key={x} value={x}>
                  Section {x}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Residence Type</span>
            <select value={residence} onChange={(e) => setResidence(e.target.value)}>
              <option>All Residence</option>
              {residenceTypes.map((r) => (
                <option key={r} value={r}>
                  {r === 'Hosteler' ? 'Hosteler' : 'Day Scholar'}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Capstone Team</span>
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              <option>All Teams</option>
              {capstoneTeams.map((t) => (
                <option key={t.teamId} value={t.teamId}>
                  {t.teamId}
                </option>
              ))}
              <option value="Unassigned">General Cohort</option>
            </select>
          </label>

          <label className="search-filter-label" style={{ gridColumn: 'span 2' }}>
            <span className="filter-label">Search Student</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name or roll number..."
            />
          </label>
        </div>
      </section>

      {/* Metrics Bar */}
      <div className="faculty-metrics">
        <Metric label="Filtered Students" value={filteredStudents.length} tone="blue" />
        <Metric label="Day Scholars" value={dayScholarCount} tone="teal" />
        <Metric label="Hostelers" value={hostelerCount} tone="purple" />
        <Metric label="Class Average" value={`${overallAvg}%`} tone="purple" />
        <Metric label="Eligible (≥ 75%)" value={eligibleCount} tone="green" />
        <Metric label="Shortage (< 75%)" value={shortageCount} tone="red" />
      </div>

      {/* Register Table */}
      <section className="surface-card faculty-register">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title maven-black">Class Attendance Register</h2>
            <p className="card-subtitle">
              Click "View 12-Mo. Sheet" on any student to inspect or adjust monthly working days and present days.
            </p>
          </div>
          <div className="status-chip">
            <span className="status-pulse" />
            <span>Synced with KIET ERP</span>
          </div>
        </div>

        <div className="attendance-table-container">
          <table className="kiet-data-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Residence</th>
                <th>Campus & Branch</th>
                <th className="text-center">Year & Sec</th>
                <th className="text-center">Total Working</th>
                <th className="text-center">Total Present</th>
                <th className="text-center">Attendance %</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => {
                const sStats = getStudentStats(s)
                return (
                  <tr key={s.id} className="faculty-student-row">
                    <td>
                      <div className="student-profile-cell">
                        <div className="student-table-avatar">
                          {s.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <strong className="student-name">{s.name}</strong>
                          <div className="student-roll">{s.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`residence-pill ${
                          s.residence === 'Hosteler' ? 'hosteler' : 'dayscholar'
                        }`}
                      >
                        {s.residence === 'Hosteler' ? 'Hosteler' : 'Day Scholar'}
                      </span>
                    </td>
                    <td>
                      <strong>{s.campus}</strong>
                      <div className="text-muted">{s.branch}</div>
                    </td>
                    <td className="text-center">
                      <span className="badge-pill">{s.year} - {s.section}</span>
                    </td>
                    <td className="text-center font-medium">{sStats.totalWorking}d</td>
                    <td className="text-center font-medium text-success">{sStats.totalPresent}d</td>
                    <td className="text-center">
                      <strong className="pct-value">{sStats.percentage}%</strong>
                    </td>
                    <td className="text-center">
                      <span className={`status-tag ${sStats.percentage >= 75 ? 'tag-success' : 'tag-warning'}`}>
                        {sStats.percentage >= 75 ? 'Eligible' : 'Shortage'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn-action-view"
                        onClick={() => setActiveModalStudent(s)}
                      >
                        Inspect 12-Mo. Sheet
                      </button>
                    </td>
                  </tr>
                )
              })}

              {!filteredStudents.length && (
                <tr>
                  <td colSpan={9} className="text-center empty-table-cell">
                    No students match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 12-Month Student Inspection Modal */}
      {activeModalStudent && (
        <div className="modal-overlay" onClick={() => setActiveModalStudent(null)}>
          <div className="modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="eyebrow">STUDENT ATTENDANCE SHEET</div>
                <h2 className="modal-title">
                  {activeModalStudent.name} ({activeModalStudent.rollNumber})
                </h2>
                <p className="modal-subtitle">
                  {activeModalStudent.campus} · {activeModalStudent.branch} · {activeModalStudent.year} Sec {activeModalStudent.section} · {activeModalStudent.residence}
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveModalStudent(null)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-body">
              {/* Modal Stats */}
              {(() => {
                const sStats = getStudentStats(activeModalStudent)
                const monthly = getStudentMonthly(activeModalStudent)
                return (
                  <div>
                    <div className="modal-stats-grid">
                      <div className="modal-stat-card">
                        <span>Overall Attendance</span>
                        <strong>{sStats.percentage}%</strong>
                      </div>
                      <div className="modal-stat-card">
                        <span>Total Working Days</span>
                        <strong>{sStats.totalWorking} Days</strong>
                      </div>
                      <div className="modal-stat-card">
                        <span>Total Present</span>
                        <strong className="text-success">{sStats.totalPresent} Days</strong>
                      </div>
                      <div className="modal-stat-card">
                        <span>Total Absent</span>
                        <strong className="text-danger">{sStats.totalAbsent} Days</strong>
                      </div>
                    </div>

                    <h3 className="modal-section-title">12 Months (Jan – Dec) Working vs. Present Days</h3>
                    <div className="modal-months-table-wrap">
                      <table className="kiet-data-table">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th className="text-center">Working Days</th>
                            <th className="text-center">Present Days</th>
                            <th className="text-center">Absent Days</th>
                            <th className="text-center">Percentage</th>
                            <th className="text-center">Quick Adjust</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthly.map((m, idx) => {
                            const pct = m.workingDays > 0 ? Number(((m.presentDays / m.workingDays) * 100).toFixed(1)) : 0
                            return (
                              <tr key={m.month}>
                                <td><strong>{m.month}</strong></td>
                                <td className="text-center">{m.workingDays}</td>
                                <td className="text-center font-medium text-success">{m.presentDays}</td>
                                <td className="text-center font-medium text-danger">{m.absentDays}</td>
                                <td className="text-center"><strong>{pct}%</strong></td>
                                <td className="text-center">
                                  <div className="input-stepper-group">
                                    <button
                                      type="button"
                                      className="btn-step"
                                      onClick={() => handleUpdateMonthAttendance(activeModalStudent.rollNumber, idx, m.presentDays - 1)}
                                      disabled={m.presentDays <= 0}
                                    >
                                      -
                                    </button>
                                    <span className="step-val">{m.presentDays}</span>
                                    <button
                                      type="button"
                                      className="btn-step"
                                      onClick={() => handleUpdateMonthAttendance(activeModalStudent.rollNumber, idx, m.presentDays + 1)}
                                      disabled={m.presentDays >= m.workingDays}
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-light"
                onClick={() => setActiveModalStudent(null)}
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, tone = 'blue' }) {
  return (
    <div className={`faculty-metric metric-tone-${tone}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value maven-black">{value}</strong>
    </div>
  )
}
