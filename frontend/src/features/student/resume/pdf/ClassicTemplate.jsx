import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { ContactLine, ResumeSections } from '@/features/student/resume/pdf/ResumeSections'
import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

const cache = new Map()

/** Black text, small-caps style headings over a thin rule, compact spacing. */
function classicStyles(fontFamily) {
  if (!cache.has(fontFamily)) {
    cache.set(
      fontFamily,
      StyleSheet.create({
        page: { fontFamily, fontSize: 10, lineHeight: 1.25, color: C.ink, backgroundColor: C.paper, paddingVertical: 28, paddingHorizontal: 38 },
        header: { alignItems: 'center', marginBottom: 4 },
        name: { fontSize: 20, lineHeight: 1.2, fontWeight: 'bold', letterSpacing: 0.5 },
        contact: { fontSize: 9, marginTop: 3, textAlign: 'center' },
        contactLink: { color: C.ink, textDecoration: 'none' },
        section: { marginTop: 7 },
        heading: {
          fontSize: 10.5,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          borderBottomWidth: 0.6,
          borderBottomColor: C.ink,
          paddingBottom: 1,
          marginBottom: 3,
        },
        entry: { marginBottom: 3.5 },
        schoolRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
        plain: { fontWeight: 'normal' },
        entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
        entryTitle: { fontWeight: 'bold', flex: 1, paddingRight: 8 },
        entryRight: { fontSize: 9.5 },
        text: {},
        meta: { fontSize: 9.5, fontStyle: 'italic', color: C.muted },
        bold: { fontWeight: 'bold' },
        skillLine: { marginBottom: 1.5 },
        listItem: { marginBottom: 1.5 },
        link: { color: C.muted, fontStyle: 'normal', textDecoration: 'none' },
        bulletRow: { flexDirection: 'row', marginTop: 1 },
        bulletDot: { width: 2.6, height: 2.6, borderRadius: 1.3, backgroundColor: C.ink, marginTop: 5, marginLeft: 3, marginRight: 6 },
        bulletText: { flex: 1 },
      }),
    )
  }
  return cache.get(fontFamily)
}

export function ClassicTemplate({ resume, fontFamily }) {
  const s = classicStyles(fontFamily)
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

ClassicTemplate.pageStyle = (fontFamily) => classicStyles(fontFamily).page
