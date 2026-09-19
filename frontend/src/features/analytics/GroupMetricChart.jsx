import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/components/common/ChartCard'
import { chartTheme } from '@/lib/chartTheme'

/**
 * One bar per group (year or section) for a single metric. Bars below `threshold` use the
 * warning colour. Section bars are labelled by year and section, e.g. "3A".
 */
export function GroupMetricChart({ title, description, icon, groups, metric, format, domain, threshold, metricLabel, className }) {
  const data = groups
    .filter((group) => group[metric] != null)
    .map((group) => ({ label: group.section ? `${group.year}${group.section}` : group.label, full: group.label, value: group[metric] }))
  // Many bars leave no room for value labels on phones; the table below each chart lists every value.
  const showLabels = data.length <= 6
  const summary = `${title}: ${data.map((entry) => `${entry.full} ${format(entry.value)}`).join(', ')}.`

  return (
    <ChartCard title={title} description={description} icon={icon} summary={summary} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer={false} data={data} margin={{ top: 24, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartTheme.grid} />
          <XAxis dataKey="label" tick={chartTheme.tick} axisLine={false} tickLine={false} interval={0} />
          <YAxis domain={domain} tick={chartTheme.tick} axisLine={false} tickLine={false} />
          <Tooltip {...chartTheme.tooltip} labelFormatter={(_, payload) => payload?.[0]?.payload.full} formatter={(value) => [format(value), metricLabel]} />
          {threshold != null && <ReferenceLine y={threshold} stroke={chartTheme.colors.warning} strokeDasharray="6 4" />}
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={threshold != null && entry.value < threshold ? chartTheme.colors.warning : chartTheme.colors.primary} />
            ))}
            {showLabels && <LabelList dataKey="value" position="top" formatter={format} fill="var(--text-heading)" fontSize={11} fontWeight={600} />}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
