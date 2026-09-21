/** "CSE · Year 3 · Section A" from any object with department, year and section. */
export function sectionLabel(section = {}) {
  return [section.department, section.year && `Year ${section.year}`, section.section && `Section ${section.section}`].filter(Boolean).join(' · ')
}
