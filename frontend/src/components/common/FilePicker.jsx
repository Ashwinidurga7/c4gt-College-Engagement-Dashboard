import { FileUp, X } from 'lucide-react'
import { useId, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/files'
import { cn } from '@/lib/utils'

/**
 * Keyboard-accessible file chooser. The native input stays in the tab order (visually hidden)
 * and the whole box is also a drop target.
 */
export function FilePicker({ id, value, onChange, accept, hint, invalid, describedBy }) {
  const inputRef = useRef(null)
  const fallbackId = useId()
  const inputId = id ?? fallbackId

  function choose(files) {
    const file = files?.[0]
    if (file) onChange(file)
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        choose(event.dataTransfer.files)
      }}
      className={cn(
        'has-focus-visible:ring-ring flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center has-focus-visible:ring-2',
        invalid ? 'border-destructive' : 'border-input',
      )}
    >
      <FileUp className="text-brand size-7" strokeWidth={1.5} aria-hidden />
      {value ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-heading max-w-56 truncate font-medium">{value.name}</span>
          <span className="text-muted-foreground">({formatFileSize(value.size)})</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${value.name}`}
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Drag a file here, or</p>
      )}
      <label htmlFor={inputId} className="text-link cursor-pointer text-sm font-semibold hover:underline">
        {value ? 'Choose a different file' : 'Browse files'}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => choose(event.target.files)}
        className="sr-only"
      />
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  )
}
