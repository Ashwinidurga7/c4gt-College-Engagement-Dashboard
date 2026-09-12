import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { getStudentByRoll, calcAttendanceStats, months } from '../../data/academicData'

// Helper to generate day-by-day status for a specific month
function generateMonthDays(monthIndex, workingDays, presentDays, absentDays, year = 2026) {
  // Days in month
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const days = []

  // Track absent days assigned
  let absentsLeft = absentDays

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthIndex, day)
    const dayOfWeek = dateObj.getDay() // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0) {
      days.push({ day, dayOfWeek: 'Sun', status: 'Weekend', label: 'Sunday' })
    } else if (dayOfWeek === 6 && (day > 7 && day <= 14)) {
      // 2nd Saturday is holiday in Indian colleges
      days.push({ day, dayOfWeek: 'Sat', status: 'Holiday', label: '2nd Saturday' })
    } else if (day === 15 && monthIndex === 7) {
      days.push({ day, dayOfWeek: 'Fri', status: 'Holiday', label: 'Independence Day' })
    } else if (day === 26 && monthIndex === 0) {
      days.push({ day, dayOfWeek: 'Mon', status: 'Holiday', label: 'Republic Day' })
    } else if (day === 2 && monthIndex === 9) {
      days.push({ day, dayOfWeek: 'Fri', status: 'Holiday', label: 'Gandhi Jayanti' })
    } else {
      // Working day: assign absent days deterministically
      const isAbsent = absentsLeft > 0 && ((day * 7 + monthIndex * 3) % 9 === 0 || day === 12 || day === 21)
      if (isAbsent && absentsLeft > 0) {
        absentsLeft--
        days.push({ day, dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek], status: 'Absent', label: 'Absent' })
      } else {
        days.push({ day, dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek], status: 'Present', label: 'Present' })
      }
    }
  }

  return days
}

export default function StudentAttendance() {
  const { user } = useAuth()
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(8) // Default to September (index 8)

  const student = useMemo(() => {
    return getStudentByRoll(user?.rollNumber || user?.email || '23JN1A4533')
  }, [user])

  // Get 12-month data
  const monthlyList = useMemo(() => {
    return student?.monthlyAttendance || []
  }, [student])

  // Calculate overall stats dynamically
  const stats = useMemo(() => {
    return calcAttendanceStats(monthlyList)
  }, [monthlyList])

  // Selected month data
  const activeMonthData = useMemo(() => {
    return monthlyList[selectedMonthIdx] || monthlyList[0] || { month: 'September', workingDays: 23, presentDays: 21, absentDays: 2 }
  }, [monthlyList, selectedMonthIdx])

  const activeMonthPct = useMemo(() => {
    if (!activeMonthData.workingDays) return 0
    return Number(((activeMonthData.presentDays / activeMonthData.workingDays) * 100).toFixed(1))
  }, [activeMonthData])

  // Calendar days for active month
  const calendarDays = useMemo(() => {
    return generateMonthDays(
      selectedMonthIdx,
      activeMonthData.workingDays,
      activeMonthData.presentDays,
      activeMonthData.absentDays
    )
  }, [selectedMonthIdx, activeMonthData])

  // Chart data formatting
  const chartData = useMemo(() => {
    return monthlyList.map((m) => ({
      month: m.month.slice(0, 3),
      fullName: m.month,
      'Working Days': m.workingDays,
      'Present Days': m.presentDays,
      'Absent Days': m.absentDays,
      pct: m.workingDays > 0 ? Number(((m.presentDays / m.workingDays) * 100).toFixed(1)) : 0,
    }))
  }, [monthlyList])

  return (
    <div className="student-dashboard attendance-view">
      {/* Student Banner */}
      <section className="page-hero attendance-hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span>KIET ACADEMIC ERP</span>
            <span className="bullet-sep">•</span>
            <span>ANNUAL ATTENDANCE REGISTER</span>
          </div>
          <h1>12-Month Working-Days Attendance</h1>
          <p className="hero-subtitle">
            <strong>{student?.name || user?.name || 'Student'}</strong> · Roll No: <strong>{student?.rollNumber || '23JN1A4533'}</strong> · {student?.branch || 'CSE'} · {student?.campus || 'KIET Korangi'}
          </p>
        </div>
        <div className="attendance-gauge-card">
          <div className="gauge-value">{stats.percentage}%</div>
          <div className="gauge-label">Cumulative Annual</div>
          <span className={`gauge-badge ${stats.percentage >= 75 ? 'eligible' : 'shortage'}`}>
            {stats.percentage >= 75 ? 'Eligible for Exams (>75%)' : 'Attendance Shortage (<75%)'}
          </span>
        </div>
      </section>

      {/* 4 Summary Cards */}
      <section className="stat-grid four-col-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Overall Attendance</span>
            <strong className="stat-value">{stats.percentage}%</strong>
            <span className="stat-subtext">Dynamic Annual Calculation</span>
          </div>
          <div className="stat-accent" />
        </div>

        <div className="stat-card indigo">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-label">Total Working Days</span>
            <strong className="stat-value">{stats.totalWorking} Days</strong>
            <span className="stat-subtext">Jan – Dec Academic Cycle</span>
          </div>
          <div className="stat-accent" />
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Total Present Days</span>
            <strong className="stat-value">{stats.totalPresent} Days</strong>
            <span className="stat-subtext">Verified Classroom Sessions</span>
          </div>
          <div className="stat-accent" />
        </div>

        <div className="stat-card red">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <span className="stat-label">Total Absent Days</span>
            <strong className="stat-value">{stats.totalAbsent} Days</strong>
            <span className="stat-subtext">Leaves & Absences</span>
          </div>
          <div className="stat-accent" />
        </div>
      </section>

      {/* 12-Month Bar Chart */}
      <section className="surface-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">12-Month Working vs. Present Days Comparison</h2>
            <p className="card-subtitle">
              Interactive distribution from January to December. Click any month below to inspect day-by-day calendar logs.
            </p>
          </div>
          <div className="status-chip">
            <span className="status-pulse" />
            <span>Real-time Verified</span>
          </div>
        </div>

        <div className="chart-wrap" style={{ height: '300px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid stroke="#e8eef7" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 26]} tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val, name, item) => [
                  `${val} days (${name === 'Present Days' ? item.payload.pct + '%' : ''})`,
                  name,
                ]}
                labelFormatter={(label, items) => `Month: ${items?.[0]?.payload?.fullName || label}`}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
              <Bar dataKey="Working Days" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="Present Days" fill="#0f3569" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 12-Month Interactive Month Selector & Table Breakdown */}
      <section className="surface-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">12-Month Academic Breakdown (Jan – Dec)</h2>
            <p className="card-subtitle">
              Click a month tab to view its day-by-day calendar attendance below.
            </p>
          </div>
        </div>

        {/* Month Pills */}
        <div className="month-pill-selector">
          {months.map((m, idx) => (
            <button
              key={m}
              type="button"
              className={`month-pill ${selectedMonthIdx === idx ? 'active' : ''}`}
              onClick={() => setSelectedMonthIdx(idx)}
            >
              <span className="pill-abbr">{m.slice(0, 3)}</span>
              <span className="pill-pct">
                {monthlyList[idx]?.workingDays
                  ? Math.round((monthlyList[idx].presentDays / monthlyList[idx].workingDays) * 100) + '%'
                  : '0%'}
              </span>
            </button>
          ))}
        </div>

        {/* 12-Month Data Table */}
        <div className="attendance-table-container">
          <table className="kiet-data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="text-center">Working Days</th>
                <th className="text-center">Present Days</th>
                <th className="text-center">Absent Days</th>
                <th className="text-center">Percentage</th>
                <th>Progress</th>
                <th className="text-center">Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {monthlyList.map((m, idx) => {
                const pct = m.workingDays > 0 ? Number(((m.presentDays / m.workingDays) * 100).toFixed(1)) : 0
                const isSelected = selectedMonthIdx === idx
                return (
                  <tr
                    key={m.month}
                    className={`table-row-selectable ${isSelected ? 'row-highlighted' : ''}`}
                    onClick={() => setSelectedMonthIdx(idx)}
                  >
                    <td>
                      <strong className="month-name">{m.month}</strong>
                      {isSelected && <span className="active-dot-indicator">• Selected</span>}
                    </td>
                    <td className="text-center">{m.workingDays}</td>
                    <td className="text-center font-medium text-success">{m.presentDays}</td>
                    <td className="text-center font-medium text-danger">{m.absentDays}</td>
                    <td className="text-center">
                      <strong className="pct-value">{pct}%</strong>
                    </td>
                    <td style={{ minWidth: '130px' }}>
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${pct >= 85 ? 'fill-high' : pct >= 75 ? 'fill-mid' : 'fill-low'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`status-tag ${pct >= 75 ? 'tag-success' : 'tag-warning'}`}>
                        {pct >= 85 ? 'Excellent' : pct >= 75 ? 'Eligible' : 'Shortage'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className={`btn-select-month ${isSelected ? 'btn-selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMonthIdx(idx)
                        }}
                      >
                        {isSelected ? 'Viewing Calendar' : 'View Calendar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Day-by-Day Interactive Calendar View for Selected Month */}
      <section className="surface-card calendar-section">
        <div className="card-header-flex">
          <div>
            <div className="kicker-sub">DETAILED DAY-WISE REGISTER</div>
            <h2 className="card-title">
              {activeMonthData.month} 2026 Daily Attendance Sheet
            </h2>
            <p className="card-subtitle">
              Working Days: <strong>{activeMonthData.workingDays}</strong> · Present: <strong>{activeMonthData.presentDays}</strong> · Absent: <strong>{activeMonthData.absentDays}</strong> · Attendance: <strong>{activeMonthPct}%</strong>
            </p>
          </div>

          {/* Calendar Legend */}
          <div className="calendar-legend">
            <span className="legend-item">
              <span className="legend-dot dot-present" /> Present
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-absent" /> Absent
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-holiday" /> Holiday
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-weekend" /> Weekend
            </span>
          </div>
        </div>

        {/* Calendar Day Grid */}
        <div className="calendar-day-grid">
          {calendarDays.map((item) => (
            <div
              key={item.day}
              className={`calendar-day-card day-status-${item.status.toLowerCase()}`}
              title={`${activeMonthData.month} ${item.day} (${item.dayOfWeek}): ${item.label}`}
            >
              <div className="day-header">
                <span className="day-number">{item.day}</span>
                <span className="day-week">{item.dayOfWeek}</span>
              </div>
              <div className="day-status-pill">
                {item.status === 'Present' && '✓ Present'}
                {item.status === 'Absent' && '✕ Absent'}
                {item.status === 'Holiday' && '★ Holiday'}
                {item.status === 'Weekend' && '— Off'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
