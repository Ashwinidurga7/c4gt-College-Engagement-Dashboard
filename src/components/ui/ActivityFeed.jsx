import React from 'react'
import { useRealtime } from '../../contexts/RealtimeContext'
import ActivityCard from './ActivityCard'
import CreateActivityForm from './CreateActivityForm'
import { formatDistanceToNow } from 'date-fns'

export default function ActivityFeed({ limit = 20, showComposer = true }){
  const { events } = useRealtime() || { events: [] }

  const items = (events || []).slice(0, limit)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {showComposer && (
        <div>
          <CreateActivityForm />
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
        {items.length === 0 && (
          <div className="card frosted-panel" style={{padding:18}}>No recent activities</div>
        )}

        {items.map(evt => (
          <ActivityCard
            key={evt.id}
            avatar={evt.avatar}
            title={evt.title || `${evt.user || 'Someone'} • ${evt.category || ''}`}
            subtitle={evt.subtitle || (evt.user ? `by ${evt.user}` : '')}
            time={evt.time ? formatDistanceToNow(new Date(evt.time), { addSuffix: true }) : ''}
            status={evt.status || 'pending'}
            category={evt.category}
            count={evt.count}
            evidenceData={evt.evidenceData}
            evidenceThumb={evt.evidenceThumb}
            evidenceName={evt.evidenceName}
            onClick={() => console.log('open', evt)}
          />
        ))}
      </div>
    </div>
  )
}
