import { ExternalLink, FolderKanban, GitBranch, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FilterBar } from '@/components/common/FilterBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { ProjectFormModal } from '@/features/student/portfolio/ProjectFormModal'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDeleteProject, useProjects } from '@/hooks/usePortfolio'
import { formatDate } from '@/lib/formatters'

function ProjectLinks({ project }) {
  const links = [
    { href: project.repoUrl, label: 'Code', icon: GitBranch },
    { href: project.liveUrl, label: 'Live', icon: ExternalLink },
  ].filter((link) => link.href)
  return links.map((link) => (
    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 text-sm font-medium hover:underline">
      <link.icon className="size-3.5" aria-hidden /> {link.label}
      <span className="sr-only"> for {project.title} (opens in a new tab)</span>
    </a>
  ))
}

export function ProjectsTab() {
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search)
  const query = useProjects({ page: 1, pageSize: 50, search: debounced.trim() })
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteProject())

  return (
    <TabSection
      title="Projects"
      description="Projects you have built, with their review status."
      count={query.data?.total}
      query={query}
      toolbar={<FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search projects" searchLabel="Search projects" />}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: FolderKanban, title: debounced ? 'No projects match your search' : 'No projects yet', description: 'Add academic or personal projects to showcase your work.' }}
      action={
        <Button size="lg" onClick={() => setEditor({ item: null })}>
          <Plus aria-hidden /> Add project
        </Button>
      }
      render={(data) => (
        <ul className="flex flex-col gap-4">
          {data.items.map((project) => (
            <li key={project.id} className="bg-card shadow-soft flex flex-col gap-4 rounded-xl border p-5 md:flex-row">
              <span className="bg-tone-purple text-tone-purple-fg flex size-12 shrink-0 items-center justify-center rounded-xl">
                <FolderKanban className="size-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <StatusBadge status={project.status} />
                  {project.approvalStatus && (
                    <StatusBadge status={project.approvalStatus} label={project.approvalStatus === 'pending' ? 'Review pending' : undefined} />
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
                <ul aria-label="Technologies" className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <li key={tech} className="bg-tone-blue text-tone-blue-fg rounded-full px-2 py-0.5 text-xs font-medium">
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-muted-foreground text-xs">
                    {formatDate(project.startDate)} – {project.endDate ? formatDate(project.endDate) : 'Present'}
                  </span>
                  <ProjectLinks project={project} />
                </div>
              </div>
              <div className="flex shrink-0 items-start gap-1 md:flex-col">
                <Button variant="ghost" size="icon-lg" aria-label={`Edit ${project.title}`} onClick={() => setEditor({ item: project })}>
                  <Pencil />
                </Button>
                <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${project.title}`} onClick={() => remove.request(project)}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    >
      {editor && <ProjectFormModal item={editor.item} open onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this project?"
        description={remove.target && `"${remove.target.title}" will be removed from your portfolio. This cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}
