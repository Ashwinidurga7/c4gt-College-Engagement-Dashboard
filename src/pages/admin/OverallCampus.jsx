import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { campusProfiles } from '../../data/adminData'
import { useToast } from '../../components/ui/Toast'
import ProfileModal from '../../components/ui/ProfileModal'

// All 14 Official KIET Ecosystem Innovation Hubs, Labs & Professional Societies
// Official KIET Ecosystem Innovation Hubs, Labs & Student Societies
export const ecosystemHubs = [
  {
    id: 'coding',
    index: '01',
    name: 'Google Coding Club',
    title: 'Competitive Programming & Google Technologies Cell',
    category: 'Technical & AI',
    icon: '💻',
    accentColor: '#0284c7',
    summary: 'High-intensity algorithm sprint cell training engineers across LeetCode, Codeforces, Google Code Jam, HackerRank, and ICPC Collegiate programming contests.',
    metrics: {
      primary: '450 Coders',
      secondary: '3,200+ Problems Solved',
      participants: 'Daily 9:00 PM Code Sprints',
    },
    coordinator: 'Dr. G. Murali',
    coordinatorRole: 'Professor of Computer Science & Coding Directorate Lead',
    location: 'Turing Computer Labs 3 & 4 • Tech Park, KIET',
    status: 'Weekly Code Sprint Active',
    featuredProjects: [
      'Distributed High-Frequency Order Matcher Engine',
      'Autonomous Code Plagiarism & AST Semantic Analyzer',
      'Campus Peer Review Git Server & Continuous CI',
    ],
    topRank: 'Codeforces Candidate Master & Global Rank #42',
    partners: ['Google Developers Program', 'GeeksforGeeks KIET Chapter', 'GitHub Campus Experts'],
  },
  {
    id: 'c4gt',
    index: '02',
    name: 'C4GT club',
    title: 'Digital Public Goods & GovTech Open Source Chapter',
    category: 'Technical & AI',
    icon: '🏛️',
    accentColor: '#0d9488',
    summary: 'Dedicated open-source public tech cell contributing directly to national Digital Public Infrastructure (DPI), GovTech open repositories, and Samagra Open Source fellowships.',
    metrics: {
      primary: '55 DPG Contributors',
      secondary: '24 Open PRs Merged',
      participants: 'Samagra GovTech Network',
    },
    coordinator: 'Dr. P. Suresh',
    coordinatorRole: 'Dean of Technology & Digital Initiatives',
    location: 'Digital Governance Lab 2 • KIET+',
    status: 'National GovTech Sprints Live',
    featuredProjects: [
      'Automated Student Attendance & Scholarship Verification Gateway',
      'Digital Certificate Cryptographic Verification Portal',
      'Public Grievance Redressal Telemetry Dashboard',
    ],
    partners: ['Samagra GovTech', 'National DPG Alliance', 'Code for GovTech (C4GT)'],
  },
  {
    id: 'smartcity',
    index: '03',
    name: 'Smart City Lab',
    title: 'Municipal Telemetry, IoT & Embedded Systems COE',
    category: 'Technical & AI',
    icon: '🌐',
    accentColor: '#10b981',
    summary: 'Applied municipal research center deploying low-power LoRaWAN sensor networks, real-time coastal weather telemetry, and automated utility monitors for Kakinada Smart City.',
    metrics: {
      primary: '16 Live City Deployments',
      secondary: '50+ LoRaWAN Nodes',
      participants: '90 Research Scholars',
    },
    coordinator: 'Dr. Ch. Rambabu',
    coordinatorRole: 'Director, Smart City Research Cell',
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
    id: 'ncc_nss',
    index: '04',
    name: 'NCC And Nss',
    title: 'Discipline, National Service & Community Outreach',
    category: 'Societies & Outreach',
    icon: '🎖️',
    accentColor: '#4f46e5',
    summary: 'Paramilitary discipline and social service cell conducting annual training camps, coastal afforestation drives, mega blood donation camps, and disaster relief across Kakinada district.',
    metrics: {
      primary: '160 NCC Cadets',
      secondary: '350 NSS Volunteers',
      participants: 'Republic Day Contingents',
    },
    coordinator: 'Lt. K. Ramesh (Associate NCC Officer)',
    coordinatorRole: 'ANO 3(A) R&R COY NCC & NSS Program Officer',
    location: 'NCC Parade Ground & Field Office • KIET Campus',
    status: 'Annual Training Camp Selection',
    featuredProjects: [
      'Annual Mega Blood Donation Drive (850+ Units Donated)',
      'Rural Digital Literacy & Swachh Bharat Coastal Cleanups',
      'Independence Day & Republic Day Ceremonial Parades',
    ],
    affiliation: '3(A) R&R COY NCC Kakinada & NSS JNTUK',
  },
  {
    id: 'toastmasters',
    index: '05',
    name: 'Toastmasters',
    title: 'Public Speaking, Oratory & Executive Leadership (Club #7124930)',
    category: 'Societies & Outreach',
    icon: '🎙️',
    accentColor: '#0ea5e9',
    summary: 'Chartered institutional club training aspiring engineers in impromptu speaking, parliamentary debate, boardroom communication, and corporate negotiation.',
    metrics: {
      primary: '230 Certified Orators',
      secondary: '52 Speech Sprints',
      participants: 'Weekly Saturday Sessions',
    },
    coordinator: 'Dr. K. Vijaya Lakshmi',
    coordinatorRole: 'Professor of English & Soft Skills Lead',
    location: "Auditorium Seminar Hall 2 • KIET Women's",
    status: 'Meeting #192 Scheduled',
    featuredProjects: [
      'Annual Humorous Speech & Evaluation Championship',
      'Table Topics Spontaneous Thought Leadership Sprint',
      'Corporate Interview Readiness & Boardroom Pitching',
    ],
    distinction: 'President’s Distinguished Club Recognition',
    affiliation: 'District 98, Toastmasters International',
  },
  {
    id: 'sports',
    index: '06',
    name: 'Kiet sports and athaletics council(kpl)',
    title: 'Inter-Campus Tournaments & Athletic Fitness Council',
    category: 'Societies & Outreach',
    icon: '🏏',
    accentColor: '#16a34a',
    summary: 'Active sports board managing the annual KIET Premier League (KPL Day-Night cricket tournament), floodlit basketball & volleyball courts, and inter-university athletic meets.',
    metrics: {
      primary: '28 Sports Teams',
      secondary: 'Annual KPL Cup',
      participants: '720+ Student Athletes',
    },
    coordinator: 'Capt. R. Jagadeesh',
    coordinatorRole: 'Physical Education Director & Sports Board Secretary',
    location: 'KIET Central Sports Ground & Indoor Stadium',
    status: 'KPL Season 3 Auction & League Sprints',
    featuredProjects: [
      'Annual KIET Premier League (KPL) Day-Night Tournament',
      'Inter-Collegiate Volleyball & Basketball Championships',
      'Campus Wellness & Morning Athletics Conditioning Cell',
    ],
    facilities: 'Standard Turf Cricket Ground, 400m Track, Floodlit Courts',
  },
  {
    id: 'hackathons',
    index: '07',
    name: 'Hackathons',
    title: 'National Innovation Challenges & SIH Innovation Desk',
    category: 'Innovation & Competitions',
    icon: '🏆',
    accentColor: '#8b5cf6',
    summary: 'Specialized university committee mentoring squads for Smart India Hackathon (SIH), UNESCO India-Africa, AICTE Manthan, and national 48-hour hackathons.',
    metrics: {
      primary: '28 Major Wins',
      secondary: '₹18.5 Lakhs Prize Money',
      participants: '80 Competing Teams',
    },
    coordinator: 'Dr. P. V. Suresh',
    coordinatorRole: 'Academic Dean & Hackathon Mentor',
    location: 'Innovation Tower, 4th Floor • KIET+',
    status: 'SIH 2026 Grand Finale Prep',
    featuredProjects: [
      'Smart Grid Energy Disaggregation (SIH 1st Prize Winner)',
      'Emergency Dispatch Telemetry for Indian Coast Guard',
      'AI OCR for Ancient Telugu Palm Leaf Inscriptions',
    ],
    annualEvents: 'KIET 48-Hour National Hackathon 2026',
    industryMentors: ['AWS Solutions Architects', 'TCS Research Labs'],
  },
  {
    id: 'robotics',
    index: '08',
    name: 'Robotics',
    title: 'KIET Autonomous Systems & Robotics Club',
    category: 'Technical & AI',
    icon: '🤖',
    accentColor: '#ef4444',
    summary: 'Advanced industrial robotics testbed at KIET designing ROS 2 autonomous exploration rovers, quadcopter inspection drones, LiDAR-equipped warehouse AGVs, and multi-axis robotic arms.',
    metrics: {
      primary: '10 Autonomous Rovers',
      secondary: '4 Drones Certified',
      participants: '140 Active Engineers',
    },
    coordinator: 'Dr. V. Subrahmanyam',
    coordinatorRole: 'Head of Robotics & Autonomous Systems, KIET',
    location: 'R&D Block I, Ground Floor Robotics Bay • KIET Main',
    status: 'e-Yantra IIT Bombay & RoboCon Trials Live',
    featuredProjects: [
      'KIET All-Terrain Lunar/Martian Exploration Rover Prototype with 6-Wheel Rocker-Bogie',
      'Autonomous Warehouse Guided Vehicle (AGV) with 3D LiDAR & SLAM',
      'Precision Agricultural Spraying Hexacopter Drone with Thermal Sensor',
    ],
    equipment: 'ROS 2 Workstations, 3D Prototype Printers, Nvidia Jetson AGX Orin, Velodyne LiDAR',
    nationalCompetitions: ['e-Yantra National Robotics Competition (IIT Bombay)', 'DD-RoboCon National Finals', 'World Robot Olympiad'],
  },
  {
    id: 'cybersecurity',
    index: '09',
    name: 'Cyber Security',
    title: 'KIET Cyber Defense, Ethical Hacking & Forensics COE',
    category: 'Technical & AI',
    icon: '🛡️',
    accentColor: '#0284c7',
    summary: 'Premier cybersecurity research & defense cell at KIET specializing in vulnerability assessment, penetration testing (VAPT), digital forensics, malware reverse-engineering, and national CTF challenges.',
    metrics: {
      primary: '190 Security Analysts',
      secondary: '35+ CVE Audits Logged',
      participants: 'Top 50 in National CTFs',
    },
    coordinator: 'Prof. K. Satyanarayana',
    coordinatorRole: 'Chief Information Security Officer & Cyber Forensics Lead, KIET',
    location: 'Cyber Security & Threat Intelligence Lab, 3rd Floor • KIET+ Campus',
    status: 'National Inter-University CTF Live',
    featuredProjects: [
      'KIET Campus Zero-Trust Network Architecture & SOC SIEM Monitoring',
      'Automated Web Application Vulnerability Scanner & OWASP Top 10 Sandbox',
      'Digital Forensic Memory Artifact Extractor & Ransomware Reverse-Engineering Toolkit',
    ],
    equipment: 'Air-Gapped Malware Analysis Sandbox, Kali Enterprise Rigs, Hardware Hacking Kits (Flipper Zero, HackRF)',
    certifications: ['Certified Ethical Hacker (CEH)', 'CompTIA Security+', 'OffSec Certified Professional (OSCP) Prep'],
    partners: ['CERT-In Cyber Swachhta Kendra', 'QuickHeal Academy', 'Nullcon Community'],
  },
]

export default function OverallCampus() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [activeCampusCode, setActiveCampusCode] = useState('KIET')
  const [selectedHubModal, setSelectedHubModal] = useState(null)
  const [selectedProfileModal, setSelectedProfileModal] = useState(null)
  const [hubCategory, setHubCategory] = useState('All')

  const activeCampus = campusProfiles.find(c => c.code === activeCampusCode) || campusProfiles[0]

  const hubCategories = ['All', 'Technical & AI', 'Innovation & Competitions', 'Societies & Outreach']

  const filteredHubs = ecosystemHubs.filter(h => {
    if (hubCategory === 'All') return true
    return h.category === hubCategory
  })

  const handleDownloadDossier = () => {
    addToast('Generating Group Accreditation & Campus Dossier (PDF)...', 'info')
    setTimeout(() => {
      addToast('KIET_Group_Governance_Report_AY2025-26.pdf prepared for download.', 'success')
    }, 700)
  }

  const handleOpenLeadershipProfile = (name, title, role, campus, department) => {
    setSelectedProfileModal({
      name,
      title,
      role,
      campus: campus || activeCampus.name,
      department: department || 'Institutional Leadership Directorate',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@kietgroup.com`,
      phone: '+91 884 230 4567',
      office: 'Administrative Block, Director Chamber',
      bio: `Distinguished academic leader with over 20+ years of administrative leadership, published patents, and educational governance at ${campus || activeCampus.shortName}.`,
      specializations: ['Institutional Accreditation (NAAC/NBA)', 'Curriculum Design', 'R&D Grants', 'Industry Alliances'],
      achievements: [
        'Instrumental in securing NAAC "A" Grade and Autonomous status for the campus',
        'Spearheaded research grants worth ₹1.2+ Crores from AICTE, DST, and MSME',
        'Facilitated tier-1 placement partnerships with Amazon, TCS, Infosys, and Cisco',
      ],
    })
  }

  return (
    <div className="overall-container fade-in">
      {/* 1. Streamlined, Airy Executive Hero Header */}
      <section className="overall-hero-card">
        <div className="overall-hero-badge">
          🏛️ KIET GROUP OF INSTITUTIONS • AUTONOMOUS GOVERNANCE NETWORK
        </div>
        <h1 className="overall-hero-title maven-black">
          Group Ecosystem &amp; Multi-Campus Governance
        </h1>
        <p className="overall-hero-desc">
          Unified command for <strong>KIET Group of Institutions</strong> governing 
          <strong> KIET Main Autonomous Campus</strong>, <strong>KIET+ Advanced Tech</strong>, 
          and <strong>KIET Women's College (KIEW)</strong> alongside 
          <strong> 9 Specialized Innovation Hubs, Labs &amp; Student Councils</strong>.
        </p>

        {/* Streamlined KPI Bar */}
        <div className="overall-kpi-bar">
          <div className="overall-kpi-chip">
            <span className="chip-icon">🏫</span>
            <div>
              <span className="chip-val maven-black">3 Campuses</span>
              <span className="chip-lbl">72 Total Acres • Korangi</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">🎓</span>
            <div>
              <span className="chip-val maven-black">4,330 Scholars</span>
              <span className="chip-lbl">1st to Final Year Batches</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">🔬</span>
            <div>
              <span className="chip-val maven-black">9 Hubs &amp; Labs</span>
              <span className="chip-lbl">Robotics, Cyber, Coding &amp; C4GT</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">💼</span>
            <div>
              <span className="chip-val maven-black">86.7% Placed</span>
              <span className="chip-lbl">Top: ₹31.50 LPA (AWS)</span>
            </div>
          </div>
          <div className="overall-kpi-chip">
            <span className="chip-icon">🚌</span>
            <div>
              <span className="chip-val maven-black">24 Fleet Buses</span>
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
        </div>
      </section>

      {/* 2. Interactive 3-Campus Deep-Dive Network */}
      <section className="campus-network-section">
        <div className="section-title-wrap">
          <span className="section-badge-eyebrow">CAMPUS NETWORK INFRASTRUCTURE</span>
          <h2 className="section-main-title maven-black">Multi-Campus Operational Profiles</h2>
          <p className="section-sub-desc">
            Toggle between campuses to inspect directorates, acreage, enrollment, faculty deployment, and direct ERP modules.
          </p>
        </div>

        {/* Switcher Tabs */}
        <div className="campus-switcher-bar">
          {campusProfiles.map(cp => {
            const isActive = activeCampusCode === cp.code
            return (
              <button
                key={cp.code}
                className={`campus-switcher-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCampusCode(cp.code)}
              >
                <div className="btn-left">
                  <strong className="maven-black">{cp.code}</strong>
                  <span>{cp.shortName}</span>
                </div>
                <div className="btn-indicator" style={{ backgroundColor: cp.color }} />
              </button>
            )
          })}
        </div>

        {/* Selected Campus Featured Showcase Card */}
        <div className="featured-campus-display">
          <div className="featured-campus-img-box">
            <img
              src={activeCampus.image || '/images/kiet/aboutus_kiet.jpg'}
              alt={activeCampus.name}
              className="featured-campus-img"
              onError={e => {
                e.currentTarget.src = '/images/kiet/aboutus_kiet.jpg'
              }}
            />
            <span
              className="featured-campus-code-badge maven-black"
              style={{ backgroundColor: activeCampus.color }}
            >
              {activeCampus.code} • Est. {activeCampus.established}
            </span>
          </div>

          <div className="featured-campus-body">
            <div className="featured-campus-header">
              <h3 className="maven-black">{activeCampus.name}</h3>
              <span className="featured-campus-tag">{activeCampus.tag}</span>
              <p className="featured-campus-meta">
                📍 {activeCampus.location} • <strong>{activeCampus.campusArea}</strong> • {activeCampus.accreditation}
              </p>
            </div>

            {/* Clickable Leadership Profiles */}
            <div className="featured-leadership-grid">
              <div
                className="clickable-leader-box"
                onClick={() =>
                  handleOpenLeadershipProfile(
                    activeCampus.director,
                    'Director & Principal',
                    'Campus Principal',
                    activeCampus.shortName,
                    'Directorate of Academic Affairs'
                  )
                }
                title="Click to inspect Director profile dossier"
              >
                <span className="leader-role-label">Director &amp; Principal (Click to View)</span>
                <strong>👤 {activeCampus.director} ↗</strong>
              </div>

              <div
                className="clickable-leader-box"
                onClick={() =>
                  handleOpenLeadershipProfile(
                    activeCampus.dean,
                    'Academic Dean',
                    'Dean of Academics & Admissions',
                    activeCampus.shortName,
                    'Office of Academic Affairs'
                  )
                }
                title="Click to inspect Dean profile dossier"
              >
                <span className="leader-role-label">Academic Dean (Click to View)</span>
                <strong>🎓 {activeCampus.dean} ↗</strong>
              </div>
            </div>

            <div className="featured-kpi-grid">
              <div className="featured-kpi-card">
                <strong className="maven-black">{activeCampus.totalStudents}</strong>
                <span>Enrolled Students</span>
              </div>
              <div className="featured-kpi-card">
                <strong className="maven-black">{activeCampus.totalFaculty}</strong>
                <span>Teaching Faculty</span>
              </div>
              <div className="featured-kpi-card">
                <strong className="maven-black">{activeCampus.totalBuses} Buses</strong>
                <span>Assigned Fleet</span>
              </div>
              <div className="featured-kpi-card">
                <strong className="maven-black" style={{ color: '#059669' }}>{activeCampus.placementRate}</strong>
                <span>Avg: {activeCampus.avgPackage}</span>
              </div>
            </div>

            <div className="featured-actions-row">
              <button className="btn-campus-link" onClick={() => navigate('/admin/students')}>
                👥 View Student Cohorts →
              </button>
              <button className="btn-campus-link" onClick={() => navigate('/admin/faculty')}>
                🎓 View Campus Faculty Roster →
              </button>
              <button className="btn-campus-link" onClick={() => navigate('/admin/placements')}>
                💼 View Placement Drives →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 9 Group Innovation Hubs, Labs & Societies */}
      <section className="hubs-explorer-section">
        <div className="section-title-wrap">
          <span className="section-badge-eyebrow">ECOSYSTEM HUBS &amp; STUDENT DEVELOPMENT</span>
          <h2 className="section-main-title maven-black">Innovation Hubs, Labs &amp; Societies (9 Modules)</h2>
          <p className="section-sub-desc">
            Explore active innovation testbeds, competitive coding arenas, IoT municipal networks, robotics, cybersecurity, and leadership councils.
          </p>
        </div>

        {/* Category Filters for Hubs */}
        <div className="hubs-filter-bar">
          {hubCategories.map(cat => (
            <button
              key={cat}
              className={`hubs-filter-btn ${hubCategory === cat ? 'active' : ''}`}
              onClick={() => setHubCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="hubs-grid-8">
          {filteredHubs.map(hub => (
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
                  <h4 className="maven-black">{hub.name}</h4>
                  <p className="hub-summary-text">{hub.summary}</p>

                  <div className="hub-metrics-box">
                    <strong className="maven-black">{hub.metrics.primary}</strong>
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

      {/* 4. Hub Dossier Modal Viewer */}
      {selectedHubModal && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedHubModal(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{selectedHubModal.icon}</span>
                <div>
                  <h3 className="modal-title maven-black">{selectedHubModal.name}</h3>
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
              <p style={{ fontSize: 13, color: 'var(--text, #334155)', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                {selectedHubModal.summary}
              </p>

              <div className="hub-modal-grid">
                <div
                  className="hub-modal-info-box clickable"
                  onClick={() => {
                    handleOpenLeadershipProfile(
                      selectedHubModal.coordinator,
                      selectedHubModal.coordinatorRole || 'Hub Coordinator',
                      'Faculty Lead',
                      'KIET Group of Institutions',
                      selectedHubModal.name
                    )
                  }}
                  title="Click to view full coordinator profile"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="box-lbl">Supervising Coordinator (Click to View)</span>
                  <strong style={{ color: '#0284c7' }}>👤 {selectedHubModal.coordinator} ↗</strong>
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
                  <span className="box-lbl">Milestones &amp; Records</span>
                  <strong style={{ color: '#0284c7' }}>🏅 {selectedHubModal.metrics.secondary}</strong>
                </div>
              </div>

              <div style={{ background: 'var(--surface, #f8fafc)', padding: 14, borderRadius: 10, border: '1px solid var(--line, #e2e8f0)' }}>
                <strong style={{ fontSize: 12.5, color: 'var(--navy, #0f172a)', display: 'block', marginBottom: 4 }}>
                  Featured Projects &amp; Live Initiatives:
                </strong>
                <ul className="hub-projects-list">
                  {selectedHubModal.featuredProjects?.map((p, idx) => (
                    <li key={idx}><strong>{p}</strong></li>
                  ))}
                </ul>
              </div>

              {selectedHubModal.equipment && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted, #475569)' }}>
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

      {/* 6. Profile Dossier Modal */}
      {selectedProfileModal && (
        <ProfileModal
          profile={selectedProfileModal}
          onClose={() => setSelectedProfileModal(null)}
        />
      )}
    </div>
  )
}
