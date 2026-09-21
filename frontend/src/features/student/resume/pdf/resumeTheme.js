/**
 * Colours and type for the resume PDF. The PDF renderer cannot read CSS variables, so this is
 * the one place outside tokens.css where hex values are allowed. Values mirror the brand tokens
 * (--kiet-blue, --text-heading). The PDF is always printed on white, even in the dark theme.
 */
export const RESUME_COLORS = {
  paper: '#ffffff',
  ink: '#111111',
  muted: '#444444',
  rule: '#bbbbbb',
  navy: '#0f2557',
  blue: '#1b4594',
  blueRule: '#8fa8d8',
}

export const TEMPLATES = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'KIET Modern' },
]

/** Built-in PDF fonts keep text selectable and parseable by applicant tracking systems. */
export const FONT_FAMILIES = {
  classic: 'Times-Roman',
  modern: 'Helvetica',
  unicode: 'NotoSans',
}

/** Characters the built-in fonts can encode (WinAnsi). Anything else needs the Noto Sans fallback. */
const WIN_ANSI = /^[\n\r\t\x20-\x7e\xa0-\xff€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]*$/

export function needsUnicodeFont(text) {
  return !WIN_ANSI.test(text)
}
