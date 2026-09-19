import { Award, BadgeCheck, Briefcase, FileBadge, FileText, FolderKanban, Medal, Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTabs } from '@/components/common/PageTabs'
import { CertificatesTab } from '@/features/student/portfolio/CertificatesTab'
import { CertificationsTab } from '@/features/student/portfolio/CertificationsTab'
import { InternshipsTab } from '@/features/student/portfolio/InternshipsTab'
import { ProjectsTab } from '@/features/student/portfolio/ProjectsTab'
import { AchievementsTab, ActivitiesTab } from '@/features/student/portfolio/RecordsTabs'
import { ResumeTab } from '@/features/student/portfolio/ResumeTab'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const TABS = [
  { value: 'certifications', label: 'Certifications', icon: BadgeCheck, Component: CertificationsTab },
  { value: 'certificates', label: 'Certificates', icon: FileBadge, Component: CertificatesTab },
  { value: 'projects', label: 'Projects', icon: FolderKanban, Component: ProjectsTab },
  { value: 'internships', label: 'Internships', icon: Briefcase, Component: InternshipsTab },
  { value: 'achievements', label: 'Achievements', icon: Medal, Component: AchievementsTab },
  { value: 'activities', label: 'Activities', icon: Sparkles, Component: ActivitiesTab },
  { value: 'resume', label: 'Resume', icon: FileText, Component: ResumeTab },
]

export function PortfolioPage() {
  useDocumentTitle('Portfolio')
  const [params, setParams] = useSearchParams()
  const current = TABS.some((tab) => tab.value === params.get('tab')) ? params.get('tab') : TABS[0].value

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Portfolio" description="Everything that shows what you have learned and built, in one place." icon={Award} />
      <PageTabs
        label="Portfolio sections"
        tabs={TABS}
        value={current}
        onValueChange={(value) => setParams({ tab: value }, { replace: true })}
      >
        {(value) => {
          const { Component } = TABS.find((tab) => tab.value === value)
          return <Component />
        }}
      </PageTabs>
    </div>
  )
}
