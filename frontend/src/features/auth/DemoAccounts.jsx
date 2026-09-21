import { FlaskConical } from 'lucide-react'
import { MOCK_ACCOUNTS, MOCK_PASSWORD } from '@/mocks/authMock'
import { roleLabel } from '@/lib/roles'

/** Mock mode only: one-click sign-in details for each role. */
export function DemoAccounts({ onPick }) {
  return (
    <details className="bg-sunken group rounded-lg border px-4 py-3 text-sm">
      <summary className="text-heading flex cursor-pointer items-center gap-2 font-semibold">
        <FlaskConical className="text-tone-purple-fg size-4" aria-hidden />
        Demo accounts (mock mode)
      </summary>
      <p className="text-muted-foreground mt-2 text-xs">
        Password for every demo account: <code className="text-heading font-semibold">{MOCK_PASSWORD}</code>
      </p>
      <ul className="mt-2 grid gap-1">
        {MOCK_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => onPick({ ...account, password: MOCK_PASSWORD })}
              className="hover:bg-muted flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors"
            >
              <span className="text-body truncate">{account.email}</span>
              <span className="text-muted-foreground shrink-0 text-xs font-semibold">{roleLabel(account.role)}</span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}
