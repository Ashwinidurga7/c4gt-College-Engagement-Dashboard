import { Document, Page } from '@react-pdf/renderer'
import { ClassicTemplate } from '@/features/student/resume/pdf/ClassicTemplate'
import { ModernTemplate } from '@/features/student/resume/pdf/ModernTemplate'

const TEMPLATE_COMPONENTS = { classic: ClassicTemplate, modern: ModernTemplate }

/** One A4 resume in the chosen template. Text stays real, selectable text on white paper. */
export function ResumeDocument({ resume, fontFamily }) {
  const Template = TEMPLATE_COMPONENTS[resume.template] ?? ClassicTemplate
  const name = resume.personal.name

  return (
    <Document title={`${name} Resume`} author={name} subject="Resume" creator="KIET Portal" producer="KIET Portal">
      <Page size="A4" style={Template.pageStyle(fontFamily)}>
        <Template resume={resume} fontFamily={fontFamily} college={resume.education[0]?.institution} />
      </Page>
    </Document>
  )
}
