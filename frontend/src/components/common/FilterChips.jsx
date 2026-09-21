import { cn } from '@/lib/utils'

/** Single-select filter pills; the selected pill is marked with aria-pressed and a filled style. */
export function FilterChips({ label, options, value, onChange, className }) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value || 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-9 rounded-full border px-3.5 text-sm font-medium transition-colors',
              selected ? 'bg-primary border-primary text-primary-foreground' : 'bg-card text-body hover:bg-muted',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
