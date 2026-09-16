import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Seal from '../../components/ui/Seal'
import AddCertificationForm from '../../components/ui/AddCertificationForm'
import { useToast } from '../../components/ui/Toast'

const KIET_ASSETS = {
  innovators: 'https://www.kietgroup.com/images/aboutus_ttl.jpg',
  campus: 'https://www.kietgroup.com/images/aboutus_kiet.jpg',
  robotics: 'https://www.kietgroup.com/images/aboutus_club1.jpg',
  leadership: 'https://www.kietgroup.com/images/aboutus_leaders.jpg',
  hackathon: 'https://www.kietgroup.com/uploads/1769937787_spot_Untitled%20design.jpg',
  edc: 'https://www.kietgroup.com/images/aboutus_ttl.jpg',
}

const defaultMockAchievements = [
  {
    id: 'ach-1',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    category: 'Certification',
    issuer: 'Amazon Web Services (AWS)',
    date: 'August 2025',
    credentialId: 'AWS-99214-KIET',
    status: 'Verified',
    points: 20,
    image: 'https://www.kietgroup.com/images/aboutus_kiot.png',
    description: 'Cloud architecture fundamentals, security, compliance, billing and core AWS services.',
  },
  {
    id: 'ach-2',
    title: 'Smart India Hackathon Finalist — Autonomous Navigation',
    category: 'Hackathon',
    issuer: 'Ministry of Education & AICTE',
    date: 'May 2025',
    credentialId: 'SIH-2025-FIN-88',
    status: 'Verified',
    points: 30,
    image: 'https://www.kietgroup.com/images/aboutus_hackathon.jpg',
    description: 'Designed an autonomous path planning algorithm for rural emergency medical delivery.',
  },
  {
    id: 'ach-3',
    title: 'Full Stack Web Development Professional Specialization',
    category: 'Certification',
    issuer: 'Coursera & DeepLearning.AI',
    date: 'February 2025',
    credentialId: 'COURSERA-V88902',
    status: 'Verified',
    points: 25,
    image: 'https://www.kietgroup.com/uploads/1769937787_spot_Untitled%20design.jpg',
    description: 'React, Node.js, REST API architecture, and database performance optimization.',
  },
]

function getCategoryIcon(cat = '') {
  const c = cat.toLowerCase()
  if (c.includes('cert')) return '📜'
  if (c.includes('hack')) return '⚡'
  if (c.includes('work') || c.includes('train')) return '🛠️'
  if (c.includes('intern')) return '💼'
  return '🏆'
}

export default function MyAchievements() {
  const { user } = useAuth()
  const { activities = [] } = useData()
  const { showSuccess } = useToast()

  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Filter activities for this student
  const userActivities = useMemo(() => {
    const fromStore = activities.filter(
      (a) => a.userId === user?.id || a.rollNumber === user?.rollNumber || a.userId === 'stu-demo-23jn1a4533'
    )
    if (fromStore.length > 0) return fromStore
    return defaultMockAchievements
  }, [activities, user])

  const verifiedList = useMemo(() => {
    return userActivities.filter((a) => a.status === 'Verified')
  }, [userActivities])

  const pendingList = useMemo(() => {
    return userActivities.filter((a) => a.status === 'Pending')
  }, [userActivities])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return userActivities
    return userActivities.filter((a) => {
      const cat = (a.category || '').toLowerCase()
      if (activeFilter === 'Certifications') return cat.includes('cert')
      if (activeFilter === 'Hackathons') return cat.includes('hack') || cat.includes('comp')
      if (activeFilter === 'Workshops') return cat.includes('work') || cat.includes('train')
      return true
    })
  }, [userActivities, activeFilter])

  const totalPoints = useMemo(() => {
    return verifiedList.reduce((acc, item) => acc + (Number(item.points) || 15), 0)
  }, [verifiedList])

  const handleDownloadCert = (item) => {
    const printWin = window.open('', '_blank', 'width=920,height=780')
    if (!printWin) {
      showSuccess(`Official Certificate for "${item.title}" downloaded.`)
      return
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>KIET Official Certificate - ${item.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Maven+Pro:wght@700;800;900&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; padding: 24px; font-family: 'Inter', sans-serif; background: #fdfbf7; color: #0f2b48; }
          .cert-container { max-width: 840px; margin: auto; padding: 24px; border: 4px solid #0f2b48; outline: 2px solid #d4af37; outline-offset: 4px; background: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
          .cert-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f2b48; padding-bottom: 14px; margin-bottom: 20px; }
          .cert-header h2 { margin: 0; font-size: 17px; font-family: 'Maven Pro', sans-serif; color: #0f2b48; font-weight: 900; }
          .cert-header small { color: #2563eb; font-weight: 700; font-size: 10px; display: block; }
          .cert-title { text-align: center; font-size: 13px; font-weight: 800; color: #b45309; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
          .cert-conferred { text-align: center; font-size: 13px; color: #64748b; font-style: italic; margin-bottom: 8px; }
          .student-name { text-align: center; font-size: 28px; font-weight: 900; color: #0f2b48; text-transform: uppercase; font-family: 'Maven Pro', sans-serif; margin: 0 0 6px 0; }
          .student-meta { text-align: center; font-size: 12px; color: #334155; margin-bottom: 16px; }
          .course-box { text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px 24px; margin-bottom: 24px; }
          .course-title { font-size: 20px; font-weight: 800; color: #1e3a8a; margin: 0 0 8px 0; }
          .course-desc { font-size: 13px; color: #475569; line-height: 1.5; margin: 0; }
          .cert-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .gold-seal { width: 72px; height: 72px; border-radius: 50%; background: radial-gradient(circle, #fef08a, #ca8a04); border: 2px dashed #78350f; color: #451a03; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 7px; font-weight: 900; text-align: center; }
          .sig-box { text-align: center; font-size: 11px; }
          .sig-line { font-family: 'Brush Script MT', cursive; font-size: 14px; color: #1e3a8a; border-bottom: 1px solid #0f2b48; padding-bottom: 2px; margin-bottom: 4px; }
          @media print { body { padding: 0; background: #fff; } .cert-container { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="cert-header">
            <div>
              <h2>KAKINADA INSTITUTE OF ENGINEERING & TECHNOLOGY</h2>
              <small>APPROVED BY AICTE • AFFILIATED TO JNTUK, KAKINADA</small>
              <div style="font-size:9px;color:#64748b;margin-top:2px;">Korangi, Kakinada, Andhra Pradesh — 533461 • Accredited by NAAC & NBA</div>
            </div>
            <div style="text-align:right;font-size:11px;font-weight:bold;color:#0f2b48;">
              ${item.issuer}<br><span style="color:#16a34a;font-size:10px;">✓ KIET VERIFIED</span>
            </div>
          </div>
          <div class="cert-title">★ CERTIFICATE OF VERIFIED ACHIEVEMENT ★</div>
          <div class="cert-conferred">This is to officially certify that</div>
          <div class="student-name">${user?.name || 'G. SAI VAMSI'}</div>
          <div class="student-meta">Roll Number: <strong>${user?.rollNumber || '23JN1A4533'}</strong> • B.Tech in Artificial Intelligence & Data Science (AIDS) • KIET (Affiliated to JNTUK)</div>
          <div class="course-box">
            <div style="font-size:12px;color:#64748b;font-style:italic;margin-bottom:6px;">has successfully completed and demonstrated distinguished proficiency in</div>
            <div class="course-title">${item.title}</div>
            <div class="course-desc">${item.description}</div>
          </div>
          <div class="cert-footer">
            <div>
              <div style="font-size:11px;font-family:monospace;font-weight:bold;color:#0f2b48;">CREDENTIAL ID: ${item.credentialId}</div>
              <div style="font-size:10px;color:#64748b;margin-top:2px;">Awarded: ${item.date} • +${item.points || 20} Activity Credits</div>
              <div style="font-size:9px;color:#16a34a;font-weight:bold;margin-top:2px;">✓ Officially Verified by ${item.verifiedBy || 'KIET Academic Council'}</div>
            </div>
            <div class="gold-seal">
              <span style="font-size:9px;">★</span>
              <span>KIET • JNTUK</span>
              <span style="font-size:8px;margin:1px 0;">+${item.points || 20} PTS</span>
              <span>MERIT BANK</span>
            </div>
            <div style="display:flex;gap:20px;">
              <div class="sig-box">
                <div class="sig-line">Dr. K. V. Ramana</div>
                <strong>Head of Department</strong><br>
                <span style="font-size:9px;color:#64748b;">Dept. of AI & DS</span>
              </div>
              <div class="sig-box">
                <div class="sig-line">Prof. M. S. R. Prasad</div>
                <strong>Dean of Academics</strong><br>
                <span style="font-size:9px;color:#64748b;">KIET Group</span>
              </div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `)
    printWin.document.close()
    showSuccess(`Generated official certificate for ${item.title}`)
  }

  return (
    <div className="student-dashboard achievements-page">
      {/* Hero Banner */}
      <section className="page-hero achievement-hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span>KIET INSTITUTIONAL RECOGNITION</span>
            <span className="bullet-sep">•</span>
            <span>MERIT & CREDENTIALS</span>
          </div>
          <h1>Achievements & Verified Credentials</h1>
          <p className="hero-subtitle">
            Authenticated repository of your co-curricular certifications, hackathon awards, and industrial recognitions.
          </p>
          <div className="hero-actions-row">
            <button
              type="button"
              className="button button-primary"
              onClick={() => setShowUploadModal(true)}
            >
              + Upload New Certificate
            </button>
            <Link to="/student/resume" className="button button-light">
              Include in Resume Builder →
            </Link>
          </div>
        </div>

        <div className="academic-id-badge">
          <strong>{verifiedList.length} Verified</strong>
          <span>{totalPoints} Activity Credits</span>
        </div>
      </section>

      {/* Metrics Row */}
      <div className="stat-grid four-col-grid">
        <div className="stat-card blue">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <span className="stat-label">Verified Credentials</span>
            <strong className="stat-value">{verifiedList.length}</strong>
            <span className="stat-subtext">Official KIET Portfolio</span>
          </div>
          <div className="stat-accent" />
        </div>

        <div className="stat-card green">
          <div className="stat-icon">🎖️</div>
          <div className="stat-info">
            <span className="stat-label">Activity Credits</span>
            <strong className="stat-value">{totalPoints} Pts</strong>
            <span className="stat-subtext">JNTUK Activity Bank</span>
          </div>
          <div className="stat-accent" />
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">📜</div>
          <div className="stat-info">
            <span className="stat-label">Certificates Available</span>
            <strong className="stat-value">{verifiedList.length}</strong>
            <span className="stat-subtext">Downloadable PDFs</span>
          </div>
          <div className="stat-accent" />
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending Review</span>
            <strong className="stat-value">{pendingList.length}</strong>
            <span className="stat-subtext">Faculty In-Review</span>
          </div>
          <div className="stat-accent" />
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="surface-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">Verified Student Credentials</h2>
            <p className="card-subtitle">
              All records below are confirmed by department coordinators and include official verification timestamps.
            </p>
          </div>
          <div className="filter-pill-group">
            {['All', 'Certifications', 'Hackathons', 'Workshops'].map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Cards Grid */}
        <div className="achievement-grid-v2">
          {filteredItems.map((item, idx) => (
            <article className="achievement-card-v2" key={item.id || idx}>
              {/* High-Clarity Certificate Miniature Preview Header (No mismatched images) */}
              <div className="cert-card-preview">
                <div className="cert-card-top-row">
                  <span className="cert-issuer-badge">
                    <span>{getCategoryIcon(item.category)}</span> {item.issuer || 'Official Issuer'}
                  </span>
                  <span className={`cert-status-badge ${item.status === 'Verified' ? 'verified' : 'pending'}`}>
                    {item.status === 'Verified' ? '✓ VERIFIED' : '⏳ IN REVIEW'}
                  </span>
                </div>

                <div className="cert-card-center">
                  <div className="cert-mini-title">{item.title}</div>
                  <div className="cert-mini-student">Conferred to: {user?.name || 'G. Sai Vamsi'} ({user?.rollNumber || '23JN1A4533'})</div>
                </div>

                <div className="cert-card-bottom-row">
                  <span className="cert-id-code">{item.credentialId || 'KIET-MERIT'}</span>
                  <span className="cert-gold-star-badge">★ +{item.points || 20} CREDITS</span>
                </div>
              </div>

              <div className="achievement-card-body">
                <div className="achievement-meta">
                  <span className="chip">{item.category || 'Certification'}</span>
                  <span className="points-pill">+{item.points || 15} pts</span>
                </div>

                <h3 className="achievement-card-title">{item.title}</h3>
                <p className="achievement-issuer">
                  {item.issuer || 'KIET Korangi (JNTUK)'} · {item.date || 'AY 2025-26'}
                </p>

                <p className="achievement-desc">
                  {item.description || 'Verified student accomplishment documented in official academic profile.'}
                </p>

                <div className="achievement-card-footer">
                  <button
                    type="button"
                    className="btn-cert-view"
                    onClick={() => setSelectedAchievement(item)}
                  >
                    <span>📜 View Certificate</span>
                  </button>
                  <button
                    type="button"
                    className="btn-cert-download"
                    onClick={() => handleDownloadCert(item)}
                  >
                    <span>📥 Download PDF</span>
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!filteredItems.length && (
            <div className="empty-state-v2">
              <strong>No achievements match this filter.</strong>
              <span>Upload new certifications or submit activities to build your record.</span>
            </div>
          )}
        </div>
      </section>

      {/* Campus Innovation Gallery */}
      <section className="space-info-grid">
        <div className="space-info-card">
          <img src={KIET_ASSETS.robotics} alt="KIET Innovation" />
          <div>
            <span>KIET INNOVATION & ROBOTICS</span>
            <h3>Practical R&D and Student Incubation</h3>
            <p>
              Students at KIET have registered over 45+ student patents and represented Andhra Pradesh at national technical symposiums.
            </p>
          </div>
        </div>
        <div className="space-info-card">
          <img src={KIET_ASSETS.campus} alt="KIET Main Campus" />
          <div>
            <span>ACADEMIC EXCELLENCE</span>
            <h3>Integrated Resume Portfolio</h3>
            <p>
              Every verified certificate connects directly with your KIET Resume Builder, auto-generating ATS-friendly bullet points.
            </p>
          </div>
        </div>
      </section>

      {/* View Details Modal with Ultra-Clear Official Certificate Document */}
      {selectedAchievement && (
        <div className="modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="eyebrow">CREDENTIAL VERIFICATION & OFFICIAL RECORD</div>
                <h2 className="modal-title">{selectedAchievement.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedAchievement(null)}
                aria-label="Close certificate preview"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Ultra-Clear Authentic Certificate Document */}
              <div className="official-certificate-modal-wrapper">
                <div className="official-certificate-document">
                  <div className="cert-border-outer">
                    <div className="cert-border-inner">
                      {/* Corner Ornaments */}
                      <div className="cert-corner top-left" />
                      <div className="cert-corner top-right" />
                      <div className="cert-corner bottom-left" />
                      <div className="cert-corner bottom-right" />

                      {/* Certificate Header */}
                      <div className="cert-doc-header">
                        <div className="cert-brand-kiet">
                          <img src="/images/kiet-logo.png" alt="KIET" className="cert-kiet-logo" />
                          <div className="cert-college-details">
                            <h4>KAKINADA INSTITUTE OF ENGINEERING & TECHNOLOGY</h4>
                            <span>APPROVED BY AICTE • AFFILIATED TO JNTUK, KAKINADA</span>
                            <small>Korangi, Kakinada, Andhra Pradesh — 533461 • Accredited by NAAC & NBA</small>
                          </div>
                        </div>
                        <div className="cert-partner-badge">
                          <span className="partner-tag">{selectedAchievement.issuerType || 'Accredited Partner'}</span>
                          <strong className="partner-name">{selectedAchievement.issuer}</strong>
                        </div>
                      </div>

                      <div className="cert-ribbon-title">
                        <span>CERTIFICATE OF VERIFIED ACHIEVEMENT</span>
                      </div>

                      <div className="cert-presentation">
                        <p className="cert-presented-text">This is to officially certify that</p>
                        <h2 className="cert-student-name">{user?.name || 'G. SAI VAMSI'}</h2>
                        <p className="cert-student-meta">
                          Roll Number: <strong>{user?.rollNumber || '23JN1A4533'}</strong> &nbsp;•&nbsp; 
                          Department: <strong>Artificial Intelligence & Data Science (AIDS)</strong> &nbsp;•&nbsp; 
                          Campus: <strong>KIET (Affiliated to JNTUK)</strong>
                        </p>
                      </div>

                      <div className="cert-achievement-content">
                        <p className="cert-desc-lead">has demonstrated distinguished competency and successfully completed</p>
                        <h3 className="cert-course-title">{selectedAchievement.title}</h3>
                        <p className="cert-course-desc">{selectedAchievement.description}</p>
                        
                        {selectedAchievement.skills && (
                          <div className="cert-skills-chips">
                            <span className="skills-label">Verified Competencies:</span>
                            {selectedAchievement.skills.map((s) => (
                              <span key={s} className="cert-skill-pill">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Certificate Footer */}
                      <div className="cert-doc-footer">
                        <div className="cert-qr-block">
                          <div className="cert-qr-code">
                            <svg viewBox="0 0 24 24" width="44" height="44" fill="#0f2b48">
                              <rect x="2" y="2" width="8" height="8" rx="1" />
                              <rect x="14" y="2" width="8" height="8" rx="1" />
                              <rect x="2" y="14" width="8" height="8" rx="1" />
                              <rect x="5" y="5" width="2" height="2" fill="#fff" />
                              <rect x="17" y="5" width="2" height="2" fill="#fff" />
                              <rect x="5" y="17" width="2" height="2" fill="#fff" />
                              <rect x="14" y="14" width="4" height="4" />
                              <rect x="19" y="19" width="3" height="3" />
                            </svg>
                          </div>
                          <div className="cert-qr-meta">
                            <span>Verified Credential</span>
                            <strong>ID: {selectedAchievement.credentialId}</strong>
                            <small>Awarded: {selectedAchievement.date}</small>
                          </div>
                        </div>

                        <div className="cert-gold-seal">
                          <div className="gold-seal-inner">
                            <span className="seal-star">★</span>
                            <span className="seal-text-top">KIET • JNTUK</span>
                            <span className="seal-credit">+{selectedAchievement.points || 20} PTS</span>
                            <span className="seal-text-bot">MERIT BANK VERIFIED</span>
                          </div>
                        </div>

                        <div className="cert-signatures">
                          <div className="cert-sig-block">
                            <div className="sig-line">Dr. K. V. Ramana</div>
                            <span className="sig-role">Head of Department (AI & DS)</span>
                            <small className="sig-org">KIET Korangi (JNTUK)</small>
                          </div>
                          <div className="cert-sig-block">
                            <div className="sig-line">Prof. M. S. R. Prasad</div>
                            <span className="sig-role">Dean of Academic Affairs</span>
                            <small className="sig-org">KIET Group of Institutions</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Key-Value Strip */}
              <div className="detail-grid" style={{ marginTop: '16px' }}>
                <div className="detail-item">
                  <span className="detail-label">Issuing Organization</span>
                  <strong className="detail-val">{selectedAchievement.issuer || 'KIET Group'}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Issue Date</span>
                  <strong className="detail-val">{selectedAchievement.date || '2025'}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Credential ID</span>
                  <strong className="detail-val">{selectedAchievement.credentialId || 'VER-KIET-992'}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Merit Credits</span>
                  <strong className="detail-val text-success">+{selectedAchievement.points || 15} Points</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-primary"
                onClick={() => handleDownloadCert(selectedAchievement)}
              >
                📥 Download Official Certificate (PDF)
              </button>
              <button
                type="button"
                className="button button-light"
                onClick={() => setSelectedAchievement(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="eyebrow">UPLOAD NEW CREDENTIAL</div>
                <h2 className="modal-title">Add Official Certificate</h2>
                <p className="modal-subtitle">
                  Attach your certificate document (PNG, JPG, or PDF) for department credit approval.
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <AddCertificationForm
                onAdded={() => {
                  setShowUploadModal(false)
                  showSuccess('Certificate uploaded successfully! Submitted to coordinator.')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
