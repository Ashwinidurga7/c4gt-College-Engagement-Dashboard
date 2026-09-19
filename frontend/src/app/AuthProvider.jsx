import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AuthContext } from '@/app/authContext'
import { queryKeys } from '@/lib/queryKeys'
import { tokenStorage } from '@/lib/tokenStorage'
import { setUnauthorizedHandler } from '@/services/apiClient'
import { authService } from '@/services/authService'

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(() => tokenStorage.get())

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: () => authService.me(token),
    enabled: Boolean(token),
    staleTime: Infinity,
    retry: false,
  })

  const signOut = useCallback(
    (reason) => {
      tokenStorage.clear()
      setToken(null)
      queryClient.clear()
      if (reason === 'expired') toast.error('Your session has expired. Please sign in again.')
    },
    [queryClient],
  )

  const signIn = useCallback(
    (session, remember) => {
      tokenStorage.set(session.token, remember)
      queryClient.setQueryData(queryKeys.me, session.user)
      setToken(session.token)
    },
    [queryClient],
  )

  useEffect(() => {
    setUnauthorizedHandler(() => signOut('expired'))
    return () => setUnauthorizedHandler(null)
  }, [signOut])

  // A rejected stored token ends the session; network failures keep it so the user can retry.
  const tokenRejected = Boolean(token) && [401, 403].includes(meQuery.error?.status)
  useEffect(() => {
    if (tokenRejected) tokenStorage.clear()
  }, [tokenRejected])

  const value = useMemo(() => {
    let status = 'anonymous'
    if (token && !tokenRejected) {
      if (meQuery.isPending) status = 'loading'
      else if (meQuery.isError) status = 'error'
      else if (meQuery.data) status = 'authenticated'
    }

    return {
      status,
      user: status === 'authenticated' ? meQuery.data : null,
      error: meQuery.error,
      retry: meQuery.refetch,
      signIn,
      signOut,
    }
  }, [token, tokenRejected, meQuery.isPending, meQuery.isError, meQuery.data, meQuery.error, meQuery.refetch, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
