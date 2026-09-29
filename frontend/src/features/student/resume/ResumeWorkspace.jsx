import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import { toast } from 'sonner'
import { PageTabs } from '@/components/common/PageTabs'
import { CompletenessPanel } from '@/features/student/resume/CompletenessPanel'
import { ResumeActions } from '@/features/student/resume/ResumeActions'
import { ResumeEditor } from '@/features/student/resume/ResumeEditor'
import { ResumePreview } from '@/features/student/resume/ResumePreview'
import { applyDraft, toPrintModel } from '@/features/student/resume/resumeAdapter'
import { firstProblem, hasProblems, validateResume, withoutInvalid } from '@/features/student/resume/resumeValidation'
import { useResumePdf } from '@/features/student/resume/useResumePdf'

const DESKTOP = '(min-width: 1024px)'
const subscribe = (callback) => {
  const media = window.matchMedia(DESKTOP)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
const useIsDesktop = () => useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP).matches)

const TABS = [
  { value: 'edit', label: 'Edit' },
  { value: 'preview', label: 'Preview' },
]

/** Split view on desktop; Edit and Preview tabs on tablets and phones. */
export function ResumeWorkspace({ base, draft, actions }) {
  const isDesktop = useIsDesktop()
  const [tab, setTab] = useState('edit')
  const [openSections, setOpenSections] = useState(['personal'])
  const [showErrors, setShowErrors] = useState(false)

  const model = useMemo(() => applyDraft(base, draft), [base, draft])
  // Format problems show as the student types; missing name or email only after they try to download.
  const typingErrors = useMemo(() => validateResume(model, { required: false }), [model])
  const errors = useMemo(() => validateResume(model), [model])
  const shownErrors = showErrors ? errors : typingErrors
  // Invalid values are left out, so the preview and PDF never show them.
  const printModel = useMemo(() => toPrintModel(withoutInvalid(model, typingErrors)), [model, typingErrors])
  const preview = useResumePdf(printModel)

  /** Opens a section in the editor and focuses one of its fields. */
  const jumpTo = useCallback((target) => {
    setTab('edit')
    setOpenSections((open) => (open.includes(target.section) ? open : [...open, target.section]))
    // Wait for the accordion panel (and the Edit tab) to render before focusing.
    setTimeout(() => {
      const field = document.getElementById(target.field)
      field?.scrollIntoView({ block: 'center' })
      field?.focus({ preventScroll: true })
    }, 80)
  }, [])

  const ensureValid = () => {
    if (!hasProblems(errors)) return true
    setShowErrors(true)
    toast.error('Fix the highlighted fields before downloading.')
    jumpTo(firstProblem(errors))
    return false
  }

  const editor = (
    <ResumeEditor
      model={model}
      base={base}
      draft={draft}
      actions={actions}
      errors={shownErrors}
      openSections={openSections}
      onOpenChange={setOpenSections}
    />
  )
  const panel = (
    <>
      <ResumeActions printModel={printModel} ensureValid={ensureValid} onSaved={actions.addSavedResume} />
      <ResumePreview preview={preview} resume={printModel} />
    </>
  )

  return (
    <div className="flex flex-col gap-6">
      <CompletenessPanel model={model} onJump={jumpTo} />
      {isDesktop ? (
        <div className="grid grid-cols-2 items-start gap-6">
          <div className="min-w-0">{editor}</div>
          <div className="sticky top-20 flex min-w-0 flex-col gap-4">{panel}</div>
        </div>
      ) : (
        <PageTabs label="Resume builder view" tabs={TABS} value={tab} onValueChange={setTab}>
          {(value) => (value === 'edit' ? editor : <div className="flex flex-col gap-4">{panel}</div>)}
        </PageTabs>
      )}
    </div>
  )
}
