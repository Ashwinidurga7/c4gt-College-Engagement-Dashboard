import { BRAND_NAME, PRODUCT_NAME } from '@/lib/brand'
import { formatDate } from '@/lib/formatters'

/**
 * Builds and saves a participation certificate PDF. The PDF library is imported on demand,
 * so it only loads when a student downloads a certificate.
 */
export async function downloadParticipationCertificate({ studentName, rollNumber, event }) {
  const { Document, Page, StyleSheet, Text, View, pdf } = await import('@react-pdf/renderer')
  const styles = StyleSheet.create({
    page: { padding: 48, fontFamily: 'Helvetica', color: '#0f2557' },
    frame: { flex: 1, borderWidth: 3, borderColor: '#1b4594', padding: 40, alignItems: 'center', justifyContent: 'center' },
    brand: { fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#1b4594' },
    title: { fontSize: 30, fontFamily: 'Helvetica-Bold', marginTop: 18 },
    lead: { fontSize: 13, marginTop: 28, color: '#55657a' },
    name: { fontSize: 24, fontFamily: 'Helvetica-Bold', marginTop: 10 },
    body: { fontSize: 13, marginTop: 14, textAlign: 'center', lineHeight: 1.5, color: '#334155' },
    footer: { fontSize: 10, marginTop: 36, color: '#55657a' },
  })
  const document = (
    <Document title={`Certificate: ${event.title}`} author={BRAND_NAME}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.frame}>
          <Text style={styles.brand}>{BRAND_NAME}</Text>
          <Text style={styles.title}>Certificate of Participation</Text>
          <Text style={styles.lead}>This certifies that</Text>
          <Text style={styles.name}>{studentName}</Text>
          <Text style={styles.body}>
            {rollNumber ? `(${rollNumber}) ` : ''}took part in {event.title}, organised by {event.organizer ?? 'the college'}
            {event.venue ? ` at ${event.venue}` : ''} on {formatDate(event.date)}.
          </Text>
          <Text style={styles.footer}>Issued through {PRODUCT_NAME}. Verify with the organising club or department.</Text>
        </View>
      </Page>
    </Document>
  )
  const blob = await pdf(document).toBlob()
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = `certificate-${event.id}.pdf`
  window.document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
