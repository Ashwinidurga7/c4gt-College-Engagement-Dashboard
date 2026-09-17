import React, { useState } from 'react'
import ProfileModal from '../../components/ui/ProfileModal'
import Icon from '../../components/ui/Icon'

const KIET = {
  campus1: '/images/kiet/aboutus_kiet.jpg',
  campus2: '/images/kiet/aboutus_kiek.jpg',
  campus3: '/images/kiet/aboutus_kiew.jpg',
  sports: '/images/kiet/aboutus_club4.jpg',
  sportsClub: '/images/kiet/aboutus_club4.jpg',
  bootcamp: '/images/kiet/aboutus_hackathon.jpg',
  microsoft: '/images/kiet/aboutus_club1.jpg',
  robotics: '/images/kiet/aboutus_club1.jpg',
  toastmasters: '/images/kiet/aboutus_club2.jpg',
  research: '/images/kiet/aboutus_ttl.jpg',
  innovation: '/images/kiet/aboutus_hackathon.jpg',
  hackathon: '/images/kiet/aboutus_hackathon.jpg',
  leaders: '/images/kiet/aboutus_leaders.jpg',
  club3: '/images/kiet/aboutus_club3.jpg',
}

const DATA = {
  events: {
    eyebrow: 'KIET CAMPUS · EVENTS',
    title: 'Events & Experiences',
    subtitle: 'Discover conferences, workshops, hackathons, and student experiences happening across KIET campuses.',
    hero: KIET.campus1,
    label: 'Campus life • Events • Experiences',
    items: [
      {
        title: 'KIET 48-Hour Hackathon 2026',
        category: 'HACKATHON',
        description: 'University-wide 48-hour continuous hackathon with live mentoring by AWS and TCS Solutions Architects.',
        image: KIET.hackathon,
        badge: 'MAR 2026',
        details: 'Compete in teams of 4 across AI/ML, Smart Mobility, and Healthcare IoT tracks. Cash prizes up to ₹2.5 Lakhs.',
      },
      {
        title: 'AI & Generative LLM Bootcamp',
        category: 'TECHNOLOGY',
        description: '2-day intensive bootcamp covering Python, PyTorch, LoRA fine-tuning, and retrieval-augmented generation.',
        image: KIET.bootcamp,
        badge: 'FEB 2026',
        details: 'Hands-on laboratory workshop hosted at the Turing Computing Center with real GPU instances.',
      },
      {
        title: 'KPL Season 2 Cricket Tournament',
        category: 'SPORTS',
        description: 'Annual KIET Premier League auction and floodlit day-night tournament bringing campuses together.',
        image: KIET.sports,
        badge: 'FEB 2026',
        details: '8 franchise teams across KIET, KIET+, and KIEW competing for the Chancellor Rolling Trophy.',
      },
      {
        title: 'Microsoft Azure & AI Workshop',
        category: 'CAREER',
        description: '40-day certification track on cloud architecture, computer vision, and cognitive services.',
        image: KIET.microsoft,
        badge: 'JAN 2026',
        details: 'Led by certified Microsoft instructors leading directly to AI-900 and AZ-900 exam vouchers.',
      },
      {
        title: 'Annual SANSKRITI Cultural Fest',
        category: 'CULTURE',
        description: '3-day university cultural gala featuring classical music, western dance competitions, and celebrity concerts.',
        image: KIET.club3,
        badge: 'DEC 2025',
        details: 'Organized by the KALA Cultural Society at the Open Air Amphitheatre.',
      },
    ],
  },
  announcements: {
    eyebrow: 'KIET CAMPUS · UPDATES',
    title: 'Academic & Campus Announcements',
    subtitle: 'Keep track of examination notices, scholarship circulars, hackathon registrations, and faculty updates.',
    hero: KIET.campus2,
    label: 'Stay informed • Act early • Stay connected',
    items: [
      {
        title: 'Mid-Semester Examinations Schedule',
        category: 'EXAMS',
        description: 'JNTUK Autonomous 2nd & 3rd year mid-semester timetables released with seating allotments.',
        image: KIET.campus1,
        badge: 'URGENT',
        details: 'Exams commence from Monday. Hall tickets available on the student ERP portal.',
      },
      {
        title: 'Smart India Hackathon 2026 Internal Round',
        category: 'INNOVATION',
        description: 'Call for student problem statement submissions for internal evaluation round.',
        image: KIET.research,
        badge: 'SIH 2026',
        details: 'Submit PPT decks to the Innovation Cell before the 25th of this month.',
      },
      {
        title: 'TCS & Infosys Campus Placement Drives',
        category: 'CAREER',
        description: 'Final year registration window open for digital engineering and full-stack developer roles.',
        image: KIET.leaders,
        badge: 'PLACEMENTS',
        details: 'Mock aptitude tests and technical interview coaching scheduled at the Placement Bureau.',
      },
    ],
  },
  hub: {
    eyebrow: 'KIET · INNOVATION & INCUBATION',
    title: 'KIET Innovation Hubs & Labs',
    subtitle: 'Explore entrepreneurship, patent incubation, industrial robotics, IoT testbeds, and deep-tech grants.',
    hero: KIET.research,
    label: 'Innovation • Startups • Research',
    items: [
      {
        title: 'KIET Innovation Hub (EDC)',
        category: 'INCUBATION',
        description: 'Nurtures student startup enterprises, patent filings, and seed grants sponsored by MSME and APIS.',
        image: KIET.innovation,
        badge: '18 STARTUPS',
        details: 'Seed funding grants up to ₹25 Lakhs. 14 patents filed in AY 2024–26.',
      },
      {
        title: 'Autonomous Systems & Robotics Lab',
        category: 'ROBOTICS',
        description: 'Advanced testbed designing ROS 2 rovers, inspection drones, and e-Yantra competition squads.',
        image: KIET.robotics,
        badge: 'ROS 2 & DRONES',
        details: 'Equipped with Nvidia Jetson Orin compute nodes, 3D prototype printers, and flight test arena.',
      },
      {
        title: 'Smart City & Public Utility IoT Lab',
        category: 'IOT & SMART CITY',
        description: 'Deploys LoRaWAN sensor networks and drainage early-warning monitors for Kakinada Municipal Corp.',
        image: KIET.research,
        badge: '12 DEPLOYMENTS',
        details: '40 live LoRaWAN nodes transmitting coastal weather and water quality metrics.',
      },
      {
        title: 'K-Hub Advanced Software Lab',
        category: 'INDUSTRY R&D',
        description: 'Industry-guided software engineering incubator delivering scalable production web applications.',
        image: KIET.microsoft,
        badge: 'IIIT-H PARTNER',
        details: 'Supervised code sprints with weekly industry architecture code reviews.',
      },
    ],
  },
  clubs: {
    eyebrow: 'KIET CAMPUS · COMMUNITIES',
    title: 'Clubs, Societies & Communities',
    subtitle: 'Discover official student chapters across competitive coding, robotics, public speaking, sports, and technical cells.',
    hero: KIET.campus1,
    label: 'Connect • Participate • Grow',
    items: [
      {
        title: 'Google Coding Club',
        category: 'TECHNICAL & AI',
        description: 'High-intensity algorithm sprint cell training engineers across LeetCode, Codeforces, Google Code Jam, HackerRank, and ICPC Collegiate programming contests.',
        image: KIET.bootcamp,
        badge: '450 CODERS',
        details: 'Daily 9:00 PM Code Sprints, 3,200+ problems solved, Turing Computer Labs 3 & 4. Google Developers & GitHub Campus Experts partner.',
      },
      {
        title: 'C4GT club',
        category: 'TECHNICAL & AI',
        description: 'Dedicated open-source public tech cell contributing directly to national Digital Public Infrastructure (DPI), GovTech open repositories, and Samagra Open Source fellowships.',
        image: KIET.campus2,
        badge: '55 DPG REPOS',
        details: 'Samagra GovTech Network, 24 open PRs merged, Digital Governance Lab 2 at KIET+.',
      },
      {
        title: 'Smart City Lab',
        category: 'TECHNICAL & AI',
        description: 'Applied municipal research center deploying low-power LoRaWAN sensor networks, real-time coastal weather telemetry, and automated utility monitors for Kakinada Smart City.',
        image: KIET.research,
        badge: '16 LIVE SENSORS',
        details: '50+ LoRaWAN Nodes, Keysight Digital Analyzers, Data Labs Wing Room 102. Collaborating with Kakinada Smart City Corporation.',
      },
      {
        title: 'NCC And Nss',
        category: 'SOCIETIES & OUTREACH',
        description: 'Paramilitary discipline and social service cell conducting annual training camps, coastal afforestation drives, mega blood donation camps, and disaster relief across Kakinada district.',
        image: KIET.campus3,
        badge: '160 CADETS • 350 NSS',
        details: '3(A) R&R COY NCC Kakinada & NSS JNTUK, NCC Parade Ground & Field Office. Annual mega blood donation drive with 850+ units.',
      },
      {
        title: 'Toastmasters',
        category: 'SOCIETIES & OUTREACH',
        description: 'Chartered institutional club training aspiring engineers in impromptu speaking, parliamentary debate, boardroom communication, and corporate negotiation.',
        image: KIET.toastmasters,
        badge: 'CLUB #7124930',
        details: 'President’s Distinguished Club Recognition, District 98 Toastmasters International. Weekly Saturday afternoon sessions.',
      },
      {
        title: 'Kiet sports and athaletics council(kpl)',
        category: 'SOCIETIES & OUTREACH',
        description: 'Active sports board managing the annual KIET Premier League (KPL Day-Night cricket tournament), floodlit basketball & volleyball courts, and inter-university athletic meets.',
        image: KIET.sports,
        badge: '28 TEAMS • KPL CUP',
        details: 'Standard Turf Cricket Ground, 400m Track, Floodlit Courts, 720+ student athletes competing for Chancellor Rolling Trophy.',
      },
      {
        title: 'Hackathons',
        category: 'INNOVATION & COMPETITIONS',
        description: 'Specialized university committee mentoring squads for Smart India Hackathon (SIH), UNESCO India-Africa, AICTE Manthan, and national 48-hour hackathons.',
        image: KIET.hackathon,
        badge: '28 MAJOR WINS',
        details: '₹18.5 Lakhs prize money won, SIH Grand Finale prep, Innovation Tower 4th Floor at KIET+.',
      },
      {
        title: 'Robotics',
        category: 'TECHNICAL & AI',
        description: 'Advanced industrial robotics testbed at KIET designing ROS 2 autonomous exploration rovers, quadcopter inspection drones, LiDAR-equipped warehouse AGVs, and multi-axis robotic arms.',
        image: KIET.robotics,
        badge: 'ROS 2 & ROVERS',
        details: 'e-Yantra IIT Bombay & RoboCon trials live. Equipped with Nvidia Jetson AGX Orin, 3D prototype printers, and Velodyne LiDAR.',
      },
      {
        title: 'Cyber Security',
        category: 'TECHNICAL & AI',
        description: 'Premier cybersecurity research & defense cell at KIET specializing in vulnerability assessment, penetration testing (VAPT), digital forensics, malware reverse-engineering, and national CTF challenges.',
        image: KIET.microsoft,
        badge: 'TOP 50 CTF',
        details: 'Zero-Trust Network Architecture, OWASP Top 10 Sandbox, Threat Intelligence Lab 3rd Floor at KIET+.',
      },
    ],
  },
}

const Arrow = () => (
  <svg className="campus-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

export default function CampusPages({ type }) {
  const page = DATA[type] || DATA.events
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <div className="campus-page campus-page-v2 fade-in">
      {/* 1. Hero Header */}
      <section className="campus-hero campus-hero-v2">
        <img
          src={page.hero}
          alt="KIET campus"
          onError={e => {
            e.currentTarget.src = KIET.campus1
          }}
        />
        <div className="campus-hero-overlay" />
        <div className="campus-hero-glow" />
        <div className="campus-hero-content">
          <span className="campus-pill">{page.eyebrow}</span>
          <h1 className="maven-black">{page.title}</h1>
          <p>{page.subtitle}</p>
          <div className="campus-hero-meta">
            <i />
            {page.label}
          </div>
        </div>
        <div className="campus-hero-brand">
          <b>KIET</b>
          <span>ENGAGE</span>
        </div>
      </section>

      {/* 2. Content Header */}
      <section className="campus-content-header campus-content-header-v2">
        <div>
          <span className="campus-kicker">CAMPUS ECOSYSTEM</span>
          <h2 className="maven-black">Explore {page.title}</h2>
          <p>Verified student clubs, innovation centers, and campus activities at KIET.</p>
        </div>
        <div className="campus-count">
          <strong className="maven-black">{String(page.items.length).padStart(2, '0')}</strong>
          <span>
            ACTIVE
            <br />
            ENTITIES
          </span>
        </div>
      </section>

      {/* 3. Cards Grid */}
      <section
        className={`campus-card-grid campus-card-grid-v2 ${
          type === 'clubs' ? 'four-up' : ''
        }`}
      >
        {page.items.map(item => (
          <article
            className="campus-card campus-card-v2"
            key={item.title}
            onClick={() => setSelectedItem(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className="campus-card-media">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                onError={e => {
                  e.currentTarget.src = KIET.campus1
                }}
              />
              <div className="campus-media-shade" />
              <span className="campus-card-category">{item.category}</span>
              {item.badge && <span className="campus-card-year">{item.badge}</span>}
            </div>
            <div className="campus-card-body">
              <div className="campus-card-line" />
              <h3 className="maven-black">{item.title}</h3>
              <p>{item.description}</p>
              <button
                className="campus-view-button"
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  setSelectedItem(item)
                }}
              >
                Inspect Details <Arrow />
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* 4. Bottom Banner */}
      <section className="campus-bottom-banner campus-bottom-banner-v2">
        <div>
          <span className="campus-kicker">LIFE AT KIET</span>
          <h3 className="maven-black">Learn beyond the classroom.</h3>
          <p>
            Academics matter. So do practical engineering projects, open-source communities, hackathons, and corporate internships.
          </p>
        </div>
        <div className="campus-banner-image">
          <img
            src={KIET.campus2}
            alt="KIET campus buildings"
            loading="lazy"
            onError={e => {
              e.currentTarget.src = KIET.campus1
            }}
          />
          <span>KIET · KORANGI, KAKINADA</span>
        </div>
      </section>

      {/* 5. Detail Modal */}
      {selectedItem && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title maven-black">{selectedItem.title}</h3>
                <span className="hub-modal-header-badge">
                  {selectedItem.category} • {selectedItem.badge || 'Active Community'}
                </span>
              </div>
              <button className="btn-modal-close" onClick={() => setSelectedItem(null)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ borderRadius: 12, overflow: 'hidden', height: 180, marginBottom: 14 }}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    e.currentTarget.src = KIET.campus1
                  }}
                />
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text, #334155)', lineHeight: 1.6 }}>
                {selectedItem.description}
              </p>
              {selectedItem.details && (
                <div
                  style={{
                    background: 'var(--surface, #f8fafc)',
                    padding: 14,
                    borderRadius: 10,
                    border: '1px solid var(--line, #e2e8f0)',
                    marginTop: 12,
                  }}
                >
                  <strong style={{ fontSize: 12, color: 'var(--navy, #0f172a)', display: 'block', marginBottom: 4 }}>
                    Entity Highlights &amp; Activities:
                  </strong>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--muted, #475569)', lineHeight: 1.55 }}>
                    {selectedItem.details}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-close-secondary"
                onClick={() => setSelectedItem(null)}
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
