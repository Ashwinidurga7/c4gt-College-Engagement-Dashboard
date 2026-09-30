import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { baseStyles, cachedStyles } from '@/features/student/resume/pdf/baseStyles'
import { ContactLine, ResumeSections } from '@/features/student/resume/pdf/ResumeSections'
import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

const PAD_X = 36
const PAD_Y = 28

/** A full-width navy header with the name in white, and headings as small navy tags. */
const boldStyles = cachedStyles((fontFamily) => {
  const base = baseStyles(fontFamily, { accent: C.navy })
  return StyleSheet.create({
    ...base,
    page: { ...base.page, paddingVertical: PAD_Y, paddingHorizontal: PAD_X },
    // Negative margins let the band bleed to the page edges on the first page only.
    header: { backgroundColor: C.navy, marginTop: -PAD_Y, marginHorizontal: -PAD_X, paddingTop: 24, paddingBottom: 14, paddingHorizontal: PAD_X, marginBottom: 4 },
    name: { fontSize: 22, lineHeight: 1.2, fontWeight: 'bold', color: C.paper, letterSpacing: 0.5 },
    contact: { ...base.contact, color: C.onNavy, marginTop: 4 },
    contactLink: { color: C.onNavy, textDecoration: 'none' },
    section: { marginTop: 9 },
    heading: {
      alignSelf: 'flex-start',
      fontSize: 8.5,
      fontWeight: 'bold',
      color: C.paper,
      backgroundColor: C.navy,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingTop: 2.5,
      paddingBottom: 1.5,
      paddingHorizontal: 5,
      marginBottom: 4,
    },
    entryRight: { ...base.entryRight, color: C.blue, fontWeight: 'bold' },
  })
})

export function BoldTemplate({ resume, fontFamily }) {
  const s = boldStyles(fontFamily)
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

BoldTemplate.pageStyle = (fontFamily) => boldStyles(fontFamily).page
