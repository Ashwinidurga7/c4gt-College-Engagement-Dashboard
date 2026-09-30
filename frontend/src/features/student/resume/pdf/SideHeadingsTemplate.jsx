import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { baseStyles, cachedStyles } from '@/features/student/resume/pdf/baseStyles'
import { ContactLine, ResumeSections } from '@/features/student/resume/pdf/ResumeSections'
import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

/** A large left-aligned name, and each section's heading in a narrow column beside its body. */
const sideHeadingStyles = cachedStyles((fontFamily) => {
  const base = baseStyles(fontFamily, { accent: C.navy })
  return StyleSheet.create({
    ...base,
    header: { borderBottomWidth: 1.5, borderBottomColor: C.navy, paddingBottom: 6, marginBottom: 2 },
    name: { fontSize: 22, lineHeight: 1.2, fontWeight: 'bold', color: C.navy, textTransform: 'uppercase', letterSpacing: 1 },
    contact: { ...base.contact, marginTop: 3 },
    section: { flexDirection: 'row', marginTop: 0, paddingTop: 6, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: C.rule },
    // Wide enough for the longest heading, EXTRACURRICULAR, on one line.
    heading: { width: 104, paddingRight: 8, fontSize: 8, fontWeight: 'bold', color: C.blue, textTransform: 'uppercase', letterSpacing: 0.4, paddingTop: 1.5 },
    sectionBody: { flex: 1 },
  })
})

export function SideHeadingsTemplate({ resume, fontFamily }) {
  const s = sideHeadingStyles(fontFamily)
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

SideHeadingsTemplate.pageStyle = (fontFamily) => sideHeadingStyles(fontFamily).page
