import { Font, pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/features/student/resume/pdf/ResumeDocument'
import { FONT_FAMILIES, needsUnicodeFont } from '@/features/student/resume/pdf/resumeTheme'

// Never split words with automatic hyphens; a resume reads better with whole words.
Font.registerHyphenationCallback((word) => [word])

let unicodeFontRegistered = false

/** Noto Sans (served from /public/fonts) for names the built-in fonts cannot encode. It has no italic, so italic uses the upright face. */
function registerUnicodeFont() {
  if (unicodeFontRegistered) return
  const regular = '/fonts/NotoSansRegular.ttf'
  const bold = '/fonts/NotoSansBold.ttf'
  Font.register({
    family: FONT_FAMILIES.unicode,
    fonts: [
      { src: regular },
      { src: regular, fontStyle: 'italic' },
      { src: bold, fontWeight: 'bold' },
      { src: bold, fontWeight: 'bold', fontStyle: 'italic' },
    ],
  })
  unicodeFontRegistered = true
}

/** Page objects in the generated file ("/Type /Page", not "/Type /Pages"). */
function countPages(source) {
  return (source.match(/\/Type\s*\/Page\b/g) ?? []).length
}

/**
 * Renders the print model (see toPrintModel) to a PDF blob and reports its page count and
 * whether the Noto Sans fallback was needed.
 */
export async function renderResumePdf(resume) {
  const unicode = needsUnicodeFont(JSON.stringify(resume))
  if (unicode) registerUnicodeFont()
  const fontFamily = unicode ? FONT_FAMILIES.unicode : FONT_FAMILIES[resume.template] ?? FONT_FAMILIES.classic
  const blob = await pdf(<ResumeDocument resume={resume} fontFamily={fontFamily} />).toBlob()
  return { blob, pages: countPages(await blob.text()), unicode }
}
