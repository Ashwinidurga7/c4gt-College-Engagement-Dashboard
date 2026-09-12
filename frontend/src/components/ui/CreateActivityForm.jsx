import React, { useState } from 'react'
import { useRealtime } from '../../contexts/RealtimeContext'

const CATEGORIES = ['KIET Innovation Hub (EDC)', 'Global Coding Club', 'Toastmasters', 'Internships', 'Certifications']

export default function CreateActivityForm({ onCreated }){
  const { emitLocal } = useRealtime()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [subtext, setSubtext] = useState('')
  const [loading, setLoading] = useState(false)

  function reset(){ setTitle(''); setSubtext(''); setCategory(CATEGORIES[0]) }

  async function handleSubmit(e){
    e.preventDefault()
    if(!title.trim()) return
    setLoading(true)
    const payload = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      category,
      subtitle: subtext.trim(),
      user: 'You',
      time: new Date().toISOString(),
    }

    // optimistic add
    const item = emitLocal ? emitLocal(payload) : payload

    // allow caller to react (optional)
    if(onCreated) onCreated(item)

    // simulate network latency until server echoes back (mock server will accept POST)
    setTimeout(()=>{
      setLoading(false)
      reset()
    }, 500)
  }

  return (
    <form className="card frosted-panel" onSubmit={handleSubmit} style={{padding:14}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{flex:1}}>
          <label className="small muted">Activity title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Add activity title" style={{width:'100%',marginTop:6}} />
        </div>

        <div style={{width:160}}>
          <label className="small muted">Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%',marginTop:6}}>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <label className="small muted">Details (optional)</label>
        <textarea value={subtext} onChange={e=>setSubtext(e.target.value)} placeholder="Short description" style={{width:'100%',marginTop:6}} />
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
        <button type="button" className="btn btn-ghost" onClick={reset} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading? 'Posting...' : 'Post Activity'}</button>
      </div>
    </form>
  )
}
