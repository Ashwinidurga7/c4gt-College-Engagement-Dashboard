import { useState, useEffect, useRef } from 'react'

export default function useCountUp(target = 0, duration = 1000){
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(()=>{
    const from = fromRef.current
    const to = Number(target) || 0
    const diff = to - from
    if(rafRef.current) cancelAnimationFrame(rafRef.current)
    if(duration <= 0 || diff === 0){ setValue(to); fromRef.current = to; return }

    function step(ts){
      if(!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(from + diff * eased))
      if(progress < 1){ rafRef.current = requestAnimationFrame(step) }
      else { fromRef.current = to; startRef.current = null }
    }

    rafRef.current = requestAnimationFrame(step)

    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); startRef.current = null }
  },[target,duration])

  return value
}
