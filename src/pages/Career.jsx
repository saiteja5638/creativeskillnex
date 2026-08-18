import { useState } from 'react'
import './Career.css'


const EXPERIENCE_OPTIONS = [
  'Fresher',
  '0 - 1 years',
  '1 - 3 years',
  '3 - 5 years',
  '5+ years',
]

const REQUIRED_FIELDS = [
  'name',
  'email',
  'location',
  'degree',
  'technology',
  'experience',
]

const EMPTY_FORM = {
  name: '',
  email: '',
  contactNumber: '',
  location: '',
  degree: '',
  technology: '',
  experience: '',
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function Career() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  function validate() {
    const nextErrors = {}
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field] || !form[field].trim()) {
        nextErrors[field] = 'This field is required.'
      }
    })
    if (form.email && !isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    try {
      await submitCareerApplication(form)
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch (err) {
      setStatus('error')
    }
  }

  function closeResult() {
    setStatus('idle')
  }

  return (
    <div className="csn-career">
      <div className="csn-career__stage" aria-hidden="true">
        <div className="csn-career__glow csn-career__glow--teal" />
        <div className="csn-career__glow csn-career__glow--amber" />
        <div className="csn-career__grid" />
        <div className="csn-career__scanlines" />
      </div>

      <div className="csn-career__wrap">
        <div className="csn-career__header">
          <span className="csn-career__eyebrow">Careers</span>
          <h1>Build the platform students actually needed</h1>
          <p>
            Tell us about yourself — every application is reviewed by our
            team, not a filter.
          </p>
        </div>

        <div className="csn-career__card">
          <div className="csn-career__panel">
            <form onSubmit={handleSubmit} noValidate>
              <div className="csn-field">
                <label htmlFor="csn-name">
                  Name <span className="csn-required">*</span>
                </label>
                <input
                  id="csn-name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>

              <div className="csn-grid-2">
                <div className={`csn-field ${errors.email ? 'csn-field--invalid' : ''}`}>
                  <label htmlFor="csn-email">
                    Email <span className="csn-required">*</span>
                  </label>
                  <input
                    id="csn-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                  {errors.email && <p className="csn-field__error">{errors.email}</p>}
                </div>

                <div className="csn-field">
                  <label htmlFor="csn-contact">
                    Contact number <span className="csn-optional">Optional</span>
                  </label>
                  <input
                    id="csn-contact"
                    type="tel"
                    placeholder="+91 98765 *****"
                    value={form.contactNumber}
                    onChange={handleChange('contactNumber')}
                  />
                </div>
              </div>

              <div className={`csn-field ${errors.location ? 'csn-field--invalid' : ''}`}>
                <label htmlFor="csn-location">
                  Location <span className="csn-required">*</span>
                </label>
                <input
                  id="csn-location"
                  type="text"
                  placeholder="City, State"
                  value={form.location}
                  onChange={handleChange('location')}
                />
                {errors.location && <p className="csn-field__error">{errors.location}</p>}
              </div>

              <div className="csn-grid-2">
                <div className={`csn-field ${errors.degree ? 'csn-field--invalid' : ''}`}>
                  <label htmlFor="csn-degree">
                    Degree <span className="csn-required">*</span>
                  </label>
                  <input
                    id="csn-degree"
                    type="text"
                    placeholder="e.g. B.Tech CSE"
                    value={form.degree}
                    onChange={handleChange('degree')}
                  />
                  {errors.degree && <p className="csn-field__error">{errors.degree}</p>}
                </div>

                <div className={`csn-field ${errors.experience ? 'csn-field--invalid' : ''}`}>
                  <label htmlFor="csn-experience">
                    Experience <span className="csn-required">*</span>
                  </label>
                  <select
                    id="csn-experience"
                    value={form.experience}
                    onChange={handleChange('experience')}
                  >
                    <option value="">Select</option>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.experience && (
                    <p className="csn-field__error">{errors.experience}</p>
                  )}
                </div>
              </div>

              <div className={`csn-field ${errors.technology ? 'csn-field--invalid' : ''}`}>
                <label htmlFor="csn-technology">
                  Working technology <span className="csn-required">*</span>
                </label>
                <input
                  id="csn-technology"
                  type="text"
                  placeholder="e.g. React, Node.js, SAP CAPM"
                  value={form.technology}
                  onChange={handleChange('technology')}
                />
                {errors.technology && (
                  <p className="csn-field__error">{errors.technology}</p>
                )}
              </div>

              <button
                type="submit"
                className="csn-submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' && <span className="csn-submit__spinner" />}
                {status === 'submitting' ? 'Sending application…' : 'Submit application'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {status === 'success' && (
        <div className="csn-result" role="dialog" aria-modal="true">
          <div className="csn-result__panel csn-result--success">
            <div className="csn-result__icon">
              <svg viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Application sent</h3>
            <p>
              Your application has been sent to the CreativeSkillNexus team.
              After verifying your profile, they will call you back soon.
            </p>
            <button className="csn-result__close" onClick={closeResult}>
              Done
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="csn-result" role="dialog" aria-modal="true">
          <div className="csn-result__panel csn-result--error">
            <div className="csn-result__icon">
              <svg viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" />
                <path d="M18 18l16 16M34 18L18 34" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Couldn't send your application</h3>
            <p>
              CreativeSkillNexus might be facing downtime. Please try again
              after some time. Sorry for the inconvenience caused.
            </p>
            <button className="csn-result__close" onClick={closeResult}>
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
