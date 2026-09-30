import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { baseStyles, cachedStyles } from '@/features/student/resume/pdf/baseStyles'
import { ContactList, ResumeSections } from '@/features/student/resume/pdf/ResumeSections'
import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

/** Skills are short lists that fit the narrow column; everything else, with its longer lines, goes in the main column. */
const SIDEBAR_SECTIONS = ['skills']
const SIDEBAR_WIDTH = 170

/** A tinted left column (name, contact, skills) beside the main column. */
const sidebarStyles = cachedStyles((fontFamily) => {
  const base = baseStyles(fontFamily, { accent: C.navy, fontSize: 9.3 })
  return StyleSheet.create({
    ...base,
    page: { ...base.page, paddingVertical: 0, paddingHorizontal: 0 },
    // Drawn on every page, so the tint runs the full height even when the resume spills onto page 2.
    backdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, width: SIDEBAR_WIDTH, backgroundColor: C.sidebar },
    columns: { flexDirection: 'row' },
    sidebar: { width: SIDEBAR_WIDTH, paddingTop: 30, paddingBottom: 28, paddingHorizontal: 16 },
    main: { flex: 1, paddingTop: 30, paddingBottom: 28, paddingLeft: 20, paddingRight: 30 },
    name: { fontSize: 18, lineHeight: 1.15, fontWeight: 'bold', color: C.navy, textTransform: 'uppercase', marginBottom: 12 },
    contact: { ...base.contact, marginBottom: 3 },
    heading: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: C.navy,
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 0.6,
      borderBottomColor: C.blueRule,
      paddingBottom: 1.5,
      marginBottom: 4,
    },
    section: { marginTop: 10 },
    skillLine: { marginBottom: 4 },
  })
})

export function SidebarTemplate({ resume, fontFamily }) {
  const s = sidebarStyles(fontFamily)
  const side = resume.sections.filter((id) => SIDEBAR_SECTIONS.includes(id))
  const main = resume.sections.filter((id) => !SIDEBAR_SECTIONS.includes(id))
  return (
    <>
      <View style={s.backdrop} fixed />
      <View style={s.columns}>
        <View style={s.sidebar}>
          <Text style={s.name}>{resume.personal.name}</Text>
          <Text style={s.heading}>Contact</Text>
          <ContactList personal={resume.personal} s={s} />
          <ResumeSections resume={resume} s={s} ids={side} />
        </View>
        <View style={s.main}>
          <ResumeSections resume={resume} s={s} ids={main} />
        </View>
      </View>
    </>
  )
}

SidebarTemplate.pageStyle = (fontFamily) => sidebarStyles(fontFamily).page
