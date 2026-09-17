import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'

// Durga Prasad Reference Data (Extracted accurately from Durga_Prasad_Resume.pdf)
export const initialDurgaPrasadResume = {
  fullName: 'Peddapalli Satya Venkata Siva Durga Prasad',
  jobTitle: 'Full Stack Developer / Software Engineer',
  email: 'durga.peddapalli@kiet.edu',
  phone: '+91 94943 00874',
  location: 'Korangi, Kakinada, Andhra Pradesh',
  linkedin: 'linkedin.com/in/durga-prasad-kiet',
  github: 'github.com/durga-prasad',
  portfolio: 'https://durga-portfolio.kiet.edu',
  summary:
    'Dedicated and detail-oriented B.Tech Computer Science student at KIET with demonstrated expertise in Full Stack Development, MERN stack, and Cloud Services. Passionate about engineering high-performance RESTful APIs, scalable database architectures, and intuitive user experiences. Proven problem-solving capabilities with 380+ LeetCode problems solved and active contributions to collegiate innovation initiatives.',
  skills: [
    { category: 'Programming Languages', items: 'Java, JavaScript (ES6+), Python, C, SQL' },
    { category: 'Frontend Development', items: 'React.js, Next.js, Redux Toolkit, HTML5, CSS3, Tailwind CSS, Bootstrap' },
    { category: 'Backend & APIs', items: 'Node.js, Express.js, RESTful Architecture, JWT Authentication, Microservices' },
    { category: 'Databases & Storage', items: 'MongoDB, PostgreSQL, MySQL, Redis' },
    { category: 'Tools & DevOps', items: 'Git, GitHub, Docker, Postman, Linux (Ubuntu), VS Code, Vercel' },
    { category: 'Core Competencies', items: 'Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), System Design, DBMS' },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Full Stack Developer Intern',
      organization: 'Innov2Grow Technologies',
      location: 'Hyderabad / Remote',
      period: 'Jun 2025 – Aug 2025',
      bullets: [
        'Engineered responsive customer-facing web modules using React.js and Tailwind CSS, increasing user session duration by 24%.',
        'Built secure REST endpoints using Node.js/Express and optimized MongoDB aggregation queries, improving API throughput by 30%.',
        'Implemented JWT-based authentication and role-based access control (RBAC) ensuring enterprise-grade data security.',
        'Collaborated closely with a 6-member agile team, participating in daily stand-ups and continuous CI/CD deployments.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Core Student Developer',
      organization: 'KIET Open Source & Tech Innovation Hub',
      location: 'Kakinada, AP',
      period: 'Jan 2025 – May 2025',
      bullets: [
        'Contributed to the development of the unified KIET student engagement portal serving 2,000+ active campus learners.',
        'Developed reusable UI components and modular design tokens, decreasing codebase redundancy across 5 internal sub-projects.',
        'Spearheaded the technical onboarding of 40+ junior developers in version control and modern React development best practices.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'TalentPath — AI-Powered Career Guidance & Placement Portal',
      techStack: 'React.js, Node.js, Express, MongoDB, Tailwind CSS, OpenAI API',
      period: 'Mar 2025 – May 2025',
      bullets: [
        'Built a full-stack career platform automating resume keyword scanning, skill gap analysis, and mock interview scheduling.',
        'Integrated asynchronous background jobs for parsing candidate profiles, reducing evaluation latency from 15s to 2s.',
        'Deployed production database with indexing and connection pooling, tested smoothly across 1,200+ simulated student queries.',
      ],
    },
    {
      id: 'proj-2',
      title: 'Workboard — Real-Time Collaborative Task Management System',
      techStack: 'React.js, WebSockets, PostgreSQL, Tailwind CSS, Docker',
      period: 'Oct 2024 – Dec 2024',
      bullets: [
        'Architected a Trello-inspired project dashboard featuring real-time drag-and-drop Kanban boards via WebSockets.',
        'Designed normalized PostgreSQL relational schema with foreign key constraints, triggers, and automated audit logging.',
        'Containerized entire application using Docker Compose for seamless local and cloud development environments.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Kakinada Institute of Engineering & Technology (KIET)',
      location: 'Korangi, Kakinada, AP',
      period: '2023 – 2027',
      score: 'CGPA: 8.65 / 10.0',
    },
    {
      id: 'edu-2',
      degree: 'Board of Intermediate Education (MPC)',
      institution: 'Sri Chaitanya Junior College',
      location: 'Kakinada, AP',
      period: '2021 – 2023',
      score: 'Percentage: 94.2%',
    },
    {
      id: 'edu-3',
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Z.P. High School',
      location: 'Andhra Pradesh',
      period: '2020 – 2021',
      score: 'GPA: 9.8 / 10.0',
    },
  ],
  achievements: [
    'LeetCode: 380+ algorithmic problems solved with 50+ days active streak (Top 15% global ranking).',
    '1st Prize Winner — Smart KIET Annual Hackathon 2025 (AI & Smart Campus Solutions track).',
    'AWS Certified Cloud Practitioner (CLF-C02) credential earned in 2025.',
    'Lead Coordinator for Google Coding Club (KIET Chapter), mentoring 100+ students in competitive DSA.',
  ],
}

const TEMPLATES = [
  { id: 'professional', name: 'Professional (Durga Prasad)', tone: 'Standard executive layout' },
  { id: 'modern', name: 'Modern Split', tone: 'Navy header with sleek accent bar' },
  { id: 'minimal', name: 'Clean Minimal', tone: 'High-contrast typography focus' },
  { id: 'classic', name: 'Academic Classic', tone: 'Traditional serif typography' },
  { id: 'creative', name: 'Creative Tech', tone: 'Two-tone badge & pill highlights' },
  { id: 'ats', name: 'ATS Optimized', tone: 'Pure single-column scanner ready' },
]

export const FONTS = [
  { id: 'jakarta', name: 'Modern Sans (Plus Jakarta)', css: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" },
  { id: 'inter', name: 'Executive Clean (Inter)', css: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { id: 'outfit', name: 'Corporate Tech (Outfit)', css: "'Outfit', 'Plus Jakarta Sans', sans-serif" },
  { id: 'serif', name: 'Editorial Serif (Merriweather)', css: "'Merriweather', Georgia, 'Times New Roman', serif" },
  { id: 'manrope', name: 'Executive Sans (Manrope)', css: "'Manrope', -apple-system, sans-serif" },
  { id: 'classic', name: 'Classic Elegant (Playfair Display)', css: "'Playfair Display', 'Garamond', serif" },
  { id: 'mono', name: 'Developer Tech (JetBrains Mono)', css: "'JetBrains Mono', monospace" },
]

export const DENSITIES = [
  { id: 'compact', name: 'Compact', lineHeight: '1.34', fontSize: '11px' },
  { id: 'standard', name: 'Standard', lineHeight: '1.45', fontSize: '11.8px' },
  { id: 'relaxed', name: 'Relaxed', lineHeight: '1.58', fontSize: '12.4px' },
]

export const ACCENT_COLORS = [
  { id: 'navy', name: 'KIET Navy', hex: '#0f2b48' },
  { id: 'royal', name: 'Royal Indigo', hex: '#1e40af' },
  { id: 'emerald', name: 'Forest Emerald', hex: '#065f46' },
  { id: 'slate', name: 'Slate Carbon', hex: '#1e293b' },
  { id: 'burgundy', name: 'Burgundy', hex: '#831843' },
]

export default function StudentResume() {
  const { user } = useAuth()
  const { showSuccess, showInfo } = useToast()
  const storageKey = `kiet_resume_profile_${user?.id || user?.rollNumber || 'student'}`

  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    return initialDurgaPrasadResume
  })

  const [selectedTemplate, setSelectedTemplate] = useState('professional')
  const [selectedFont, setSelectedFont] = useState('inter')
  const [selectedDensity, setSelectedDensity] = useState('standard')
  const [selectedColor, setSelectedColor] = useState('navy')
  const [isExpandedView, setIsExpandedView] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [activeAccordion, setActiveAccordion] = useState('contact')
  const printRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const selectedFontObj = FONTS.find(f => f.id === selectedFont) || FONTS[0]
  const selectedDensityObj = DENSITIES.find(d => d.id === selectedDensity) || DENSITIES[1]
  const selectedColorObj = ACCENT_COLORS.find(c => c.id === selectedColor) || ACCENT_COLORS[0]

  const handleScrollProgress = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const progress = scrollHeight > clientHeight ? Math.round((scrollTop / (scrollHeight - clientHeight)) * 100) : 0
      setScrollProgress(progress)
    }
  }

  const handleScrollTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  const handleFitWidth = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth - 48
      const calculatedZoom = Math.max(50, Math.min(110, Math.round((containerWidth / 794) * 100)))
      setZoomLevel(calculatedZoom)
      showInfo(`Auto-fitted slide width (${calculatedZoom}%)`)
    }
  }

  // Save changes to localStorage
  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(resumeData))
      showSuccess('Resume saved successfully! All templates updated.')
    } catch {
      showSuccess('Resume updated in memory.')
    }
  }

  // Reset to Durga Prasad standard
  const handleResetToStandard = () => {
    if (window.confirm('Reset all resume sections to standard KIET Durga Prasad template?')) {
      setResumeData(initialDurgaPrasadResume)
      localStorage.setItem(storageKey, JSON.stringify(initialDurgaPrasadResume))
      showInfo('Reset to KIET Standard Template.')
    }
  }

  // Print handler
  const handlePrint = () => {
    window.print()
  }

  // Generic field update
  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }))
  }

  // Skill row update
  const handleSkillChange = (index, key, val) => {
    setResumeData((prev) => {
      const nextSkills = [...prev.skills]
      nextSkills[index] = { ...nextSkills[index], [key]: val }
      return { ...prev, skills: nextSkills }
    })
  }

  // Experience updates
  const handleExpChange = (index, key, val) => {
    setResumeData((prev) => {
      const next = [...prev.experience]
      next[index] = { ...next[index], [key]: val }
      return { ...prev, experience: next }
    })
  }

  const handleExpBulletChange = (expIdx, bulletIdx, val) => {
    setResumeData((prev) => {
      const next = [...prev.experience]
      const nextBullets = [...next[expIdx].bullets]
      nextBullets[bulletIdx] = val
      next[expIdx] = { ...next[expIdx], bullets: nextBullets }
      return { ...prev, experience: next }
    })
  }

  const handleAddExpBullet = (expIdx) => {
    setResumeData((prev) => {
      const next = [...prev.experience]
      next[expIdx] = { ...next[expIdx], bullets: [...next[expIdx].bullets, 'New impact statement or achievement...'] }
      return { ...prev, experience: next }
    })
  }

  // Project updates
  const handleProjectChange = (index, key, val) => {
    setResumeData((prev) => {
      const next = [...prev.projects]
      next[index] = { ...next[index], [key]: val }
      return { ...prev, projects: next }
    })
  }

  const handleProjectBulletChange = (projIdx, bulletIdx, val) => {
    setResumeData((prev) => {
      const next = [...prev.projects]
      const nextBullets = [...next[projIdx].bullets]
      nextBullets[bulletIdx] = val
      next[projIdx] = { ...next[projIdx], bullets: nextBullets }
      return { ...prev, projects: next }
    })
  }

  // Education updates
  const handleEduChange = (index, key, val) => {
    setResumeData((prev) => {
      const next = [...prev.education]
      next[index] = { ...next[index], [key]: val }
      return { ...prev, education: next }
    })
  }

  // Achievements update
  const handleAchievementChange = (index, val) => {
    setResumeData((prev) => {
      const next = [...prev.achievements]
      next[index] = val
      return { ...prev, achievements: next }
    })
  }

  const handleAddAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, 'New certification, competitive programming rank or award...'],
    }))
  }

  const handleDeleteExpBullet = (expIdx, bIdx) => {
    setResumeData((prev) => {
      const next = [...prev.experience]
      const nextBullets = next[expIdx].bullets.filter((_, idx) => idx !== bIdx)
      next[expIdx] = { ...next[expIdx], bullets: nextBullets }
      return { ...prev, experience: next }
    })
  }

  const handleDeleteProjectBullet = (projIdx, bIdx) => {
    setResumeData((prev) => {
      const next = [...prev.projects]
      const nextBullets = next[projIdx].bullets.filter((_, idx) => idx !== bIdx)
      next[projIdx] = { ...next[projIdx], bullets: nextBullets }
      return { ...prev, projects: next }
    })
  }

  const handleDeleteAchievement = (achIdx) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== achIdx),
    }))
  }

  return (
    <div className="student-dashboard resume-builder-page">
      {/* Top Header & Toolbar */}
      <div className="resume-builder-header">
        <div>
          <div className="eyebrow">
            <span>KIET CAREER & PLACEMENT CELL</span>
            <span className="bullet-sep">•</span>
            <span>PROFESSIONAL RESUME BUILDER</span>
          </div>
          <h1 className="maven-black">Resume Studio</h1>
          <p>
            Standardized on the high-impact template of <strong>Durga Prasad (KIET CSE)</strong>. Choose between 6 templates with 100% data preservation.
          </p>
        </div>

        <div className="resume-global-actions">
          <button type="button" className="button button-light" onClick={handleResetToStandard}>
            ↺ Reset to Durga Prasad Sample
          </button>
          <button type="button" className="button button-primary" onClick={handleSave}>
            💾 Save Resume
          </button>
          <button type="button" className="button button-accent" onClick={handlePrint}>
            🖨️ Print / Download PDF
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      <section className="surface-card template-selector-bar">
        <div className="template-selector-label">
          <span className="label-title">Resume Format:</span>
          <span className="label-desc">Switch seamlessly between 6 verified college and corporate styles</span>
        </div>
        <div className="template-button-group">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn-template-choice ${selectedTemplate === t.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedTemplate(t.id)
                showInfo(`Applied "${t.name}" format`)
              }}
            >
              <span className="btn-tmpl-name">{t.name}</span>
              <span className="btn-tmpl-tone">{t.tone}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Split-Screen Studio: Left Editor, Right Live Preview */}
      <div className={`resume-split-layout ${isExpandedView ? 'expanded-slide-mode' : ''}`}>
        {/* LEFT COLUMN: Accordion Editor */}
        {!isExpandedView && (
          <div className="resume-editor-pane">
            <div className="editor-pane-header">
              <div className="eph-title-group">
                <span className="eph-icon">⚡</span>
                <div>
                  <h3 className="maven-black">Resume Studio Editor</h3>
                  <p>Real-time sync to live slide canvas • 100% data preservation</p>
                </div>
              </div>
              <span className="editor-status-badge">● Live Synced</span>
            </div>

            {/* 1. Personal & Contact Info Accordion */}
            <div className={`accordion-card acc-contact ${activeAccordion === 'contact' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'contact' ? '' : 'contact')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge blue">👤</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Personal &amp; Contact Details</span>
                    <span className="acc-subtitle">Full legal name, contact handles &amp; portfolio links</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">7 Fields</span>
                  <span className="accordion-chevron">{activeAccordion === 'contact' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'contact' && (
                <div className="accordion-content">
                  <div className="form-group">
                    <label>
                      <span className="field-icon">👤</span> Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={resumeData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      className="kiet-input"
                      placeholder="e.g. Durga Prasad"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <span className="field-icon">💼</span> Target Job Title / Specialization
                    </label>
                    <input
                      type="text"
                      value={resumeData.jobTitle}
                      onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                      className="kiet-input"
                      placeholder="e.g. Full Stack Developer / Software Engineer"
                    />
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label>
                        <span className="field-icon">✉️</span> Institutional Email
                      </label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="kiet-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <span className="field-icon">📞</span> Contact Number
                      </label>
                      <input
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className="kiet-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <span className="field-icon">📍</span> Location (City, State)
                    </label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      className="kiet-input"
                    />
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label>
                        <span className="field-icon">🔗</span> LinkedIn Profile Handle
                      </label>
                      <input
                        type="text"
                        value={resumeData.linkedin}
                        onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                        className="kiet-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <span className="field-icon">🐙</span> GitHub Profile Handle
                      </label>
                      <input
                        type="text"
                        value={resumeData.github}
                        onChange={(e) => handleFieldChange('github', e.target.value)}
                        className="kiet-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Professional Summary */}
            <div className={`accordion-card acc-summary ${activeAccordion === 'summary' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'summary' ? '' : 'summary')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge purple">📝</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Professional Executive Summary</span>
                    <span className="acc-subtitle">Primary engineering focus, core stack &amp; metrics</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">380+ DSA Metric</span>
                  <span className="accordion-chevron">{activeAccordion === 'summary' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'summary' && (
                <div className="accordion-content">
                  <div className="form-group">
                    <label>Executive Profile Statement</label>
                    <textarea
                      rows="4"
                      value={resumeData.summary}
                      onChange={(e) => handleFieldChange('summary', e.target.value)}
                      className="kiet-input"
                    />
                    <small className="field-hint">
                      Highlight your B.Tech specialization at KIET, key software stacks, and quantifiable achievements (e.g. 380+ DSA problems solved).
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Technical Skills (6 Categories) */}
            <div className={`accordion-card acc-skills ${activeAccordion === 'skills' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'skills' ? '' : 'skills')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge amber">⚡</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Technical Skills Portfolio</span>
                    <span className="acc-subtitle">Structured across 6 core computer science domains</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">{resumeData.skills.length} Domains</span>
                  <span className="accordion-chevron">{activeAccordion === 'skills' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'skills' && (
                <div className="accordion-content">
                  <p className="section-instruction-note">
                    Customize your technical stack categories. Technologies typed below will instantly render as verified skills on the live resume slide.
                  </p>
                  {resumeData.skills.map((skill, idx) => {
                    const domainIcons = ['💻', '🎨', '⚙️', '🗄️', '🛠️', '🧠']
                    return (
                      <div key={idx} className="nested-item-box skill-domain-box">
                        <div className="domain-card-head">
                          <span className="domain-index-badge">
                            {domainIcons[idx] || '⚡'} Domain #{idx + 1}
                          </span>
                          <span className="domain-active-label">{skill.category}</span>
                        </div>

                        <div className="form-group">
                          <label>Category Label</label>
                          <input
                            type="text"
                            value={skill.category}
                            onChange={(e) => handleSkillChange(idx, 'category', e.target.value)}
                            className="kiet-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Technologies &amp; Frameworks (comma-separated)</label>
                          <input
                            type="text"
                            value={skill.items}
                            onChange={(e) => handleSkillChange(idx, 'items', e.target.value)}
                            className="kiet-input"
                            placeholder="e.g. Java, Python, React, Docker"
                          />
                        </div>

                        {/* Live Skill Chips Preview */}
                        {skill.items && (
                          <div className="skill-live-chips-preview">
                            <span className="live-preview-label">Live Skill Badges:</span>
                            <div className="chips-row">
                              {skill.items.split(',').filter((s) => s.trim()).map((tech, tIdx) => (
                                <span key={tIdx} className="skill-preview-chip">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 4. Experience & Internships */}
            <div className={`accordion-card acc-experience ${activeAccordion === 'experience' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'experience' ? '' : 'experience')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge emerald">💼</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Work Experience &amp; Internships</span>
                    <span className="acc-subtitle">Industrial engagements, client projects &amp; student roles</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">{resumeData.experience.length} Roles</span>
                  <span className="accordion-chevron">{activeAccordion === 'experience' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'experience' && (
                <div className="accordion-content">
                  {resumeData.experience.map((exp, expIdx) => (
                    <div key={exp.id || expIdx} className="nested-item-box exp-card-box">
                      <div className="item-card-header">
                        <span className="item-index-tag">ROLE #{expIdx + 1}</span>
                        <strong className="item-header-title">{exp.role} @ {exp.organization}</strong>
                      </div>

                      <div className="form-row-two">
                        <div className="form-group">
                          <label>Designation / Role Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleExpChange(expIdx, 'role', e.target.value)}
                            className="kiet-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Company / Organization</label>
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={(e) => handleExpChange(expIdx, 'organization', e.target.value)}
                            className="kiet-input"
                          />
                        </div>
                      </div>

                      <div className="form-row-two">
                        <div className="form-group">
                          <label>📍 Work Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => handleExpChange(expIdx, 'location', e.target.value)}
                            className="kiet-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>📅 Tenure / Period</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => handleExpChange(expIdx, 'period', e.target.value)}
                            className="kiet-input"
                          />
                        </div>
                      </div>

                      <div className="bullets-editor">
                        <label className="bullets-title-label">Impact Bullet Points (STAR Format)</label>
                        {exp.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="bullet-row-advanced">
                            <span className="bullet-idx-bubble">#{bIdx + 1}</span>
                            <textarea
                              rows="2"
                              value={b}
                              onChange={(e) => handleExpBulletChange(expIdx, bIdx, e.target.value)}
                              className="kiet-input"
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                type="button"
                                className="btn-bullet-del"
                                onClick={() => handleDeleteExpBullet(expIdx, bIdx)}
                                title="Remove bullet point"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn-add-bullet"
                          onClick={() => handleAddExpBullet(expIdx)}
                        >
                          + Add Impact Bullet Point
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Technical Projects */}
            <div className={`accordion-card acc-projects ${activeAccordion === 'projects' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'projects' ? '' : 'projects')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge rose">🚀</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Technical Projects</span>
                    <span className="acc-subtitle">Full stack, distributed systems &amp; software architecture</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">{resumeData.projects.length} Projects</span>
                  <span className="accordion-chevron">{activeAccordion === 'projects' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'projects' && (
                <div className="accordion-content">
                  {resumeData.projects.map((proj, pIdx) => (
                    <div key={proj.id || pIdx} className="nested-item-box proj-card-box">
                      <div className="item-card-header">
                        <span className="item-index-tag rose">PROJECT #{pIdx + 1}</span>
                        <strong className="item-header-title">{proj.title}</strong>
                      </div>

                      <div className="form-group">
                        <label>Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleProjectChange(pIdx, 'title', e.target.value)}
                          className="kiet-input"
                        />
                      </div>

                      <div className="form-row-two">
                        <div className="form-group">
                          <label>Technologies &amp; Architecture</label>
                          <input
                            type="text"
                            value={proj.techStack}
                            onChange={(e) => handleProjectChange(pIdx, 'techStack', e.target.value)}
                            className="kiet-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>📅 Duration / Timeline</label>
                          <input
                            type="text"
                            value={proj.period}
                            onChange={(e) => handleProjectChange(pIdx, 'period', e.target.value)}
                            className="kiet-input"
                          />
                        </div>
                      </div>

                      {/* Live Tech Stack Chips */}
                      {proj.techStack && (
                        <div className="skill-live-chips-preview">
                          <span className="live-preview-label">Stack Pills:</span>
                          <div className="chips-row">
                            {proj.techStack.split(',').filter((s) => s.trim()).map((t, idx) => (
                              <span key={idx} className="skill-preview-chip stack-pill">
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bullets-editor">
                        <label className="bullets-title-label">Architecture &amp; Engineering Highlights</label>
                        {proj.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="bullet-row-advanced">
                            <span className="bullet-idx-bubble">#{bIdx + 1}</span>
                            <textarea
                              rows="2"
                              value={b}
                              onChange={(e) => handleProjectBulletChange(pIdx, bIdx, e.target.value)}
                              className="kiet-input"
                            />
                            {proj.bullets.length > 1 && (
                              <button
                                type="button"
                                className="btn-bullet-del"
                                onClick={() => handleDeleteProjectBullet(pIdx, bIdx)}
                                title="Remove highlight bullet"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Education History */}
            <div className={`accordion-card acc-education ${activeAccordion === 'education' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'education' ? '' : 'education')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge indigo">🎓</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Education History</span>
                    <span className="acc-subtitle">B.Tech degrees, Intermediate &amp; Secondary schooling</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">{resumeData.education.length} Degrees</span>
                  <span className="accordion-chevron">{activeAccordion === 'education' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'education' && (
                <div className="accordion-content">
                  {resumeData.education.map((edu, eduIdx) => {
                    const eduTiers = ['UG Degree (B.Tech)', 'Intermediate (+2)', 'Secondary School (SSC)']
                    return (
                      <div key={edu.id || eduIdx} className="nested-item-box edu-card-box">
                        <div className="item-card-header">
                          <span className="item-index-tag indigo">{eduTiers[eduIdx] || `QUALIFICATION #${eduIdx + 1}`}</span>
                          <strong className="item-header-title">{edu.degree}</strong>
                        </div>

                        <div className="form-row-two">
                          <div className="form-group">
                            <label>Degree / Examination</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEduChange(eduIdx, 'degree', e.target.value)}
                              className="kiet-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Institution / College</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleEduChange(eduIdx, 'institution', e.target.value)}
                              className="kiet-input"
                            />
                          </div>
                        </div>

                        <div className="form-row-two">
                          <div className="form-group">
                            <label>🎯 CGPA / Percentage Score</label>
                            <input
                              type="text"
                              value={edu.score}
                              onChange={(e) => handleEduChange(eduIdx, 'score', e.target.value)}
                              className="kiet-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>📅 Graduation Years</label>
                            <input
                              type="text"
                              value={edu.period}
                              onChange={(e) => handleEduChange(eduIdx, 'period', e.target.value)}
                              className="kiet-input"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 7. Achievements & Honors */}
            <div className={`accordion-card acc-achievements ${activeAccordion === 'achievements' ? 'open' : ''}`}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'achievements' ? '' : 'achievements')}
              >
                <div className="acc-trigger-left">
                  <span className="acc-icon-badge gold">🏆</span>
                  <div className="acc-text-wrap">
                    <span className="acc-title">Honors, Achievements &amp; Certifications</span>
                    <span className="acc-subtitle">LeetCode streaks, AWS credentials &amp; hackathon wins</span>
                  </div>
                </div>
                <div className="acc-trigger-right">
                  <span className="acc-count-pill">{resumeData.achievements.length} Credentials</span>
                  <span className="accordion-chevron">{activeAccordion === 'achievements' ? '▲' : '▼'}</span>
                </div>
              </button>

              {activeAccordion === 'achievements' && (
                <div className="accordion-content">
                  {resumeData.achievements.map((ach, achIdx) => (
                    <div key={achIdx} className="bullet-row-advanced" style={{ marginBottom: '10px' }}>
                      <span className="bullet-idx-bubble gold">★ #{achIdx + 1}</span>
                      <textarea
                        rows="2"
                        value={ach}
                        onChange={(e) => handleAchievementChange(achIdx, e.target.value)}
                        className="kiet-input"
                      />
                      {resumeData.achievements.length > 1 && (
                        <button
                          type="button"
                          className="btn-bullet-del"
                          onClick={() => handleDeleteAchievement(achIdx)}
                          title="Remove achievement"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-bullet"
                    onClick={handleAddAchievement}
                  >
                    + Add Verified Achievement / Certification
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Live Interactive Resume Slide with Scroll Controls */}
        <div className={`resume-preview-pane ${isExpandedView ? 'expanded' : ''}`}>
          {/* Advanced Toolbar & Typography Engine */}
          <div className="preview-toolbar-advanced">
            <div className="preview-toolbar-top-row">
              <div className="preview-slide-indicator">
                <span className="live-pulse-dot" />
                <strong className="maven-black">Resume Slide Canvas</strong>
                <span className="slide-badge-spec">A4 • 210 × 297 mm</span>
                <span className="slide-badge-template">{selectedTemplate.toUpperCase()}</span>
              </div>

              <div className="preview-actions-group">
                {/* Quick Scroll Navigation */}
                <div className="scroll-quick-buttons">
                  <button
                    type="button"
                    className="btn-scroll-action"
                    onClick={handleScrollTop}
                    title="Scroll to Top of Resume"
                  >
                    ⬆ Top
                  </button>
                  <button
                    type="button"
                    className="btn-scroll-action"
                    onClick={handleScrollBottom}
                    title="Scroll to Bottom of Resume"
                  >
                    ⬇ Bottom
                  </button>
                  <button
                    type="button"
                    className="btn-scroll-action"
                    onClick={handleFitWidth}
                    title="Auto-Fit Page to Canvas Width"
                  >
                    📄 Fit Width
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="zoom-controls">
                  <button
                    type="button"
                    className="btn-zoom"
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="zoom-text">{zoomLevel}%</span>
                  <button
                    type="button"
                    className="btn-zoom"
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn-zoom btn-zoom-reset"
                    onClick={() => setZoomLevel(100)}
                    title="Reset Zoom"
                  >
                    100%
                  </button>
                </div>

                {/* Toggle Full Slide Mode */}
                <button
                  type="button"
                  className={`btn-expand-view ${isExpandedView ? 'active' : ''}`}
                  onClick={() => setIsExpandedView(!isExpandedView)}
                  title={isExpandedView ? 'Restore Editor' : 'Expand Full Slide View'}
                >
                  {isExpandedView ? '⊡ Split View' : '⛶ Full Slide'}
                </button>
              </div>
            </div>

            {/* Dynamic Typography, Density & Color Palette Bar */}
            <div className="preview-style-bar">
              <div className="style-option-group">
                <span className="style-label">🔤 Typography:</span>
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    setSelectedFont(e.target.value)
                    showInfo(`Applied "${FONTS.find(f => f.id === e.target.value)?.name}" typography`)
                  }}
                  className="font-select-modern"
                >
                  {FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="style-option-group">
                <span className="style-label">📏 Line Spacing:</span>
                <div className="density-toggle-group">
                  {DENSITIES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`btn-density ${selectedDensity === d.id ? 'active' : ''}`}
                      onClick={() => setSelectedDensity(d.id)}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="style-option-group">
                <span className="style-label">🎨 Palette:</span>
                <div className="color-swatches-group">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`swatch-btn ${selectedColor === c.id ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setSelectedColor(c.id)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll Reading Progress Bar */}
            <div className="preview-scroll-progress-track">
              <div className="preview-scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
            </div>
          </div>

          {/* Scrollable Container with Independent Smooth Scrollbar */}
          <div
            ref={scrollContainerRef}
            className="resume-scroll-container"
            onScroll={handleScrollProgress}
          >
            <div
              className="resume-zoom-wrapper"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* THE RESUME SLIDE PAPER */}
              <div
                ref={printRef}
                className={`resume-paper template-theme-${selectedTemplate} font-${selectedFont} density-${selectedDensity}`}
                id="printable-resume-paper"
                style={{
                  fontFamily: selectedFontObj.css,
                  fontSize: selectedDensityObj.fontSize,
                  lineHeight: selectedDensityObj.lineHeight,
                  '--resume-accent': selectedColorObj.hex,
                }}
              >
                {/* 1. PROFESSIONAL TEMPLATE (Durga Prasad Reference) */}
                {selectedTemplate === 'professional' && (
                  <div className="tmpl-professional">
                    {/* Header */}
                    <div className="res-header">
                      <h1 className="res-name">{resumeData.fullName}</h1>
                      <div className="res-contact-bar">
                        {resumeData.phone && <span>{resumeData.phone}</span>}
                        {resumeData.email && <span>• {resumeData.email}</span>}
                        {resumeData.location && <span>• {resumeData.location}</span>}
                      </div>
                      <div className="res-links-bar">
                        {resumeData.linkedin && <span>LinkedIn: {resumeData.linkedin}</span>}
                        {resumeData.github && <span>• GitHub: {resumeData.github}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="res-section">
                        <h2 className="res-section-title">PROFESSIONAL SUMMARY</h2>
                        <p className="res-summary-text">{resumeData.summary}</p>
                      </div>
                    )}

                    {/* Technical Skills */}
                    <div className="res-section">
                      <h2 className="res-section-title">TECHNICAL SKILLS</h2>
                      <div className="res-skills-list">
                        {resumeData.skills.map((s, idx) => (
                          <div key={idx} className="res-skill-line">
                            <strong>{s.category}:</strong> <span>{s.items}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="res-section">
                      <h2 className="res-section-title">WORK EXPERIENCE & INTERNSHIPS</h2>
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="res-entry">
                          <div className="res-entry-head">
                            <span className="res-role-title">
                              <strong>{exp.role}</strong> — <em>{exp.organization}</em>
                            </span>
                            <span className="res-period">{exp.period}</span>
                          </div>
                          <div className="res-location-sub">{exp.location}</div>
                          <ul className="res-bullets">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div className="res-section">
                      <h2 className="res-section-title">PROJECTS</h2>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="res-entry">
                          <div className="res-entry-head">
                            <span className="res-role-title">
                              <strong>{proj.title}</strong>
                            </span>
                            <span className="res-period">{proj.period}</span>
                          </div>
                          <div className="res-tech-line">
                            <em>Technologies: {proj.techStack}</em>
                          </div>
                          <ul className="res-bullets">
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="res-section">
                      <h2 className="res-section-title">EDUCATION</h2>
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="res-entry res-edu-entry">
                          <div className="res-entry-head">
                            <span className="res-role-title">
                              <strong>{edu.degree}</strong> — <em>{edu.institution}</em>
                            </span>
                            <span className="res-period">{edu.period}</span>
                          </div>
                          <div className="res-location-sub">
                            {edu.location} | <strong>{edu.score}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div className="res-section">
                      <h2 className="res-section-title">ACHIEVEMENTS & CERTIFICATIONS</h2>
                      <ul className="res-bullets">
                        {resumeData.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. MODERN TEMPLATE */}
                {selectedTemplate === 'modern' && (
                  <div className="tmpl-modern">
                    <div className="modern-header-banner">
                      <h1>{resumeData.fullName}</h1>
                      <div className="modern-subtitle">{resumeData.jobTitle}</div>
                      <div className="modern-contact-flex">
                        <span>✉ {resumeData.email}</span>
                        <span>☎ {resumeData.phone}</span>
                        <span>📍 {resumeData.location}</span>
                      </div>
                    </div>

                    <div className="modern-body-pad">
                      <div className="res-section">
                        <h2 className="modern-sec-title">PROFILE</h2>
                        <p className="res-summary-text">{resumeData.summary}</p>
                      </div>

                      <div className="res-section">
                        <h2 className="modern-sec-title">TECHNICAL EXPERTISE</h2>
                        <div className="modern-skills-grid">
                          {resumeData.skills.map((s, idx) => (
                            <div key={idx} className="modern-skill-box">
                              <strong>{s.category}</strong>
                              <p>{s.items}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="res-section">
                        <h2 className="modern-sec-title">EXPERIENCE</h2>
                        {resumeData.experience.map((exp, idx) => (
                          <div key={idx} className="res-entry">
                            <div className="res-entry-head">
                              <strong>{exp.role} · {exp.organization}</strong>
                              <span className="modern-badge-period">{exp.period}</span>
                            </div>
                            <ul className="res-bullets">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="res-section">
                        <h2 className="modern-sec-title">FEATURED PROJECTS</h2>
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="res-entry">
                            <div className="res-entry-head">
                              <strong>{proj.title}</strong>
                              <span className="modern-badge-period">{proj.period}</span>
                            </div>
                            <div className="modern-tech-pill">{proj.techStack}</div>
                            <ul className="res-bullets">
                              {proj.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="res-section">
                        <h2 className="modern-sec-title">EDUCATION</h2>
                        {resumeData.education.map((edu, idx) => (
                          <div key={idx} className="res-entry">
                            <div className="res-entry-head">
                              <strong>{edu.degree}</strong>
                              <span>{edu.period}</span>
                            </div>
                            <div>{edu.institution} · <em>{edu.score}</em></div>
                          </div>
                        ))}
                      </div>

                      <div className="res-section">
                        <h2 className="modern-sec-title">HONORS & RECOGNITION</h2>
                        <ul className="res-bullets">
                          {resumeData.achievements.map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MINIMAL TEMPLATE */}
                {selectedTemplate === 'minimal' && (
                  <div className="tmpl-minimal">
                    <div className="min-header">
                      <h1 className="min-name">{resumeData.fullName}</h1>
                      <div className="min-meta">
                        {resumeData.jobTitle} — {resumeData.email} — {resumeData.phone}
                      </div>
                      <div className="min-links">
                        {resumeData.linkedin} | {resumeData.github}
                      </div>
                    </div>

                    <div className="min-section">
                      <h2 className="min-title">Background</h2>
                      <p>{resumeData.summary}</p>
                    </div>

                    <div className="min-section">
                      <h2 className="min-title">Skills</h2>
                      {resumeData.skills.map((s, idx) => (
                        <div key={idx} style={{ marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600 }}>{s.category}:</span> {s.items}
                        </div>
                      ))}
                    </div>

                    <div className="min-section">
                      <h2 className="min-title">Experience</h2>
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{exp.role}, {exp.organization}</strong>
                            <span>{exp.period}</span>
                          </div>
                          <ul className="res-bullets">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="min-section">
                      <h2 className="min-title">Projects</h2>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{proj.title}</strong>
                            <span>{proj.period}</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#555' }}>{proj.techStack}</div>
                          <ul className="res-bullets">
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="min-section">
                      <h2 className="min-title">Education</h2>
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                          <span>{edu.score} ({edu.period})</span>
                        </div>
                      ))}
                    </div>

                    <div className="min-section">
                      <h2 className="min-title">Achievements</h2>
                      <ul className="res-bullets">
                        {resumeData.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 4. CLASSIC TEMPLATE */}
                {selectedTemplate === 'classic' && (
                  <div className="tmpl-classic">
                    <div className="classic-header">
                      <h1>{resumeData.fullName}</h1>
                      <div className="classic-contact">
                        {resumeData.location} • {resumeData.phone} • {resumeData.email}
                      </div>
                      <div className="classic-links">
                        {resumeData.linkedin} • {resumeData.github}
                      </div>
                    </div>

                    <hr className="classic-divider" />

                    <div className="classic-section">
                      <h3>OBJECTIVE & SUMMARY</h3>
                      <p>{resumeData.summary}</p>
                    </div>

                    <div className="classic-section">
                      <h3>EDUCATION</h3>
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="classic-edu-row">
                          <div>
                            <strong>{edu.institution}</strong> — <em>{edu.degree}</em>
                          </div>
                          <div>{edu.score} ({edu.period})</div>
                        </div>
                      ))}
                    </div>

                    <div className="classic-section">
                      <h3>TECHNICAL EXPERTISE</h3>
                      <table className="classic-table">
                        <tbody>
                          {resumeData.skills.map((s, idx) => (
                            <tr key={idx}>
                              <td style={{ width: '32%', fontWeight: 'bold' }}>{s.category}</td>
                              <td>{s.items}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="classic-section">
                      <h3>PROFESSIONAL EXPERIENCE</h3>
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{exp.organization}</strong> — <em>{exp.role}</em>
                            <span>{exp.period}</span>
                          </div>
                          <ul className="res-bullets">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="classic-section">
                      <h3>ACADEMIC PROJECTS</h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{proj.title}</strong>
                            <span>{proj.period}</span>
                          </div>
                          <div><em>Tools: {proj.techStack}</em></div>
                          <ul className="res-bullets">
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="classic-section">
                      <h3>AWARDS & CERTIFICATIONS</h3>
                      <ul className="res-bullets">
                        {resumeData.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 5. CREATIVE TEMPLATE */}
                {selectedTemplate === 'creative' && (
                  <div className="tmpl-creative">
                    <div className="creative-header">
                      <div className="creative-badge">KIET GRADUATE</div>
                      <h1 className="creative-title">{resumeData.fullName}</h1>
                      <div className="creative-tagline">{resumeData.jobTitle}</div>
                      <div className="creative-pills">
                        <span>✉ {resumeData.email}</span>
                        <span>☎ {resumeData.phone}</span>
                        <span>🌐 {resumeData.portfolio}</span>
                      </div>
                    </div>

                    <div className="creative-card-block">
                      <h3 className="creative-block-title">About Me</h3>
                      <p>{resumeData.summary}</p>
                    </div>

                    <div className="creative-card-block">
                      <h3 className="creative-block-title">Skills & Arsenal</h3>
                      <div className="creative-skill-chips">
                        {resumeData.skills.map((s, idx) => (
                          <div key={idx} className="skill-chip-group">
                            <strong>{s.category}:</strong>
                            <span>{s.items}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="creative-card-block">
                      <h3 className="creative-block-title">Experience & Internships</h3>
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                            <span>{exp.role} @ {exp.organization}</span>
                            <span>{exp.period}</span>
                          </div>
                          <ul className="res-bullets">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="creative-card-block">
                      <h3 className="creative-block-title">Key Projects</h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                            <span>{proj.title}</span>
                            <span>{proj.period}</span>
                          </div>
                          <span className="creative-tech-tag">{proj.techStack}</span>
                          <ul className="res-bullets" style={{ marginTop: '6px' }}>
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="creative-card-block">
                      <h3 className="creative-block-title">Education</h3>
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span><strong>{edu.degree}</strong> ({edu.institution})</span>
                          <span>{edu.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. ATS FRIENDLY TEMPLATE */}
                {selectedTemplate === 'ats' && (
                  <div className="tmpl-ats">
                    <div className="ats-header">
                      <h1>{resumeData.fullName.toUpperCase()}</h1>
                      <div>
                        {resumeData.location} | {resumeData.phone} | {resumeData.email} | {resumeData.linkedin}
                      </div>
                    </div>

                    <div className="ats-section">
                      <h2>PROFESSIONAL SUMMARY</h2>
                      <p>{resumeData.summary}</p>
                    </div>

                    <div className="ats-section">
                      <h2>CORE TECHNICAL SKILLS</h2>
                      {resumeData.skills.map((s, idx) => (
                        <div key={idx} style={{ margin: '3px 0' }}>
                          <strong>{s.category}:</strong> {s.items}
                        </div>
                      ))}
                    </div>

                    <div className="ats-section">
                      <h2>WORK EXPERIENCE</h2>
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{exp.role}</strong>
                            <span>{exp.period}</span>
                          </div>
                          <div>{exp.organization}, {exp.location}</div>
                          <ul className="res-bullets">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="ats-section">
                      <h2>PROJECTS</h2>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{proj.title}</strong>
                            <span>{proj.period}</span>
                          </div>
                          <div>Technologies: {proj.techStack}</div>
                          <ul className="res-bullets">
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="ats-section">
                      <h2>EDUCATION</h2>
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                          <span>{edu.score} | {edu.period}</span>
                        </div>
                      ))}
                    </div>

                    <div className="ats-section">
                      <h2>ACHIEVEMENTS AND CERTIFICATIONS</h2>
                      <ul className="res-bullets">
                        {resumeData.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
