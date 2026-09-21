import { useState } from 'react'
import { toast } from 'sonner'

/**
 * Pairs a mutation with a ConfirmDialog: `request(item)` opens the dialog,
 * confirming runs the mutation with `toVariables(item)` and closes on success.
 */
export function useConfirmAction(mutation, toVariables = (item) => item.id) {
  const [target, setTarget] = useState(null)

  return {
    target,
    request: setTarget,
    dialogProps: {
      open: target !== null,
      onOpenChange: (open) => !open && setTarget(null),
      isPending: mutation.isPending,
      onConfirm: () =>
        mutation.mutate(toVariables(target), {
          onSuccess: () => setTarget(null),
          onError: (error) => toast.error(error.message),
        }),
    },
  }
}
