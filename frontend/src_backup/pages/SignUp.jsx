import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUp(){
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const [show, setShow] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()){
      setError('All fields are required')
      return
    }
    setLoading(true)
    const res = await signup({ name, email, password })
    setLoading(false)
    if (!res.ok){
      setError(res.error || 'Unable to create account')
      return
    }
    nav(`/${res.user.role.toLowerCase()}`)
  }

  return (
    <div style={{padding:40,maxWidth:640}}>
      <h1 style={{fontFamily:'Fraunces, serif',color:'var(--ink-navy)'}}>Create an account</h1>
      <div style={{marginTop:12}}>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
          <label>
            <div style={{fontSize:13,color:'var(--muted)'}}>Full name</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" style={{padding:10,borderRadius:8,border:'1px solid #e5e7eb'}} />
          </label>
          <label>
            <div style={{fontSize:13,color:'var(--muted)'}}>College email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@college.edu" style={{padding:10,borderRadius:8,border:'1px solid #e5e7eb'}} />
          </label>
          <label>
            <div style={{fontSize:13,color:'var(--muted)'}}>Password</div>
            <div style={{display:'flex',gap:8}}>
              <input type={show ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a secure password" style={{padding:10,borderRadius:8,border:'1px solid #e5e7eb',flex:1}} />
              <button type="button" onClick={()=>setShow(s=>!s)} style={{padding:'8px 10px',borderRadius:6,border:'1px solid #e5e7eb',background:'#fff'}}>{show ? 'Hide' : 'Show'}</button>
            </div>
          </label>

          {error && <div style={{color:'var(--rejected-red)'}}>{error}</div>}

          <div style={{display:'flex',gap:8}}>
            <button type="submit" disabled={loading} style={{background:'var(--ink-navy)',color:'#fff',border:'none',padding:'10px 14px',borderRadius:8}}>{loading ? 'Creating...' : 'Create account'}</button>
            <Link to="/" style={{alignSelf:'center',color:'var(--muted)'}}>Back to sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
