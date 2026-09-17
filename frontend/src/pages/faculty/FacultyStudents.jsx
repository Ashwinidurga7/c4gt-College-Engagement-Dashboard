import React, { useMemo, useState } from 'react'
import {
  campuses,
  branchesByCampus,
  sections,
  students,
  years,
  residenceTypes,
  capstoneTeams,
} from '../../data/academicData'

export default function FacultyStudents() {
  const [campus, setCampus] = useState('All Campuses')
  const [branch, setBranch] = useState('All Branches')
  const [year, setYear] = useState('All Years')
  const [section, setSection] = useState('All Sections')
  const [residence, setResidence] = useState('All Residence')
  const [team, setTeam] = useState('All Teams')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const branchOptions = useMemo(
    () =>
      campus === 'All Campuses'
        ? [...new Set(Object.values(branchesByCampus).flat().map((b) => b.code))]
        : branchesByCampus[campus].map((b) => b.code),
    [campus]
  )

  const filtered = useMemo(() => {
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
        `${s.name} ${s.rollNumber}`.toLowerCase().includes(query.toLowerCase())

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

  const avg = filtered.length
    ? Math.round(filtered.reduce((a, s) => a + s.attendance, 0) / filtered.length)
    : 0

  const dayScholarCount = filtered.filter((s) => s.residence === 'Day Scholar').length
  const hostelerCount = filtered.filter((s) => s.residence === 'Hosteler').length

  return (
    <div className="student-dashboard faculty-view">
      {/* 1. Clean Institutional Header */}
      <div className="faculty-hero-banner" style={{ marginBottom: 20 }}>
        <div className="faculty-header-meta">
          <span className="faculty-governance-tag">👨‍🏫 FACULTY • STUDENT DIRECTORY</span>
          <h1 className="faculty-title maven-black">
            Students &amp; Academic Overview
          </h1>
          <p className="faculty-subtitle">
            Comprehensive student directory with campus, branch, section, residence status (Day Scholar vs. Hosteler), and Capstone Team tracking.
          </p>
        </div>
        <div className="faculty-hero-actions">
          <div className="overall-kpi-chip" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="chip-icon">🎓</span>
            <div>
              <span className="chip-val maven-black" style={{ color: '#fff' }}>{filtered.length} Students</span>
              <span className="chip-lbl" style={{ color: '#dbeafe' }}>Active Directory</span>
            </div>
          </div>
        </div>
      </div>

      <section className="surface-card filter-panel">
        <div className="filter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <label>
            Campus
            <select
              value={campus}
              onChange={(e) => {
                setCampus(e.target.value)
                setBranch('All Branches')
              }}
            >
              <option>All Campuses</option>
              {campuses.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Branch
            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
              <option>All Branches</option>
              {branchOptions.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>

          <label>
            Year
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>All Years</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>

          <label>
            Section
            <select value={section} onChange={(e) => setSection(e.target.value)}>
              <option>All Sections</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            Residence
            <select value={residence} onChange={(e) => setResidence(e.target.value)}>
              <option>All Residence</option>
              {residenceTypes.map((r) => (
                <option key={r} value={r}>
                  {r === 'Hosteler' ? '🏢 Hosteler' : '🚌 Day Scholar'}
                </option>
              ))}
            </select>
          </label>

          <label>
            Capstone Team
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

          <label className="filter-search" style={{ gridColumn: 'span 2' }}>
            Search student
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or roll number (e.g. 23JN1A4533)..."
            />
          </label>
        </div>
      </section>

      <div className="faculty-metrics">
        <Metric label="Total Students" value={filtered.length} />
        <Metric label="Day Scholars" value={dayScholarCount} />
        <Metric label="Hostelers" value={hostelerCount} />
        <Metric label="Avg attendance" value={`${avg}%`} />
        <Metric
          label="Eligible (≥75%)"
          value={filtered.filter((s) => s.attendance >= 75).length}
        />
        <Metric
          label="Shortage (<75%)"
          value={filtered.filter((s) => s.attendance < 75).length}
        />
      </div>

      <section className="surface-card faculty-register">
        <div className="register-head">
          <div>
            <h2 className="maven-black">Class Register &amp; Capstone Allocation</h2>
            <p>180 Cohort Students across 3 sections with live residence and project assignments.</p>
          </div>
          <span className="live-pill">● LIVE REGISTER</span>
        </div>

        <div className="student-table">
          <div className="student-table-head">
            <span>Student</span>
            <span>Campus / Branch</span>
            <span>Residence</span>
            <span>Team / Role</span>
            <span>Attendance</span>
            <span></span>
          </div>

          {filtered.map((s) => (
            <button
              className="student-table-row"
              key={s.id}
              onClick={() => setSelected(s)}
            >
              <span>
                <strong>{s.name}</strong>
                <small>{s.rollNumber}</small>
              </span>
              <span>
                <strong>{s.campus}</strong>
                <small>
                  {s.branch} · Sec {s.section}
                </small>
              </span>
              <span>
                <span
                  className={`residence-pill ${
                    s.residence === 'Hosteler' ? 'hosteler' : 'dayscholar'
                  }`}
                >
                  {s.residence === 'Hosteler' ? '🏢 Hosteler' : '🚌 Day Scholar'}
                </span>
              </span>
              <span>
                {s.teamId ? (
                  <span className="team-pill-table">
                    <strong>{s.teamId}</strong>
                    <small>{s.teamRole?.split('/')[0]?.trim() || 'Developer'}</small>
                  </span>
                ) : (
                  <small style={{ color: '#64748b' }}>General Cohort</small>
                )}
              </span>
              <span className={s.attendance >= 75 ? 'status-good' : 'status-low'}>
                {s.attendance}%
              </span>
              <span className="view-link">View →</span>
            </button>
          ))}

          {!filtered.length && (
            <div className="empty-state">No students match the selected filters.</div>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="student-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="student-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>
            <span className="eyebrow dark-eyebrow">STUDENT PROFILE</span>
            <h2>{selected.name}</h2>
            <p className="modal-sub">
              {selected.rollNumber} · {selected.campus} · {selected.branch} · {selected.year} · Section {selected.section}
            </p>

            <div className="modal-grid">
              <Detail
                label="Residence"
                value={
                  selected.residence === 'Hosteler'
                    ? `🏢 Hosteler (${selected.hostelBlock || 'Godavari Hostel'})`
                    : `🚌 Day Scholar (${selected.busRoute || 'Bus Route 03'})`
                }
              />
              <Detail
                label="Capstone Team"
                value={
                  selected.teamId
                    ? `${selected.teamId} (${selected.teamRole || 'Member'})`
                    : 'General Cohort'
                }
              />
              <Detail label="Attendance" value={`${selected.attendance}%`} />
              <Detail
                label="Fee Balance"
                value={`₹${(selected.fees?.total - selected.fees?.paid || 0).toLocaleString('en-IN')}`}
              />
              <Detail label="Transport" value={selected.transport?.status || 'Active'} />
              <Detail
                label="Latest SGPA"
                value={selected.results?.at(-1)?.sgpa || selected.cgpa}
              />
            </div>

            <h3 style={{ marginTop: 20 }}>Exam Results History</h3>
            <div className="mini-result-list">
              {(selected.results || []).map((r) => (
                <div key={r.semester}>
                  <span>Semester {r.semester}</span>
                  <strong>{r.sgpa} SGPA</strong>
                  <em>{r.status}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="faculty-metric">
      <span>{label}</span>
      <strong className="maven-black">{value}</strong>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
