import { IncludeList } from '@/features/student/resume/sections/IncludeList'

/** Club and campus activities from the Portfolio. */
export function ExtracurricularSection({ model, actions }) {
  return (
    <IncludeList
      id="resume-extracurricular-list"
      items={model.extracurricular}
      onToggle={(item, included) => actions.setItem('extracurricular', item.id, { included })}
      describe={(item) => ({ title: item.role ? `${item.title} (${item.role})` : item.title, meta: item.description })}
      emptyText="No club or campus activities yet, so this section is left out."
      emptyLink={{ to: '/student/clubs', label: 'Explore clubs' }}
    />
  )
}
