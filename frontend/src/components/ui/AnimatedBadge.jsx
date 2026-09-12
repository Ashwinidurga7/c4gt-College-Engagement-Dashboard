import React from 'react'
import useCountUp from '../../hooks/useCountUp'

export default function AnimatedBadge({ label, count, variant = 'count', small = false }){
  const number = useCountUp(count || 0, 900)
  return (
    <div className={`badge ${variant === 'count' ? 'count' : 'pill'} ${small ? 'small':''} badge-animated`} aria-hidden={false}>
      <span style={{fontWeight:700,fontSize:12}}>{label}</span>
      {variant === 'count' && <span style={{background:'rgba(255,255,255,0.08)',padding:'4px 8px',borderRadius:999,fontWeight:700}}>{number}</span>}
    </div>
  )
}
