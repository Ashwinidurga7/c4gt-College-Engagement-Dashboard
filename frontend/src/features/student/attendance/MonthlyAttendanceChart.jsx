import { BarChart3 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/components/common/ChartCard'
import { EmptyState } from '@/components/common/EmptyState'
import { isLowAttendance, LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { chartTheme } from '@/lib/chartTheme'
import { formatMonth, formatPercent } from '@/lib/formatters'

export function MonthlyAttendanceChart({ monthly }) {
  const data = monthly.map((entry) => ({ ...entry, label: formatMonth(entry.month) }))
  const summary = `Monthly attendance: ${data.map((entry) => `${entry.label} ${formatPercent(entry.percentage)}`).join(', ')}.`

  if (data.length === 0) {
    return (
      <div className="bg-card shadow-soft rounded-xl border">
        <EmptyState icon={BarChart3} title="No monthly data yet" />
      </div>
    )
  }

  return (
    <ChartCard title="Monthly attendance" description={`Dashed line marks the ${LOW_ATTENDANCE_THRESHOLD}% requirement.`} icon={BarChart3} summary={summary}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer={false} data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartTheme.grid} />
          <XAxis dataKey="label" tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={chartTheme.tick} axisLine={false} tickLine={false} unit="%" />
          <Tooltip {...chartTheme.tooltip} formatter={(value) => [formatPercent(value), 'Attendance']} />
          <ReferenceLine y={LOW_ATTENDANCE_THRESHOLD} stroke={chartTheme.colors.warning} strokeDasharray="6 4" />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.month} fill={isLowAttendance(entry.percentage) ? chartTheme.colors.warning : chartTheme.colors.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
