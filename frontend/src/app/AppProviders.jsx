import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/app/AuthProvider'
import { queryClient } from '@/app/queryClient'
import { ThemeProvider } from '@/app/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
