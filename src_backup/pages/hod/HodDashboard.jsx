import React from 'react'
import { useData } from '../../contexts/DataContext'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import Tilt from '../../components/ui/Tilt'

export default function HodDashboard() {
  const { activities } = useData()

  const byCategory = activities.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(byCategory).map(([name, value]) => ({ name, value }))

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif',margin:0}}>HOD — Department Overview</h2>
          <div className="muted">Overview of departmental activity and engagement</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:16}}>
        <Tilt className="depth-lg">
          <div className="card">
            <div className="muted">Total Submissions</div>
            <div style={{fontSize:28,fontWeight:800,color:'var(--ink-navy)'}}>{activities.length}</div>
          </div>
        </Tilt>
        <Tilt className="depth-lg">
          <div className="card">
            <div className="muted">Verified</div>
            <div style={{fontSize:28,fontWeight:800,color:'var(--verified-green)'}}>{activities.filter(a=>a.status==='Verified').length}</div>
          </div>
        </Tilt>
        <Tilt className="depth-lg">
          <div className="card">
            <div className="muted">Pending Review</div>
            <div style={{fontSize:28,fontWeight:800,color:'var(--seal-gold)'}}>{activities.filter(a=>a.status==='Pending').length}</div>
          </div>
        </Tilt>
      </div>

      <div style={{display:'flex',gap:12,marginTop:18}}>
        <Tilt style={{flex:1}}>
          <div style={{flex:1}} className="card">
            <div style={{fontWeight:800}}>Activity by Category</div>
            <div style={{height:200,marginTop:8}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--ink-navy)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </Tilt>

        <div style={{width:360,display:'flex',flexDirection:'column',gap:12}}>
          <Tilt>
            <div className="card">
              <div style={{fontWeight:800}}>Top Contributors</div>
            <ul style={{listStyle:'none',padding:0,marginTop:8}}>
              {Object.values(activities.reduce((m,a)=>{m[a.studentName]= (m[a.studentName]||0)+1; return m}, {})).length===0 && <li className="muted">No data</li>}
              {Object.entries(activities.reduce((m,a)=>{m[a.studentName]= (m[a.studentName]||0)+1; return m}, {})).map(([name,count])=> (
                <li key={name} style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
                  <div>{name}</div>
                  <div className="muted">{count}</div>
                </li>
              ))}
            </ul>
            </div>
          </Tilt>

          <Tilt>
            <div className="card">
              <div style={{fontWeight:800}}>Department Notes</div>
              <div className="muted" style={{marginTop:8}}>No outstanding alerts.</div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  )
}
