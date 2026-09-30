import { Document, Page } from '@react-pdf/renderer'
import { BoldTemplate } from '@/features/student/resume/pdf/BoldTemplate'
import { ClassicTemplate } from '@/features/student/resume/pdf/ClassicTemplate'
import { ExecutiveTemplate } from '@/features/student/resume/pdf/ExecutiveTemplate'
import { ModernTemplate } from '@/features/student/resume/pdf/ModernTemplate'
import { SideHeadingsTemplate } from '@/features/student/resume/pdf/SideHeadingsTemplate'
import { SidebarTemplate } from '@/features/student/resume/pdf/SidebarTemplate'

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
  sidebar: SidebarTemplate,
  bold: BoldTemplate,
  sideHeadings: SideHeadingsTemplate,
}

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
