import { Crown, UsersRound } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'

const ROLE_GROUPS = [
  { role: 'senior', label: 'Senior developers' },
  { role: 'junior', label: 'Junior developers' },
]

function initials(name) {
  return name
    .split(/\s+/)
    .filter((part) => part.replace('.', '').length > 1)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function TeamCard({ team }) {
  const lead = team.members.find((member) => member.role === 'lead')

  return (
    <li className="flex flex-col rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-heading text-base font-semibold">{team.name}</h3>
        <span className="text-muted-foreground text-xs font-medium">{team.members.length} members</span>
      </div>
      {lead && (
        <div className="bg-tone-blue mt-3 flex items-center gap-3 rounded-lg p-2.5">
          <span className="bg-brand flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" aria-hidden>
            {initials(lead.name)}
          </span>
          <div className="min-w-0">
            <p className="text-tone-blue-fg flex items-center gap-1 text-xs font-semibold tracking-wide uppercase">
              <Crown className="size-3.5" aria-hidden /> Team lead
            </p>
            <p className="text-heading truncate text-sm font-semibold">{lead.name}</p>
          </div>
        </div>
      )}
      {ROLE_GROUPS.map(({ role, label }) => {
        const members = team.members.filter((member) => member.role === role)
        if (members.length === 0) return null
        return (
          <div key={role} className="mt-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{label}</p>
            <ul aria-label={`${team.name} ${label.toLowerCase()}`} className="mt-1.5 flex flex-col gap-1">
              {members.map((member) => (
                <li key={member.name} className="text-body text-sm">
                  {member.name}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </li>
  )
}

/** The club's core team for the year, one card per team. Clubs without a listed team show nothing. */
export function ClubHubMembers({ club }) {
  const { academicYear, teams } = club.hubTeams
  if (teams.length === 0) return null

  const total = teams.reduce((sum, team) => sum + team.members.length, 0)
  const year = academicYear ? ` for AY ${academicYear}` : ''

  return (
    <SectionCard title="Hub members" description={`${total} students across ${teams.length} teams${year}`} icon={UsersRound}>
      <ul aria-label="Hub teams" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </ul>
    </SectionCard>
  )
}
