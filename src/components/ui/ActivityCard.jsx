import React, { useRef, useCallback } from 'react'
import Tilt from './Tilt'
import AnimatedBadge from './AnimatedBadge'

export default function ActivityCard({
  avatar,
  title,
  subtitle,
  time,
  status = 'pending',
  category, // e.g. 'C4GT Hub', 'GCC', 'Toust Masters', 'Internships'
  count,
  evidenceData,
  evidenceThumb,
  evidenceName,
  onClick,
  children,
}){
  const containerRef = useRef(null)

  const createRipple = useCallback((e) => {
    const el = containerRef.current
    if(!el) return
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 0.6
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const span = document.createElement('span')
    span.className = 'ripple-effect'
    span.style.width = span.style.height = `${size}px`
    span.style.left = `${x}px`
    span.style.top = `${y}px`
    el.appendChild(span)
    setTimeout(()=>{ span.remove() }, 700)
  }, [])

  return (
    <Tilt>
      <div
        ref={containerRef}
        className="card frosted-panel activity-card"
        onClick={onClick}
        onMouseDown={createRipple}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={e => {
          if(!onClick) return
          if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) }
        }}
        style={{padding:14, cursor: onClick ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent', position:'relative', overflow:'hidden'}}
      >
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:56,height:56,borderRadius:12,overflow:'hidden',flexShrink:0,background:'linear-gradient(135deg,var(--accent-1),var(--accent-3))'}}>
            {avatar ? <img src={avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : null}
          </div>

          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'space-between'}}>
              <div style={{fontSize:15,fontWeight:700,color:'var(--color-ink-navy)'}}>{title}</div>
              {category && <AnimatedBadge label={category} count={count} variant={count ? 'count' : 'pill'} small />}
            </div>
              <div className="small muted" style={{marginTop:6}}>{subtitle}</div>
              {(evidenceThumb || evidenceData) && (
                <div style={{marginTop:8}}>
                  {/* prefer thumbnail (image or generated from pdf), otherwise link to evidenceData */}
                  {evidenceThumb ? (
                    <img src={evidenceThumb} alt={evidenceName || 'evidence'} className="thumb" />
                  ) : (evidenceData && String(evidenceData).startsWith('data:image') ? (
                    <img src={evidenceData} alt={evidenceName || 'evidence'} className="thumb" />
                  ) : evidenceData ? (
                    <a href={evidenceData} target="_blank" rel="noreferrer">View evidence</a>
                  ) : null)}
                </div>
              )}
          </div>

          <div style={{textAlign:'right'}}>
            <div className={`seal ${status}`} style={{transform:'rotate(0deg)',fontSize:12,padding:'6px 8px'}}>
              {status === 'verified' ? 'VERIFIED' : status === 'rejected' ? 'REJECTED' : 'PENDING'}
            </div>
            <div className="small muted" style={{marginTop:6}}>{time}</div>
          </div>
        </div>

        {children && <div style={{marginTop:12}}>{children}</div>}
      </div>
    </Tilt>
  )
}
