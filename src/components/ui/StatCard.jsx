import React from 'react'
import Tilt from './Tilt'

export default function StatCard({ title, value, caption }) {
  return (
    <Tilt className="depth-lg" max={10} scale={1.03}>
      <div className="card" style={{padding:18,minWidth:160}}>
        <div style={{fontSize:12,color:'var(--muted)',textTransform:'uppercase',letterSpacing:0.6}}>{title}</div>
        <div style={{fontSize:26,fontWeight:800,color:'var(--ink-navy)',marginTop:8}}>{value}</div>
        {caption && <div style={{fontSize:12,color:'var(--muted)',marginTop:10}}>{caption}</div>}
      </div>
    </Tilt>
  )
}
