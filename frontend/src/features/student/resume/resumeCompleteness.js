/**
 * Checks behind the "Resume completeness" panel. `target` opens a section and focuses a field;
 * `link` sends the student to the page where that record is managed.
 * Optional items are listed but do not lower the percentage, since many freshers have none.
 */
export function resumeCompleteness(model) {
  const hasLevel = (level) => model.school.some((row) => row.level === level && row.score)
  const skillCount = Object.values(model.skills).flat().length
  const personal = model.personal

  const checks = [
    { id: 'phone', label: 'Phone number', done: Boolean(personal.phone.trim()), target: { section: 'personal', field: 'resume-phone' } },
    { id: 'location', label: 'Location (town and state)', done: Boolean(personal.location.trim()), target: { section: 'personal', field: 'resume-location' } },
    {
      id: 'links',
      label: 'LinkedIn or GitHub profile',
      done: Boolean(personal.linkedin.trim() || personal.github.trim()),
      target: { section: 'personal', field: 'resume-linkedin' },
    },
    { id: 'summary', label: 'Professional summary', done: Boolean(model.summary.trim()), target: { section: 'summary', field: 'resume-summary' } },
    { id: 'class10', label: 'Class 10 marks', done: hasLevel('Class 10'), target: { section: 'education', field: 'resume-add-class10' } },
    {
      id: 'class12',
      label: 'Class 12 or diploma marks',
      done: hasLevel('Class 12') || hasLevel('Diploma'),
      target: { section: 'education', field: 'resume-add-class12' },
    },
    { id: 'skills', label: 'At least 3 skills', done: skillCount >= 3, target: { section: 'skills', field: 'resume-skills-languages' } },
    model.projects.length
      ? { id: 'projects', label: 'At least one project included', done: model.projects.some((item) => item.included), target: { section: 'projects', field: 'resume-projects-list' } }
      : { id: 'projects', label: 'At least one project', done: false, link: '/student/portfolio?tab=projects', linkLabel: 'Add in Portfolio' },
    model.certifications.length
      ? {
          id: 'certifications',
          label: 'At least one certification included',
          done: model.certifications.some((item) => item.included),
          target: { section: 'certifications', field: 'resume-certifications-list' },
        }
      : { id: 'certifications', label: 'At least one certification', done: false, link: '/student/portfolio?tab=certifications', linkLabel: 'Add in Portfolio' },
    { id: 'experience', label: 'Internship experience', optional: true, done: model.experience.length > 0, link: '/student/portfolio?tab=internships', linkLabel: 'Add in Portfolio' },
    { id: 'achievements', label: 'Achievements', optional: true, done: model.achievements.length > 0, link: '/student/portfolio?tab=achievements', linkLabel: 'View in Portfolio' },
    { id: 'extracurricular', label: 'Clubs and activities', optional: true, done: model.extracurricular.length > 0, link: '/student/clubs', linkLabel: 'Explore clubs' },
  ]

  const counted = checks.filter((check) => !check.optional)
  const percent = Math.round((counted.filter((check) => check.done).length / counted.length) * 100)
  return { percent, missing: checks.filter((check) => !check.done), checks }
}
