import { IncludeList } from '@/features/student/resume/sections/IncludeList'

export function AchievementsSection({ model, actions }) {
  return (
    <IncludeList
      id="resume-achievements-list"
      items={model.achievements}
      onToggle={(item, included) => actions.setItem('achievements', item.id, { included })}
      describe={(item) => ({ title: item.text })}
      emptyText="No achievements recorded yet, so this section is left out."
      emptyLink={{ to: '/student/portfolio?tab=achievements', label: 'View Portfolio' }}
    />
  )
}
