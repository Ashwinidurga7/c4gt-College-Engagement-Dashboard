import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { initials } from '@/lib/formatters'
import { navItemsFor } from '@/lib/navigation'
import { roleLabel } from '@/lib/roles'

export function ProfileMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const paths = navItemsFor(user.role).map((item) => item.path)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${user.name}`}
        className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition-colors"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-nav text-nav-strong text-sm font-semibold">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 md:block">
          <span className="text-heading block max-w-40 truncate text-sm font-semibold">{user.name}</span>
          <span className="text-muted-foreground block text-xs">{roleLabel(user.role)}</span>
        </span>
        <ChevronDown className="text-muted-foreground hidden size-4 md:block" aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-1 py-2">
          <span className="text-heading truncate text-sm font-semibold">{user.name}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">{user.email}</span>
          <span className="mt-1 flex flex-wrap gap-1.5">
            <span className="bg-tone-blue text-tone-blue-fg rounded-full px-2 py-0.5 text-xs font-semibold">
              {roleLabel(user.role)}
            </span>
            <CollegeBadge college={user.college} />
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {paths.includes('profile') && (
          <DropdownMenuItem onSelect={() => navigate(`/${user.role}/profile`)}>
            <UserRound aria-hidden /> My profile
          </DropdownMenuItem>
        )}
        {paths.includes('settings') && (
          <DropdownMenuItem onSelect={() => navigate(`/${user.role}/settings`)}>
            <Settings aria-hidden /> Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onSelect={() => signOut()}>
          <LogOut aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
