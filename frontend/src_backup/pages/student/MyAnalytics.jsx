import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from '../../components/ui/ChartCard'

export default function MyAnalytics(){
  const { user } = useAuth()
  const { activities } = useData()
  const my = activities.filter(a=>a.userId===user.id)

  const byCategory = my.reduce((acc,a)=>{ acc[a.category]= (acc[a.category]||0)+1; return acc}, {})
  const data = Object.entries(byCategory).map(([k,v])=>({name:k, value:v}))

  return (
    <div>
      <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif'}}>My Analytics</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
        <ChartCard title="Activities by Category">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" fill="#1F3358"/></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Engagement Overview">
          <div style={{padding:20,color:'var(--muted)'}}>Engagement score and trends (demo)</div>
        </ChartCard>
      </div>
    </div>
  )
}
