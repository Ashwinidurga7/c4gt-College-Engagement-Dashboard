import React from 'react'

export default function CampusPages({ type }) {
  const data = {
    events: {
      title: 'Events',
      subtitle: 'Discover activities and events across the campus.',
      items: [
        ['AI Bootcamp', 'Technology', 'Hands-on AI learning and technical activities.'],
        ['KPL Season 2', 'Sports', 'Campus sports and student participation.'],
        ['Innovation Activities', 'Innovation', 'Project and innovation opportunities.'],
      ],
    },

    announcements: {
      title: 'Announcements',
      subtitle: 'Important updates for students.',
      items: [
        ['Academic Updates', 'Academic', 'Latest academic and examination information.'],
        ['Campus Updates', 'Campus', 'New campus activities and opportunities.'],
        ['Student Updates', 'Student', 'Student engagement and participation updates.'],
      ],
    },

    hub: {
      title: 'C4GT Hub @ KIET',
      subtitle: 'Technology, innovation, projects and student opportunities.',
      items: [
        ['Coding & Development', 'Technology', 'Build technical skills through coding and projects.'],
        ['Projects & Innovation', 'Innovation', 'Work on practical projects and ideas.'],
        ['Internships & Opportunities', 'Career', 'Explore practical learning and career opportunities.'],
      ],
    },

    clubs: {
      title: 'Clubs & Communities',
      subtitle: 'Explore student communities and activities.',
      items: [
        ['Global Coding Club', 'Technical', 'Coding and technology-focused student community.'],
        ['C4GT Hub @ KIET', 'Innovation', 'Technology and project-focused student community.'],
        ['Toastmasters', 'Communication', 'Communication and leadership development.'],
        ['NCC & NSS', 'Community', 'Social service and student activities.'],
      ],
    },
  }

  const page = data[type] || data.events

  return (
    <div className="campus-page">
      <div className="campus-eyebrow">KIET ENGAGEMENT</div>
      <h1 className="campus-title">{page.title}</h1>
      <p className="campus-subtitle">{page.subtitle}</p>

      <div className="campus-grid">
        {page.items.map(([title, category, description]) => (
          <div className="campus-item" key={title}>
            <span className="campus-tag">{category}</span>

            <h2>{title}</h2>

            <p>{description}</p>

            <button className="btn btn-primary">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}