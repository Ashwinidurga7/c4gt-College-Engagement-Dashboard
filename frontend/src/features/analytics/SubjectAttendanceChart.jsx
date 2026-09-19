import { BookOpen } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/components/common/ChartCard'
import { isLowAttendance, LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { chartTheme } from '@/lib/chartTheme'
import { formatPercent } from '@/lib/formatters'

/** Average attendance per subject, as horizontal bars with the 75% line. */
export function SubjectAttendanceChart({ subjects, className }) {
  const summary = `Average attendance by subject: ${subjects.map((entry) => `${entry.subject} ${formatPercent(entry.percentage)}`).join(', ')}.`

  return (
    <ChartCard
      title="Subject-wise average"
      description={`Dashed line marks the ${LOW_ATTENDANCE_THRESHOLD}% requirement.`}
      icon={BookOpen}
      summary={summary}
      height={Math.max(200, subjects.length * 52)}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer={false} data={subjects} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke={chartTheme.grid} />
          <XAxis type="number" domain={[0, 100]} unit="%" tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="subject" width={116} tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <Tooltip {...chartTheme.tooltip} formatter={(value) => [formatPercent(value), 'Average']} />
          <ReferenceLine x={LOW_ATTENDANCE_THRESHOLD} stroke={chartTheme.colors.warning} strokeDasharray="6 4" />
          <Bar dataKey="percentage" radius={[0, 6, 6, 0]} maxBarSize={28} isAnimationActive={false}>
            {subjects.map((entry) => (
              <Cell key={entry.subject} fill={isLowAttendance(entry.percentage) ? chartTheme.colors.warning : chartTheme.colors.primary} />
            ))}
            <LabelList dataKey="percentage" position="right" formatter={(value) => formatPercent(value)} fill="var(--text-heading)" fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
