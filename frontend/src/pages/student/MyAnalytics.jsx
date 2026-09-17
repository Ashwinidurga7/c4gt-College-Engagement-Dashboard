import React from 'react'
import { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'

const COLORS = ['#2458d3','#0d9b7c','#7356d8','#ea9b20']
const KIET = {
  campus: 'https://www.kietgroup.com/images/aboutus_heroimg.jpg',
  robotics: 'https://www.kietgroup.com/images/aboutus_club1.jpg',
  students: 'https://www.kietgroup.com/images/aboutus_ttl.jpg',
  clubs: 'https://www.kietgroup.com/images/aboutus_club2.jpg',
}

export default function MyAnalytics(){
  const { user } = useAuth()
  const { activities } = useData()
  const my = activities.filter(a=>a.userId===user.id)

  const byCategory = useMemo(() => {
    const acc = {}
    my.forEach(a => { acc[a.category] = (acc[a.category]||0) + 1 })
    return Object.entries(acc).map(([name,value])=>({name,value}))
  }, [my])

  const verified = my.filter(a => a.status === 'Verified').length
  const pending = my.filter(a => a.status === 'Pending').length
  const participationTrend = my.length
    ? my.map((a, index) => ({ label: `A${index + 1}`, value: index + 1 }))
    : [{label:'Start',value:0}]

  const engagementScore = my.length ? Math.min(100, 45 + verified * 18 + pending * 6) : 0

  return (
    <div className="student-space-page">
      <section className="space-hero analytics-hero">
        <div className="space-hero-copy">
          <span className="space-eyebrow">MY SPACE · INSIGHTS</span>
          <h1 className="maven-black">My Analytics</h1>
          <p>See how your participation is building over time, what categories you explore most, and where your verified progress stands.</p>
          <div className="space-hero-tags"><span>Participation</span><span>Progress</span><span>Trends</span></div>
        </div>
        <div className="space-hero-image"><img src={KIET.campus} alt="KIET aerial campus" /><div className="space-hero-image-overlay" /><span>KIET · CAMPUS OVERVIEW</span></div>
      </section>

      <section className="space-stat-grid">
        <div className="space-stat"><span>Engagement Score</span><strong className="maven-black">{engagementScore}</strong><small>Based on your current activity mix</small></div>
        <div className="space-stat"><span>Verified</span><strong className="maven-black">{verified}</strong><small>Completed and approved</small></div>
        <div className="space-stat"><span>Pending</span><strong className="maven-black">{pending}</strong><small>Still under review</small></div>
        <div className="space-stat"><span>Categories</span><strong className="maven-black">{byCategory.length}</strong><small>Areas you have explored</small></div>
      </section>

      <section className="analytics-grid-v2">
        <article className="analytics-card-v2 wide"><div className="analytics-head"><div><span>ACTIVITY MIX</span><h3 className="maven-black">Activities by category</h3></div><strong className="maven-black">{my.length} total</strong></div><div className="chart-box"><ResponsiveContainer width="100%" height={260}><BarChart data={byCategory}><CartesianGrid stroke="#e8eef7" strokeDasharray="4 4"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis allowDecimals={false} tick={{fontSize:11}}/><Tooltip/><Bar dataKey="value" fill="#2458d3" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></article>

        <article className="analytics-card-v2"><div className="analytics-head"><div><span>STATUS</span><h3 className="maven-black">Verification split</h3></div></div><div className="chart-box compact"><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={[{name:'Verified',value:verified},{name:'Pending',value:pending}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4}>{[verified,pending].map((_,i)=><Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-legend"><span><i style={{background:COLORS[0]}} />Verified</span><span><i style={{background:COLORS[1]}} />Pending</span></div></div></article>

        <article className="analytics-card-v2"><div className="analytics-head"><div><span>PROGRESS</span><h3 className="maven-black">Participation trend</h3></div><strong className="maven-black">{engagementScore}/100</strong></div><div className="chart-box"><ResponsiveContainer width="100%" height={230}><LineChart data={participationTrend}><CartesianGrid stroke="#e8eef7" strokeDasharray="4 4"/><XAxis dataKey="label" tick={{fontSize:11}}/><YAxis allowDecimals={false} tick={{fontSize:11}}/><Tooltip/><Line type="monotone" dataKey="value" stroke="#7356d8" strokeWidth={3} dot={{r:4}} activeDot={{r:6}}/></LineChart></ResponsiveContainer></div></article>
      </section>
    </div>
  )
}
