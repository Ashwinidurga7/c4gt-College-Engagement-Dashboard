import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useRealtime } from '../../contexts/RealtimeContext'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../ui/Icon'

export default function AddCertificationForm({ onAdded }){
  const { addActivity } = useData()
  const { emitLocal } = useRealtime()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [provider, setProvider] = useState('Coursera')
  const [evidence, setEvidence] = useState('')
  const [evidenceData, setEvidenceData] = useState(null)
  const [evidenceThumb, setEvidenceThumb] = useState(null)
  const [evidenceName, setEvidenceName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    if(!title.trim()) return
    setLoading(true)
    const payload = {
      title: `${title} — ${provider}`,
      category: 'Certification',
      subtitle: evidence,
      userId: user?.id,
      user: user?.name,
      status: 'Pending',
      time: new Date().toISOString(),
      evidenceName: evidenceName || undefined,
      evidenceData: evidenceData || undefined,
    }

    // add to local data store for persistence
    const saved = addActivity(payload)

    // optimistic broadcast to realtime feed
    if(emitLocal) emitLocal({ ...saved, title: payload.title, category: payload.category, user: payload.user, time: payload.time })

    setTimeout(()=>{
      setLoading(false)
      setTitle('')
      setEvidence('')
      if(onAdded) onAdded(saved)
    }, 400)
  }

  function handleFile(e){
    const file = e.target.files && e.target.files[0]
    if(!file) return
    // validate type and size
    const allowed = ['image/png','image/jpeg','image/jpg','application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB
    if(!allowed.includes(file.type)){
      setError('Unsupported file type. Upload PNG/JPG or PDF.')
      setEvidenceData(null)
      setEvidenceName('')
      return
    }
    if(file.size > maxSize){
      setError('File too large. Max 5MB allowed.')
      setEvidenceData(null)
      setEvidenceName('')
      return
    }
    setError('')
    setEvidenceName(file.name)
    // handle PDF vs image
    if (file.type === 'application/pdf'){
      // read as ArrayBuffer to render first page thumbnail, and read as dataURL to store full PDF
      const arrayReader = new FileReader()
      arrayReader.onload = async function(ev){
        try{
          const arrayBuffer = ev.target.result
          const pdfjs = await import('pdfjs-dist/legacy/build/pdf')
          pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.js'
          const pdf = await pdfjs.getDocument({data: arrayBuffer}).promise
          const page = await pdf.getPage(1)
          const viewport = page.getViewport({scale:1.5})
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = viewport.width
          canvas.height = viewport.height
          await page.render({ canvasContext: ctx, viewport }).promise
          const thumb = canvas.toDataURL('image/png')
          setEvidenceThumb(thumb)
        }catch(err){
          console.warn('PDF thumb generation failed', err)
          setEvidenceThumb(null)
        }
      }
      arrayReader.readAsArrayBuffer(file)

      const dataReader = new FileReader()
      dataReader.onload = function(ev){ setEvidenceData(ev.target.result) }
      dataReader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = function(ev){ setEvidenceData(ev.target.result); setEvidenceThumb(ev.target.result) }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cert-upload-form">
      <div className="cert-form-grid">
        <div className="cert-field cert-field-wide">
          <label>Certification title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., Data Science Professional" />
        </div>

        <div className="cert-field">
          <label>Provider</label>
          <input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="e.g., Coursera" />
        </div>
      </div>

      <div className="cert-field">
        <label>Evidence URL <span>(optional)</span></label>
        <input value={evidence} onChange={e=>setEvidence(e.target.value)} placeholder="https://..." />
      </div>

      <div className="cert-field">
        <label>Certificate / evidence file</label>
        <label className="cert-dropzone">
          <input type="file" onChange={handleFile} accept=".png,.jpg,.jpeg,.pdf" />
          <span className="cert-drop-icon"><Icon name="upload" /></span>
          <strong>{evidenceName || 'Choose a certificate file'}</strong>
          <small>{evidenceName ? 'File selected and ready to submit' : 'PNG, JPG or PDF · Max 5 MB'}</small>
        </label>
        {evidenceData && (
          <div className="cert-file-preview">
            {evidenceThumb ? <img src={evidenceThumb} alt="Certificate preview" /> : <div className="cert-pdf-badge">PDF</div>}
            <div><strong>{evidenceName}</strong><span>Evidence attached</span></div>
          </div>
        )}
        {error && <div className="cert-form-error">{error}</div>}
      </div>

      <div className="cert-form-footer">
        <span>Keep your certificate details clear and verifiable.</span>
        <button type="submit" className="btn btn-primary cert-submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Certification'}
        </button>
      </div>
    </form>
  )
}
