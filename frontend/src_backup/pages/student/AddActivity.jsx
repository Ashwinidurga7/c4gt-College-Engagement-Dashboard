import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'

export default function AddActivity(){
  const { addActivity } = useData()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Workshop')

  function handleSubmit(e){
    e.preventDefault()
    addActivity({ title, category, userId: user.id })
    setTitle('')
  }

  return (
    <div>
      <h2 style={{color:'var(--ink-navy)',fontFamily:'Fraunces, serif'}}>Add Activity</h2>
      <form onSubmit={handleSubmit} style={{display:'grid',gap:12,maxWidth:640}}>
        <label>
          <div style={{color:'var(--muted)'}}>Title</div>
          <input value={title} onChange={e=>setTitle(e.target.value)} required style={{width:'100%',padding:8,borderRadius:6}} />
        </label>
        <label>
          <div style={{color:'var(--muted)'}}>Category</div>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:8,borderRadius:6}}>
            <option>Workshop</option>
            <option>Hackathon</option>
            <option>Internship</option>
            <option>Certification</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          <div style={{color:'var(--muted)'}}>Evidence (URL)</div>
          <input placeholder="https://..." style={{width:'100%',padding:8,borderRadius:6}} />
        </label>
        <div>
          <button type="submit" style={{background:'var(--ink-navy)',color:'#fff',padding:'8px 12px',borderRadius:6}}>Submit Activity</button>
        </div>
      </form>
    </div>
  )
}
