import { CollegeBadge } from '@/components/common/CollegeBadge'
import { DetailList } from '@/components/common/DetailList'
import { ProgressRing } from '@/components/common/ProgressRing'
import { ValueBadge } from '@/components/common/StatusBadge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { isLowAttendance } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

/** Read-only summary of a roster row; no extra request is made. */
export function StudentDetailDialog({ student, onClose }) {
  const low = isLowAttendance(student.attendancePercentage)

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-heading text-xl">{student.name}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2">
            {student.rollNumber} <CollegeBadge college={student.college} />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <ProgressRing value={student.attendancePercentage} warn={low} size={96} stroke={10} label={`Attendance ${formatPercent(student.attendancePercentage)}`}>
            <span className="text-heading text-lg font-bold">{formatPercent(student.attendancePercentage)}</span>
          </ProgressRing>
          <DetailList
            columns={2}
            className="flex-1"
            items={[
              { label: 'CGPA', value: student.cgpa?.toFixed(2) },
              { label: 'Backlogs', value: formatNumber(student.backlogs) },
              { label: 'Department', value: student.department },
              { label: 'Year · Section', value: [student.year && `Year ${student.year}`, student.section].filter(Boolean).join(' · ') },
            ]}
          />
        </div>
        {student.subjects.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Subject attendance</h3>
            <ul className="divide-y rounded-lg border">
              {student.subjects.map((subject) => (
                <li key={subject.subject} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="text-body">{subject.subject}</span>
                  <span className="text-muted-foreground flex items-center gap-2 text-xs">
                    {subject.attended}/{subject.conducted}
                    <ValueBadge value={formatPercent(subject.percentage)} warn={isLowAttendance(subject.percentage)} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {student.email && (
          <a href={`mailto:${student.email}`} className="text-link text-sm font-medium break-all hover:underline">
            {student.email}
          </a>
        )}
      </DialogContent>
    </Dialog>
  )
}
