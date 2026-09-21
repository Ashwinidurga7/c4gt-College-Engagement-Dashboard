import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ResumeField } from '@/features/student/resume/sections/ResumeField'

const LEVELS = ['Class 10', 'Class 12', 'Diploma']

function SchoolRow({ row, index, onChange, onRemove }) {
  const id = `resume-school-${row.id}`
  const set = (field) => (value) => onChange({ ...row, [field]: value })
  return (
    <fieldset className="bg-sunken/60 grid gap-3 rounded-lg border p-3 sm:grid-cols-2">
      <legend className="sr-only">School record {index + 1}</legend>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-level`} className="text-heading text-sm font-semibold">
          Level
        </label>
        <NativeSelect id={`${id}-level`} size="lg" className="w-full" value={row.level} onChange={(event) => set('level')(event.target.value)}>
          {LEVELS.map((level) => (
            <NativeSelectOption key={level} value={level}>
              {level}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <ResumeField id={`${id}-board`} label="Board" value={row.board} onChange={set('board')} placeholder="e.g. BIEAP, CBSE, SSC" />
      <ResumeField id={`${id}-institution`} label="School or college" value={row.institution} onChange={set('institution')} className="sm:col-span-2" />
      <ResumeField id={`${id}-year`} label="Year of passing" value={row.year} onChange={set('year')} inputMode="numeric" maxLength={4} />
      <ResumeField id={`${id}-score`} label="Score" value={row.score} onChange={set('score')} placeholder="e.g. 95.4% or 9.8 CGPA" />
      <Button type="button" variant="ghost" size="sm" className="text-danger-text self-start sm:col-span-2" onClick={onRemove}>
        <Trash2 aria-hidden /> Remove {row.level}
      </Button>
    </fieldset>
  )
}

/** Degree details come from the academic record; school marks are entered here and kept in the draft. */
export function EducationSection({ model, actions }) {
  const degree = model.education[0]
  const rows = model.school
  const has = (...levels) => rows.some((row) => levels.includes(row.level))
  const addRow = (level) => actions.setSchool([...rows, { id: `${level.replace(/\W/g, '')}${Date.now().toString(36)}`, level, board: '', institution: '', year: '', score: '' }])
  const set = (field) => (value) => actions.setEducation(field, value)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ResumeField id="resume-institution" label="Institution" value={degree.institution} onChange={set('institution')} className="sm:col-span-2" />
        <ResumeField id="resume-degree" label="Degree" value={degree.degree} onChange={set('degree')} />
        <ResumeField id="resume-branch" label="Branch" value={degree.branch} onChange={set('branch')} />
        <ResumeField id="resume-start-year" label="Start year" value={degree.startYear} onChange={set('startYear')} inputMode="numeric" maxLength={4} />
        <ResumeField id="resume-end-year" label="End year (expected)" value={degree.endYear} onChange={set('endYear')} inputMode="numeric" maxLength={4} />
      </div>
      <div className="bg-info-soft text-info-text rounded-lg px-3 py-2 text-sm">
        {degree.cgpa !== null
          ? `CGPA ${degree.cgpa.toFixed(2)} comes from your published results${degree.semestersGraded ? ` (semesters 1 to ${degree.semestersGraded})` : ''} and cannot be edited here.`
          : 'Your CGPA appears here once results are published.'}
      </div>
      {degree.sgpas.length > 0 && (
        <div className="flex items-center gap-3">
          <Checkbox id="resume-show-sgpa" checked={degree.showSgpa} onCheckedChange={(checked) => set('showSgpa')(checked === true)} />
          <label htmlFor="resume-show-sgpa" className="text-sm">
            Also list the SGPA of each semester
          </label>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h4 className="text-heading text-sm font-semibold">School and diploma</h4>
        {rows.map((row, index) => (
          <SchoolRow
            key={row.id}
            row={row}
            index={index}
            onChange={(next) => actions.setSchool(rows.map((entry) => (entry.id === row.id ? next : entry)))}
            onRemove={() => actions.setSchool(rows.filter((entry) => entry.id !== row.id))}
          />
        ))}
        <div className="flex flex-wrap gap-2">
          {!has('Class 10') && (
            <Button id="resume-add-class10" type="button" variant="outline" size="sm" onClick={() => addRow('Class 10')}>
              <Plus aria-hidden /> Add Class 10
            </Button>
          )}
          {!has('Class 12', 'Diploma') && (
            <Button id="resume-add-class12" type="button" variant="outline" size="sm" onClick={() => addRow('Class 12')}>
              <Plus aria-hidden /> Add Class 12 or diploma
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
