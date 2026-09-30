import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { baseStyles, cachedStyles } from '@/features/student/resume/pdf/baseStyles'
import { ContactLine, ResumeSections } from '@/features/student/resume/pdf/ResumeSections'
import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

/** Serif type, a centred spaced-out name, and centred headings on a light grey band. */
const executiveStyles = cachedStyles((fontFamily) => {
  const base = baseStyles(fontFamily, { fontSize: 10 })
  return StyleSheet.create({
    ...base,
    page: { ...base.page, lineHeight: 1.25, paddingHorizontal: 40 },
    header: { alignItems: 'center', borderBottomWidth: 0.8, borderBottomColor: C.ink, paddingBottom: 6, marginBottom: 2 },
    name: { fontSize: 19, lineHeight: 1.2, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2.5 },
    contact: { ...base.contact, color: C.ink, marginTop: 4, textAlign: 'center' },
    contactLink: { color: C.ink, textDecoration: 'none' },
    section: { marginTop: 8 },
    heading: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      textAlign: 'center',
      backgroundColor: C.band,
      paddingTop: 2.5,
      paddingBottom: 1.5,
      marginBottom: 4,
    },
    meta: { ...base.meta, fontStyle: 'italic' },
    link: { color: C.muted, textDecoration: 'none' },
  })
})

export function ExecutiveTemplate({ resume, fontFamily }) {
  const s = executiveStyles(fontFamily)
  return (
    <>
      <View style={s.header}>
        <Text style={s.name}>{resume.personal.name}</Text>
        <ContactLine personal={resume.personal} s={s} />
      </View>
      <ResumeSections resume={resume} s={s} />
    </>
  )
}

ExecutiveTemplate.pageStyle = (fontFamily) => executiveStyles(fontFamily).page
