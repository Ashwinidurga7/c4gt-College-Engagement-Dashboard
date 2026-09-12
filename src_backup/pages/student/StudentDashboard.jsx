import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const activityData = [
  { month: 'Apr', participation: 42 },
  { month: 'May', participation: 56 },
  { month: 'Jun', participation: 61 },
  { month: 'Jul', participation: 70 },
  { month: 'Aug', participation: 76 },
  { month: 'Sep', participation: 84 },
]

const categoryData = [
  { name: 'Technical', value: 34 },
  { name: 'Workshops', value: 25 },
  { name: 'Clubs', value: 18 },
  { name: 'Sports', value: 13 },
  { name: 'Social', value: 10 },
]

const departmentData = [
  { name: 'CAI', students: 520 },
  { name: 'CSM', students: 460 },
  { name: 'AID', students: 430 },
  { name: 'CSD', students: 390 },
  { name: 'CSC', students: 350 },
]

const announcements = [
  {
    title: 'AI and technology activities',
    type: 'Academic',
    time: 'Today',
  },
  {
    title: 'New campus activity updates are available',
    type: 'Campus',
    time: 'Today',
  },
  {
    title: 'Workshop and student engagement opportunities',
    type: 'Student',
    time: 'Yesterday',
  },
]

const activities = [
  {
    title: 'Global Coding Club',
    category: 'Club',
    description: 'Coding, development and technical activities',
    action: 'Explore',
  },
  {
    title: 'K-Hub',
    category: 'Innovation',
    description: 'Learning, innovation and technology community',
    action: 'Explore',
  },
  {
    title: 'Toastmasters',
    category: 'Communication',
    description: 'Communication and leadership development',
    action: 'Explore',
  },
  {
    title: 'NCC / NSS',
    category: 'Community',
    description: 'Social service and student participation',
    action: 'Explore',
  },
]

const upcomingEvents = [
  {
    title: 'AI Bootcamp',
    date: '09 Feb 2026',
    category: 'Technology',
    venue: 'Campus',
  },
  {
    title: 'KPL Season 2',
    date: '06 Feb 2026',
    category: 'Sports',
    venue: 'Campus',
  },
  {
    title: 'Innovation Activities',
    date: 'Upcoming',
    category: 'Innovation',
    venue: 'Campus',
  },
]

const pieColors = ['#2563eb', '#0f766e', '#7c3aed', '#ea580c', '#15803d']

export default function StudentDashboard() {
  const currentHour = new Date().getHours()

const greeting =
  currentHour < 12
    ? 'Good Morning'
    : currentHour < 17
      ? 'Good Afternoon'
      : 'Good Evening'
      
  const { user } = useAuth()
  const { activities: myActivitiesData = [] } = useData()

  const myActivities = myActivitiesData.filter(
    (item) => item.userId === user?.id
  )

  const verified = myActivities.filter(
    (item) => item.status === 'Verified'
  )

  const pending = myActivities.filter(
    (item) => item.status === 'Pending'
  )

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>KIET ENGAGE</div>

          <h1 style={styles.title}>
           {greeting}, {user?.name || 'Student'}
          </h1>

          <p style={styles.subtitle}>
            Your campus, activities and opportunities — all in one place.
          </p>
        </div>

        <div style={styles.heroButtons}>
          <button className="btn btn-ghost">
            🔔 Notifications
          </button>

          <button className="btn btn-primary">
            View Profile
          </button>
        </div>
      </section>

      {/* OVERVIEW */}
      <section style={styles.statsGrid}>
        <StatCard
          title="Upcoming Events"
          value="06"
          icon="📅"
          accent="#2563eb"
        />

        <StatCard
          title="Active Communities"
          value="04"
          icon="👥"
          accent="#0f766e"
        />

        <StatCard
          title="My Activities"
          value={myActivities.length}
          icon="🎯"
          accent="#7c3aed"
        />

        <StatCard
          title="Certificates"
          value={verified.length}
          icon="🏆"
          accent="#b45309"
        />
      </section>

      {/* UPDATES */}
      <div style={styles.mainGrid}>
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Campus Updates
              </h2>

              <p style={styles.sectionSub}>
                Latest information for students
              </p>
            </div>

            <button className="btn btn-ghost">
              View All
            </button>
          </div>

          <div>
            {announcements.map((item, index) => (
              <div key={index} style={styles.updateRow}>
                <div style={styles.updateIcon}>
                  📢
                </div>

                <div style={{ flex: 1 }}>
                  <div style={styles.updateTitle}>
                    {item.title}
                  </div>

                  <div style={styles.updateMeta}>
                    {item.type}
                  </div>
                </div>

                <span style={styles.time}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Quick Access
          </h2>

          <p style={styles.sectionSub}>
            Frequently used student features
          </p>

          <div style={styles.quickGrid}>
            <QuickAction
              icon="🎯"
              label="Activities"
              href="/#/student/activities"
            />

            <QuickAction
              icon="🏆"
              label="Achievements"
              href="/#/student/achievements"
            />

            <QuickAction
              icon="📊"
              label="Analytics"
              href="/#/student/analytics"
            />

            <QuickAction
              icon="➕"
              label="Add Activity"
              href="/#/student/add"
            />
          </div>
        </section>
      </div>

      {/* EXPLORE */}
      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Explore KIET
            </h2>

            <p style={styles.sectionSub}>
              Discover communities and student opportunities
            </p>
          </div>
        </div>

        <div style={styles.activityGrid}>
          {activities.map((item) => (
            <div key={item.title} style={styles.activityCard}>
              <div style={styles.category}>
                {item.category}
              </div>

              <h3 style={styles.activityTitle}>
                {item.title}
              </h3>

              <p style={styles.activityDescription}>
                {item.description}
              </p>

              <button className="btn btn-primary">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Upcoming & Recent Events
            </h2>

            <p style={styles.sectionSub}>
              Stay connected with campus activities
            </p>
          </div>

          <button className="btn btn-ghost">
            All Events
          </button>
        </div>

        <div style={styles.eventGrid}>
          {upcomingEvents.map((event) => (
            <div key={event.title} style={styles.eventCard}>
              <div style={styles.eventDate}>
                {event.date}
              </div>

              <h3 style={styles.eventTitle}>
                {event.title}
              </h3>

              <div style={styles.eventMeta}>
                {event.category} · {event.venue}
              </div>

              <button className="btn btn-primary">
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <div style={styles.chartGrid}>
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Student Participation
          </h2>

          <p style={styles.sectionSub}>
            Engagement trend over time
          </p>

          <div style={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="participation"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Activities by Category
          </h2>

          <p style={styles.sectionSub}>
            Current participation distribution
          </p>

          <div style={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Student Distribution
        </h2>

        <p style={styles.sectionSub}>
          Student count by current programme
        </p>

        <div style={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="students"
                fill="#12325b"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* PERSONAL */}
      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              My Engagement
            </h2>

            <p style={styles.sectionSub}>
              Your activity participation summary
            </p>
          </div>

          <strong style={styles.score}>
            84 / 100
          </strong>
        </div>

        <div style={styles.summaryGrid}>
          <SummaryCard
            label="Total Activities"
            value={myActivities.length}
          />

          <SummaryCard
            label="Verified"
            value={verified.length}
          />

          <SummaryCard
            label="Pending"
            value={pending.length}
          />

          <SummaryCard
            label="Certificates"
            value={verified.length}
          />
        </div>
      </section>
    </div>
  )
}

function StatCard({ title, value, icon, accent }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <span style={styles.statTitle}>{title}</span>

        <span
          style={{
            ...styles.statIcon,
            background: `${accent}12`,
          }}
        >
          {icon}
        </span>
      </div>

      <div style={styles.statValue}>
        {value}
      </div>
    </div>
  )
}

function QuickAction({ icon, label, href }) {
  return (
    <a href={href} style={styles.quickAction}>
      <span style={styles.quickIcon}>
        {icon}
      </span>

      <span>{label}</span>

      <span style={styles.arrow}>→</span>
    </a>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryLabel}>
        {label}
      </div>

      <div style={styles.summaryValue}>
        {value}
      </div>
    </div>
  )
}

const styles = {
  page: {
    maxWidth: 1400,
    margin: '0 auto',
    paddingBottom: 40,
  },

  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 24,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    color: '#2563eb',
    marginBottom: 8,
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    color: '#12325b',
  },

  subtitle: {
    margin: '7px 0 0',
    fontSize: 14,
    color: '#64748b',
  },

  heroButtons: {
    display: 'flex',
    gap: 10,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 14,
  },

  statCard: {
    background: '#fff',
    border: '1px solid #dbe4f0',
    borderRadius: 16,
    padding: 18,
    boxShadow:
      '0 3px 10px rgba(15, 23, 42, 0.05)',
  },

  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statTitle: {
    fontSize: 12,
    color: '#64748b',
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: 800,
    color: '#12325b',
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 2fr) minmax(280px, 1fr)',
    gap: 16,
    marginTop: 16,
  },

  card: {
    background: '#fff',
    border: '1px solid #dbe4f0',
    borderRadius: 16,
    padding: 20,
    boxShadow:
      '0 3px 10px rgba(15, 23, 42, 0.04)',
    marginTop: 16,
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 800,
    color: '#12325b',
  },

  sectionSub: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: 12,
  },

  updateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 0',
    borderBottom: '1px solid #edf2f7',
  },

  updateIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  updateTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
  },

  updateMeta: {
    marginTop: 4,
    fontSize: 11,
    color: '#64748b',
  },

  time: {
    fontSize: 11,
    color: '#94a3b8',
  },

  quickGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginTop: 16,
  },

  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #dbe4f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    fontWeight: 700,
  },

  quickIcon: {
    fontSize: 18,
  },

  arrow: {
    marginLeft: 'auto',
    color: '#2563eb',
  },

  activityGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginTop: 18,
  },

  activityCard: {
    background: '#f8fbff',
    border: '1px solid #dbe4f0',
    borderRadius: 14,
    padding: 16,
  },

  category: {
    display: 'inline-block',
    padding: '5px 9px',
    borderRadius: 999,
    background: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 10,
    fontWeight: 800,
  },

  activityTitle: {
    margin: '12px 0 7px',
    fontSize: 16,
    color: '#12325b',
  },

  activityDescription: {
    minHeight: 40,
    margin: 0,
    fontSize: 12,
    lineHeight: 1.5,
    color: '#64748b',
  },

  eventGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 14,
    marginTop: 18,
  },

  eventCard: {
    border: '1px solid #dbe4f0',
    borderRadius: 14,
    padding: 16,
  },

  eventDate: {
    fontSize: 11,
    fontWeight: 800,
    color: '#2563eb',
  },

  eventTitle: {
    margin: '10px 0 5px',
    fontSize: 16,
    color: '#12325b',
  },

  eventMeta: {
    marginBottom: 14,
    fontSize: 12,
    color: '#64748b',
  },

  chartGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },

  chart: {
    width: '100%',
    height: 300,
    marginTop: 16,
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 12,
    marginTop: 18,
  },

  summaryCard: {
    background: '#f8fbff',
    border: '1px solid #dbe4f0',
    borderRadius: 12,
    padding: 15,
  },

  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
  },

  summaryValue: {
    marginTop: 6,
    fontSize: 23,
    fontWeight: 800,
    color: '#12325b',
  },

  score: {
    fontSize: 20,
    color: '#2563eb',
  },
}