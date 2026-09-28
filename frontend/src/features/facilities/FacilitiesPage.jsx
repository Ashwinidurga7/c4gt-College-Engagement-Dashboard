import { Clock, MapPin, Phone } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { FilterBar } from '@/components/common/FilterBar'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { ListSkeleton } from '@/components/common/Skeleton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { useFacilities } from '@/hooks/usePreview'
import { FACILITY_CATEGORIES } from '@/lib/campus'
import { formatTime } from '@/lib/formatters'

const CATEGORY_OPTIONS = [{ value: '', label: 'All' }, ...FACILITY_CATEGORIES.map((category) => ({ value: category, label: category }))]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isOpen(facility, now = new Date()) {
  if (!facility.opens) return true
  const minutes = now.getHours() * 60 + now.getMinutes()
  const toMinutes = (value) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3))
  return facility.days.includes(now.getDay()) && minutes >= toMinutes(facility.opens) && minutes < toMinutes(facility.closes)
}

function dayRange(days) {
  if (days.length === 7) return 'Every day'
  if (days.length === 6 && !days.includes(0)) return 'Mon – Sat'
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Mon – Fri'
  return days.map((day) => DAY_NAMES[day]).join(', ')
}

export function FacilitiesPage() {
  useDocumentTitle('Facilities')
  const list = useListQuery({ pageSize: 50, initialFilters: { category: '' } })
  const query = useFacilities(list.query)

  let body
  if (query.isPending) body = <ListSkeleton rows={4} />
  else if (query.isError) body = <ErrorState error={query.error} onRetry={query.refetch} />
  else if (query.data.items.length === 0) body = <EmptyState icon={MapPin} title="No facilities match" description="Try a different search or category." />
  else {
    body = (
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {query.data.items.map((facility) => {
          const open = isOpen(facility)
          return (
            <li key={facility.id} className="bg-card shadow-soft flex flex-col gap-2 rounded-xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{facility.name}</h2>
                  <p className="text-muted-foreground text-xs">{facility.category}</p>
                </div>
                <StatusBadge status={open ? 'active' : 'inactive'} label={!facility.opens ? 'Always on' : open ? 'Open now' : 'Closed'} />
              </div>
              {facility.description && <p className="text-body text-sm">{facility.description}</p>}
              <p className="text-body flex items-center gap-2 text-sm">
                <MapPin className="text-brand size-4 shrink-0" aria-hidden /> {facility.location}
              </p>
              <p className="text-body flex items-center gap-2 text-sm">
                <Clock className="text-brand size-4 shrink-0" aria-hidden />{' '}
                {facility.opens ? `${dayRange(facility.days)}, ${formatTime(facility.opens)} – ${formatTime(facility.closes)}` : 'Available at all hours'}
              </p>
              <p className="text-body flex items-center gap-2 text-sm">
                <Phone className="text-brand size-4 shrink-0" aria-hidden />
                <a href={`tel:${facility.contact}`} className="text-link hover:underline">
                  {facility.contact}
                </a>
              </p>
              {facility.details?.length > 0 && (
                <ul className="text-muted-foreground mt-1 flex list-disc flex-col gap-1 border-t pt-3 pl-4 text-xs">
                  {facility.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Facilities" description="What the campus offers, where it is and when it is open." icon={MapPin} preview />
      <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search facilities or locations" searchLabel="Search facilities" />
      <FilterChips label="Category" options={CATEGORY_OPTIONS} value={list.filters.category} onChange={(value) => list.setFilter('category', value)} />
      <div aria-busy={query.isFetching || undefined}>{body}</div>
      <PreviewNotice>Hours, contact numbers and some details are placeholders until the college office confirms them.</PreviewNotice>
    </div>
  )
}
