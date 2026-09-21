import { dateRange } from '@/features/student/resume/resumeFormat'
import { BulletEditor } from '@/features/student/resume/sections/BulletEditor'
import { IncludeList } from '@/features/student/resume/sections/IncludeList'

/** Internships from the Portfolio, all included by default. */
export function ExperienceSection({ model, actions }) {
  return (
    <IncludeList
      id="resume-experience-list"
      items={model.experience}
      onToggle={(item, included) => actions.setItem('experience', item.id, { included })}
      describe={(item) => ({ title: [item.role, item.company].filter(Boolean).join(', '), meta: dateRange(item.startDate, item.endDate) })}
      details={(item) => (
        <BulletEditor
          idPrefix={`resume-experience-${item.id}-bullet`}
          label={`${item.role || 'the role'} at ${item.company}`}
          bullets={item.bullets}
          onChange={(bullets) => actions.setItem('experience', item.id, { bullets })}
        />
      )}
      emptyText="No internships yet, so this section is left out. That is common for freshers."
      emptyLink={{ to: '/student/portfolio?tab=internships', label: 'Add an internship in Portfolio' }}
    />
  )
}
