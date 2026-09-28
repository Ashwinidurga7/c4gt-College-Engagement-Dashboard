import { ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { SectionCard } from '@/components/common/SectionCard'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { AttendanceHistory } from '@/features/lectureAttendance/AttendanceHistory'
import { AttendanceSheet, classLabel } from '@/features/lectureAttendance/AttendanceSheet'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { DEPARTMENT_NAMES, DEPARTMENTS, SECTIONS, YEARS } from '@/lib/colleges'

function todayIso() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

function Select({ id, label, value, onChange, children }) {
  return (
    <FormField id={id} label={label}>
      <NativeSelect id={id} size="lg" className="w-full" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </NativeSelect>
    </FormField>
  )
}

/** Faculty attendance: branch, then year and section, then date; mark, save, and review or download. */
export function TakeAttendancePage() {
  useDocumentTitle('Take Attendance')
  const { user } = useAuth()
  const [department, setDepartment] = useState(user?.department ?? DEPARTMENTS[0])
  const [year, setYear] = useState(String(user?.assignedYears?.[0] ?? 1))
  const [section, setSection] = useState(SECTIONS[0])
  const [date, setDate] = useState(todayIso)

  const params = { department, year, section, date }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Take attendance" description="Pick a branch, year and section, then the date, and mark who is absent." icon={ClipboardCheck} preview />
      <SectionCard title="Class and date" icon={ClipboardCheck}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select id="attendance-branch" label="Branch" value={department} onChange={setDepartment}>
            {DEPARTMENTS.map((code) => (
              <NativeSelectOption key={code} value={code}>
                {code} · {DEPARTMENT_NAMES[code]}
              </NativeSelectOption>
            ))}
          </Select>
          <Select id="attendance-year" label="Year" value={year} onChange={setYear}>
            {YEARS.map((value) => (
              <NativeSelectOption key={value} value={String(value)}>
                Year {value}
              </NativeSelectOption>
            ))}
          </Select>
          <Select id="attendance-section" label="Section" value={section} onChange={setSection}>
            {SECTIONS.map((value) => (
              <NativeSelectOption key={value} value={value}>
                Section {value}
              </NativeSelectOption>
            ))}
          </Select>
          <FormField id="attendance-date" label="Date">
            <Input id="attendance-date" type="date" className="bg-card h-11" value={date} max={todayIso()} onChange={(event) => event.target.value && setDate(event.target.value)} />
          </FormField>
        </div>
      </SectionCard>
      <AttendanceSheet key={Object.values(params).join('|')} params={params} />
      <AttendanceHistory params={{ department, year, section, month: date.slice(0, 7) }} selectedDate={date} onOpenDay={setDate} />
      <PreviewNotice>
        Attendance for {classLabel(params)} is kept in this preview and is not yet sent to student records. Downloads are CSV files that open in Excel.
      </PreviewNotice>
    </div>
  )
}
