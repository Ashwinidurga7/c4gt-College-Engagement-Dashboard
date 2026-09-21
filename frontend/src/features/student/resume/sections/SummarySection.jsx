import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeField } from '@/features/student/resume/sections/ResumeField'
import { useSaveProfileField } from '@/features/student/resume/useSaveProfileField'

/** Starts from the profile bio; edits stay in the draft unless saved back as the bio. */
export function SummarySection({ model, profileBio, actions }) {
  const profile = useSaveProfileField()
  const summary = model.summary
  const changed = summary.trim() !== (profileBio ?? '')

  return (
    <div className="flex flex-col gap-2">
      <ResumeField
        id="resume-summary"
        label="Professional summary"
        multiline
        rows={4}
        value={summary}
        onChange={actions.setSummary}
        hint={`Two or three lines on what you are studying, your strengths and the role you want. ${summary.length} characters.`}
      />
      {changed && summary.trim() && (
        profile.canSave('bio', summary.trim()) ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            disabled={profile.isPending}
            onClick={() => profile.save('bio', summary.trim(), actions.clearSummary)}
          >
            {profile.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
            Save as my profile bio
          </Button>
        ) : (
          <p className="text-muted-foreground text-xs">Your profile bio is limited to 300 characters, so this longer summary stays on the resume only.</p>
        )
      )}
    </div>
  )
}
