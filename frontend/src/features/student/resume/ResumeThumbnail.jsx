import { SECTION_LABELS } from '@/features/student/resume/resumeAdapter'

const LINE_WIDTHS = ['w-11/12', 'w-4/5', 'w-2/3']

/**
 * Small drawing of the first page for phones, where embedded PDF viewers are unreliable.
 * It is decorative: the real PDF opens with "Open full preview".
 */
export function ResumeThumbnail({ resume }) {
  const modern = resume.template === 'modern'
  return (
    <div aria-hidden className="bg-paper mx-auto aspect-[210/297] w-full max-w-[240px] overflow-hidden rounded-sm border p-4 shadow-sm">
      <p className={`truncate text-[11px] leading-tight font-bold ${modern ? 'text-paper-accent' : 'text-paper-ink text-center'}`}>{resume.personal.name || 'Your name'}</p>
      <div className={`bg-paper-line mt-1 h-1 rounded-full ${modern ? 'w-3/4' : 'mx-auto w-3/4'}`} />
      {modern && <div className="bg-paper-accent mt-2 h-px w-full" />}
      <div className="mt-2 flex flex-col gap-2">
        {resume.sections.slice(0, 7).map((id) => (
          <div key={id}>
            <p className={`text-[7px] leading-none font-bold uppercase ${modern ? 'text-paper-accent' : 'text-paper-ink'}`}>{SECTION_LABELS[id]}</p>
            {!modern && <div className="bg-paper-ink mt-0.5 h-px w-full" />}
            <div className="mt-1 flex flex-col gap-0.5">
              {LINE_WIDTHS.map((width) => (
                <div key={width} className={`bg-paper-line h-0.5 rounded-full ${width}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
