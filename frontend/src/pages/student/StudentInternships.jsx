import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Seal from '../../components/ui/Seal'

const DEFAULT_INTERNSHIPS = [
  {
    id: 'intern-1',
    company: 'Amazon Web Services (AWS Academy & EduSkills)',
    role: 'Cloud Architecture & DevOps Intern',
    kind: 'Corporate Virtual Apprenticeship',
    mode: 'Remote',
    startDate: '01 Jun 2025',
    endDate: '31 Aug 2025',
    duration: '3 Months',
    technicalBasis: 'Based on AWS Well-Architected Framework, Serverless Microservices (Lambda, API Gateway), and CloudFormation Infrastructure-as-Code.',
    stipend: '₹18,000 / month',
    mentor: 'R. K. Verma (Senior Cloud Solutions Architect, AWS)',
    status: 'Verified',
    credentialId: 'AWS-INTERN-2025-4491',
    summary: 'Constructed multi-region failover infrastructure with zero downtime CI/CD deployment pipelines using GitHub Actions and AWS ECS Fargate.',
    deliverables: [
      'Engineered auto-scaling multi-tier VPC network with private subnets',
      'Deployed serverless telemetry aggregation microservices',
      'Completed AWS Academy Cloud Foundations & Architecting cohorts',
    ],
  },
  {
    id: 'intern-2',
    company: 'Kakinada Smart City Corporation Limited',
    role: 'Municipal IoT & Embedded Systems Intern',
    kind: 'Public Sector Technical Internship',
    mode: 'Offline',
    startDate: '15 Dec 2024',
    endDate: '15 Mar 2025',
    duration: '3 Months',
    technicalBasis: 'Based on low-power LoRaWAN sensor networks, STM32 microcontroller firmware, and municipal drainage overflow early-warning telemetry.',
    stipend: '₹12,000 / month',
    mentor: 'Dr. Ch. Rambabu (Director, KIET Smart City Lab)',
    status: 'Verified',
    credentialId: 'KSCCL-IOT-2025-081',
    summary: 'Deployed physical telemetry nodes across 12 coastal storm-water channels in Kakinada to transmit real-time water-level telemetry to the Command and Control Centre.',
    deliverables: [
      'Calibrated ultrasonic water level sensors with 99.2% uptime',
      'Developed MQTT gateway forwarder for municipal command dashboard',
      'Participated in field trials during coastal monsoon telemetry testbed',
    ],
  },
  {
    id: 'intern-3',
    company: 'Salesforce India (AICTE Supported Cohort)',
    role: 'Salesforce Platform & Apex Developer Intern',
    kind: 'Industry-Academia Virtual Internship',
    mode: 'Remote',
    startDate: '01 Sep 2024',
    endDate: '30 Nov 2024',
    duration: '3 Months',
    technicalBasis: 'Based on Salesforce CRM architecture, Lightning Web Components (LWC), Apex Triggers, and enterprise SOQL database optimization.',
    stipend: 'Sponsored EduSkills Grant + Badge',
    mentor: 'P. Sandeep (Salesforce Trailhead Mentor)',
    status: 'Verified',
    credentialId: 'SFDC-EDU-2024-9921',
    summary: 'Earned Salesforce Developer Superbadge and architected a custom university grievance dispatch automation system with automated SLA alerts.',
    deliverables: [
      'Developed 8 custom Lightning Web Components (LWC)',
      'Constructed asynchronous batch Apex handlers processing 10k records',
      'Secured 100% test class coverage across all deployment packages',
    ],
  },
  {
    id: 'intern-4',
    company: 'Defence R&D Organisation (NSTL Visakhapatnam)',
    role: 'Sonar Signal & Embedded Systems Research Intern',
    kind: 'Government Defence Research Fellowship',
    mode: 'Offline',
    startDate: '01 May 2024',
    endDate: '30 Jun 2024',
    duration: '2 Months',
    technicalBasis: 'Based on digital signal processing (DSP), underwater acoustic wave telemetry, and MATLAB algorithm simulation for naval defense platforms.',
    stipend: '₹15,000 / month + Security Clearance',
    mentor: 'Scientist-E, Naval Science & Technological Laboratory (NSTL)',
    status: 'Verified',
    credentialId: 'DRDO-NSTL-2024-R4',
    summary: 'Implemented acoustic noise cancellation filtering algorithms on simulated hydrodynamic sensor streams under senior naval research scientists.',
    deliverables: [
      'Designed adaptive LMS noise filtration filters in MATLAB/Simulink',
      'Conducted telemetry spectral analysis on underwater acoustics',
      'Presented technical research paper to NSTL Scientific Directorate',
    ],
  },
  {
    id: 'intern-5',
    company: 'Infosys Springboard (Global Digital Technologies)',
    role: 'Full Stack Java & Microservices Intern',
    kind: 'Corporate FastTrack Internship',
    mode: 'Hybrid',
    startDate: '05 Jan 2026',
    endDate: '30 Apr 2026',
    duration: '4 Months (Current)',
    technicalBasis: 'Based on Spring Boot 3 microservices, Kafka event streaming, React frontends, and containerized Docker Kubernetes orchestration.',
    stipend: '₹20,000 / month (PPO Track)',
    mentor: 'K. Srinivasan (Principal Tech Lead, Infosys)',
    status: 'In Progress',
    credentialId: 'INFY-SPRING-2026-T8',
    summary: 'Working on resilient enterprise banking transaction pipelines with distributed event logs and circuit-breaker fault tolerances.',
    deliverables: [
      'Building RESTful APIs with Spring Boot and Spring Data JPA',
      'Configuring Kafka topics for high-throughput messaging',
      'Targeting Pre-Placement Offer (PPO) upon completion',
    ],
  },
]

export default function StudentInternships() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [internships, setInternships] = useState(() => {
    try {
      const saved = localStorage.getItem('kiet_student_internships')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return DEFAULT_INTERNSHIPS
  })

  const [activeFilter, setActiveFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewDossierModal, setViewDossierModal] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    kind: 'Corporate Internship',
    mode: 'Remote',
    startDate: '',
    endDate: '',
    duration: '',
    technicalBasis: '',
    stipend: '',
    mentor: '',
    summary: '',
  })

  useEffect(() => {
    try {
      localStorage.setItem('kiet_student_internships', JSON.stringify(internships))
    } catch {
      // ignore
    }
  }, [internships])

  const filteredInternships = useMemo(() => {
    if (activeFilter === 'All') return internships
    if (activeFilter === 'Remote') return internships.filter(i => i.mode === 'Remote')
    if (activeFilter === 'Offline') return internships.filter(i => i.mode === 'Offline')
    if (activeFilter === 'Hybrid') return internships.filter(i => i.mode === 'Hybrid')
    if (activeFilter === 'Verified') return internships.filter(i => i.status === 'Verified')
    return internships
  }, [internships, activeFilter])

  const handleAddInternship = (e) => {
    e.preventDefault()
    if (!formData.company.trim() || !formData.role.trim() || !formData.technicalBasis.trim()) {
      addToast('Please fill out Company, Role, and the Technical Foundation basis.', 'error')
      return
    }

    const newIntern = {
      id: `intern-${Date.now()}`,
      company: formData.company.trim(),
      role: formData.role.trim(),
      kind: formData.kind,
      mode: formData.mode,
      startDate: formData.startDate || 'Current Semester',
      endDate: formData.endDate || 'Ongoing',
      duration: formData.duration || '3 Months',
      technicalBasis: formData.technicalBasis.trim(),
      stipend: formData.stipend || 'Academic Credit & Stipend',
      mentor: formData.mentor || 'Faculty Industry Coordinator',
      status: 'Pending Verification',
      credentialId: `KIET-INT-${Math.floor(1000 + Math.random() * 9000)}`,
      summary: formData.summary.trim() || 'Work experience recorded in KIET student portfolio.',
      deliverables: ['Submitted project evaluation dossier to department faculty.'],
    }

    setInternships([newIntern, ...internships])
    setShowAddModal(false)
    setFormData({
      company: '',
      role: '',
      kind: 'Corporate Internship',
      mode: 'Remote',
      startDate: '',
      endDate: '',
      duration: '',
      technicalBasis: '',
      stipend: '',
      mentor: '',
      summary: '',
    })
    addToast('Internship logged successfully and submitted for faculty verification!', 'success')
  }

  return (
    <div className="student-space-page fade-in">
      {/* 1. Header Banner */}
      <section className="internships-hero-card">
        <div className="internships-hero-copy">
          <div className="internships-hero-badge">
            🏢 CAREER &amp; INDUSTRY APPRENTICESHIPS • KIET ENGAGEMENT
          </div>
          <h1 className="maven-black">Industry Internships &amp; Practical Training</h1>
          <p>
            Track your corporate internships, research fellowships, and government technical apprenticeships. 
            Review work modes (Remote vs. Offline), start and completion dates, and verifiable domain foundations.
          </p>
          <div className="internships-hero-stats">
            <div className="kpi-tag">
              <strong className="maven-black">{internships.length}</strong> <span>Total Internships</span>
            </div>
            <div className="kpi-tag">
              <strong className="maven-black">{internships.filter(i => i.mode === 'Remote').length}</strong> <span>Remote Cohorts</span>
            </div>
            <div className="kpi-tag">
              <strong className="maven-black">{internships.filter(i => i.mode === 'Offline').length}</strong> <span>Offline / On-Site</span>
            </div>
            <div className="kpi-tag">
              <strong className="maven-black">{internships.filter(i => i.status === 'Verified').length}</strong> <span>Verified Records</span>
            </div>
          </div>
        </div>

        <div className="internships-hero-actions">
          <button className="btn-add-internship" onClick={() => setShowAddModal(true)}>
            + Log New Internship
          </button>
        </div>
      </section>

      {/* 2. Mode Filter Bar */}
      <div className="internships-toolbar-bar">
        <div className="internships-filter-pills">
          {['All', 'Remote', 'Offline', 'Hybrid', 'Verified'].map(filter => (
            <button
              key={filter}
              className={`intern-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'All' ? 'All Internships' : filter}
            </button>
          ))}
        </div>
        <span className="internships-count-label">
          Showing {filteredInternships.length} of {internships.length} experiences
        </span>
      </div>

      {/* 3. Detailed, Clear Internship Cards */}
      <div className="internships-list">
        {filteredInternships.map(intern => (
          <article key={intern.id} className="internship-card">
            {/* Top Bar: Company, Mode Pill, Status */}
            <div className="internship-card-top">
              <div className="intern-company-box">
                <span className="intern-icon-wrap">
                  {intern.mode === 'Remote' ? '🌐' : intern.mode === 'Offline' ? '🏢' : '🔄'}
                </span>
                <div>
                  <h3 className="intern-role-title maven-black">{intern.role}</h3>
                  <span className="intern-company-name">{intern.company}</span>
                </div>
              </div>

              <div className="intern-top-badges">
                <span className={`intern-mode-pill ${intern.mode.toLowerCase()}`}>
                  {intern.mode === 'Remote' ? '📶 Remote' : intern.mode === 'Offline' ? '📍 Offline (On-Site)' : '🔀 Hybrid'}
                </span>
                <Seal status={intern.status === 'Verified' ? 'Verified' : 'Pending'} />
              </div>
            </div>

            {/* Core Details Grid: Kind, Duration, Dates, Stipend */}
            <div className="intern-details-meta-grid">
              <div className="meta-cell">
                <span className="meta-lbl">INTERNSHIP KIND</span>
                <strong>{intern.kind}</strong>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">TENURE &amp; DATES</span>
                <strong>{intern.startDate} — {intern.endDate}</strong>
                <small className="intern-duration-lbl">({intern.duration})</small>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">STIPEND / GRANT</span>
                <strong>{intern.stipend}</strong>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">INDUSTRY MENTOR</span>
                <strong>{intern.mentor}</strong>
              </div>
            </div>

            {/* The User's Special Requirement: "On what based that internship actually" */}
            <div className="intern-technical-basis-card">
              <div className="basis-header">
                <span className="basis-icon">🔬</span>
                <strong>ON WHAT BASED THAT INTERNSHIP ACTUALLY:</strong>
              </div>
              <p className="basis-text">{intern.technicalBasis}</p>
            </div>

            {/* Summary & Deliverables */}
            <p className="intern-summary-text">{intern.summary}</p>

            {/* Card Footer Actions */}
            <div className="internship-card-footer">
              <span className="intern-cred-id">
                Credential: <code>{intern.credentialId}</code>
              </span>
              <button
                className="btn-view-dossier"
                onClick={() => setViewDossierModal(intern)}
              >
                Inspect Official Dossier →
              </button>
            </div>
          </article>
        ))}

        {filteredInternships.length === 0 && (
          <div className="internships-empty-card">
            <span style={{ fontSize: 36 }}>💼</span>
            <h4>No internships found under this filter</h4>
            <p>Switch to "All Internships" or add your industrial training and apprenticeship records.</p>
            <button className="btn-add-internship" onClick={() => setShowAddModal(true)}>
              + Log Internship
            </button>
          </div>
        )}
      </div>

      {/* 4. Add Internship Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card intern-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>💼</span>
                <div>
                  <h3 className="modal-title">Record New Internship</h3>
                  <span className="modal-subtitle">
                    Capture role, organization, work mode, dates, and core technical basis
                  </span>
                </div>
              </div>
              <button className="btn-modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInternship}>
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group-field">
                    <label>
                      Sponsoring Company / Organization <span>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Amazon Web Services (AWS) / Cisco"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div className="form-group-field">
                    <label>
                      Internship Role / Title <span>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Cloud Architecture & DevOps Intern"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group-field">
                    <label>Internship Mode</label>
                    <select
                      value={formData.mode}
                      onChange={e => setFormData({ ...formData, mode: e.target.value })}
                    >
                      <option value="Remote">Remote (Virtual)</option>
                      <option value="Offline">Offline (On-Site)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form-group-field">
                    <label>Internship Kind</label>
                    <select
                      value={formData.kind}
                      onChange={e => setFormData({ ...formData, kind: e.target.value })}
                    >
                      <option value="Corporate Internship">Corporate Internship</option>
                      <option value="Industry-Academia Cohort">Industry-Academia Cohort</option>
                      <option value="Government Research Fellowship">Government Research Fellowship</option>
                      <option value="Virtual Apprenticeship">Virtual Apprenticeship</option>
                      <option value="Startup Incubation Project">Startup Incubation Project</option>
                    </select>
                  </div>

                  <div className="form-group-field">
                    <label>Stipend / Allowance</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹15,000 / mo or Academic Credit"
                      value={formData.stipend}
                      onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group-field">
                    <label>Start Date</label>
                    <input
                      type="text"
                      placeholder="e.g., 01 Jun 2025"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group-field">
                    <label>End Date</label>
                    <input
                      type="text"
                      placeholder="e.g., 31 Aug 2025"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g., 3 Months"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label>
                    On What Based That Internship Actually (Core Technical &amp; Domain Foundation) <span>*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the exact core technology or domain foundation this internship is based on (e.g. Based on AWS Well-Architected Framework, Serverless Microservices, and CloudFormation infrastructure...)"
                    value={formData.technicalBasis}
                    onChange={e => setFormData({ ...formData, technicalBasis: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group-field">
                    <label>Industry Mentor / Reporting Supervisor</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Solutions Architect, AWS"
                      value={formData.mentor}
                      onChange={e => setFormData({ ...formData, mentor: e.target.value })}
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Brief Overview &amp; Key Deliverables</label>
                    <input
                      type="text"
                      placeholder="Summary of work performed..."
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-modal-action">
                  Submit for Institutional Verification
                </button>
                <button
                  type="button"
                  className="btn-modal-close-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Internship Dossier Modal */}
      {viewDossierModal && (
        <div className="admin-modal-backdrop" onClick={() => setViewDossierModal(null)}>
          <div className="admin-modal-card intern-dossier-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>📜</span>
                <div>
                  <h3 className="modal-title">{viewDossierModal.role}</h3>
                  <span className="intern-dossier-sub">
                    {viewDossierModal.company} • {viewDossierModal.duration}
                  </span>
                </div>
              </div>
              <button className="btn-modal-close" onClick={() => setViewDossierModal(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="intern-details-meta-grid" style={{ marginBottom: 16 }}>
                <div className="meta-cell">
                  <span className="meta-lbl">WORK MODE</span>
                  <strong>{viewDossierModal.mode}</strong>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">TENURE DATES</span>
                  <strong>{viewDossierModal.startDate} — {viewDossierModal.endDate}</strong>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">STIPEND</span>
                  <strong>{viewDossierModal.stipend}</strong>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">CREDENTIAL ID</span>
                  <strong className="intern-cred-id-val">{viewDossierModal.credentialId}</strong>
                </div>
              </div>

              <div className="intern-technical-basis-card" style={{ marginBottom: 16 }}>
                <div className="basis-header">
                  <span className="basis-icon">🔬</span>
                  <strong>CORE TECHNICAL FOUNDATION:</strong>
                </div>
                <p className="basis-text">{viewDossierModal.technicalBasis}</p>
              </div>

              <div className="intern-deliverables-box">
                <strong className="intern-deliverables-title">
                  Verified Internship Deliverables:
                </strong>
                <ul className="intern-deliverables-list">
                  {viewDossierModal.deliverables?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="intern-verify-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🛡️</span>
                  <div>
                    <strong className="intern-verify-title">Verified by Department Industry Cell</strong>
                    <small className="intern-verify-sub">Assigned Mentor: {viewDossierModal.mentor}</small>
                  </div>
                </div>
                <Seal status="Verified" />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-action"
                onClick={() => {
                  addToast(`Accredited completion certificate for ${viewDossierModal.company} generated.`, 'info')
                  setViewDossierModal(null)
                }}
              >
                Download Verified Dossier PDF
              </button>
              <button
                className="btn-modal-close-secondary"
                onClick={() => setViewDossierModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
