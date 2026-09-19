import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <span className="bg-tone-blue text-tone-blue-fg flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden />
      </span>
      <p className="text-heading mt-4 font-semibold">{title}</p>
      {description && <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
