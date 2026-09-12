import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'

export const activityCategories = [
  'Technical Competitions & Hackathons',
  'Workshops & Seminars',
  'Internships & Industrial Training',
  'Professional Certifications',
  'Paper / Patent Publications',
  'Community & Social Service (NSS/NCC)',
  'Sports & Cultural Events',
  'Student Club Leadership',
  'Open Source / Coding Contributions',
  'Entrepreneurship & Innovation (EDC)',
  'Other Co-Curricular Achievements',
]

export default function AddActivity() {
  const { addActivity } = useData()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    category: activityCategories[0],
    organizer: '',
    date: new Date().toISOString().split('T')[0],
    role: 'Participant',
    description: '',
    credentialUrl: '',
    points: 10,
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('File size exceeds 5MB limit. Please upload a smaller image or PDF.')
        return
      }
      setFileName(file.name)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewImage(null)
      }
    }
  }

  const handleRemoveFile = () => {
    setFileName('')
    setPreviewImage(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      showError('Please provide a title for the activity.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      try {
        addActivity({
          title: formData.title.trim(),
          category: formData.category,
          organizer: formData.organizer.trim() || 'KIET Korangi (JNTUK)',
          date: formData.date,
          role: formData.role,
          description: formData.description.trim(),
          credentialUrl: formData.credentialUrl.trim(),
          points: Number(formData.points) || 10,
          evidenceFile: fileName || null,
          evidencePreview: previewImage || null,
          userId: user?.id,
          userName: user?.name || 'Student',
          rollNumber: user?.rollNumber || '23JN1A4533',
          submittedAt: new Date().toISOString(),
        })

        showSuccess('Activity submitted successfully! Pending faculty coordinator verification.')
        setIsSubmitting(false)
        navigate('/student/activities')
      } catch (err) {
        showError('Failed to record activity. Please try again.')
        setIsSubmitting(false)
      }
    }, 600)
  }

  return (
    <div className="student-dashboard add-activity-page">
      {/* Page Header */}
      <div className="page-title-row">
        <div>
          <div className="eyebrow">
            <span>STUDENT ENGAGEMENT</span>
            <span className="bullet-sep">•</span>
            <span>ACTIVITY & CREDIT SUBMISSION</span>
          </div>
          <h1>Record New Campus Activity</h1>
          <p>
            Submit proof of technical events, internships, hackathons, and certifications to earn university activity credits.
          </p>
        </div>
        <div>
          <Link to="/student/activities" className="button button-light">
            ← Back to Activities
          </Link>
        </div>
      </div>

      <div className="form-layout-two-col">
        {/* Main Form Card */}
        <section className="surface-card form-main-card">
          <form onSubmit={handleSubmit} className="kiet-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">
                Activity / Event Title <span className="req-star">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Smart India Hackathon 2026 / AWS Cloud Practitioner"
                required
                className="kiet-input"
              />
            </div>

            {/* Category & Role */}
            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="category">
                  Category (11 Approved Streams) <span className="req-star">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="kiet-input"
                >
                  {activityCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  Participation Role <span className="req-star">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="kiet-input"
                >
                  <option value="Winner / 1st Prize">Winner / 1st Prize</option>
                  <option value="Runner Up / 2nd Prize">Runner Up / 2nd Prize</option>
                  <option value="Finalist / Top 10">Finalist / Top 10</option>
                  <option value="Participant">Participant / Attendee</option>
                  <option value="Lead Organizer">Lead Student Organizer</option>
                  <option value="Volunteer / Core Team">Volunteer / Core Team</option>
                  <option value="Intern / Trainee">Intern / Trainee</option>
                  <option value="Author / Presenter">Author / Presenter</option>
                </select>
              </div>
            </div>

            {/* Organizing Body & Date */}
            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="organizer">Organizing Body / Institution</label>
                <input
                  id="organizer"
                  name="organizer"
                  type="text"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="e.g. KIET EDC / IIT Madras / HackerEarth / Google"
                  className="kiet-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date of Event / Completion</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="kiet-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Summary / Key Learnings</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the challenge, project built, technology stack used, or certification syllabus covered..."
                className="kiet-input"
              />
            </div>

            {/* Verification Link */}
            <div className="form-group">
              <label htmlFor="credentialUrl">Credential URL / GitHub Repository</label>
              <input
                id="credentialUrl"
                name="credentialUrl"
                type="url"
                value={formData.credentialUrl}
                onChange={handleChange}
                placeholder="https://coursera.org/verify/... or https://github.com/..."
                className="kiet-input"
              />
            </div>

            {/* File Upload Zone */}
            <div className="form-group">
              <label>Certificate / Evidence Document (PDF, JPG, PNG)</label>
              <div className="upload-dropzone">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="upload-input-hidden"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    <strong>Click to upload certificate</strong> or drag & drop here
                  </div>
                  <span className="upload-hint">Supported formats: PDF, JPG, PNG up to 5MB</span>
                </label>
              </div>

              {fileName && (
                <div className="upload-preview-bar">
                  <div className="file-info">
                    <span className="file-icon">📎</span>
                    <strong className="file-name">{fileName}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={handleRemoveFile}
                    title="Remove attached file"
                  >
                    ✕
                  </button>
                </div>
              )}

              {previewImage && (
                <div className="image-preview-box">
                  <img src={previewImage} alt="Certificate preview" />
                </div>
              )}
            </div>

            {/* Submit Bar */}
            <div className="form-actions-bar">
              <button
                type="submit"
                className="button button-primary btn-submit-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-inline" /> Submitting Record...
                  </>
                ) : (
                  'Submit for Faculty Verification'
                )}
              </button>
              <Link to="/student/activities" className="button button-light">
                Cancel
              </Link>
            </div>
          </form>
        </section>

        {/* Guidelines Sidebar */}
        <aside className="guidelines-sidebar">
          <div className="surface-card guidelines-card">
            <h3 className="guidelines-title">Submission Guidelines</h3>
            <ul className="guidelines-list">
              <li>
                <strong>Activity Credit Policy:</strong> All verified activities count toward semester co-curricular credits under JNTUK guidelines.
              </li>
              <li>
                <strong>Certificate Verification:</strong> Upload clear, legible certificates showing your name and roll number.
              </li>
              <li>
                <strong>Review Timeline:</strong> Faculty coordinators review submissions within 48-72 working hours.
              </li>
              <li>
                <strong>Resume Integration:</strong> Verified activities automatically become eligible to link directly into your KIET Resume Builder.
              </li>
            </ul>

            <div className="student-badge-box">
              <div className="badge-avatar">
                {(user?.name || 'S').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong>{user?.name || 'Student'}</strong>
                <div className="text-muted">{user?.rollNumber || '23JN1A4533'}</div>
                <div className="text-muted">KIET Korangi • JNTUK</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
