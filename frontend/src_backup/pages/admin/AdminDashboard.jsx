import React, { useState } from 'react'
import Tilt from '../../components/ui/Tilt'
import { useData } from '../../contexts/DataContext'
import { useRealtime } from '../../contexts/RealtimeContext'

function PreviewEvidence({ item }){
  if (!item) return null
  if (item.evidenceThumb) return <img src={item.evidenceThumb} alt={item.evidenceName || 'evidence'} style={{maxWidth:'100%',borderRadius:8}} />
  if (item.evidenceData && String(item.evidenceData).startsWith('data:application/pdf')) return <a href={item.evidenceData} target="_blank" rel="noreferrer">Open PDF evidence</a>
  if (item.evidenceData && String(item.evidenceData).startsWith('data:image')) return <img src={item.evidenceData} alt={item.evidenceName || 'evidence'} style={{maxWidth:'100%',borderRadius:8}} />
  if (item.subtitle) return <a href={item.subtitle} target="_blank" rel="noreferrer">View evidence link</a>
  return <div className="muted">No evidence provided</div>
}

function loadUsers(){
  try {
    const raw = localStorage.getItem('c4gt_users')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export default function AdminDashboard() {
  const initialUsers = loadUsers()
  const [users, setUsers] = useState(initialUsers)
  const { activities, updateActivityStatusWithMeta } = useData()
  const { emitLocal } = useRealtime()

  const pending = activities.filter(a=>a.status==='Pending')

  function toggleActive(email){
    setUsers(prev => prev.map(u => u.email === email ? { ...u, disabled: !u.disabled } : u))
  }

  function approve(id){
    updateActivityStatusWithMeta(id,'Verified')
    const item = activities.find(a=>a.id===id)
    if(item && emitLocal) emitLocal({ ...item, status: 'Verified', time: new Date().toISOString() })
  }

  function reject(id, reason){
    updateActivityStatusWithMeta(id,'Rejected',{ reason })
    const item = activities.find(a=>a.id===id)
    if(item && emitLocal) emitLocal({ ...item, status: 'Rejected', time: new Date().toISOString(), reason })
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif',margin:0}}>Admin — User Management</h2>
          <div className="muted">Manage accounts and roles</div>
        </div>
      </div>

      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1fr 360px',gap:12}}>
        <Tilt>
          <div className="card">
          <div style={{fontWeight:800}}>Users</div>
          <table style={{width:'100%',marginTop:12,borderCollapse:'collapse'}}>
            <thead className="muted"><tr><th style={{textAlign:'left'}}>Name</th><th>Role</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.email} style={{borderTop:'1px solid #f0f0f0'}}>
                  <td style={{padding:'8px 6px'}}>{u.name}</td>
                  <td style={{padding:'8px 6px'}}>{u.role}</td>
                  <td style={{padding:'8px 6px'}} className="muted">{u.email}</td>
                  <td style={{padding:'8px 6px',textAlign:'right'}}>
                    <button className="btn" onClick={()=>toggleActive(u.email)}>{u.disabled ? 'Enable' : 'Disable'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </Tilt>

        <Tilt className="depth-lg">
          <div className="card" style={{maxHeight:600,overflow:'auto'}}>
            <div style={{fontWeight:800}}>Pending Verifications</div>
            <div style={{marginTop:8}}>
              {pending.length === 0 && <div className="muted">No pending submissions.</div>}
              {pending.map(item => (
                <div key={item.id} style={{borderTop:'1px solid #f3f3f3',padding:'10px 0'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontWeight:700}}>{item.title}</div>
                      <div className="muted small">{item.category} • {item.user}</div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn" onClick={()=>approve(item.id)}>Approve</button>
                      <button className="btn btn-ghost" onClick={()=>{ const reason = prompt('Rejection reason'); if(reason) reject(item.id, reason) }}>Reject</button>
                    </div>
                  </div>
                  <div style={{marginTop:8}}>
                    <PreviewEvidence item={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tilt>
      </div>
    </div>
  )
}
