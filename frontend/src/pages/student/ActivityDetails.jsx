import React from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import Tilt from '../../components/ui/Tilt'
import Seal from '../../components/ui/Seal'

export default function ActivityDetails(){
  const { id } = useParams()
  const { activities } = useData()
  const activity = activities.find(a=>a.id===id)

  if (!activity) return <div>Activity not found</div>

  return (
    <div>
      <h2 style={{color:'var(--ink-navy)',fontFamily:'var(--font-heading)',fontWeight:900}}>Activity Details</h2>
      <Tilt>
        <div className="card" style={{marginTop:12}}>
          <h3>{activity.title}</h3>
          <div style={{color:'var(--muted)'}}>Category: {activity.category}</div>
          <div style={{marginTop:8}}>Status: <Seal status={activity.status} /></div>
          <div style={{marginTop:12}}>Submitted by: {activity.userId}</div>
        </div>
      </Tilt>
    </div>
  )
}
