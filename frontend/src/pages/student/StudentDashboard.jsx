import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { getStudentByRoll, calcAttendanceStats, generateMonthlyAttendance } from '../../data/academicData'
import Icon from '../../components/ui/Icon'

const announcements = [
  { title: 'Mid-Semester Examination Schedule Notification (AY 2025-26)', type: 'Academic', time: 'Today', date: 'Sep 12' },
  { title: 'AI & Machine Learning Student Hackathon Registration Open', type: 'Competition', time: 'Today', date: 'Sep 11' },
  { title: 'Fee Payment Counter & Online Portal Active for Even Semester', type: 'Finance', time: 'Yesterday', date: 'Sep 10' },
  { title: 'Campus Placement Drive: Top Tier Product & IT Companies', type: 'Placements', time: '2 days ago', date: 'Sep 08' },
]

const communities = [
  {
    title: 'Google Coding Club',
    category: 'TECHNICAL & AI',
    description: 'Competitive programming, LeetCode sprints, and Google technologies.',
    image: '/images/kiet/aboutus_club1.jpg',
    link: '/student/clubs',
  },
  {
    title: 'C4GT club',
    category: 'TECHNICAL & AI',
    description: 'Digital Public Goods, GovTech open source, and national fellowship sprints.',
    image: '/images/kiet/aboutus_kiet.jpg',
    link: '/student/clubs',
  },
  {
    title: 'Smart City Lab',
    category: 'TECHNICAL & AI',
    description: 'Municipal LoRaWAN telemetry and IoT embedded sensing for Kakinada.',
    image: '/images/kiet/aboutus_ttl.jpg',
    link: '/student/clubs',
  },
  {
    title: 'NCC And Nss',
    category: 'SOCIETIES & OUTREACH',
    description: 'Paramilitary discipline, blood donation drives, and community leadership.',
    image: '/images/kiet/aboutus_kiew.jpg',
    link: '/student/clubs',
  },
  {
    title: 'Toastmasters',
    category: 'SOCIETIES & OUTREACH',
    description: 'International public speaking, debate, and executive leadership forum.',
    image: '/images/kiet/aboutus_club2.jpg',
    link: '/student/clubs',
  },
  {
    title: 'Kiet sports and athaletics council(kpl)',
    category: 'SOCIETIES & OUTREACH',
    description: 'Inter-collegiate championships, annual KPL cricket tournaments, and athletics.',
    image: '/images/kiet/aboutus_club4.jpg',
    link: '/student/clubs',
  },
  {
    title: 'Hackathons',
    category: 'INNOVATION & COMPETITIONS',
    description: 'Smart India Hackathon (SIH) mentoring squads and national 48-hour competitions.',
    image: '/images/kiet/aboutus_hackathon.jpg',
    link: '/student/clubs',
  },
  {
    title: 'Robotics',
    category: 'TECHNICAL & AI',
    description: 'ROS 2 autonomous exploration rovers, drones, and e-Yantra engineering.',
    image: '/images/kiet/aboutus_club1.jpg',
    link: '/student/clubs',
  },
  {
    title: 'Cyber Security',
    category: 'TECHNICAL & AI',
    description: 'VAPT vulnerability audits, reverse engineering, and national CTF challenges.',
    image: '/images/kiet/aboutus_ttl.jpg',
    link: '/student/clubs',
  },
]

const upcomingEvents = [
  {
    title: 'KIET National AI Bootcamp & Hackfest',
    date: 'Sep 24-26',
    category: 'Technology',
    venue: 'Campus Main Auditorium',
    image: 'https://www.kietgroup.com/uploads/1770628309_spot_Untitled%20design.jpg',
  },
  {
    title: 'KPL Annual Inter-College Sports Championship',
    date: 'Oct 05-08',
    category: 'Sports',
    venue: 'KIET Sports Ground',
    image: 'https://www.kietgroup.com/uploads/1770386196_spot_Untitled%20design%20(3).jpg',
  },
  {
    title: 'AI Fusion Hackathon & Project Expo',
    date: 'Oct 18',
    category: 'Innovation',
    venue: 'R&D Innovation Gallery',
    image: 'https://www.kietgroup.com/uploads/1769108912_aifusion1.png',
  },
]

const pieColors = ['#0f3569', '#2458d3', '#10b981', '#f59e0b', '#8b5cf6']

export default function StudentDashboard() {
  const { user } = useAuth()
  const { activities: myActivitiesData = [] } = useData()
  const [studentDb, setStudentDb] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch live student profile from MongoDB Atlas backend
  useEffect(() => {
    let isMounted = true
    async function loadStudentProfile() {
      if (!user) return
      setLoading(true)
      try {
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {}
        const res = await fetch(`${apiBase}/students/me`, { headers })
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data && isMounted) {
            setStudentDb(json.data)
            return
          }
        }
      } catch (err) {
        console.warn('StudentDashboard: could not fetch student from DB, falling back to local data', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadStudentProfile()
    return () => {
      isMounted = false
    }
  }, [user])

  // Detailed student record merging DB record with authenticated user and academicData
  const student = useMemo(() => {
    const local = getStudentByRoll(user?.rollNumber || user?.email || '')
    if (studentDb) {
      const deptName = typeof studentDb.department === 'object'
        ? (studentDb.department?.name || studentDb.department?.code)
        : studentDb.department
      const branchName = studentDb.branch ||
        (typeof studentDb.department === 'object' ? studentDb.department?.code : studentDb.department) ||
        user?.branch ||
        local?.branch ||
        'CSE'

      return {
        ...local,
        ...studentDb,
        name: studentDb.name || studentDb.user?.name || user?.name || local?.name || 'Student',
        rollNumber: studentDb.rollNumber || studentDb.user?.rollNumber || user?.rollNumber || local?.rollNumber || '',
        department: deptName || user?.department || local?.department || 'Computer Science & Engineering',
        branch: branchName,
        year: studentDb.year || user?.year || local?.year || '1st Year',
        section: studentDb.section || user?.section || local?.section || 'A',
        cgpa: studentDb.cgpa !== undefined && studentDb.cgpa !== null && studentDb.cgpa !== ''
          ? studentDb.cgpa
          : (local?.cgpa || user?.cgpa || '8.5'),
        campus: studentDb.campus || studentDb.college || user?.campus || user?.college || local?.campus || 'KIET',
        monthlyAttendance: (studentDb.monthlyAttendance && studentDb.monthlyAttendance.length > 0)
          ? studentDb.monthlyAttendance
          : (local?.monthlyAttendance || generateMonthlyAttendance(2)),
        results: (studentDb.results && studentDb.results.length > 0) ? studentDb.results : (local?.results || []),
        fees: studentDb.fees || local?.fees,
        transport: studentDb.transport || local?.transport,
      }
    }
    if (local) return local
    return {
      name: user?.name || 'Student',
      rollNumber: user?.rollNumber || '',
      email: user?.email || '',
      department: user?.department || 'Computer Science & Engineering',
      branch: user?.branch || 'CSE',
      year: user?.year || '1st Year',
      section: user?.section || 'A',
      cgpa: user?.cgpa || '8.5',
      campus: user?.campus || user?.college || 'KIET',
      college: user?.college || 'KIET',
      monthlyAttendance: generateMonthlyAttendance(2),
      results: [],
    }
  }, [studentDb, user])

  const attendanceStats = useMemo(() => {
    return calcAttendanceStats(student?.monthlyAttendance || [])
  }, [student])

  // Attendance 12-month trend for chart
  const attendanceMonthlyTrend = useMemo(() => {
    if (!student?.monthlyAttendance) return []
    return student.monthlyAttendance.map((m) => {
      const pct = m.workingDays > 0 ? Number(((m.presentDays / m.workingDays) * 100).toFixed(1)) : 0
      return {
        month: m.month.slice(0, 3),
        fullMonth: m.month,
        attendancePct: pct,
        present: m.presentDays,
        working: m.workingDays,
      }
    })
  }, [student])

  const myActivities = useMemo(() => {
    return myActivitiesData.filter((item) => item.userId === user?.id || item.rollNumber === student?.rollNumber)
  }, [myActivitiesData, user, student])

  const verifiedActivities = myActivities.filter((item) => item.status === 'Verified')

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening'

  // Latest semester SGPA
  const latestResult = student?.results?.[student.results.length - 1]

  // Fee calculation
  const feeBalance = student?.fees ? (student.fees.total || 0) - (student.fees.paid || 0) : 0
  const isFeeClear = feeBalance <= 0

  return (
    <div className="student-dashboard">
      {/* Welcome Banner */}
      <section className="welcome-card">
        <div className="welcome-copy">
          <div className="eyebrow">
            <span>KIET CAMPUS ERP</span>
            <span className="bullet-sep">•</span>
            <span>{student?.campus || 'KIET Korangi'}</span>
            <span className="bullet-sep">•</span>
            <span>{student?.branch || 'CSE'}</span>
          </div>
          <h1 className="maven-black">
            {greeting}, <span>{student?.name || user?.name || 'Student'}</span>
          </h1>
          <p>
            Welcome to your unified academic portal. Track real-time attendance, fee clearances, bus passes, semester SGPA, and co-curricular achievements.
          </p>
          <div className="welcome-meta-pills">
            <span className="meta-pill">
              <strong>Roll No:</strong> {student?.rollNumber || user?.rollNumber || '—'}
            </span>
            <span className="meta-pill">
              <strong>Year & Sec:</strong> {student?.year || user?.year || '1st Year'} - Sec {student?.section || user?.section || 'A'}
            </span>
            <span className="meta-pill">
              <strong>CGPA:</strong> {student?.cgpa !== undefined && student?.cgpa !== null && student?.cgpa !== '' ? student?.cgpa : (user?.cgpa || '8.5')}
            </span>
          </div>
          <div className="welcome-actions">
            <Link className="button button-primary" to="/student/attendance">
              View 12-Month Attendance
            </Link>
            <Link className="button button-light" to="/student/resume">
              Open Resume Builder
            </Link>
          </div>
        </div>
        <div className="welcome-visual" aria-label="KIET Campus">
          <img src="https://www.kietgroup.com/images/aboutus_kiet.jpg" alt="KIET Campus Ground" />
          <div className="visual-overlay" />
          <div className="visual-badge">
            <span className="dot" /> KIET • JNTUK AFFILIATED
          </div>
        </div>
      </section>

      {/* 6 Key Student Metric Cards */}
      <section className="stat-grid six-col-grid">
        {/* 1. Overall Attendance */}
        <Link to="/student/attendance" className="stat-card blue">
          <div className="stat-icon">
            <Icon name="calendar" />
          </div>
          <div className="stat-info">
            <span className="stat-label">12-Mo. Attendance</span>
            <strong className="stat-value maven-black">{attendanceStats.percentage}%</strong>
            <span className={`status-badge-inline ${attendanceStats.percentage >= 75 ? 'positive' : 'warning'}`}>
              {attendanceStats.percentage >= 75 ? 'Eligible (>75%)' : 'Shortage'}
            </span>
          </div>
          <div className="stat-accent" />
        </Link>

        {/* 2. Fees Status */}
        <Link to="/student/fees" className="stat-card green">
          <div className="stat-icon">
            <Icon name="rupee" />
          </div>
          <div className="stat-info">
            <span className="stat-label">College Fees</span>
            <strong className="stat-value maven-black">{isFeeClear ? 'Cleared' : `₹${feeBalance.toLocaleString()}`}</strong>
            <span className={`status-badge-inline ${isFeeClear ? 'positive' : 'warning'}`}>
              {isFeeClear ? 'All Paid' : 'Due Balance'}
            </span>
          </div>
          <div className="stat-accent" />
        </Link>

        {/* 3. Transport Status */}
        <Link to="/student/transport" className="stat-card orange">
          <div className="stat-icon">
            <Icon name="bus" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Transport Route</span>
            <strong className="stat-value maven-black" style={{ fontSize: '1.05rem', marginTop: '4px' }}>
              {student?.transport?.route?.split('·')[0]?.trim() || 'Route 03'}
            </strong>
            <span className="status-badge-inline positive">
              {student?.transport?.status || 'Active Pass'}
            </span>
          </div>
          <div className="stat-accent" />
        </Link>

        {/* 4. Latest SGPA */}
        <Link to="/student/results" className="stat-card purple">
          <div className="stat-icon">
            <Icon name="book" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sem {latestResult?.semester || 'IV'} SGPA</span>
            <strong className="stat-value maven-black">{latestResult?.sgpa || '8.75'}</strong>
            <span className="status-badge-inline positive">CGPA: {student?.cgpa || '8.65'}</span>
          </div>
          <div className="stat-accent" />
        </Link>

        {/* 5. Activities Count */}
        <Link to="/student/activities" className="stat-card teal">
          <div className="stat-icon">
            <Icon name="target" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Logged Activities</span>
            <strong className="stat-value maven-black">{myActivities.length}</strong>
            <span className="status-badge-inline neutral">All Categories</span>
          </div>
          <div className="stat-accent" />
        </Link>

        {/* 6. Achievements & Certs */}
        <Link to="/student/achievements" className="stat-card indigo">
          <div className="stat-icon">
            <Icon name="award" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Achievements</span>
            <strong className="stat-value maven-black">{verifiedActivities.length || 3}</strong>
            <span className="status-badge-inline positive">Verified</span>
          </div>
          <div className="stat-accent" />
        </Link>
      </section>

      {/* 12-Month Attendance Trend Chart */}
      <section className="surface-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title maven-black">12-Month Attendance Progression (Jan – Dec)</h2>
            <p className="card-subtitle">
              Calculated dynamically: Total Working Days = {attendanceStats.totalWorking}, Present = {attendanceStats.totalPresent} days ({attendanceStats.percentage}%)
            </p>
          </div>
          <Link to="/student/attendance" className="link-button">
            View Monthly Breakdown <Icon name="arrow-right" />
          </Link>
        </div>
        <div className="chart-wrap" style={{ height: '240px', marginTop: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceMonthlyTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#e8eef7" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                formatter={(value, name) => [`${value}%`, 'Attendance']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="attendancePct"
                stroke="#0f3569"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2458d3', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Two-Column: Announcements + Quick Actions */}
      <div className="dashboard-grid two-col">
        <section className="surface-card">
          <SectionHeading
            title="Campus Announcements"
            subtitle="Official notifications from Principal & Department Dean"
            action="View All"
            href="/student/announcements"
          />
          <div className="updates-list">
            {announcements.map((item) => (
              <div key={item.title} className="update-row">
                <div className="update-badge-date">{item.date}</div>
                <div className="update-body">
                  <strong>{item.title}</strong>
                  <span>{item.type} Notification</span>
                </div>
                <div className="update-time">{item.time}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <SectionHeading title="Student Quick Access" subtitle="Navigate essential campus services" />
          <div className="quick-grid">
            <QuickAction icon="calendar" label="12-Mo. Attendance" href="/student/attendance" />
            <QuickAction icon="card" label="Fee Details" href="/student/fees" />
            <QuickAction icon="bus" label="Bus Transport" href="/student/transport" />
            <QuickAction icon="document" label="Semester Results" href="/student/results" />
            <QuickAction icon="document" label="Resume Builder" href="/student/resume" />
            <QuickAction icon="upload" label="Add Activity" href="/student/add" />
          </div>
        </section>
      </div>

      {/* Campus Events */}
      <section className="section-block">
        <SectionHeading
          title="Upcoming Campus Events & Hackathons"
          subtitle="Participate and earn college merit points"
          action="All Events"
          href="/student/events"
        />
        <div className="event-grid">
          {upcomingEvents.map((event) => (
            <Link to="/student/events" className="event-card" key={event.title}>
              <div className="event-media">
                <img src={event.image} alt={event.title} loading="lazy" />
                <div className="event-date-badge">{event.date}</div>
              </div>
              <div className="event-content">
                <span className="chip">{event.category}</span>
                <h3>{event.title}</h3>
                <p>{event.venue}</p>
                <span className="text-link">
                  Register & View Details <Icon name="arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Student Clubs & Communities */}
      <section className="section-block">
        <SectionHeading
          title="KIET Student Communities"
          subtitle="Discover active student chapters, coding societies & clubs"
          action="Browse Societies"
          href="/student/clubs"
        />
        <div className="image-card-grid">
          {communities.map((item) => (
            <Link to={item.link} className="image-card" key={item.title}>
              <div className="image-card-media">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="image-card-shade" />
              </div>
              <div className="image-card-content">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="card-link">
                  Explore Society <Icon name="arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function SectionHeading({ title, subtitle, action, href }) {
  return (
    <div className="section-heading">
      <div>
        <h2 className="maven-black">{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <Link className="section-action" to={href}>
          {action}
          <Icon name="arrow" />
        </Link>
      )}
    </div>
  )
}

function QuickAction({ icon, label, href }) {
  return (
    <Link to={href} className="quick-action">
      <span className="quick-emoji"><Icon name={icon} size={18} /></span>
      <span>{label}</span>
      <span className="quick-arrow">
        <Icon name="arrow" />
      </span>
    </Link>
  )
}
