import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Seal from '../../components/ui/Seal'
import Icon from '../../components/ui/Icon'

const IMAGES = {
  coding: '/images/kiet/aboutus_club1.jpg',
  innovation: '/images/kiet/aboutus_hackathon.jpg',
  campus: '/images/kiet/aboutus_kiet.jpg',
  toastmasters: '/images/kiet/aboutus_club2.jpg',
  ttl: '/images/kiet/aboutus_ttl.jpg',
}

export default function MyActivities() {
  const { user } = useAuth()
  const { activities } = useData()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  // Sample student projects to display within Activities if on Projects tab
  const [projects] = useState(() => {
    try {
      const saved = localStorage.getItem('kiet_student_projects')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return [
      {
        id: 'proj-1',
        title: 'AgroDrone AI — Crop Pathology Telemetry',
        intro: 'Computer vision pipeline running on edge hexacopters to identify leaf spot disease in real-time.',
        githubUrl: 'https://github.com/kiet-student/agrodrone-ai-telemetry',
        deployedUrl: 'https://agrodrone-telemetry-demo.kiet.edu',
        techStack: ['Python', 'FastAPI', 'PyTorch', 'OpenCV'],
        category: 'Projects',
        status: 'Verified',
      },
      {
        id: 'proj-2',
        title: 'KIET Smart Gate & RFID Telemetry Portal',
        intro: 'High-throughput student entry authentication system processing 4,000+ campus entries per hour.',
        githubUrl: 'https://github.com/kiet-student/smartgate-iot-portal',
        deployedUrl: 'https://smartgate.kietgroup.com',
        techStack: ['React', 'Node.js', 'PostgreSQL'],
        category: 'Projects',
        status: 'Verified',
      },
    ]
  })

  const myActivities = useMemo(
    () =>
      activities.filter(
        a =>
          a.userId === user?.id ||
          a.rollNumber === user?.rollNumber ||
          a.userId === 'stu-demo-23jn1a4533'
      ),
    [activities, user]
  )

  const filteredActivities = useMemo(() => {
    if (activeTab === 'All') return myActivities
    if (activeTab === 'Certifications') return myActivities.filter(a => a.category === 'Certification')
    if (activeTab === 'Hackathons') return myActivities.filter(a => a.category === 'Hackathon')
    if (activeTab === 'Workshops') return myActivities.filter(a => a.category === 'Workshops')
    return myActivities
  }, [myActivities, activeTab])

  const verified = myActivities.filter(a => a.status === 'Verified').length
  const pending = myActivities.filter(a => a.status === 'Pending').length

  const imageFor = (activity) => {
    const key = activity.category?.toLowerCase() || ''
    if (key.includes('hackathon')) return IMAGES.innovation
    if (key.includes('workshop') || key.includes('ai')) return IMAGES.coding
    if (key.includes('toast') || key.includes('speech')) return IMAGES.toastmasters
    return IMAGES.ttl
  }

  return (
    <div className="student-space-page fade-in">
      {/* 1. Hero Banner */}
      <section className="activities-hero-card">
        <div className="activities-hero-copy">
          <span className="activities-hero-badge"><Icon name="student" /> MY SPACE • PARTICIPATION &amp; MERIT</span>
          <h1 className="maven-black">My Activities &amp; Credentials</h1>
          <p>
            Consolidated record of your academic projects, professional certifications, hackathon victories, and campus club participations.
          </p>
        </div>
        <div className="activities-hero-actions">
          <Link to="/student/add" className="btn-add-activity-primary">
            + Add New Activity
          </Link>
          <Link to="/student/projects" className="btn-add-activity-secondary">
            <Icon name="trending-up" /> Open Projects Hub <Icon name="arrow-right" />
          </Link>
          <Link to="/student/internships" className="btn-add-activity-secondary">
            <Icon name="briefcase" /> Open Internships View <Icon name="arrow-right" />
          </Link>
        </div>
      </section>

      {/* 2. KPI Summary Bar */}
      <section className="space-stat-grid">
        <div className="space-stat">
          <span>Total Records</span>
          <strong className="maven-black">{myActivities.length + projects.length}</strong>
          <small>Activities &amp; projects on record</small>
        </div>
        <div className="space-stat">
          <span>Verified Merit</span>
          <strong className="maven-black">{verified}</strong>
          <small>Approved by HOD &amp; Faculty</small>
        </div>
        <div className="space-stat">
          <span>Pending Review</span>
          <strong className="maven-black">{pending}</strong>
          <small>Awaiting evaluation</small>
        </div>
        <div className="space-stat">
          <span>Active Projects</span>
          <strong className="maven-black">{projects.length}</strong>
          <small>Public code repositories</small>
        </div>
      </section>

      {/* 3. Category Tabs */}
      <div className="activities-tab-bar">
        {[
          { id: 'All', label: 'All Activities' },
          { id: 'Projects', label: `Projects (${projects.length})` },
          { id: 'Certifications', label: 'Certifications' },
          { id: 'Hackathons', label: 'Hackathons' },
          { id: 'Workshops', label: 'Workshops' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`activity-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Content Display */}
      {activeTab === 'Projects' ? (
        /* Render Projects with GitHub & Live Demo Links */
        <div className="projects-grid">
          {projects.map(proj => (
            <article key={proj.id} className="project-card">
              <div className="project-card-header">
                <div className="project-header-top">
                  <span className="project-category-badge">{proj.category || 'Project'}</span>
                  <span className="project-status-badge deployed">
                    <Icon name="dot" /> {proj.deployedUrl ? 'Live Deployed' : 'Public Repo'}
                  </span>
                </div>
                <h3 className="project-card-title maven-black">{proj.title}</h3>
                <p className="project-card-intro">{proj.intro}</p>
              </div>

              <div className="project-tech-pills">
                {proj.techStack?.map((t, idx) => (
                  <span key={idx} className="tech-pill">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-card-footer">
                <div className="project-links-group">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-project-link github"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                  {proj.deployedUrl && (
                    <a
                      href={proj.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-project-link live"
                    >
                      <span>Live App <Icon name="trending-up" /></span>
                    </a>
                  )}
                </div>
                <Link to="/student/projects" className="activity-manage-link">
                  Manage Projects <Icon name="arrow-right" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Render Activities / Certifications / Hackathons */
        <section className="activity-list-v2">
          {filteredActivities.map(a => (
            <article className="activity-row-v2" key={a.id}>
              <div className="activity-row-media">
                <img
                  src={imageFor(a)}
                  alt={a.title}
                  onError={e => {
                    e.currentTarget.src = IMAGES.campus
                  }}
                />
              </div>
              <div className="activity-row-main">
                <div className="activity-row-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="activity-category">{a.category}</span>
                    {a.issuer && <span className="activity-issuer-chip">{a.issuer}</span>}
                  </div>
                  <Seal status={a.status} />
                </div>
                <h3 className="maven-black">{a.title}</h3>
                <p>
                  {a.description || 'Student participation recorded in the KIET engagement profile.'}
                </p>
                {a.skills && (
                  <div className="activity-skills-row">
                    {a.skills.map((s, i) => (
                      <span key={i} className="skill-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="activity-row-action">
                <Link to={`/student/activity/${a.id}`}>
                  View Details <span><Icon name="arrow-right" /></span>
                </Link>
              </div>
            </article>
          ))}

          {filteredActivities.length === 0 && (
            <div className="empty-state-v2">
              <strong>No activities found in this filter.</strong>
              <span>Add a participation or certification record to build your student portfolio.</span>
              <div style={{ marginTop: 12 }}>
                <Link to="/student/add" className="space-primary-button">
                  + Add Activity Record
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. Helpful Links Footer */}
      <section className="space-info-grid">
        <div className="space-info-card">
          <img src={IMAGES.innovation} alt="KIET innovation" onError={e => (e.currentTarget.src = IMAGES.campus)} />
          <div>
            <span>KIET PROJECTS &amp; GITHUB</span>
            <h3 className="maven-black">Publish software to your portfolio</h3>
            <p>
              Recruiters evaluate working GitHub code and deployed URLs. Add your full-stack apps and ML models to stand out during campus placements.
            </p>
            <Link to="/student/projects" className="space-card-action-link">
              Open Projects Portfolio <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
        <div className="space-info-card dark">
          <img src={IMAGES.campus} alt="KIET internships" onError={e => (e.currentTarget.src = IMAGES.campus)} />
          <div>
            <span>INDUSTRY INTERNSHIPS</span>
            <h3 className="maven-black">Separate corporate &amp; research cohorts</h3>
            <p>
              Capture Remote vs Offline modes, dates, and domain foundations under the dedicated Internships section.
            </p>
            <Link to="/student/internships" className="space-card-action-link accent">
              View Dedicated Internships <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
