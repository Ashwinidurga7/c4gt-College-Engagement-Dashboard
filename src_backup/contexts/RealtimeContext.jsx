import React, { createContext, useContext, useEffect, useState, useRef } from 'react'

const RealtimeContext = createContext(null)

export function useRealtime(){
  return useContext(RealtimeContext)
}

export function RealtimeProvider({ children, url }){
  const [events, setEvents] = useState([])
  const esRef = useRef(null)

  useEffect(()=>{
    const endpoint = url || (import.meta.env.VITE_REALTIME_URL || 'http://localhost:4000/events')
    const es = new EventSource(endpoint)
    esRef.current = es

    es.onmessage = (e) => {
      try{
        const payload = JSON.parse(e.data)
        setEvents(prev => [payload, ...prev].slice(0, 200))
      }catch(err){
        console.error('Realtime parse error', err)
      }
    }

    es.onerror = (err) => {
      console.warn('Realtime connection error', err)
      // EventSource will auto-reconnect; we could implement backoff here
    }

    return ()=>{
      es.close()
      esRef.current = null
    }
  },[url])

  // optimistic local emit (does not persist unless you POST to backend)
  function emitLocal(event){
    const item = { ...event, id: event.id || `local-${Date.now()}`, _local: true, ts: new Date().toISOString() }
    setEvents(prev => [item, ...prev].slice(0,200))
    // attempt to POST to server if available
    const endpoint = (import.meta.env.VITE_REALTIME_EMIT_URL || 'http://localhost:4000/emit')
    fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(item)}).catch(()=>{})
    return item
  }

  return (
    <RealtimeContext.Provider value={{events, emitLocal}}>
      {children}
    </RealtimeContext.Provider>
  )
}

export default RealtimeContext
