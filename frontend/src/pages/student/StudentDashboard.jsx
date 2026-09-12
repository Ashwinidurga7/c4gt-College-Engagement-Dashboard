import React, { useMemo } from 'react'
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
import { getStudentByRoll, calcAttendanceStats } from '../../data/academicData'

const announcements = [
  { title: 'Mid-Semester Examination Schedule Notification (AY 2025-26)', type: 'Academic', time: 'Today', date: 'Sep 12' },
  { title: 'AI & Machine Learning Student Hackathon Registration Open', type: 'Competition', time: 'Today', date: 'Sep 11' },
  { title: 'Fee Payment Counter & Online Portal Active for Even Semester', type: 'Finance', time: 'Yesterday', date: 'Sep 10' },
  { title: 'Campus Placement Drive: Top Tier Product & IT Companies', type: 'Placements', time: '2 days ago', date: 'Sep 08' },
]

const communities = [
  {
    title: 'Global Coding Club (KIET)',
    category: 'TECH COMMUNITY',
    description: 'Competitive programming, open-source projects, and algorithmic development.',
    image: 'https://www.kietgroup.com/uploads/1769937787_spot_Untitled%20design.jpg',
    link: '/student/clubs',
  },
  {
    title: 'KIET Robotics Lab',
    category: 'INNOVATION & ROBOTICS',
    description: 'Student engineering lab building autonomous systems, robotics, and hardware IoT prototypes.',
    image: 'https://www.kietgroup.com/images/aboutus_club1.jpg',
    link: '/student/clubs',
  },
  {
    title: 'KIET Toastmasters Club',
    category: 'LEADERSHIP & SPEECH',
    description: 'International public speaking, debate, and professional communication leadership forum.',
    image: 'https://www.kietgroup.com/images/aboutus_club2.jpg',
    link: '/student/clubs',
  },
  {
    title: 'KIET Sports & Athletics Club',
    category: 'SPORTS & ATHLETICS',
    description: 'Inter-collegiate championships, annual KPL cricket tournaments, and athletics coaching.',
    image: 'https://www.kietgroup.com/images/aboutus_club4.jpg',
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

function Icon({ name }) {
  const paths = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 9h18" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20c.6-3.4 2.5-5 5.5-5s4.9 1.6 5.5 5M14 16c3.2-.7 5.5.8 6.5 4" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="m15.5 8.5 2-2" />
      </>
    ),
    award: (
      <>
        <path d="M8 4h8v5c0 3-1.8 5-4 5s-4-2-4-5z" />
        <path d="M8 7H5c0 3 1.5 4.5 4 4.5M16 7h3c0 3-1.5 4.5-4 4.5M12 14v4M8.5 20h7" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    bus: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M7 18v2M17 18v2M3 10h18" />
      </>
    ),
    rupee: (
      <>
        <line x1="6" y1="4" x2="18" y2="4" />
        <line x1="6" y1="9" x2="18" y2="9" />
        <path d="M6 14h5a4 4 0 0 0 0-8H6" />
        <line x1="6" y1="9" x2="14" y2="20" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10M6 10h10" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { activities: myActivitiesData = [] } = useData()

  // Find detailed student record
  const student = useMemo(() => {
    return getStudentByRoll(user?.rollNumber || user?.email || '23JN1A4533')
  }, [user])

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
          <h1>
            {greeting}, <span>{student?.name || user?.name || 'Student'}</span> 👋
          </h1>
          <p>
            Welcome to your unified academic portal. Track real-time attendance, fee clearances, bus passes, semester SGPA, and co-curricular achievements.
          </p>
          <div className="welcome-meta-pills">
            <span className="meta-pill">
              <strong>Roll No:</strong> {student?.rollNumber || '23JN1A4533'}
            </span>
            <span className="meta-pill">
              <strong>Year & Sec:</strong> {student?.year || '2nd Year'} - Sec {student?.section || 'A'}
            </span>
            <span className="meta-pill">
              <strong>CGPA:</strong> {student?.cgpa || '8.65'}
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
            <strong className="stat-value">{attendanceStats.percentage}%</strong>
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
            <strong className="stat-value">{isFeeClear ? 'Cleared' : `₹${feeBalance.toLocaleString()}`}</strong>
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
            <strong className="stat-value" style={{ fontSize: '1.05rem', marginTop: '4px' }}>
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
            <strong className="stat-value">{latestResult?.sgpa || '8.75'}</strong>
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
            <strong className="stat-value">{myActivities.length}</strong>
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
            <strong className="stat-value">{verifiedActivities.length || 3}</strong>
            <span className="status-badge-inline positive">Verified</span>
          </div>
          <div className="stat-accent" />
        </Link>
      </section>

      {/* 12-Month Attendance Trend Chart */}
      <section className="surface-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">12-Month Attendance Progression (Jan – Dec)</h2>
            <p className="card-subtitle">
              Calculated dynamically: Total Working Days = {attendanceStats.totalWorking}, Present = {attendanceStats.totalPresent} days ({attendanceStats.percentage}%)
            </p>
          </div>
          <Link to="/student/attendance" className="link-button">
            View Monthly Breakdown →
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
            <QuickAction icon="📅" label="12-Mo. Attendance" href="/student/attendance" />
            <QuickAction icon="💳" label="Fee Details" href="/student/fees" />
            <QuickAction icon="🚌" label="Bus Transport" href="/student/transport" />
            <QuickAction icon="📜" label="Semester Results" href="/student/results" />
            <QuickAction icon="📄" label="Resume Builder" href="/student/resume" />
            <QuickAction icon="➕" label="Add Activity" href="/student/add" />
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
        <h2>{title}</h2>
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
      <span className="quick-emoji">{icon}</span>
      <span>{label}</span>
      <span className="quick-arrow">
        <Icon name="arrow" />
      </span>
    </Link>
  )
}
