import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { SectionCard } from '@/components/common/SectionCard'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { batchToppers } from '@/lib/analytics'
import { academicYearLabel, academicYearStart, YEARS } from '@/lib/colleges'

/** Results are published after each semester, so toppers start from the last completed academic year. */
const YEARS_BACK = 3

function Filter({ id, label, value, onChange, children }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <NativeSelect id={id} size="lg" className="w-full sm:w-44" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </NativeSelect>
    </>
  )
}

/** Department toppers for a chosen academic year, year of study, semester and branch. */
export function DepartmentToppers({ students, branches }) {
  const currentStart = academicYearStart()
  const academicYears = Array.from({ length: YEARS_BACK }, (_, index) => currentStart - 1 - index)
  const [yearStart, setYearStart] = useState(String(academicYears[0]))
  const [yearOfStudy, setYearOfStudy] = useState('3')
  const [semester, setSemester] = useState('')
  const [branch, setBranch] = useState('')

  const year = Number(yearOfStudy)
  const semesters = [year * 2 - 1, year * 2]
  const pool = branch ? students.filter((student) => student.department === branch) : students
  const toppers = batchToppers(pool, { yearStart: Number(yearStart), currentStart, yearOfStudy: year, semester: semester ? Number(semester) : undefined })
  const scoreLabel = semester ? `Semester ${semester} SGPA` : `CGPA to year ${year}`

  const columns = [
    { key: 'rank', header: 'Rank', cell: (_, index) => index + 1, className: 'text-muted-foreground w-14 tabular-nums font-semibold' },
    {
      key: 'name',
      header: 'Student',
      cell: (row) => (
        <div>
          <p className="text-heading font-medium">{row.name}</p>
          <p className="text-muted-foreground text-xs">{row.rollNumber}</p>
        </div>
      ),
    },
    { key: 'department', header: 'Branch' },
    { key: 'section', header: 'Section', align: 'center' },
    { key: 'score', header: scoreLabel, align: 'right', cell: (row) => row.score.toFixed(2), className: 'text-heading tabular-nums font-semibold' },
  ]

  return (
    <SectionCard title="Department toppers" description={`Ranked by ${scoreLabel.toLowerCase()} for ${academicYearLabel(Number(yearStart))}.`} icon={Trophy}>
      <DataTable
        caption="Department toppers"
        columns={columns}
        rows={toppers}
        getRowKey={(row) => row.rollNumber}
        emptyTitle="No results for this selection"
        emptyDescription="That batch had no published results in this academic year."
        minWidth={560}
        toolbar={
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Filter id="toppers-academic-year" label="Academic year" value={yearStart} onChange={setYearStart}>
              {academicYears.map((start) => (
                <NativeSelectOption key={start} value={String(start)}>
                  {academicYearLabel(start)}
                </NativeSelectOption>
              ))}
            </Filter>
            <Filter
              id="toppers-year"
              label="Year of study"
              value={yearOfStudy}
              onChange={(value) => {
                setYearOfStudy(value)
                setSemester('')
              }}
            >
              {YEARS.map((value) => (
                <NativeSelectOption key={value} value={String(value)}>
                  Year {value}
                </NativeSelectOption>
              ))}
            </Filter>
            <Filter id="toppers-semester" label="Semester" value={semester} onChange={setSemester}>
              <NativeSelectOption value="">Both semesters</NativeSelectOption>
              {semesters.map((value) => (
                <NativeSelectOption key={value} value={String(value)}>
                  Semester {value}
                </NativeSelectOption>
              ))}
            </Filter>
            {branches.length > 1 && (
              <Filter id="toppers-branch" label="Branch" value={branch} onChange={setBranch}>
                <NativeSelectOption value="">All branches</NativeSelectOption>
                {branches.map((code) => (
                  <NativeSelectOption key={code} value={code}>
                    {code}
                  </NativeSelectOption>
                ))}
              </Filter>
            )}
          </div>
        }
      />
    </SectionCard>
  )
}
