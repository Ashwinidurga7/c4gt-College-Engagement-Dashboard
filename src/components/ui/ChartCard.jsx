import React from 'react'
import Tilt from './Tilt'

export default function ChartCard({ title, children }) {
  return (
    <Tilt>
      <div className="card" style={{padding:16}}>
        <div style={{fontSize:14,fontWeight:600,color:'var(--ink-navy)'}}>{title}</div>
        <div style={{marginTop:12}}>{children}</div>
      </div>
    </Tilt>
  )
}
