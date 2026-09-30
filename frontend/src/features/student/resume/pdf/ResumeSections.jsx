import { Link, Text, View } from '@react-pdf/renderer'
import { SECTION_LABELS } from '@/features/student/resume/resumeAdapter'
import { dateRange, displayUrl, monthYear } from '@/features/student/resume/resumeFormat'

/** Section bodies shared by every template; `s` is the template's stylesheet. No tables, so text extraction stays in reading order. */

/**
 * The PDF engine may break a line anywhere that is not a single space, and draws a hyphen when it does, so
 * "2026  |" could print as "2026  |-". The separator's own spacing is non-breaking, and every other
 * boundary between styled pieces of text falls on a single space.
 */
const SEP = '  |  '

/** The bullet is drawn, not typed, so text extraction (and applicant tracking systems) see only the sentence. */
function Bullets({ items, s }) {
  return items.map((text, index) => (
    <View key={index} style={s.bulletRow}>
      <View style={s.bulletDot} />
      <Text style={s.bulletText}>{text}</Text>
    </View>
  ))
}

function EntryHead({ title, right, s }) {
  return (
    <View style={s.entryHead}>
      <Text style={s.entryTitle}>{title}</Text>
      {right ? <Text style={s.entryRight}>{right}</Text> : null}
    </View>
  )
}

/** A detail line such as "React, Node.js | github.com/anita/app"; the URL part is a link. */
function MetaLine({ parts, url, s }) {
  const text = parts.filter(Boolean).join(', ')
  if (!text && !url) return null
  return (
    <Text style={s.meta}>
      {text}
      {text && url ? SEP : ''}
      {url ? (
        <Link src={url} style={s.link}>
          {displayUrl(url)}
        </Link>
      ) : null}
    </Text>
  )
}

function Education({ resume, s }) {
  return (
    <>
      {resume.education.map((entry) => (
        <View key={entry.id} style={s.entry} wrap={false}>
          <EntryHead title={[entry.degree, entry.branch].filter(Boolean).join(', ')} right={entry.startYear && `${entry.startYear} to ${entry.endYear || 'Present'}`} s={s} />
          <Text style={s.text}>{entry.institution}</Text>
          {entry.cgpa !== null && (
            <Text style={s.text}>
              CGPA: {entry.cgpa.toFixed(2)} / 10{entry.semestersGraded ? ` (semesters 1 to ${entry.semestersGraded})` : ''}
            </Text>
          )}
          {entry.showSgpa && entry.sgpas.length > 0 && (
            <Text style={s.meta}>SGPA: {entry.sgpas.map((row) => `Sem ${row.semester}: ${row.sgpa.toFixed(2)}`).join(', ')}</Text>
          )}
        </View>
      ))}
      {resume.school.map((row) => (
        <View key={row.id} style={s.schoolRow} wrap={false}>
          <Text style={s.entryTitle}>
            {row.level}
            <Text style={s.plain}>{[row.board, row.institution, row.score && `Score: ${row.score}`].filter(Boolean).map((part) => `${SEP}${part}`).join('')}</Text>
          </Text>
          {row.year ? <Text style={s.entryRight}>{row.year}</Text> : null}
        </View>
      ))}
    </>
  )
}

const BODIES = {
  summary: ({ resume, s }) => <Text style={s.text}>{resume.summary}</Text>,
  education: Education,
  skills: ({ resume, s }) =>
    resume.skills.map((group) => (
      <Text key={group.key} style={s.skillLine}>
        <Text style={s.bold}>{`${group.label}: `}</Text>
        {group.items.join(', ')}
      </Text>
    )),
  projects: ({ resume, s }) =>
    resume.projects.map((item) => (
      <View key={item.id} style={s.entry} wrap={false}>
        <EntryHead title={item.title} s={s} />
        <MetaLine parts={item.techStack} url={item.url} s={s} />
        <Bullets items={item.bullets} s={s} />
      </View>
    )),
  experience: ({ resume, s }) =>
    resume.experience.map((item) => (
      <View key={item.id} style={s.entry} wrap={false}>
        <EntryHead title={[item.role, item.company].filter(Boolean).join(', ')} right={dateRange(item.startDate, item.endDate)} s={s} />
        <Bullets items={item.bullets} s={s} />
      </View>
    )),
  certifications: ({ resume, s }) =>
    resume.certifications.map((item) => {
      const details = [item.issuer, monthYear(item.date), item.verified ? 'Verified by the college' : null].filter(Boolean)
      return (
        <View key={item.id} style={s.listItem} wrap={false}>
          <Text style={s.text}>
            <Text style={s.bold}>{details.length ? `${item.title},` : item.title}</Text>
            {details.length ? ` ${details.join(', ')}` : ''}
            {item.url ? SEP : ''}
            {item.url ? (
              <Link src={item.url} style={s.link}>
                {displayUrl(item.url)}
              </Link>
            ) : null}
          </Text>
        </View>
      )
    }),
  achievements: ({ resume, s }) => <Bullets items={resume.achievements} s={s} />,
  extracurricular: ({ resume, s }) => (
    <Bullets
      items={resume.extracurricular.map((item) => `${item.title}${item.role ? ` (${item.role})` : ''}${item.description ? `: ${item.description}` : ''}`)}
      s={s}
    />
  ),
}

/**
 * Every visible section in the student's order, or only `ids` (for a template that splits sections into
 * columns). The heading stays with at least a line of its body. `s.section` with a row direction and
 * `s.sectionBody` with flex 1 put the heading beside its body instead of above it.
 */
export function ResumeSections({ resume, s, ids = resume.sections }) {
  return ids.map((id) => {
    const Body = BODIES[id]
    return (
      <View key={id} style={s.section}>
        <Text style={s.heading} minPresenceAhead={28}>
          {SECTION_LABELS[id]}
        </Text>
        <View style={s.sectionBody}>
          <Body resume={resume} s={s} />
        </View>
      </View>
    )
  })
}

/** Phone | email | location | links, as selectable text; links are clickable. */
export function ContactLine({ personal, s }) {
  const parts = [
    personal.phone && { text: personal.phone },
    personal.email && { text: personal.email, url: `mailto:${personal.email}` },
    personal.location && { text: personal.location },
    ...personal.links.map((link) => ({ text: displayUrl(link.text), url: link.url })),
  ].filter(Boolean)

  return (
    <Text style={s.contact}>
      {parts.map((part, index) => (
        <Text key={part.text}>
          {index > 0 ? SEP : ''}
          {part.url ? (
            <Link src={part.url} style={s.contactLink}>
              {part.text}
            </Link>
          ) : (
            part.text
          )}
        </Text>
      ))}
    </Text>
  )
}

/** The same contact details one per line, for a narrow sidebar. */
export function ContactList({ personal, s }) {
  const parts = [
    personal.phone && { text: personal.phone },
    personal.email && { text: personal.email, url: `mailto:${personal.email}` },
    personal.location && { text: personal.location },
    ...personal.links.map((link) => ({ text: displayUrl(link.text), url: link.url })),
  ].filter(Boolean)

  return parts.map((part) => (
    <Text key={part.text} style={s.contact}>
      {part.url ? (
        <Link src={part.url} style={s.contactLink}>
          {part.text}
        </Link>
      ) : (
        part.text
      )}
    </Text>
  ))
}
