import { useEffect, useMemo, useState } from 'react'
import './JobPulse.css'


const EXPERIENCE_FILTERS = ['Fresher', '0-1', '1-2', '2-3', '3-4', '5++']
const TYPE_FILTERS = ['IT', 'NON IT']

const EMPTY_FORM = {
  companyName: '',
  technology: '',
  itOrNonIt: '',
  experience: '',
  skills: '',
  ctc: '',
  referBy: '',
  link: '',
}

const REQUIRED_FIELDS = [
  'companyName',
  'technology',
  'itOrNonIt',
  'experience',
  'skills',
  'ctc',
  'link',
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function skillsToList(skills) {
  if (Array.isArray(skills)) return skills
  if (!skills) return []
  return String(skills)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function JobCard({ job, index }) {
  const isIt = String(job.ITORNONIT || '').toUpperCase() === 'IT'
  return (
    <div className="jp-card" style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}>
      <div className="jp-card__inner">
        <div className="jp-card__top">
          <h3 className="jp-card__company">{job.COMPANYNAME}</h3>
          <span className={`jp-card__tag ${isIt ? 'jp-card__tag--it' : 'jp-card__tag--nonit'}`}>
            {isIt ? 'IT' : 'Non-IT'}
          </span>
        </div>

        <div className="jp-card__meta">
          <span>
            <strong>{job.TECHNOLOGY}</strong>
          </span>
          <span>Exp: <strong>{job.EXPERIENCE}</strong> yrs</span>
        </div>

        <div className="jp-card__skills">
          {skillsToList(job.SKILLS).map((skill) => (
            <span className="jp-card__skill" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <div className="jp-card__footer">
          <div>
            <span className="jp-card__ctc">
              {job.CTC}
              <span>CTC</span>
            </span>
            {job.REFERBY && <div className="jp-card__refer">Referred by {job.REFERBY}</div>}
          </div>
          <a
            className="jp-card__apply"
            href={job.LINK}
            target="_blank"
            rel="noreferrer"
          >
            Apply now ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function CreateJobModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validate() {
    const nextErrors = {}
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field] || !form[field].trim()) {
        nextErrors[field] = 'Required.'
      }
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    try {
      await createJob(form)
      setStatus('success')
      onCreated({
        COMPANYNAME: form.companyName,
        TECHNOLOGY: form.technology,
        ITORNONIT: form.itOrNonIt,
        EXPERIENCE: form.experience,
        SKILLS: form.skills,
        CTC: form.ctc,
        REFERBY: form.referBy,
        LINK: form.link,
      })
      setTimeout(onClose, 1100)
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="jp-modal" role="dialog" aria-modal="true">
      <div className="jp-modal__panel">
        <div className="jp-modal__head">
          <div>
            <h2>Post a job</h2>
            <p>This goes straight onto the JobPulse board.</p>
          </div>
          <button className="jp-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {status === 'success' && (
          <div className="jp-modal__banner jp-modal__banner--success">
            Job posted — it's live on the board.
          </div>
        )}
        {status === 'error' && (
          <div className="jp-modal__banner jp-modal__banner--error">
            Couldn't post the job. JobPulse might be down — try again shortly.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`jp-field ${errors.companyName ? 'jp-field--invalid' : ''}`}>
            <label htmlFor="jp-company">
              Company name <span className="jp-required">*</span>
            </label>
            <input
              id="jp-company"
              type="text"
              placeholder="e.g. Acme Corp"
              value={form.companyName}
              onChange={handleChange('companyName')}
            />
            {errors.companyName && <p className="jp-field__error">{errors.companyName}</p>}
          </div>

          <div className="jp-grid-2">
            <div className={`jp-field ${errors.technology ? 'jp-field--invalid' : ''}`}>
              <label htmlFor="jp-tech">
                Technology <span className="jp-required">*</span>
              </label>
              <input
                id="jp-tech"
                type="text"
                placeholder="e.g. React, SAP CAPM"
                value={form.technology}
                onChange={handleChange('technology')}
              />
              {errors.technology && <p className="jp-field__error">{errors.technology}</p>}
            </div>

            <div className={`jp-field ${errors.itOrNonIt ? 'jp-field--invalid' : ''}`}>
              <label htmlFor="jp-type">
                IT / Non-IT <span className="jp-required">*</span>
              </label>
              <select id="jp-type" value={form.itOrNonIt} onChange={handleChange('itOrNonIt')}>
                <option value="">Select</option>
                <option value="IT">IT</option>
                <option value="NON IT">Non-IT</option>
              </select>
              {errors.itOrNonIt && <p className="jp-field__error">{errors.itOrNonIt}</p>}
            </div>
          </div>

          <div className="jp-grid-2">
            <div className={`jp-field ${errors.experience ? 'jp-field--invalid' : ''}`}>
              <label htmlFor="jp-exp">
                Experience required <span className="jp-required">*</span>
              </label>
              <select id="jp-exp" value={form.experience} onChange={handleChange('experience')}>
                <option value="">Select</option>
                {EXPERIENCE_FILTERS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              {errors.experience && <p className="jp-field__error">{errors.experience}</p>}
            </div>

            <div className={`jp-field ${errors.ctc ? 'jp-field--invalid' : ''}`}>
              <label htmlFor="jp-ctc">
                CTC <span className="jp-required">*</span>
              </label>
              <input
                id="jp-ctc"
                type="text"
                placeholder="e.g. 6-8 LPA"
                value={form.ctc}
                onChange={handleChange('ctc')}
              />
              {errors.ctc && <p className="jp-field__error">{errors.ctc}</p>}
            </div>
          </div>

          <div className={`jp-field ${errors.skills ? 'jp-field--invalid' : ''}`}>
            <label htmlFor="jp-skills">
              Skills <span className="jp-required">*</span>
            </label>
            <input
              id="jp-skills"
              type="text"
              placeholder="Comma-separated, e.g. React, Node.js, SQL"
              value={form.skills}
              onChange={handleChange('skills')}
            />
            {errors.skills && <p className="jp-field__error">{errors.skills}</p>}
          </div>

          <div className="jp-grid-2">
            <div className="jp-field">
              <label htmlFor="jp-refer">
                Refer by <span className="jp-optional">Optional</span>
              </label>
              <input
                id="jp-refer"
                type="text"
                placeholder="Referrer's name"
                value={form.referBy}
                onChange={handleChange('referBy')}
              />
            </div>

            <div className={`jp-field ${errors.link ? 'jp-field--invalid' : ''}`}>
              <label htmlFor="jp-link">
                Apply link (URL) <span className="jp-required">*</span>
              </label>
              <input
                id="jp-link"
                type="url"
                placeholder="https://..."
                value={form.link}
                onChange={handleChange('link')}
              />
              {errors.link && <p className="jp-field__error">{errors.link}</p>}
            </div>
          </div>

          <button type="submit" className="jp-modal__submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Posting…' : 'Post job'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function JobPulse() {
  const [jobs, setJobs] = useState([])
  const [loadState, setLoadState] = useState('loading') // loading | loaded | error
  const [search, setSearch] = useState('')
  const [expFilter, setExpFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  // useEffect(() => {
  //   let cancelled = false
  //   setLoadState('loading')
  //   // fetchJobs()
  //     .then((data) => {
  //       if (!cancelled) {
  //         setJobs(Array.isArray(data) ? data : [])
  //         setLoadState('loaded')
  //       }
  //     })
  //     .catch(() => {
  //       if (!cancelled) setLoadState('error')
  //     })
  //   return () => {
  //     cancelled = true
  //   }
  // }, [])

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase()
    return jobs.filter((job) => {
      if (expFilter && String(job.EXPERIENCE) !== expFilter) return false
      if (typeFilter && String(job.ITORNONIT || '').toUpperCase() !== typeFilter) return false
      if (term) {
        const haystack = [job.COMPANYNAME, job.TECHNOLOGY, job.SKILLS]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [jobs, search, expFilter, typeFilter])

  function handleCreated(newJob) {
    setJobs((prev) => [newJob, ...prev])
  }

  return (
    <div className="jp">
      <div className="jp__stage" aria-hidden="true">
        <div className="jp__glow jp__glow--teal" />
        <div className="jp__glow jp__glow--amber" />
      </div>

      <div className="jp__inner">
        <div className="jp__header">
          <div>
            <span className="jp__eyebrow">Live openings</span>
            <h1>JobPulse</h1>
            <p>Real roles from real companies — no scraped listings, no dead links.</p>
          </div>
          <button className="jp__create-btn" onClick={() => setShowCreate(true)}>
            + Create job
          </button>
        </div>

        <div className="jp__filters">
          <div className="jp__search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search company, technology, or skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="jp__filter-group">
            <span className="jp__filter-label">Experience</span>
            {EXPERIENCE_FILTERS.map((exp) => (
              <button
                key={exp}
                className={`jp__pill ${expFilter === exp ? 'jp__pill--active' : ''}`}
                onClick={() => setExpFilter(expFilter === exp ? '' : exp)}
              >
                {exp}
              </button>
            ))}
          </div>

          <div className="jp__filter-divider" />

          <div className="jp__filter-group">
            <span className="jp__filter-label">Type</span>
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                className={`jp__pill ${typeFilter === type ? 'jp__pill--active' : ''}`}
                onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
              >
                {type === 'NON IT' ? 'Non-IT' : type}
              </button>
            ))}
          </div>
        </div>

        {loadState === 'loading' && (
          <div className="jp__state">
            <div className="jp__spinner" />
            <h3>Loading openings…</h3>
          </div>
        )}

        {loadState === 'error' && (
          <div className="jp__state">
            <h3>Couldn't load the board</h3>
            <p>JobPulse might be facing downtime. Please try again in a moment.</p>
          </div>
        )}

        {loadState === 'loaded' && filteredJobs.length === 0 && (
          <div className="jp__state">
            <h3>No matching openings</h3>
            <p>Try clearing a filter or searching a different term.</p>
          </div>
        )}

        {loadState === 'loaded' && filteredJobs.length > 0 && (
          <div className="jp__grid">
            {filteredJobs.map((job, i) => (
              <JobCard job={job} index={i} key={job.ID ?? job.LINK ?? i} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateJobModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  )
}
