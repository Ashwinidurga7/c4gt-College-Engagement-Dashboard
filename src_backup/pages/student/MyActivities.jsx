import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import DataTable from '../../components/ui/DataTable'
import Seal from '../../components/ui/Seal'

export default function MyActivities(){
  const { user } = useAuth()
  const { activities } = useData()
  const myActivities = activities.filter(a=>a.userId === user.id)

  const columns = [
    { key:'title', title:'Title' },
    { key:'category', title:'Category' },
    { key:'status', title:'Status', render: r => <Seal status={r.status} /> },
    { key:'actions', title:'', render: r => <Link to={`/student/activity/${r.id}`}>View</Link> }
  ]

  return (
    <div>
      <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif'}}>My Activities</h2>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{color:'var(--muted)'}}>All submitted activities and their verification status.</div>
        <Link to="/student/add"><button style={{background:'var(--seal-gold)',border:'none',padding:'8px 12px',borderRadius:6}}>Add Activity</button></Link>
      </div>
      <DataTable columns={columns} data={myActivities} />
    </div>
  )
}
