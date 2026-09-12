import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Seal from '../../components/ui/Seal'

const IMAGES = {
  coding: 'https://www.kietgroup.com/uploads/1769937787_spot_Untitled%20design.jpg',
  innovation: 'https://www.kietgroup.com/images/aboutus_club1.jpg',
  campus: 'https://www.kietgroup.com/images/aboutus_kiet.jpg',
}

export default function MyActivities(){
  const { user } = useAuth()
  const { activities } = useData()
  const [filter, setFilter] = useState('All')

  const myActivities = useMemo(
    () => activities.filter(a => a.userId === user?.id || a.rollNumber === user?.rollNumber || a.userId === 'stu-demo-23jn1a4533'),
    [activities, user]
  )

  const filtered = useMemo(() => {
    if (filter === 'All') return myActivities
    return myActivities.filter(a => a.status === filter)
  }, [myActivities, filter])

  const verified = myActivities.filter(a => a.status === 'Verified').length
  const pending = myActivities.filter(a => a.status === 'Pending').length
  const categories = [...new Set(myActivities.map(a => a.category))].length

  const imageFor = (activity) => {
    const key = activity.category?.toLowerCase() || ''
    if (key.includes('intern')) return IMAGES.innovation
    if (key.includes('workshop') || key.includes('ai')) return IMAGES.coding
    return IMAGES.campus
  }

  return (
    <div className="student-space-page">
      <section className="space-hero">
        <div className="space-hero-copy">
          <span className="space-eyebrow">MY SPACE · PARTICIPATION</span>
          <h1>My Activities</h1>
          <p>Keep every campus contribution in one place — from workshops and hackathons to internships and verified participation.</p>
          <div className="space-hero-tags">
            <span>KIET Engage</span><span>Student Record</span><span>Live Status</span>
          </div>
        </div>
        <div className="space-hero-image">
          <img src={IMAGES.coding} alt="KIET students working together" />
          <div className="space-hero-image-overlay" />
          <span>KIET · STUDENT ACTIVITY</span>
        </div>
      </section>

      <section className="space-stat-grid">
        <div className="space-stat"><span>Total Activities</span><strong>{myActivities.length}</strong><small>Submitted in your profile</small></div>
        <div className="space-stat"><span>Verified</span><strong>{verified}</strong><small>Accepted by faculty/admin</small></div>
        <div className="space-stat"><span>Pending</span><strong>{pending}</strong><small>Awaiting verification</small></div>
        <div className="space-stat"><span>Categories</span><strong>{categories}</strong><small>Different participation areas</small></div>
      </section>

      <section className="space-section-head">
        <div><span className="space-kicker">YOUR RECORD</span><h2>Recent participation</h2><p>Review evidence, categories and verification status.</p></div>
        <Link to="/student/add" className="space-primary-button">+ Add Activity</Link>
      </section>

      <section className="activity-toolbar">
        {['All','Verified','Pending'].map(item => (
          <button key={item} className={filter === item ? 'activity-filter active' : 'activity-filter'} onClick={()=>setFilter(item)}>{item}</button>
        ))}
      </section>

      <section className="activity-list-v2">
        {filtered.map(a => (
          <article className="activity-row-v2" key={a.id}>
            <div className="activity-row-media"><img src={imageFor(a)} alt={a.title} /></div>
            <div className="activity-row-main">
              <div className="activity-row-top"><span className="activity-category">{a.category}</span><Seal status={a.status} /></div>
              <h3>{a.title}</h3>
              <p>Student participation recorded in the KIET engagement profile.</p>
            </div>
            <div className="activity-row-action"><Link to={`/student/activity/${a.id}`}>View details <span>→</span></Link></div>
          </article>
        ))}
        {filtered.length === 0 && <div className="empty-state-v2"><strong>No activities in this filter.</strong><span>Add a participation record to start building your profile.</span></div>}
      </section>

      <section className="space-info-grid">
        <div className="space-info-card">
          <img src={IMAGES.innovation} alt="KIET robotics and innovation" />
          <div><span>KIET INNOVATION</span><h3>Build beyond the classroom</h3><p>KIET highlights hands-on learning, innovation projects and technology communities across the campus.</p></div>
        </div>
        <div className="space-info-card dark">
          <img src={IMAGES.campus} alt="KIET campus life" />
          <div><span>KIET ENGAGE</span><h3>Participation becomes a profile</h3><p>Your activities, verification status and achievements are designed to stay connected across the student dashboard.</p></div>
        </div>
      </section>
    </div>
  )
}
