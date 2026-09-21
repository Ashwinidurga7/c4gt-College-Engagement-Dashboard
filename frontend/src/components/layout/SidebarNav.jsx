import { NavLink } from 'react-router-dom'
import { PreviewBadge } from '@/components/common/PreviewBadge'
import { NAVIGATION } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function SidebarNav({ role, onNavigate }) {
  const groups = NAVIGATION[role] ?? []

  return (
    <nav aria-label="Main" className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.section}>
          <p className="text-nav-muted px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase">{group.section}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={`/${role}/${item.path}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'text-nav-text flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      'hover:bg-nav-hover focus-visible:outline-nav-strong',
                      isActive && 'bg-nav-active text-nav-active-text hover:bg-nav-active',
                    )
                  }
                >
                  <item.icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.preview && <PreviewBadge compact />}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
