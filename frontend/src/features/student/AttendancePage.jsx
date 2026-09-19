import { CalendarCheck } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { AttendanceOverview } from '@/features/student/attendance/AttendanceOverview'
import { RecentAttendanceTable, SubjectAttendanceTable } from '@/features/student/attendance/AttendanceTables'
import { LowAttendanceAlert } from '@/features/student/attendance/LowAttendanceAlert'
import { MonthlyAttendanceChart } from '@/features/student/attendance/MonthlyAttendanceChart'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useStudentAttendance } from '@/hooks/useStudent'

export function AttendancePage() {
  useDocumentTitle('Attendance')
  const query = useStudentAttendance()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendance" description="Track your attendance and stay on top of your academic journey." icon={CalendarCheck} />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton count={3} />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(data) => data.conducted === 0}
        empty={{ icon: CalendarCheck, title: 'No classes recorded yet', description: 'Your attendance appears here once classes begin.' }}
      >
        {(attendance) => (
          <>
            <LowAttendanceAlert attendance={attendance} />
            <AttendanceOverview attendance={attendance} />
            <div className="grid gap-6 xl:grid-cols-5">
              <div className="min-w-0 xl:col-span-3">
                <SubjectAttendanceTable subjects={attendance.subjects} />
              </div>
              <div className="min-w-0 xl:col-span-2">
                <MonthlyAttendanceChart monthly={attendance.monthly} />
              </div>
            </div>
            <RecentAttendanceTable records={attendance.records} />
          </>
        )}
      </QueryView>
    </div>
  )
}
