import { SectionCard } from '@/components/common/SectionCard'

/**
 * Card for a Recharts chart. `summary` is announced to screen readers in place of the
 * graphic, so the chart itself is hidden from assistive technology.
 */
export function ChartCard({ summary, height = 260, children, ...cardProps }) {
  return (
    <SectionCard {...cardProps}>
      <p className="sr-only">{summary}</p>
      <div aria-hidden style={{ height }} className="w-full min-w-0">
        {children}
      </div>
    </SectionCard>
  )
}
