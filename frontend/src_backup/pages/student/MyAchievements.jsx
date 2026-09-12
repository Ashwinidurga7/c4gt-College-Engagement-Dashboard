import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Tilt from '../../components/ui/Tilt'
import Seal from '../../components/ui/Seal'
import AddCertificationForm from '../../components/ui/AddCertificationForm'

export default function MyAchievements(){
  const { user } = useAuth()
  const { activities } = useData()
  const verified = activities.filter(a=>a.userId===user.id && a.status==='Verified')

  return (
    <div>
      <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif'}}>My Achievements</h2>
      <div style={{marginTop:12,marginBottom:12}}>
        <AddCertificationForm onAdded={(item)=>{ /* optional callback */ }} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:12}}>
        {verified.map(a=> (
          <Tilt key={a.id}>
            <div className="card">
              <div style={{fontWeight:700}}>{a.title}</div>
              <div style={{color:'var(--muted)'}}>{a.category}</div>
              <div style={{marginTop:8}}><Seal status={a.status} /></div>
            </div>
          </Tilt>
        ))}
        {verified.length===0 && <div>No verified achievements yet.</div>}
      </div>
    </div>
  )
}
