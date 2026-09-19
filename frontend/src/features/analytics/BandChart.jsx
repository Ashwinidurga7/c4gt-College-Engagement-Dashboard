import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/components/common/ChartCard'
import { chartTheme } from '@/lib/chartTheme'

const TONE_FILLS = {
  danger: chartTheme.colors.danger,
  warning: chartTheme.colors.warning,
  primary: chartTheme.colors.primary,
  success: chartTheme.colors.success,
}

/**
 * Student counts per band (attendance ranges, CGPA ranges). Each bar carries its count as a
 * label, so colour is never the only cue.
 */
export function BandChart({ title, description, icon, bands, unit = 'students', className }) {
  const data = bands.map((band) => ({ label: band.short ?? band.label, full: band.label, count: band.count, fill: TONE_FILLS[band.tone] ?? chartTheme.colors.primary }))
  const summary = `${title}: ${data.map((entry) => `${entry.full} ${entry.count} ${unit}`).join(', ')}.`

  return (
    <ChartCard title={title} description={description} icon={icon} summary={summary} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartTheme.grid} />
          <XAxis dataKey="label" tick={chartTheme.tick} axisLine={false} tickLine={false} interval={0} />
          <YAxis allowDecimals={false} tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <Tooltip {...chartTheme.tooltip} labelFormatter={(_, payload) => payload?.[0]?.payload.full} formatter={(value) => [value, 'Students']} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.fill} />
            ))}
            <LabelList dataKey="count" position="top" fill="var(--text-heading)" fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
