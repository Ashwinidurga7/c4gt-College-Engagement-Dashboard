import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Tilt from '../../components/ui/Tilt'

const departmentData = [
  { department: 'CSE', students: 820 },
  { department: 'AIDS', students: 610 },
  { department: 'ECE', students: 720 },
  { department: 'EEE', students: 480 },
  { department: 'MECH', students: 390 },
]

const engagementData = [
  { month: 'Apr', engagement: 58 },
  { month: 'May', engagement: 64 },
  { month: 'Jun', engagement: 68 },
  { month: 'Jul', engagement: 72 },
  { month: 'Aug', engagement: 79 },
  { month: 'Sep', engagement: 84 },
]

const announcements = [
  {
    id: 1,
    title: 'Mid Examination Schedule Released',
    type: 'Academic',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Hackathon 2026 registrations are now open',
    type: 'Event',
    time: '5 hours ago',
  },
  {
    id: 3,
    title: 'Campus placement training starts Monday',
    type: 'Placement',
    time: 'Yesterday',
  },
]

const campusActivities = [
  {
    id: 1,
    title: 'React & Web Development Workshop',
    category: 'Technical',
    organizer: 'Coding Club',
    date: 'Sep 05, 2026',
    participants: 120,
  },
  {
    id: 2,
    title: 'Inter College Football Tournament',
    category: 'Sports',
    organizer: 'Sports Club',
    date: 'Sep 07, 2026',
    participants: 80,
  },
  {
    id: 3,
    title: 'NSS Community Service Drive',
    category: 'Social',
    organizer: 'NSS Unit',
    date: 'Sep 09, 2026',
    participants: 65,
  },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const { activities = [] } = useData()

  const myActivities = activities.filter(
    (activity) => activity.userId === user?.id
  )

  const verifiedActivities = myActivities.filter(
    (activity) => activity.status === 'Verified'
  )

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2
            style={{
              color: 'var(--ink-navy)',
              fontFamily: 'Fraunces, serif',
              margin: 0,
            }}
          >
            Good Morning, {user?.name || 'Student'} 👋
          </h2>

          <div className="muted" style={{ marginTop: 6 }}>
            Here&apos;s what&apos;s happening across the campus today.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost">🔔 Notifications</button>
          <button className="btn btn-primary">Profile</button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 14,
          marginTop: 20,
        }}
      >
        <StatCard
          label="Total Students"
          value="4,280"
          icon="👨‍🎓"
        />

        <StatCard
          label="Active Staff"
          value="186"
          icon="👩‍🏫"
        />

        <StatCard
          label="Today's Activities"
          value={campusActivities.length}
          icon="📅"
        />

        <StatCard
          label="My Verified Activities"
          value={verifiedActivities.length}
          icon="✅"
        />
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: 16,
          marginTop: 18,
        }}
      >
        {/* ANNOUNCEMENTS */}
        <Tilt>
          <div className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: 'var(--ink-navy)',
                  }}
                >
                  College Announcements
                </div>

                <div className="muted" style={{ fontSize: 13 }}>
                  Latest updates from college and staff
                </div>
              </div>

              <button className="btn btn-ghost">View All</button>
            </div>

            <div style={{ marginTop: 14 }}>
              {announcements.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '13px 0',
                    borderBottom: '1px solid #ececec',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        📢 {item.title}
                      </div>

                      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                        {item.type}
                      </div>
                    </div>

                    <div
                      className="muted"
                      style={{
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tilt>

        {/* QUICK ACTIONS */}
        <Tilt>
          <div className="card">
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--ink-navy)',
              }}
            >
              Quick Actions
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                marginTop: 14,
              }}
            >
              <a
                href="/#/student/activities"
                className="btn btn-primary"
              >
                Explore Activities
              </a>

              <a
                href="/#/student/add"
                className="btn"
              >
                Add My Activity
              </a>

              <a
                href="/#/student/achievements"
                className="btn"
              >
                My Achievements
              </a>

              <a
                href="/#/student/analytics"
                className="btn"
              >
                My Analytics
              </a>
            </div>
          </div>
        </Tilt>
      </div>

      {/* CAMPUS ACTIVITIES */}
      <div style={{ marginTop: 18 }}>
        <Tilt>
          <div className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: 'var(--ink-navy)',
                  }}
                >
                  Campus Activities
                </div>

                <div className="muted" style={{ fontSize: 13 }}>
                  Activities happening around your college
                </div>
              </div>

              <button className="btn btn-ghost">
                Explore
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(230px, 1fr))',
                gap: 12,
                marginTop: 15,
              }}
            >
              {campusActivities.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    border: '1px solid #ececec',
                    borderRadius: 12,
                    padding: 14,
                    background: '#fff',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '5px 8px',
                      borderRadius: 999,
                      background: '#f2f4f7',
                    }}
                  >
                    {activity.category}
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      marginTop: 10,
                      color: 'var(--ink-navy)',
                    }}
                  >
                    {activity.title}
                  </div>

                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {activity.organizer}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 12,
                      fontSize: 12,
                    }}
                  >
                    <span>📅 {activity.date}</span>
                    <span>👥 {activity.participants}</span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 12 }}
                  >
                    View Activity
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Tilt>
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 18,
        }}
      >
        {/* BAR CHART */}
        <Tilt>
          <div className="card">
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: 'var(--ink-navy)',
              }}
            >
              Students by Department
            </div>

            <div
              className="muted"
              style={{
                fontSize: 12,
                marginTop: 4,
                marginBottom: 12,
              }}
            >
              Current student distribution
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tilt>

        {/* LINE CHART */}
        <Tilt>
          <div className="card">
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: 'var(--ink-navy)',
              }}
            >
              Student Engagement Trend
            </div>

            <div
              className="muted"
              style={{
                fontSize: 12,
                marginTop: 4,
                marginBottom: 12,
              }}
            >
              Monthly participation score
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tilt>
      </div>

      {/* MY ACTIVITY SUMMARY */}
      <div style={{ marginTop: 18 }}>
        <Tilt>
          <div className="card">
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--ink-navy)',
              }}
            >
              My Activity Summary
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                marginTop: 14,
              }}
            >
              <MiniStat
                label="Total Activities"
                value={myActivities.length}
              />

              <MiniStat
                label="Verified"
                value={verifiedActivities.length}
              />

              <MiniStat
                label="Pending"
                value={
                  myActivities.filter(
                    (activity) => activity.status === 'Pending'
                  ).length
                }
              />

              <MiniStat
                label="Engagement Score"
                value="84 / 100"
              />
            </div>
          </div>
        </Tilt>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <Tilt>
      <div className="card" style={{ minHeight: 105 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div className="muted" style={{ fontSize: 12 }}>
            {label}
          </div>

          <div style={{ fontSize: 21 }}>{icon}</div>
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginTop: 8,
            color: 'var(--ink-navy)',
          }}
        >
          {value}
        </div>
      </div>
    </Tilt>
  )
}

function MiniStat({ label, value }) {
  return (
    <div
      style={{
        border: '1px solid #ececec',
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div className="muted" style={{ fontSize: 12 }}>
        {label}
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginTop: 6,
          color: 'var(--ink-navy)',
        }}
      >
        {value}
      </div>
    </div>
  )
}