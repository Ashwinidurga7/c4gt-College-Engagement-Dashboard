import { BookUser, GraduationCap, Mail, Pencil, UserRound, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { DetailList } from '@/components/common/DetailList'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EditProfileModal } from '@/features/student/profile/EditProfileModal'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useStudentProfile } from '@/hooks/useStudent'
import { semesterLabel } from '@/lib/academics'
import { formatDate, initials } from '@/lib/formatters'

export function ProfilePage() {
  useDocumentTitle('Profile')
  const query = useStudentProfile()
  const [editing, setEditing] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My profile"
        description="Your personal and academic details."
        icon={UserRound}
        actions={
          query.data && (
            <Button size="lg" onClick={() => setEditing(true)}>
              <Pencil aria-hidden /> Edit profile
            </Button>
          )
        }
      />

      <QueryView query={query} skeleton={<SectionCard><ListSkeleton rows={5} /></SectionCard>}>
        {(profile) => (
          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard className="lg:row-span-2" bodyClassName="flex flex-col items-center text-center">
              <Avatar className="size-24">
                <AvatarFallback className="bg-nav text-nav-strong text-3xl font-semibold">{initials(profile.name)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground text-sm">{profile.rollNumber ?? 'Roll number not set'}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <CollegeBadge college={profile.college} />
                {profile.department && (
                  <span className="bg-tone-purple text-tone-purple-fg rounded-full px-2 py-0.5 text-xs font-semibold">
                    {profile.department}
                  </span>
                )}
              </div>
              <a href={`mailto:${profile.email}`} className="text-link mt-4 inline-flex items-center gap-1.5 text-sm break-all hover:underline">
                <Mail className="size-4 shrink-0" aria-hidden /> {profile.email}
              </a>
              {profile.bio && <p className="text-muted-foreground mt-4 border-t pt-4 text-sm">{profile.bio}</p>}
            </SectionCard>

            <SectionCard title="Personal details" icon={BookUser} className="lg:col-span-2">
              <DetailList
                items={[
                  { label: 'Mobile number', value: profile.phone },
                  { label: 'Date of birth', value: profile.dateOfBirth && formatDate(profile.dateOfBirth) },
                  { label: 'Gender', value: profile.gender },
                  { label: 'Address', value: profile.address, wide: true },
                ]}
              />
            </SectionCard>

            <SectionCard title="Academic details" icon={GraduationCap} className="lg:col-span-2">
              <DetailList
                columns={3}
                items={[
                  { label: 'Department', value: profile.department },
                  { label: 'Year and section', value: [profile.year && `Year ${profile.year}`, profile.section].filter(Boolean).join(' · ') },
                  { label: 'Current semester', value: profile.currentSemester && semesterLabel(profile.currentSemester) },
                  { label: 'Batch', value: profile.batch },
                  { label: 'Regulation', value: profile.regulation },
                  { label: 'Mentor', value: profile.mentor },
                ]}
              />
            </SectionCard>

            <SectionCard title="Guardian" icon={UsersRound} className="lg:col-span-3">
              <DetailList
                columns={3}
                items={[
                  { label: 'Guardian name', value: profile.guardianName },
                  { label: 'Guardian mobile', value: profile.guardianPhone },
                  { label: 'Admission type', value: profile.admissionType },
                ]}
              />
            </SectionCard>

            {editing && <EditProfileModal profile={profile} open={editing} onOpenChange={setEditing} />}
          </div>
        )}
      </QueryView>
    </div>
  )
}
