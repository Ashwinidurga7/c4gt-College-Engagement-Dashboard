import { BulletEditor } from '@/features/student/resume/sections/BulletEditor'
import { IncludeList } from '@/features/student/resume/sections/IncludeList'

/** The 3 most recent projects are included by default; bullets start from each description. */
export function ProjectsSection({ model, actions }) {
  return (
    <IncludeList
      id="resume-projects-list"
      items={model.projects}
      onToggle={(item, included) => actions.setItem('projects', item.id, { included })}
      describe={(item) => ({ title: item.title, meta: item.techStack.join(', ') })}
      details={(item) => (
        <BulletEditor
          idPrefix={`resume-project-${item.id}-bullet`}
          label={item.title}
          bullets={item.bullets}
          onChange={(bullets) => actions.setItem('projects', item.id, { bullets })}
        />
      )}
      emptyText="You have no projects yet, so this section is left out."
      emptyLink={{ to: '/student/portfolio?tab=projects', label: 'Add a project in Portfolio' }}
    />
  )
}
