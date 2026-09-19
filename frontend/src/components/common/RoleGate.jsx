import { useAuth } from '@/hooks/useAuth'

/**
 * Renders children only for the listed roles. Hiding UI is a convenience, not security:
 * the backend still decides what each role may read or change.
 */
export function RoleGate({ allow, fallback = null, children }) {
  const { user } = useAuth()
  return user && allow.includes(user.role) ? children : fallback
}
