import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: 'AgroDrone AI — Multispectral Crop Pathology System',
    intro: 'Computer vision pipeline running on edge hexacopters to identify leaf spot disease and nitrogen deficiency in real-time.',
    githubUrl: 'https://github.com/kiet-student/agrodrone-ai-telemetry',
    deployedUrl: 'https://agrodrone-telemetry-demo.kiet.edu',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'OpenCV', 'React'],
    category: 'AI / Computer Vision',
    status: 'Live Deployed',
    year: '2025–26',
    stars: 38,
  },
  {
    id: 'proj-2',
    title: 'KIET Smart Gate & RFID Telemetry Portal',
    intro: 'High-throughput student entry authentication system processing 4,000+ campus entries per hour with offline caching.',
    githubUrl: 'https://github.com/kiet-student/smartgate-iot-portal',
    deployedUrl: 'https://smartgate.kietgroup.com',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'MQTT', 'ESP32'],
    category: 'Full-Stack & IoT',
    status: 'Live Deployed',
    year: '2025',
    stars: 24,
  },
  {
    id: 'proj-3',
    title: 'Distributed High-Frequency Order Matcher Engine',
    intro: 'Memory-mapped L3 order book engine benchmarked at 450,000 orders/sec with zero-allocation data structures.',
    githubUrl: 'https://github.com/kiet-student/distributed-order-book-cpp',
    deployedUrl: '', // No deployed link for low-level daemon
    techStack: ['C++20', 'Linux Sockets', 'Google Benchmark', 'Docker'],
    category: 'Systems & Algorithms',
    status: 'Completed',
    year: '2024',
    stars: 62,
  },
  {
    id: 'proj-4',
    title: 'MediTrack IoT — Vaccine Cold-Chain Telemetry Guard',
    intro: 'Low-power LoRaWAN sensor mesh monitoring rural healthcare vaccine storage units with automated SMS fault dispatches.',
    githubUrl: 'https://github.com/kiet-student/meditrack-iot-sensor',
    deployedUrl: 'https://meditrack.kiet.edu.in',
    techStack: ['C++', 'FreeRTOS', 'LoRaWAN', 'FastAPI', 'Grafana'],
    category: 'IoT & Embedded',
    status: 'Live Deployed',
    year: '2025',
    stars: 19,
  },
  {
    id: 'proj-5',
    title: 'AI OCR for Ancient Telugu Palm Leaf Inscriptions',
    intro: 'Transformer-based character recognition model trained on digitized 16th-century palm manuscripts with 91.4% character accuracy.',
    githubUrl: 'https://github.com/kiet-student/telugu-palm-ocr-ai',
    deployedUrl: '',
    techStack: ['PyTorch', 'Vision Transformer (ViT)', 'HuggingFace', 'Gradio'],
    category: 'AI / Computer Vision',
    status: 'SIH Finalist',
    year: '2024',
    stars: 45,
  },
  {
    id: 'proj-6',
    title: 'Autonomous Code Review AST Guardian',
    intro: 'GitHub Actions bot analyzing PR abstract syntax trees to enforce department coding guidelines and catch memory vulnerabilities.',
    githubUrl: 'https://github.com/kiet-student/code-ast-guardian',
    deployedUrl: 'https://ast-guardian.kiet.edu',
    techStack: ['TypeScript', 'Babel AST', 'GitHub API', 'Vite'],
    category: 'Developer Tools',
    status: 'Live Deployed',
    year: '2025',
    stars: 31,
  },
]

export default function StudentProjects() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('kiet_student_projects')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return DEFAULT_PROJECTS
  })

  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    githubUrl: '',
    deployedUrl: '',
    techStack: '',
    category: 'Full-Stack & Web',
  })

  useEffect(() => {
    try {
      localStorage.setItem('kiet_student_projects', JSON.stringify(projects))
    } catch {
      // ignore
    }
  }, [projects])

  const categories = ['All', 'AI / Computer Vision', 'Full-Stack & IoT', 'Systems & Algorithms', 'Developer Tools']

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category.toLowerCase().includes(activeCategory.toLowerCase())
      const matchesQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.intro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCat && matchesQuery
    })
  }, [projects, activeCategory, searchQuery])

  const handleAddProject = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.intro.trim() || !formData.githubUrl.trim()) {
      addToast('Please fill out Project Name, Intro, and GitHub URL.', 'error')
      return
    }

    const newProj = {
      id: `proj-${Date.now()}`,
      title: formData.title.trim(),
      intro: formData.intro.trim(),
      githubUrl: formData.githubUrl.trim(),
      deployedUrl: formData.deployedUrl.trim(),
      techStack: formData.techStack
        ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : ['React', 'JavaScript'],
      category: formData.category,
      status: formData.deployedUrl.trim() ? 'Live Deployed' : 'Active Repository',
      year: '2026',
      stars: 1,
    }

    setProjects([newProj, ...projects])
    setShowAddModal(false)
    setFormData({ title: '', intro: '', githubUrl: '', deployedUrl: '', techStack: '', category: 'Full-Stack & Web' })
    addToast('Project published to your portfolio successfully!', 'success')
  }

  return (
    <div className="student-space-page fade-in">
      {/* 1. Sleek, Light-Weighted Hero Header */}
      <section className="projects-hero-card">
        <div className="projects-hero-copy">
          <div className="projects-hero-badge">
            ⚡ CODE &amp; INNOVATION REPOSITORIES • KIET PORTFOLIO
          </div>
          <h1>Technical Projects &amp; Deployments</h1>
          <p>
            Showcase your software architectures, open-source repositories, AI/ML models, and deployed cloud web applications with direct links for recruiters.
          </p>
          <div className="projects-hero-kpis">
            <div className="kpi-tag">
              <strong>{projects.length}</strong> <span>Projects Logged</span>
            </div>
            <div className="kpi-tag">
              <strong>{projects.filter(p => p.deployedUrl).length}</strong> <span>Live Deployed</span>
            </div>
            <div className="kpi-tag">
              <strong>{projects.filter(p => p.githubUrl).length}</strong> <span>Public Repos</span>
            </div>
          </div>
        </div>

        <div className="projects-hero-actions">
          <button className="btn-add-project" onClick={() => setShowAddModal(true)}>
            + Submit New Project
          </button>
        </div>
      </section>

      {/* 2. Filter Bar & Search */}
      <div className="projects-toolbar-bar">
        <div className="projects-categories-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`project-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="project-search-wrap">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search projects by tech, title, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Clean, Modern Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map(proj => (
          <article key={proj.id} className="project-card">
            <div className="project-card-header">
              <div className="project-header-top">
                <span className="project-category-badge">{proj.category}</span>
                <span className={`project-status-badge ${proj.deployedUrl ? 'deployed' : 'repo'}`}>
                  ● {proj.status}
                </span>
              </div>
              <h3 className="project-card-title">{proj.title}</h3>
              <p className="project-card-intro">{proj.intro}</p>
            </div>

            <div className="project-tech-pills">
              {proj.techStack.map((tech, idx) => (
                <span key={idx} className="tech-pill">
                  {tech}
                </span>
              ))}
            </div>

            <div className="project-card-footer">
              <div className="project-links-group">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-project-link github"
                    title="Inspect Source Code on GitHub"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub Code</span>
                  </a>
                )}

                {proj.deployedUrl ? (
                  <a
                    href={proj.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-project-link live"
                    title="Open Live Deployed Application"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>Live Demo ↗</span>
                  </a>
                ) : (
                  <span className="no-deploy-tag">No Live Deploy</span>
                )}
              </div>

              <span className="project-year-tag">{proj.year}</span>
            </div>
          </article>
        ))}

        {filteredProjects.length === 0 && (
          <div className="projects-empty-card">
            <span style={{ fontSize: 36 }}>💻</span>
            <h4>No projects found</h4>
            <p>Try clearing your search query or submit a new project repository to get started.</p>
            <button className="btn-add-project" onClick={() => setShowAddModal(true)}>
              + Add First Project
            </button>
          </div>
        )}
      </div>

      {/* 4. Add Project Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card project-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>🚀</span>
                <div>
                  <h3 className="modal-title">Publish New Project</h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    Add your repository and deployment to your verified portfolio
                  </span>
                </div>
              </div>
              <button className="btn-modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProject}>
              <div className="modal-body">
                <div className="form-group-field">
                  <label>
                    Project Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., AgroDrone AI — Crop Disease Telemetry"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group-field">
                  <label>
                    Short Intro / Overview <span>*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what the project does, key features, and your core technical contribution..."
                    value={formData.intro}
                    onChange={e => setFormData({ ...formData, intro: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group-field">
                    <label>
                      GitHub Repository URL <span>*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/project-repo"
                      value={formData.githubUrl}
                      onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Live Deployed URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://your-project.vercel.app or similar"
                      value={formData.deployedUrl}
                      onChange={e => setFormData({ ...formData, deployedUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group-field">
                    <label>Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, Python, PostgreSQL"
                      value={formData.techStack}
                      onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Domain Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Full-Stack & Web">Full-Stack &amp; Web</option>
                      <option value="AI / Computer Vision">AI / Computer Vision</option>
                      <option value="Full-Stack & IoT">Full-Stack &amp; IoT</option>
                      <option value="Systems & Algorithms">Systems &amp; Algorithms</option>
                      <option value="Developer Tools">Developer Tools</option>
                      <option value="Mobile Application">Mobile Application</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-modal-action">
                  Publish to Portfolio
                </button>
                <button
                  type="button"
                  className="btn-modal-close-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
