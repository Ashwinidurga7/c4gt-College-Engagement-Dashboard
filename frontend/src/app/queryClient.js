import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      // Never retry auth or permission failures; retry transient ones once.
      retry: (failureCount, error) => ![401, 403, 404].includes(error?.status) && failureCount < 1,
    },
    mutations: { retry: false },
  },
})
