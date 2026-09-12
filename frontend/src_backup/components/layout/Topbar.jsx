import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  function handleLogout(){
    logout()
    nav('/')
  }

  return (
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:14,borderBottom:'1px solid rgba(31,51,88,0.04)',background:'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)'}}>
      <div style={{fontWeight:700,fontFamily:'Fraunces, serif',color:'var(--ink-navy)',fontSize:18}}>C4GT Dashboard</div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:700}}>{user?.name || 'Guest'}</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>{user?.role || ''}</div>
        </div>
        {user && <button onClick={handleLogout} className="btn">Logout</button>}
      </div>
    </header>
  )
}
