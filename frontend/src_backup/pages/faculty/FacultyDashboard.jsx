import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import Tilt from '../../components/ui/Tilt'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const { activities, updateActivityStatus, updateActivityStatusWithMeta } = useData()
  const pending = activities.filter(a => a.status === 'Pending')
  const [showReject, setShowReject] = useState(false)
  const [selected, setSelected] = useState(null)
  const [reason, setReason] = useState('')

  function handleApprove(id){
    updateActivityStatus(id,'Verified')
  }

  function handleReject(id){
    setSelected(id)
    setReason('')
    setShowReject(true)
  }

  function confirmReject(){
    if(!selected) return
    updateActivityStatusWithMeta(selected,'Rejected',{ rejectionReason: reason, rejectedBy: user?.name || 'Faculty', reviewedAt: Date.now() })
    setShowReject(false)
    setSelected(null)
    setReason('')
  }

    return (
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif',margin:0}}>Faculty Reviews</h2>
            <div className="muted">Pending verifications from students</div>
          </div>
        </div>

        <div style={{marginTop:18}}>
          {pending.length===0 && <Tilt><div className="card">No pending activities.</div></Tilt>}
          {pending.map(p=> (
            <Tilt key={p.id}>
              <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div>
                  <div style={{fontWeight:800}}>{p.title}</div>
                  <div className="muted">Submitted by {p.studentName} — {p.category}</div>
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <button className="btn btn-ghost" onClick={()=>handleReject(p.id)}>Reject</button>
                  <button className="btn btn-primary" onClick={()=>handleApprove(p.id)}>Approve</button>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
        {showReject && (
          <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(8,10,20,0.45)'}}>
            <div className="card" style={{width:520}}>
              <h3 style={{margin:0}}>Reject Activity</h3>
              <div className="muted" style={{marginTop:8}}>Provide a reason for rejection.</div>
              <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason" style={{width:'100%',marginTop:12,minHeight:100}} />
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
                <button className="btn" onClick={()=>{setShowReject(false); setSelected(null)}}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmReject}>Confirm Reject</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
