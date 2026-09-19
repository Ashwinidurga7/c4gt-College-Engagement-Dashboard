import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login })
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: authService.register })
}
