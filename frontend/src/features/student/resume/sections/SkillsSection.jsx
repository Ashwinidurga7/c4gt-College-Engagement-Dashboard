import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SKILL_GROUPS } from '@/features/student/resume/resumeAdapter'
import { ResumeField } from '@/features/student/resume/sections/ResumeField'

/**
 * Skills are not in the API, so the student types them. Technologies from their own projects
 * are offered as one-click suggestions; nothing is added without the student choosing it.
 */
export function SkillsSection({ model, skillText, actions }) {
  const known = new Set(Object.values(model.skills).flat().map((skill) => skill.toLowerCase()))
  const suggestions = [...new Set(model.projects.flatMap((project) => project.techStack))].filter((skill) => !known.has(skill.toLowerCase()))
  const textOf = (key) => skillText?.[key] ?? model.skills[key].join(', ')

  function addSuggestion(skill) {
    const current = textOf('other').trim()
    actions.setSkillText('other', current ? `${current.replace(/,\s*$/, '')}, ${skill}` : skill)
  }

  return (
    <div className="flex flex-col gap-4">
      {SKILL_GROUPS.map((group) => (
        <ResumeField
          key={group.key}
          id={`resume-skills-${group.key}`}
          label={group.label}
          value={textOf(group.key)}
          onChange={(text) => actions.setSkillText(group.key, text)}
          hint="Separate skills with commas."
        />
      ))}
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-heading text-sm font-semibold">From your projects</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill) => (
              <Button key={skill} type="button" variant="outline" size="sm" onClick={() => addSuggestion(skill)}>
                <Plus aria-hidden />
                <span className="sr-only">Add </span>
                {skill}
                <span className="sr-only"> to other skills</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
