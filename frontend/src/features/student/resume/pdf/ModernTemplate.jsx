import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { ContactLine, ResumeSections } from '@/features/student/resume/pdf/ResumeSections'
import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

const cache = new Map()

/** Navy name, thin blue rule under the header, blue section headings, small college badge. */
function modernStyles(fontFamily) {
  if (!cache.has(fontFamily)) {
    cache.set(
      fontFamily,
      StyleSheet.create({
        page: { fontFamily, fontSize: 9.5, lineHeight: 1.3, color: C.ink, backgroundColor: C.paper, paddingVertical: 28, paddingHorizontal: 36 },
        header: { borderBottomWidth: 1.2, borderBottomColor: C.blue, paddingBottom: 6, marginBottom: 2 },
        nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
        name: { fontSize: 21, lineHeight: 1.2, fontWeight: 'bold', color: C.navy },
        badge: {
          fontSize: 7.5,
          fontWeight: 'bold',
          color: C.blue,
          borderWidth: 0.8,
          borderColor: C.blueRule,
          borderRadius: 3,
          lineHeight: 1,
          paddingTop: 3,
          paddingBottom: 2,
          paddingHorizontal: 5,
          marginTop: 5,
        },
        contact: { fontSize: 8.8, marginTop: 3, color: C.muted },
        contactLink: { color: C.blue, textDecoration: 'none' },
        section: { marginTop: 7 },
        heading: { fontSize: 10.5, fontWeight: 'bold', color: C.blue, letterSpacing: 0.4, marginBottom: 2 },
        entry: { marginBottom: 3.5 },
        schoolRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
        plain: { fontWeight: 'normal', color: C.ink },
        entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
        entryTitle: { fontWeight: 'bold', color: C.navy, flex: 1, paddingRight: 8 },
        entryRight: { fontSize: 8.8, color: C.muted },
        text: {},
        meta: { fontSize: 8.8, color: C.muted },
        bold: { fontWeight: 'bold' },
        skillLine: { marginBottom: 1.5 },
        listItem: { marginBottom: 1.5 },
        link: { color: C.blue, textDecoration: 'none' },
        bulletRow: { flexDirection: 'row', marginTop: 1 },
        bulletDot: { width: 2.6, height: 2.6, borderRadius: 1.3, backgroundColor: C.blue, marginTop: 4.8, marginLeft: 3, marginRight: 6 },
        bulletText: { flex: 1 },
      }),
    )
  }
  return cache.get(fontFamily)
}

export function ModernTemplate({ resume, fontFamily, college }) {
  const s = modernStyles(fontFamily)
  return (
    <>
      <View style={s.header}>
        <View style={s.nameRow}>
          <Text style={s.name}>{resume.personal.name}</Text>
          {college ? <Text style={s.badge}>{college}</Text> : null}
        </View>
        <ContactLine personal={resume.personal} s={s} />
      </View>
      <ResumeSections resume={resume} s={s} />
    </>
  )
}

ModernTemplate.pageStyle = (fontFamily) => modernStyles(fontFamily).page
