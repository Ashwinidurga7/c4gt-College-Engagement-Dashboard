import { ArrowDown, ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { SECTION_LABELS, sectionHasContent } from '@/features/student/resume/resumeAdapter'
import { AchievementsSection } from '@/features/student/resume/sections/AchievementsSection'
import { CertificationsSection } from '@/features/student/resume/sections/CertificationsSection'
import { EducationSection } from '@/features/student/resume/sections/EducationSection'
import { ExperienceSection } from '@/features/student/resume/sections/ExperienceSection'
import { ExtracurricularSection } from '@/features/student/resume/sections/ExtracurricularSection'
import { PersonalSection } from '@/features/student/resume/sections/PersonalSection'
import { ProjectsSection } from '@/features/student/resume/sections/ProjectsSection'
import { SkillsSection } from '@/features/student/resume/sections/SkillsSection'
import { SummarySection } from '@/features/student/resume/sections/SummarySection'

const SECTION_EDITORS = {
  summary: SummarySection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  certifications: CertificationsSection,
  achievements: AchievementsSection,
  extracurricular: ExtracurricularSection,
}

/** Include switch and keyboard-friendly Up/Down buttons (no drag and drop). */
function SectionControls({ id, label, index, count, visible, actions, order, onMoved }) {
  const move = (step) => {
    actions.moveSection(order, id, step)
    onMoved(`${label} moved to position ${index + step + 1} of ${count}.`)
  }
  return (
    <div className="flex shrink-0 items-center gap-1">
      <label className="text-muted-foreground mr-1 flex items-center gap-2 text-xs font-medium">
        <Switch checked={visible} onCheckedChange={(checked) => actions.setSectionVisible(id, checked)} aria-label={`Include ${label} in resume`} />
        <span aria-hidden className="hidden sm:inline">
          Include
        </span>
      </label>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => move(-1)}>
        <ArrowUp />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Move ${label} down`} disabled={index === count - 1} onClick={() => move(1)}>
        <ArrowDown />
      </Button>
    </div>
  )
}

/**
 * One accordion item per resume section, in the student's order. Personal details are the
 * resume header, so they are always first and always included.
 */
export function ResumeEditor({ model, base, draft, actions, errors, openSections, onOpenChange }) {
  const [announcement, setAnnouncement] = useState('')
  const order = model.sectionOrder
  const extra = {
    personal: { profilePhone: base.personal.phone },
    summary: { profileBio: base.summary },
    skills: { skillText: draft.skills },
  }

  return (
    <div className="bg-card shadow-soft rounded-xl border px-4 sm:px-5">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <Accordion type="multiple" value={openSections} onValueChange={onOpenChange}>
        <AccordionItem value="personal">
          <AccordionTrigger>{SECTION_LABELS.personal}</AccordionTrigger>
          <AccordionContent>
            <PersonalSection model={model} actions={actions} errors={errors} {...extra.personal} />
          </AccordionContent>
        </AccordionItem>

        {order.map((id, index) => {
          const Editor = SECTION_EDITORS[id]
          const label = SECTION_LABELS[id]
          const visible = model.sectionVisible[id]
          const empty = !sectionHasContent(model, id)
          return (
            <AccordionItem key={id} value={id}>
              <div className="flex items-center gap-2">
                <AccordionTrigger>
                  <span className="flex min-w-0 flex-col">
                    <span className={visible ? undefined : 'text-muted-foreground'}>{label}</span>
                    {(!visible || empty) && (
                      <span className="text-muted-foreground text-xs font-normal">{visible ? 'Nothing to include yet' : 'Left out of the PDF'}</span>
                    )}
                  </span>
                </AccordionTrigger>
                <SectionControls id={id} label={label} index={index} count={order.length} visible={visible} actions={actions} order={order} onMoved={setAnnouncement} />
              </div>
              <AccordionContent>
                <Editor model={model} actions={actions} {...extra[id]} />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
