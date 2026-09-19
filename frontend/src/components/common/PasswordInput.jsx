import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { IconInput } from '@/components/common/IconInput'

export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false)
  const label = visible ? 'Hide password' : 'Show password'

  return (
    <IconInput
      ref={ref}
      icon={LockKeyhole}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={label}
          aria-pressed={visible}
          title={label}
          className="text-muted-foreground hover:text-heading hover:bg-muted flex size-8 items-center justify-center rounded-md transition-colors"
        >
          {visible ? <EyeOff className="size-[18px]" strokeWidth={1.75} /> : <Eye className="size-[18px]" strokeWidth={1.75} />}
        </button>
      }
      {...props}
    />
  )
})
