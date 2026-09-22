import { ExternalLink, FolderGit2, FolderKanban, UsersRound } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'

function ProjectLink({ href, icon: Icon, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
      <Icon className="size-4" aria-hidden />
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

/** Projects the club has built, newest academic year first. Only real entries are listed, never counts. */
export function ClubProjects({ club }) {
  const projects = [...club.projects].sort((a, b) => String(b.academicYear ?? '').localeCompare(String(a.academicYear ?? '')))

  return (
    <SectionCard title="Past projects" description={projects.length > 0 ? `What ${club.name} members have built` : undefined} icon={FolderKanban}>
      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects listed yet" description={`Projects built by ${club.name} will appear here.`} />
      ) : (
        <ul className="flex flex-col divide-y">
          {projects.map((project, index) => (
            <li key={project.id} className={index === 0 ? 'pb-5' : 'py-5 last:pb-0'}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-heading text-base font-semibold">{project.name}</h3>
                {project.academicYear && (
                  <span className="bg-tone-blue text-tone-blue-fg rounded-full px-2 py-0.5 text-xs font-semibold">AY {project.academicYear}</span>
                )}
              </div>
              {project.description && <p className="text-body mt-1.5 text-sm leading-relaxed">{project.description}</p>}
              {project.team.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <UsersRound className="size-3.5" aria-hidden /> Team
                  </p>
                  <ul aria-label={`${project.name} team`} className="mt-1.5 flex flex-wrap gap-1.5">
                    {project.team.map((member) => (
                      <li key={member} className="bg-muted text-body rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(project.deployUrl || project.repoUrl) && (
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {project.deployUrl && (
                    <ProjectLink href={project.deployUrl} icon={ExternalLink}>
                      View live project
                    </ProjectLink>
                  )}
                  {project.repoUrl && (
                    <ProjectLink href={project.repoUrl} icon={FolderGit2}>
                      Source code
                    </ProjectLink>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
