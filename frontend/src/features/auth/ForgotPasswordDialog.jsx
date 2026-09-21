import { LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/** There is no self-service reset endpoint, so the dialog routes people to the college admin. */
export function ForgotPasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-link rounded-sm text-sm font-medium hover:underline">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="bg-tone-blue text-tone-blue-fg mb-2 flex size-11 items-center justify-center rounded-full">
            <LifeBuoy className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <DialogTitle className="text-heading text-lg">Reset your password</DialogTitle>
          <DialogDescription>
            Password resets are handled by the college administration. Contact the admin office of your college (KIET,
            KIET+ or KIEW) from your institutional email and they will reset it for you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="lg">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
