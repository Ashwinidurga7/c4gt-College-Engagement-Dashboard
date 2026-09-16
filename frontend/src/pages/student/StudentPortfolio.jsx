import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getStudentByRoll, calcAttendanceStats } from '../../data/academicData'

const cards = [
  ['Attendance', '12-Month working-days attendance & daily calendar', '/student/attendance', '01'],
  ['Academic updates', 'Fee accounts, bus pass logistics and exam results', '/student/academics', '02'],
  ['My activities', 'Internships, technical events and campus participation', '/student/activities', '03'],
  ['Resume Studio', 'Edit Durga Prasad template & preview 6 styles', '/student/resume', '04'],
  ['Achievements', 'Verified credentials, certificates and merit points', '/student/achievements', '05'],
  ['Analytics', 'Track your comprehensive college journey', '/student/analytics', '06'],
]

const image = 'https://www.kietgroup.com/images/aboutus_kiet.jpg'

export default function StudentPortfolio() {
  const { user } = useAuth()
  const s = useMemo(() => {
    return getStudentByRoll(user?.rollNumber || user?.email || '23JN1A4533')
  }, [user])

  const attendanceStats = useMemo(() => {
    return calcAttendanceStats(s?.monthlyAttendance || [])
  }, [s])

  return (
    <div className="student-dashboard">
      <section className="portfolio-hero premium-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span>KIET STUDENT PORTFOLIO</span>
            <span className="bullet-sep">•</span>
            <span>AY 2025–26</span>
          </div>
          <h1 className="maven-black">Everything important to your college life, together.</h1>
          <p className="hero-meta">
            {s.name} <b>•</b> {s.rollNumber} <b>•</b> {s.branch} <b>•</b> {s.year} <b>•</b> {s.campus}
          </p>
          <div className="hero-actions">
            <Link to="/student/academics" className="button button-light">
              View academic record
            </Link>
            <Link to="/student/resume" className="hero-text-link">
              Edit resume studio →
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={image} alt="KIET campus" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div className="hero-image-caption">
            <span>KIET Group of Institutions</span>
            <small>Korangi • Kakinada (Affiliated to JNTUK)</small>
          </div>
        </div>
      </section>

      <div className="portfolio-welcome">
        <div>
          <span className="eyebrow dark-eyebrow">YOUR WORKSPACE</span>
          <h2 className="maven-black">Student services</h2>
          <p>Quick access to the academic and co-curricular services you use most.</p>
        </div>
        <div className="student-identity">
          <span>12-Mo. Attendance</span>
          <strong className="maven-black">{attendanceStats.percentage}%</strong>
          <small className={attendanceStats.percentage >= 75 ? 'text-success' : 'text-danger'}>
            {attendanceStats.percentage >= 75 ? 'Eligible for examinations' : 'Attendance shortage'}
          </small>
        </div>
      </div>

      <div className="portfolio-grid modern-grid">
        {cards.map(([t, d, to, n]) => (
          <Link to={to} className="portfolio-card modern-card" key={t}>
            <span className="card-number">{n}</span>
            <div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
            <span className="portfolio-arrow">
              Open <b>→</b>
            </span>
          </Link>
        ))}
      </div>

      <section className="campus-strip">
        <div>
          <span className="eyebrow dark-eyebrow">CAMPUS LIFE</span>
          <h2 className="maven-black">Stay involved without losing track of academics.</h2>
          <p>Your technical events, internships, hackathons, clubs and achievements can be recorded under My Activities.</p>
        </div>
        <Link to="/student/activities" className="button button-primary">
          Open My Activities
        </Link>
      </section>
    </div>
  )
}
