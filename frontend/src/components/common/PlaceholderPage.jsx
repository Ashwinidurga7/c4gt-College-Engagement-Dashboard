import { Hammer } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** Stand-in for routes whose real page arrives in a later build phase. */
export function PlaceholderPage({ item }) {
  useDocumentTitle(item.label)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={item.label} icon={item.icon} preview={item.preview} />
      <section className="bg-card shadow-soft flex flex-col items-center rounded-xl border px-6 py-14 text-center">
        <span className="bg-tone-blue text-tone-blue-fg flex size-12 items-center justify-center rounded-full">
          <Hammer className="size-6" strokeWidth={1.75} aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold">This page is being built</h2>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">
          {item.label} is scheduled for build phase {item.phase}.
          {item.preview && ' It will run on sample data until a backend endpoint is available.'}
        </p>
      </section>
    </div>
  )
}
