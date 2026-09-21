/** Recharts styling that reads design tokens, so charts follow the active theme. */
export const chartTheme = {
  grid: 'var(--border-subtle)',
  axis: 'var(--text-muted)',
  tick: { fill: 'var(--text-muted)', fontSize: 12 },
  tooltip: {
    contentStyle: {
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      boxShadow: 'var(--shadow-raised)',
      color: 'var(--text-body)',
      fontSize: 13,
    },
    labelStyle: { color: 'var(--text-heading)', fontWeight: 600 },
    itemStyle: { color: 'var(--text-body)' },
    cursor: { fill: 'var(--surface-sunken)' },
  },
  colors: {
    primary: 'var(--chart-1)',
    success: 'var(--status-success)',
    warning: 'var(--status-warning)',
    danger: 'var(--status-danger)',
    muted: 'var(--border-subtle)',
  },
}
