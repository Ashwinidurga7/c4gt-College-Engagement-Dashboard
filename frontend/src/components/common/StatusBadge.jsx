import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  Clock,
  Info,
  Megaphone,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = {
  success: 'bg-success-soft text-success-text',
  warning: 'bg-warning-soft text-warning-text',
  danger: 'bg-danger-soft text-danger-text',
  info: 'bg-info-soft text-info-text',
  neutral: 'bg-muted text-muted-foreground',
}

/** Every status pairs a colour with an icon and a text label, never colour alone. */
const STATUSES = {
  important: { label: 'Important', tone: 'info', icon: Info },
  general: { label: 'General', tone: 'neutral', icon: Megaphone },
  urgent: { label: 'Urgent', tone: 'danger', icon: CircleAlert },
  active: { label: 'Active', tone: 'success', icon: CircleDot },
  inactive: { label: 'Inactive', tone: 'neutral', icon: CircleDot },
  pending: { label: 'Pending', tone: 'warning', icon: Clock },
  approved: { label: 'Approved', tone: 'success', icon: CircleCheck },
  rejected: { label: 'Rejected', tone: 'danger', icon: CircleX },
  verified: { label: 'Verified', tone: 'success', icon: ShieldCheck },
  present: { label: 'Present', tone: 'success', icon: CircleCheck },
  absent: { label: 'Absent', tone: 'danger', icon: CircleX },
  pass: { label: 'Pass', tone: 'success', icon: CircleCheck },
  fail: { label: 'Fail', tone: 'danger', icon: CircleX },
  low: { label: 'Low', tone: 'warning', icon: TriangleAlert },
  ongoing: { label: 'Ongoing', tone: 'info', icon: CircleDashed },
  completed: { label: 'Completed', tone: 'success', icon: CircleCheck },
}

export function StatusBadge({ status, label, className }) {
  const config = STATUSES[String(status).toLowerCase()] ?? { label: status, tone: 'neutral', icon: CircleDot }
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        TONES[config.tone],
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden />
      {label ?? config.label}
    </span>
  )
}

/** Numeric pill that switches to the warning style below a threshold, with an icon for non-colour cues. */
export function ValueBadge({ value, warn, children, className }) {
  const Icon = warn ? TriangleAlert : CircleCheck
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums',
        warn ? TONES.warning : TONES.success,
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden />
      {children ?? value}
      {warn && <span className="sr-only"> (below requirement)</span>}
    </span>
  )
}
