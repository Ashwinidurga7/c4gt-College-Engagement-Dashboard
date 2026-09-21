import { Search } from 'lucide-react'
import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { navItemsFor } from '@/lib/navigation'
import { cn } from '@/lib/utils'

/** Jump to any page available to the current role. */
export function GlobalSearch({ role, className }) {
  const navigate = useNavigate()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [notFound, setNotFound] = useState(false)
  const items = navItemsFor(role)

  function handleSubmit(event) {
    event.preventDefault()
    const term = query.trim().toLowerCase()
    if (!term) return
    const match =
      items.find((item) => item.label.toLowerCase() === term) ??
      items.find((item) => item.label.toLowerCase().includes(term))
    if (match) {
      navigate(`/${role}/${match.path}`)
      setQuery('')
      setNotFound(false)
    } else {
      setNotFound(true)
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search pages
      </label>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
      <input
        id={`${listId}-input`}
        type="search"
        list={listId}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setNotFound(false)
        }}
        placeholder="Search pages, e.g. Attendance"
        aria-invalid={notFound || undefined}
        aria-describedby={notFound ? `${listId}-status` : undefined}
        className="bg-sunken border-border placeholder:text-muted-foreground focus-visible:border-ring h-10 w-full rounded-lg border pr-3 pl-9 text-sm outline-none"
      />
      <datalist id={listId}>
        {items.map((item) => (
          <option key={item.path} value={item.label} />
        ))}
      </datalist>
      {notFound && (
        <p id={`${listId}-status`} role="status" className="bg-popover text-danger-text shadow-lifted absolute top-full mt-1 rounded-md border px-3 py-1.5 text-xs">
          No page matches “{query}”.
        </p>
      )}
    </form>
  )
}
