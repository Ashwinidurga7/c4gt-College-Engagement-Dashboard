import { Users } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { RosterTable } from '@/features/roster/RosterTable'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'

/**
 * Student list page shared by faculty, CTPO and HOD. `useStudents` is the role's roster hook;
 * the backend decides which students are returned.
 */
export function RosterPage({ title, description, documentTitle, useStudents, filterOptions = [], showScope = false }) {
  useDocumentTitle(documentTitle ?? title)
  const initialFilters = Object.fromEntries(filterOptions.map((filter) => [filter.key, '']))
  const list = useListQuery({ initialSort: { key: 'rollNumber', direction: 'asc' }, initialFilters })
  const query = useStudents(list.query)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} icon={Users} />
      <RosterTable list={list} query={query} filterOptions={filterOptions} showScope={showScope} caption={title} />
    </div>
  )
}
