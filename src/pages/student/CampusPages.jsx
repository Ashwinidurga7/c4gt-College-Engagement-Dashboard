import React from 'react'

const KIET = {
  campus1: 'https://www.kietgroup.com/images/aboutus_heroimg.jpg',
  campus2: 'https://www.kietgroup.com/images/aboutus_kiet.jpg',
  sports: 'https://www.kietgroup.com/uploads/1770386196_spot_Untitled%20design%20(3).jpg', // KIET Sports Ground Cricket / KPL
  sportsClub: 'https://www.kietgroup.com/images/aboutus_club4.jpg', // Sports & Athletics Club
  bootcamp: 'https://www.kietgroup.com/uploads/1770628309_spot_Untitled%20design.jpg', // AI Bootcamp / Workshop
  microsoft: 'https://www.kietgroup.com/uploads/1769937787_spot_Untitled%20design.jpg', // Microsoft AI & Dev Lab
  robotics: 'https://www.kietgroup.com/images/aboutus_club1.jpg', // Robotics Lab
  toastmasters: 'https://www.kietgroup.com/images/aboutus_club2.jpg', // Toastmasters Stage Speech
  research: 'https://www.kietgroup.com/images/aboutus_ttl.jpg', // Project Expo / TTL
  innovation: 'https://www.kietgroup.com/images/aboutus_hackathon.jpg', // Innovation Workshops & Ideation
  hackathon: 'https://www.kietgroup.com/images/aboutus_hackathon.jpg', // Skill Workshops
  leaders: 'https://www.kietgroup.com/images/aboutus_leaders.jpg', // Leadership
}

const DATA = {
  events: {
    eyebrow: 'KIET CAMPUS · EVENTS', title: 'Events & Experiences',
    subtitle: 'Discover conferences, workshops and student experiences happening across KIET.',
    hero: KIET.campus1, label: 'Campus life • Events • Experiences',
    items: [
      ['AI Bootcamp', 'TECHNOLOGY', 'KIET reported a 2-day AI Bootcamp covering Python, Linux and core AI algorithms with hands-on learning.', KIET.bootcamp, 'FEB 2026'],
      ['KPL Season 2', 'SPORTS', 'KIET announced the KPL Season 2 auction and tournament, bringing students together through competitive campus sport.', KIET.sports, 'FEB 2026'],
      ['Microsoft Training', 'CAREER', 'Microsoft conducted a 40-day training program at KIET on AI, Machine Learning and NLP with hands-on learning.', KIET.microsoft, 'JAN 2026'],
    ],
  },
  announcements: {
    eyebrow: 'KIET CAMPUS · UPDATES', title: 'Announcements',
    subtitle: 'Keep track of important academic, campus and student notices.',
    hero: KIET.campus2, label: 'Stay informed • Act early • Stay connected',
    items: [
      ['Student Workshops', 'ACADEMIC', 'KIET highlights weekly hands-on workshops, including React, Flutter and Cloud Computing.', KIET.hackathon],
      ['Innovation & Research', 'OPPORTUNITY', 'The KIET site highlights robotics, research activity and an Innovation & Research Hub at KIET II.', KIET.research],
      ['Student Communities', 'STUDENT LIFE', 'Explore coding, robotics, public speaking, leadership, NCC/NSS and sports communities at KIET.', KIET.toastmasters],
    ],
  },
  hub: {
    eyebrow: 'KIET · INNOVATION & INCUBATION', title: 'KIET Innovation Hub (EDC)',
    subtitle: 'Explore entrepreneurship, patent incubation, industrial projects and tech opportunities.',
    hero: KIET.research, label: 'Innovation • Startups • Research',
    items: [
      ['Student Innovation Cell', 'EDC CELL', 'KIET Entrepreneurship Development Cell nurtures student startup ideas, patent filings and prototype grants.', KIET.innovation, '2026'],
      ['Industrial R&D Projects', 'PROJECTS', 'Faculty-guided student teams develop real-world solutions in IoT, AI/ML, autonomous systems and sustainable tech.', KIET.robotics, '2023–26'],
      ['Incubation & Mentorship', 'OPPORTUNITIES', 'Connects promising student founders with alumni venture capital mentors and technology angel networks.', KIET.leaders, 'EDC'],
    ],
  },
  clubs: {
    eyebrow: 'KIET CAMPUS · COMMUNITIES', title: 'Clubs & Communities',
    subtitle: 'Find communities that match your interests, skills and ambitions.',
    hero: KIET.campus1, label: 'Connect • Participate • Grow',
    items: [
      ['Global Coding Club', 'TECHNICAL', 'KIET describes the Global Coding Club as a structured coding community with senior-mentor support and hands-on projects.', KIET.microsoft],
      ['KIET Robotics Lab', 'INNOVATION', 'A student technology community focused on autonomous systems and robotics.', KIET.robotics],
      ['Toastmasters', 'LEADERSHIP', 'KIET’s public-speaking community builds confidence, communication and leadership.', KIET.toastmasters],
      ['KIET Sports & Fitness', 'SPORTS', 'Campus sports and fitness activities encourage teamwork, participation and competition.', KIET.sportsClub],
    ],
  },
}

const Arrow = () => <svg className="campus-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>

export default function CampusPages({ type }) {
  const page = DATA[type] || DATA.events
  return (
    <div className="campus-page campus-page-v2">
      <section className="campus-hero campus-hero-v2">
        <img src={page.hero} alt="KIET campus" />
        <div className="campus-hero-overlay" />
        <div className="campus-hero-glow" />
        <div className="campus-hero-content">
          <span className="campus-pill">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
          <div className="campus-hero-meta"><i />{page.label}</div>
        </div>
        <div className="campus-hero-brand"><b>KIET</b><span>ENGAGE</span></div>
      </section>

      <section className="campus-content-header campus-content-header-v2">
        <div><span className="campus-kicker">KIET ENGAGE</span><h2>Explore {page.title}</h2><p>Designed around the way students discover and participate on campus.</p></div>
        <div className="campus-count"><strong>{String(page.items.length).padStart(2,'0')}</strong><span>FEATURED<br/>ITEMS</span></div>
      </section>

      <section className={`campus-card-grid campus-card-grid-v2 ${type === 'clubs' ? 'four-up' : ''}`}>
        {page.items.map(([title,category,description,image,badge]) => (
          <article className="campus-card campus-card-v2" key={title}>
            <div className="campus-card-media">
              <img src={image} alt={title} loading="lazy" />
              <div className="campus-media-shade" />
              <span className="campus-card-category">{category}</span>
              {badge && <span className="campus-card-year">{badge}</span>}
            </div>
            <div className="campus-card-body">
              <div className="campus-card-line" />
              <h3>{title}</h3>
              <p>{description}</p>
              <button className="campus-view-button" type="button">Explore <Arrow /></button>
            </div>
          </article>
        ))}
      </section>

      <section className="campus-bottom-banner campus-bottom-banner-v2">
        <div><span className="campus-kicker">LIFE AT KIET</span><h3>Learn beyond the classroom.</h3><p>Academics matter. So do projects, communities, events and the people you meet along the way.</p></div>
        <div className="campus-banner-image"><img src={KIET.campus2} alt="KIET campus buildings" loading="lazy" /><span>KIET · KORANGI, KAKINADA</span></div>
      </section>
    </div>
  )
}
