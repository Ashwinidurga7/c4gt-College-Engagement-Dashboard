import { Plus, X } from 'lucide-react'
import { TextArea } from '@/components/common/TextArea'
import { Button } from '@/components/ui/button'

/** About two printed lines; longer bullets get a gentle nudge, never a block. */
const LONG_BULLET = 180

/** Add, edit and remove the bullet points of one project or internship. */
export function BulletEditor({ idPrefix, label, bullets, onChange }) {
  const update = (index, text) => onChange(bullets.map((bullet, i) => (i === index ? text : bullet)))

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-heading mb-1 text-xs font-semibold">Bullet points for {label}</legend>
      <p id={`${idPrefix}-hint`} className="text-muted-foreground text-xs">
        Start each point with a verb (built, led, improved) and keep it under about two lines.
      </p>
      {bullets.map((bullet, index) => {
        const id = `${idPrefix}-${index}`
        const long = bullet.length > LONG_BULLET
        return (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <label htmlFor={id} className="sr-only">
                Bullet {index + 1} of {bullets.length}
              </label>
              <TextArea
                id={id}
                rows={2}
                value={bullet}
                aria-describedby={long ? `${id}-long` : `${idPrefix}-hint`}
                onChange={(event) => update(index, event.target.value)}
              />
              {long && (
                <p id={`${id}-long`} className="text-warning-text mt-1 text-xs">
                  This point may run past two lines. Consider splitting or shortening it.
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="text-muted-foreground shrink-0"
              aria-label={`Remove bullet ${index + 1}`}
              onClick={() => onChange(bullets.filter((_, i) => i !== index))}
            >
              <X />
            </Button>
          </div>
        )
      })}
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange([...bullets, ''])}>
        <Plus aria-hidden /> Add bullet point
      </Button>
    </fieldset>
  )
}
