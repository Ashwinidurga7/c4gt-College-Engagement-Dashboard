import { SECTION_LABELS } from '@/features/student/resume/resumeAdapter'
import { cn } from '@/lib/utils'

const LINE_WIDTHS = ['w-11/12', 'w-4/5', 'w-2/3']

/** How each template draws its name and section headings, in miniature. */
const LOOKS = {
  classic: { name: 'text-paper-ink text-center', heading: 'text-paper-ink', underline: true },
  modern: { name: 'text-paper-accent', heading: 'text-paper-accent', headerRule: true },
  executive: { name: 'text-paper-ink text-center uppercase tracking-wider', heading: 'bg-paper-line/50 text-paper-ink py-px text-center', headerRule: true },
  bold: { name: 'text-paper', heading: 'bg-paper-accent text-paper self-start px-1 py-px', band: true },
  sideHeadings: { name: 'text-paper-accent uppercase', heading: 'text-paper-accent w-1/4 shrink-0', headerRule: true, side: true },
  sidebar: { name: 'text-paper-accent uppercase', heading: 'text-paper-accent', underline: true, sidebar: true },
}

function Lines() {
  return (
    <div className="mt-1 flex min-w-0 flex-1 flex-col gap-0.5">
      {LINE_WIDTHS.map((width) => (
        <div key={width} className={`bg-paper-line h-0.5 rounded-full ${width}`} />
      ))}
    </div>
  )
}

function Section({ id, look }) {
  return (
    <div className={cn('flex', look.side ? 'flex-row gap-1' : 'flex-col')}>
      <p className={cn('text-[7px] leading-none font-bold uppercase', look.heading)}>{SECTION_LABELS[id]}</p>
      {look.underline && <div className="bg-paper-ink mt-0.5 h-px w-full" />}
      <Lines />
    </div>
  )
}

/**
 * Small drawing of the first page for phones, where embedded PDF viewers are unreliable.
 * It is decorative: the real PDF opens with "Open full preview".
 */
export function ResumeThumbnail({ resume }) {
  const look = LOOKS[resume.template] ?? LOOKS.classic
  const name = <p className={cn('truncate text-[11px] leading-tight font-bold', look.name)}>{resume.personal.name || 'Your name'}</p>
  const sections = resume.sections.slice(0, 7)

  if (look.sidebar) {
    const side = sections.filter((id) => id === 'skills')
    return (
      <div aria-hidden className="bg-paper mx-auto flex aspect-[210/297] w-full max-w-[240px] overflow-hidden rounded-sm border shadow-sm">
        <div className="bg-paper-accent/10 flex w-[38%] flex-col gap-2 p-2.5">
          {name}
          <Lines />
          {side.map((id) => (
            <Section key={id} id={id} look={look} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-2.5">
          {sections
            .filter((id) => !side.includes(id))
            .map((id) => (
              <Section key={id} id={id} look={look} />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div aria-hidden className="bg-paper mx-auto aspect-[210/297] w-full max-w-[240px] overflow-hidden rounded-sm border shadow-sm">
      <div className={cn('px-4 pt-4', look.band && 'bg-paper-accent pb-2.5')}>
        {name}
        <div className={cn('mt-1 h-1 w-3/4 rounded-full', look.band ? 'bg-paper/50' : 'bg-paper-line', look.name.includes('text-center') && 'mx-auto')} />
      </div>
      <div className="px-4 pb-4">
        {look.headerRule && <div className="bg-paper-accent mt-2 h-px w-full" />}
        <div className="mt-2 flex flex-col gap-2">
          {sections.map((id) => (
            <Section key={id} id={id} look={look} />
          ))}
        </div>
      </div>
    </div>
  )
}
