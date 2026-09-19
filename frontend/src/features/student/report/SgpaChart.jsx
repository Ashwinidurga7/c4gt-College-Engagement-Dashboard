import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/components/common/ChartCard'
import { chartTheme } from '@/lib/chartTheme'

export function SgpaChart({ semesters, className }) {
  const data = semesters.map((entry) => ({ label: `Sem ${entry.semester}`, sgpa: entry.sgpa }))
  const summary = `SGPA by semester: ${data.map((entry) => `${entry.label} ${entry.sgpa.toFixed(2)}`).join(', ')}.`

  return (
    <ChartCard title="SGPA by semester" description="Semester grade point average on a 10-point scale." icon={TrendingUp} summary={summary} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartTheme.grid} />
          <XAxis dataKey="label" tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <Tooltip {...chartTheme.tooltip} formatter={(value) => [Number(value).toFixed(2), 'SGPA']} />
          <Bar dataKey="sgpa" fill={chartTheme.colors.primary} radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false}>
            <LabelList dataKey="sgpa" position="top" formatter={(value) => Number(value).toFixed(2)} fill="var(--text-heading)" fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
