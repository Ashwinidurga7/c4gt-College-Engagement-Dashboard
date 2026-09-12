import React, { useEffect, useState } from 'react'

export default function Seal({ status }) {
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{ setMounted(true); return ()=>setMounted(false) }, [])
  const color = status === 'Verified' ? 'var(--verified-green)' : status === 'Pending' ? 'var(--seal-gold)' : 'var(--rejected-red)'
  const style = {display:'inline-block',background:color,color:'#fff',padding:'6px 8px',borderRadius:6,fontWeight:700,transform:'rotate(-6deg)'}
    return (
      <span className={`seal ${status === 'Verified' ? 'verified' : status === 'Rejected' ? 'rejected' : 'pending'}`} style={{fontFamily:'Fraunces, serif',padding:'6px 10px',boxShadow:'0 4px 10px rgba(31,51,88,0.08)',...style,opacity: mounted ? 1 : 0, transform: mounted ? 'rotate(-6deg) scale(1)' : 'rotate(-6deg) scale(.92)', transition: 'opacity .22s ease, transform .22s cubic-bezier(.2,.9,.25,1)'}}>
        {status}
      </span>
    )
}
