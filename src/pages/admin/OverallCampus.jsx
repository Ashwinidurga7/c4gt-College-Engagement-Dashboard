import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { campusProfiles } from '../../data/adminData'
import { useToast } from '../../components/ui/Toast'

// 8 Official Innovation Hubs & Specialized Centers of Excellence
export const ecosystemHubs = [
  {
    id: 'edc',
    index: '01',
    name: 'KIET Innovation Hub (EDC)',
    title: 'Incubation & Startup Development Center',
    category: 'Entrepreneurship & R&D',
    icon: '💡',
    accentColor: '#f59e0b',
    summary: 'Central deep-tech incubator facilitating seed funding grants, patent protections, and prototype acceleration for student-led campus enterprises.',
    metrics: {
      primary: '18 Startups',
      secondary: '₹25.0 Lakhs Seed Grants',
      participants: '340 Registered Innovators',
    },
    coordinator: 'Prof. M. S. R. Prasad',
    location: 'Innovation Wing B, Room 204 • KIET Main',
    status: 'Active Incubation Cycle',
    featuredProjects: [
      'AgroDrone AI — Crop Health & Multispectral Disease Telemetry',
      'MediTrack IoT — Hospital Vaccine Cold-Chain Telemetry Guard',
      'AquaPure Sensor Mesh — Rural Potable Water Quality Monitory',
    ],
    patentsFiled: 14,
    fundingSponsors: ['MSME Govt. of India', 'AP Innovation Society (APIS)'],
  },
  {
    id: 'coding',
    index: '02',
    name: 'Global Coding Club & CP Arena',
    title: 'Competitive Programming & Algorithm Cell',
    category: 'Software Engineering',
    icon: '💻',
    accentColor: '#0284c7',
    summary: 'High-intensity algorithm sprint cell training engineers across LeetCode, Codeforces, HackerRank, and ICPC Collegiate programming contests.',
    metrics: {
      primary: '420 Coders',
      secondary: '2,800+ Problems Solved',
      participants: 'Daily 9:00 PM Code Sprints',
    },
    coordinator: 'Dr. G. Murali',
    location: 'Turing Computer Labs 3 & 4 • Tech Park',
    status: 'Weekly Challenge Active',
    featuredProjects: [
      'Distributed High-Frequency Order Matcher Engine',
      'Autonomous Code Plagiarism & AST Semantic Analyzer',
      'Campus Peer Review Git Server & Continuous CI',
    ],
    topRank: 'Codeforces Candidate Master',
    partners: ['GeeksforGeeks KIET Chapter', 'GitHub Campus Experts'],
  },
  {
    id: 'hackathons',
    index: '03',
    name: 'Hackathons & Technical Showcases',
    title: 'National Innovation Challenges & SIH Desk',
    category: 'Competitions & Hackathons',
    icon: '🏆',
    accentColor: '#8b5cf6',
    summary: 'Specialized administrative committee mentoring university squads for Smart India Hackathon (SIH), UNESCO India-Africa, and regional hackathons.',
    metrics: {
      primary: '24 Major Wins',
      secondary: '₹14.5 Lakhs Prize Money',
      participants: '68 Competing Teams',
    },
    coordinator: 'Dr. P. V. Suresh',
    location: 'Innovation Tower, 4th Floor • KIET+',
    status: 'SIH 2026 Grand Finale Prep',
    featuredProjects: [
      'Smart Grid Energy Disaggregation (SIH 1st Prize Winner)',
      'Emergency Dispatch Telemetry for Indian Coast Guard',
      'AI OCR for Ancient Telugu Palm Leaf Inscriptions',
    ],
    annualEvents: 'KIET 48-Hour Hack-a-Thon 2026',
    industryMentors: ['AWS Solutions Architects', 'TCS Research Labs'],
  },
  {
    id: 'smartcity',
    index: '04',
    name: 'Smart City & Public Utility IoT Lab',
    title: 'Municipal Telemetry & Embedded Systems Lab',
    category: 'IoT & Embedded Hardware',
    icon: '🌐',
    accentColor: '#10b981',
    summary: 'Applied research center deploying low-power LoRaWAN sensor networks, weather telemetry, and automated utility monitors for Kakinada Smart City.',
    metrics: {
      primary: '12 Live Deployments',
      secondary: '40 LoRaWAN Nodes',
      participants: '85 Research Scholars',
    },
    coordinator: 'Dr. Ch. Rambabu',
    location: 'Data Labs Wing, Room 102 • KIET Main',
    status: 'Live Sensor Telemetry',
    featuredProjects: [
      'Kakinada Coastal Weather Telemetry Mesh System',
      'Autonomous Smart Solar Streetlighting Mesh Network',
      'Municipal Drainage Overflow Early-Warning Sensor',
    ],
    equipment: 'Keysight Digital Analyzers, LoRaWAN Gateways, STM32 ARM Kits',
    collaborators: ['Kakinada Smart City Corporation', 'JNTUK Research Cell'],
  },
  {
    id: 'robotics',
    index: '05',
    name: 'Autonomous Systems & Robotics Lab',
    title: 'Unmanned Ground & Aerial Systems Center',
    category: 'Robotics & Automation',
    icon: '🤖',
    accentColor: '#ef4444',
    summary: 'Advanced industrial robotics testbed designing ROS 2 autonomous exploration rovers, quadcopter inspection drones, and 6-DOF robotic arms.',
    metrics: {
      primary: '8 Autonomous Rovers',
      secondary: '3 Drones Certified',
      participants: '110 Active Engineers',
    },
    coordinator: 'Dr. V. Subrahmanyam',
    location: 'R&D Block I, Ground Floor Bay • KIET Main',
    status: 'Rover Field Trials Active',
    featuredProjects: [
      'All-Terrain Lunar/Martian Exploration Rover Prototype',
      'Warehouse Autonomous Guided Vehicle (AGV) with LiDAR',
      'Precision Agricultural Spraying Hexacopter Drone',
    ],
    equipment: 'ROS 2 Workstations, 3D Prototype Printers, Nvidia Jetson Orin',
    nationalCompetitions: ['e-Yantra (IIT Bombay)', 'RoboCon National Finals'],
  },
  {
    id: 'toastmasters',
    index: '06',
    name: 'Toastmasters International (KIET Chapter)',
    title: 'Public Speaking, Oratory & Executive Leadership',
    category: 'Leadership & Soft Skills',
    icon: '🎙️',
    accentColor: '#0ea5e9',
    summary: 'Chartered institutional club (Club #7124930) training aspiring engineers in impromptu speaking, parliamentary debate, and corporate negotiation.',
    metrics: {
      primary: '210 Certified Orators',
      secondary: '48 Speech Sprints',
      participants: 'Weekly Saturday Sessions',
    },
    coordinator: 'Dr. K. Vijaya Lakshmi',
    location: 'Auditorium Seminar Hall 2 • KIET Women\'s',
    status: 'Meeting #182 Scheduled',
    featuredProjects: [
      'Annual Humorous Speech & Evaluation Championship',
      'Table Topics Spontaneous Thought Leadership Sprint',
      'Corporate Interview Readiness & Boardroom Pitching',
    ],
    distinction: 'President’s Distinguished Club Recognition',
    affiliation: 'District 98, Toastmasters International',
  },
  {
    id: 'internships',
    index: '07',
    name: 'Central Placement & Internship Cell',
    title: 'Corporate Alliances & Career Readiness Bureau',
    category: 'Corporate Relations',
    icon: '🚀',
    accentColor: '#14b8a6',
    summary: 'Central corporate desk bridging students with tier-1 enterprise internships, full-time campus placements, and industrial pre-placement offers (PPOs).',
    metrics: {
      primary: '832 Placements',
      secondary: '440+ Summer Interns',
      participants: '88+ Hiring Partners',
    },
    coordinator: 'Dr. S. K. Padmavathi',
    location: 'Central Placement Bureau, Ground Floor',
    status: 'On-Campus Drives Active',
    featuredProjects: [
      'AWS Cloud Architecture Accelerator Bootcamp',
      'ServiceNow Certified System Administrator Cohort',
      'Infosys Springboard Enterprise Full-Stack FastTrack',
    ],
    topOffer: '₹31.50 LPA (Amazon Web Services)',
    averagePackage: '₹6.65 LPA (Group Average)',
  },
  {
    id: 'events',
    index: '08',
    name: 'Academic Circulars & Institutional Events Desk',
    title: 'Accreditation, Conferences & University Symposia',
    category: 'Governance & Events',
    icon: '📢',
    accentColor: '#6366f1',
    summary: 'Central executive registry overseeing university conferences, faculty development programs, AICTE compliance filings, and national symposiums.',
    metrics: {
      primary: '36 Annual Events',
      secondary: '100% JNTUK Compliance',
      participants: 'All 3 Campuses Synchronized',
    },
    coordinator: 'Dean of Academic Affairs',
    location: 'Central Administrative Wing • Headquarters',
    status: 'AY 2025–26 Calendar Synced',
    featuredProjects: [
      'National Conference on Advancements in AI & ML (NCAIML)',
      'Annual University Technical Festival (TECH-EXPO 2026)',
      'Faculty Development Program on LLMs & Autonomous Agents',
    ],
    certifications: ['NAAC "A" Grade Audit', 'NBA Tier-I Compliance'],
    regulatory: 'AICTE New Delhi & JNTUK Kakinada',
  },
]

export default function OverallCampus() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [activeCampusCode, setActiveCampusCode] = useState('KIET')
  const [selectedHubModal, setSelectedHubModal] = useState(null)

  const activeCampus = campusProfiles.find((c) => c.code === activeCampusCode) || campusProfiles[0]

  const handleSyncTelemetry = () => {
    addToast('Synchronizing telemetry across KIET, KIET+, and KIET Women\'s...', 'info')
    setTimeout(() => {
      addToast('All 8 Innovation Hubs & 3 Campus Registries verified 100% synchronized.', 'success')
    }, 800)
  }

  const handleDownloadDossier = () => {
    addToast('Generating Group Accreditation & Campus Dossier (PDF/CSV)...', 'info')
    setTimeout(() => {
      addToast('KIET_Group_Governance_Report_AY2025-26.pdf prepared for download.', 'success')
    }, 700)
  }

  return (
    <div className="overall-container fade-in">
      {/* 1. Executive Hero Header */}
      <section className="overall-hero-card">
        <div className="overall-hero-badge">
          🏛️ KIET GROUP OF INSTITUTIONS • AUTONOMOUS GOVERNANCE NETWORK
        </div>
        <h1 className="overall-hero-title">
          Group Ecosystem &amp; Multi-Campus Operational Command
        </h1>
        <p className="overall-hero-desc">
          Unified operational command for <strong>KIET Group of Institutions</strong> governing 
          <strong> KIET Main Autonomous Campus</strong>, <strong>KIET+ Advanced Tech</strong>, 
          and <strong>KIET Women's College (KIEW)</strong> alongside 
          <strong> 8 High-Impact Innovation Hubs &amp; Research Centers</strong>.
        </p>

        {/* Quick KPI Bar */}
        <div className="overall-kpi-bar">
          <div className="overall-kpi-chip">
            <span className="chip-icon">🏫</span>
            <div>
              <span className="chip-val">3 Campuses</span>
              <span className="chip-lbl">72 Total Acres • Korangi</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">🎓</span>
            <div>
              <span className="chip-val">4,330 Scholars</span>
              <span className="chip-lbl">1st to Final Year Batches</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">🔬</span>
            <div>
              <span className="chip-val">8 R&amp;D CoEs</span>
              <span className="chip-lbl">Robotics, IoT &amp; Coding</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">💼</span>
            <div>
              <span className="chip-val">86.7% Placed</span>
              <span className="chip-lbl">Top: ₹31.50 LPA (AWS)</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">🚌</span>
            <div>
              <span className="chip-val">24 Fleet Buses</span>
              <span className="chip-lbl">100% GPS Telemetry</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="overall-hero-actions">
          <button className="btn-overall-primary" onClick={() => navigate('/admin')}>
            📊 Open Central Governance Dashboard →
          </button>
          <button className="btn-overall-secondary" onClick={handleDownloadDossier}>
            📑 Group Accreditation Dossier
          </button>
          <button className="btn-overall-secondary" onClick={handleSyncTelemetry}>
            🔄 Sync ERP Telemetry
          </button>
        </div>
      </section>

      {/* 2. Interactive 3-Campus Deep-Dive Network */}
      <section className="campus-network-section">
        <div className="section-title-wrap">
          <span className="section-badge-eyebrow">CAMPUS NETWORK INFRASTRUCTURE</span>
          <h2 className="section-main-title">Multi-Campus Operational Profiles</h2>
          <p className="section-sub-desc">
            Toggle between campuses to inspect directorates, acreage, enrollment, faculty deployment, and direct ERP modules.
          </p>
        </div>

        {/* Switcher Tabs */}
        <div className="campus-switcher-bar">
          {campusProfiles.map((cp) => {
            const isActive = activeCampusCode === cp.code
            return (
              <button
                key={cp.code}
                className={`campus-switcher-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCampusCode(cp.code)}
              >
                <div className="btn-left">
                  <strong>{cp.code}</strong>
                  <span>{cp.shortName}</span>
                </div>
                <div
                  className="btn-indicator"
                  style={{ backgroundColor: cp.color }}
                />
              </button>
            )
          })}
        </div>

        {/* Selected Campus Featured Showcase Card */}
        <div className="featured-campus-display">
          <div className="featured-campus-img-box">
            <img
              src={activeCampus.image}
              alt={activeCampus.name}
              className="featured-campus-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span
              className="featured-campus-code-badge"
              style={{ backgroundColor: activeCampus.color }}
            >
              {activeCampus.code} • Est. {activeCampus.established}
            </span>
          </div>

          <div className="featured-campus-body">
            <div className="featured-campus-header">
              <h3>{activeCampus.name}</h3>
              <span className="featured-campus-tag">{activeCampus.tag}</span>
              <p className="featured-campus-meta">
                📍 {activeCampus.location} • <strong>{activeCampus.campusArea}</strong> • {activeCampus.accreditation}
              </p>
            </div>

            <div className="featured-leadership-grid">
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Director &amp; Principal</span>
                <strong>{activeCampus.director}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Academic Dean</span>
                <strong>{activeCampus.dean}</strong>
              </div>
            </div>

            <div className="featured-kpi-grid">
              <div className="featured-kpi-card">
                <strong>{activeCampus.totalStudents}</strong>
                <span>Enrolled Students</span>
              </div>
              <div className="featured-kpi-card">
                <strong>{activeCampus.totalFaculty}</strong>
                <span>Teaching Faculty</span>
              </div>
              <div className="featured-kpi-card">
                <strong>{activeCampus.totalBuses} Buses</strong>
                <span>Assigned Fleet</span>
              </div>
              <div className="featured-kpi-card">
                <strong style={{ color: '#059669' }}>{activeCampus.placementRate}</strong>
                <span>Avg: {activeCampus.avgPackage}</span>
              </div>
            </div>

            <div className="featured-actions-row">
              <button
                className="btn-campus-link"
                onClick={() => navigate('/admin/students')}
              >
                👥 View Student Cohorts (1st–4th Yr) →
              </button>
              <button
                className="btn-campus-link"
                onClick={() => navigate('/admin/faculty')}
              >
                🎓 View Campus Faculty Roster →
              </button>
              <button
                className="btn-campus-link"
                onClick={() => navigate('/admin/placements')}
              >
                💼 View Placement Drives →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 8 Group Innovation Hubs & Labs (Interactive CoE Modules) */}
      <section className="hubs-explorer-section">
        <div className="section-title-wrap">
          <span className="section-badge-eyebrow">GROUP ECOSYSTEM &amp; STUDENT DEVELOPMENT</span>
          <h2 className="section-main-title">Centers of Excellence, Laboratories &amp; Hubs (8 Modules)</h2>
          <p className="section-sub-desc">
            Explore active innovation testbeds, competitive coding communities, IoT municipal networks, and leadership academies.
          </p>
        </div>

        <div className="hubs-grid-8">
          {ecosystemHubs.map((hub) => (
            <div
              key={hub.id}
              className="hub-card"
              onClick={() => setSelectedHubModal(hub)}
            >
              <div>
                <div className="hub-card-top">
                  <div
                    className="hub-icon-frame"
                    style={{ backgroundColor: `${hub.accentColor}15`, color: hub.accentColor }}
                  >
                    {hub.icon}
                  </div>
                  <span className="hub-status-pill">
                    ● {hub.status}
                  </span>
                </div>

                <div className="hub-card-body">
                  <span className="hub-category-tag">{hub.category}</span>
                  <h4>{hub.name}</h4>
                  <p className="hub-summary-text">{hub.summary}</p>

                  <div className="hub-metrics-box">
                    <strong>{hub.metrics.primary}</strong>
                    <span>{hub.metrics.secondary} • {hub.metrics.participants}</span>
                  </div>
                </div>
              </div>

              <div className="hub-card-footer">
                <span className="hub-coord-name">👤 {hub.coordinator}</span>
                <button className="hub-action-btn">
                  Inspect Dossier →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Autonomous ERP Architecture Assurance Callout */}
      <section className="overall-architecture-callout">
        <span className="callout-icon">🛡️</span>
        <div>
          <h4>100% Autonomous &amp; Self-Contained Institutional Governance</h4>
          <p>
            This portal runs as an internal, enterprise-grade autonomous ERP workspace. 
            All campus data, demographic rosters, fleet telematics, and laboratory records are governed internally 
            without depending on or redirecting to external public promotional websites.
          </p>
        </div>
      </section>

      {/* 5. Hub Dossier Modal Viewer */}
      {selectedHubModal && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedHubModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{selectedHubModal.icon}</span>
                <div>
                  <h3 className="modal-title">{selectedHubModal.name}</h3>
                  <span className="hub-modal-header-badge">
                    {selectedHubModal.category} • Module {selectedHubModal.index}
                  </span>
                </div>
              </div>
              <button className="btn-modal-close" onClick={() => setSelectedHubModal(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                {selectedHubModal.summary}
              </p>

              <div className="hub-modal-grid">
                <div className="hub-modal-info-box">
                  <span className="box-lbl">Supervising Coordinator</span>
                  <strong>👤 {selectedHubModal.coordinator}</strong>
                </div>
                <div className="hub-modal-info-box">
                  <span className="box-lbl">Operational Headquarters</span>
                  <strong>📍 {selectedHubModal.location}</strong>
                </div>
                <div className="hub-modal-info-box">
                  <span className="box-lbl">Current Engagement</span>
                  <strong style={{ color: '#059669' }}>⚡ {selectedHubModal.metrics.primary}</strong>
                </div>
                <div className="hub-modal-info-box">
                  <span className="box-lbl">Milestones &amp; Grants</span>
                  <strong style={{ color: '#7c3aed' }}>🏅 {selectedHubModal.metrics.secondary}</strong>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: 12.5, color: '#0f172a', display: 'block', marginBottom: 4 }}>
                  Featured Projects &amp; Live Initiatives:
                </strong>
                <ul className="hub-projects-list">
                  {selectedHubModal.featuredProjects.map((p, idx) => (
                    <li key={idx}><strong>{p}</strong></li>
                  ))}
                </ul>
              </div>

              {selectedHubModal.equipment && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#475569' }}>
                  <strong>Laboratory Infrastructure:</strong> {selectedHubModal.equipment}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-action"
                onClick={() => {
                  addToast(`Administrative notice dispatched to ${selectedHubModal.name} coordinator.`, 'info')
                  setSelectedHubModal(null)
                }}
              >
                Dispatch Admin Circular to Hub
              </button>
              <button
                className="btn-modal-close-secondary"
                onClick={() => setSelectedHubModal(null)}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
