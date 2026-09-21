import { Link } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * Checklist of records the student picks for the resume. `describe(item)` gives the label parts;
 * `details(item)` renders editable extras (such as bullets) under an included item.
 */
export function IncludeList({ id, items, onToggle, describe, details, emptyText, emptyLink }) {
  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {emptyText}{' '}
        {emptyLink && (
          <Link to={emptyLink.to} className="text-link font-medium hover:underline">
            {emptyLink.label}
          </Link>
        )}
      </p>
    )
  }

  return (
    <ul id={id} tabIndex={-1} className="flex flex-col gap-3 outline-none">
      {items.map((item) => {
        const { title, meta, badge, disabledReason } = describe(item)
        const checkboxId = `${id}-${item.id}`
        return (
          <li key={item.id} className="bg-sunken/60 flex flex-col gap-3 rounded-lg border p-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id={checkboxId}
                className="mt-0.5"
                checked={item.included}
                disabled={Boolean(disabledReason)}
                aria-describedby={disabledReason ? `${checkboxId}-reason` : undefined}
                onCheckedChange={(checked) => onToggle(item, checked === true)}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label htmlFor={checkboxId} className="text-heading text-sm leading-snug font-medium">
                  {title}
                </label>
                {(meta || badge) && (
                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                    {meta && <span>{meta}</span>}
                    {badge}
                  </div>
                )}
                {disabledReason && (
                  <p id={`${checkboxId}-reason`} className="text-muted-foreground text-xs">
                    {disabledReason}
                  </p>
                )}
              </div>
            </div>
            {item.included && details?.(item)}
          </li>
        )
      })}
    </ul>
  )
}
