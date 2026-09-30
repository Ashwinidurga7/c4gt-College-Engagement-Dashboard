import { RESUME_COLORS as C } from '@/features/student/resume/pdf/resumeTheme'

/**
 * The entry-level styles every template needs for ResumeSections, with `accent` colouring titles, links
 * and bullets. A template spreads these into its StyleSheet and overrides the ones that make it distinct.
 */
export function baseStyles(fontFamily, { accent = C.ink, fontSize = 9.5 } = {}) {
  return {
    page: { fontFamily, fontSize, lineHeight: 1.3, color: C.ink, backgroundColor: C.paper, paddingVertical: 28, paddingHorizontal: 36 },
    contact: { fontSize: fontSize - 0.7, color: C.muted },
    contactLink: { color: accent, textDecoration: 'none' },
    section: { marginTop: 7 },
    entry: { marginBottom: 3.5 },
    schoolRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    plain: { fontWeight: 'normal', color: C.ink },
    entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
    entryTitle: { fontWeight: 'bold', color: accent, flex: 1, paddingRight: 8 },
    entryRight: { fontSize: fontSize - 0.7, color: C.muted },
    text: {},
    meta: { fontSize: fontSize - 0.7, color: C.muted },
    bold: { fontWeight: 'bold' },
    skillLine: { marginBottom: 1.5 },
    listItem: { marginBottom: 1.5 },
    link: { color: accent, textDecoration: 'none' },
    bulletRow: { flexDirection: 'row', marginTop: 1 },
    bulletDot: { width: 2.6, height: 2.6, borderRadius: 1.3, backgroundColor: accent, marginTop: 4.8, marginLeft: 3, marginRight: 6 },
    bulletText: { flex: 1 },
  }
}

/** One cached StyleSheet per font, since the Noto Sans fallback swaps the font at render time. */
export function cachedStyles(build) {
  const cache = new Map()
  return (fontFamily) => {
    if (!cache.has(fontFamily)) cache.set(fontFamily, build(fontFamily))
    return cache.get(fontFamily)
  }
}
