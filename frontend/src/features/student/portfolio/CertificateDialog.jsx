import { Download, ExternalLink } from 'lucide-react'
import { DetailList } from '@/components/common/DetailList'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/formatters'

const IMAGE = /\.(png|jpe?g|svg|webp)$/i

/** Extension of the stored file: from the URL, or from the original name for a blob URL. */
function extensionOf(certificate) {
  const source = certificate.fileUrl.startsWith('blob:') ? certificate.fileName ?? '' : certificate.fileUrl.split('?')[0]
  return source.includes('.') ? source.split('.').pop().toLowerCase() : 'pdf'
}

function downloadName(certificate) {
  const slug = certificate.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug || 'certificate'}.${extensionOf(certificate)}`
}

const STATUS_NOTES = {
  pending: 'Waiting for a faculty member to verify it.',
  verified: 'Verified by the college.',
  rejected: 'Not accepted. Upload a clearer copy to try again.',
}

/** A certificate's details, verification status, a preview of the file and a download. */
export function CertificateDialog({ certificate, onClose }) {
  const isImage = certificate.fileUrl && IMAGE.test(`.${extensionOf(certificate)}`)

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-heading text-xl">{certificate.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2">
            <StatusBadge status={certificate.status} /> {STATUS_NOTES[certificate.status]}
          </DialogDescription>
        </DialogHeader>
        <DetailList
          columns={2}
          items={[
            { label: 'Issued by', value: certificate.issuedBy },
            { label: 'Category', value: certificate.category },
            { label: 'Date', value: formatDate(certificate.date) },
            { label: 'File', value: certificate.fileName },
            ...(certificate.verifiedBy ? [{ label: 'Verified by', value: certificate.verifiedBy }] : []),
            ...(certificate.remarks ? [{ label: 'Remarks', value: certificate.remarks }] : []),
          ]}
        />
        {certificate.fileUrl ? (
          <>
            {isImage && <img src={certificate.fileUrl} alt={`${certificate.title} certificate`} className="w-full rounded-lg border" />}
            <div className="flex flex-wrap gap-2">
              <Button asChild size="lg">
                <a href={certificate.fileUrl} download={downloadName(certificate)}>
                  <Download aria-hidden /> Download
                </a>
              </Button>
              {!isImage && (
                <Button asChild variant="outline" size="lg">
                  <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink aria-hidden /> Open<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">The file is stored with the college and is not available to download here.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
