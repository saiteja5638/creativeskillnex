import { useState } from 'react'
import Reveal from './Reveal'
import { submitUserConcern } from '../api/userConcerns'
import './ContactSection.css'

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'hello@creativeskillnexus.com',
    href: 'mailto:hello@creativeskillnexus.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: '/company/creativeskillnexus',
    href: 'https://linkedin.com/company/creativeskillnexus',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8.5" r="0.5" fill="currentColor" />
        <path d="M7.5 11v6M7.5 11v6M12 17v-3.5c0-1.5 1-2.5 2.3-2.5s2.2 1 2.2 2.5V17M12 11v6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@creativeskillnexus',
    href: 'https://instagram.com/creativeskillnexus',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    value: '/creativeskillnexus',
    href: 'https://facebook.com/creativeskillnexus',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M15 8.5h-2c-.8 0-1.5.7-1.5 1.5v2h3.3l-.4 3H11.5V21H8.5v-6H6.5v-3h2V9.7c0-2.3 1.5-4.2 4-4.2h2.5v3Z" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const initialForm = { name: '', contact: '', email: '', concern: '' }

function ContactSection() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }
    if (!form.concern.trim()) next.concern = 'Please tell us your concern'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      await submitUserConcern(form)
      setSubmitted(true)
      setForm(initialForm)
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      setSubmitError(
        'Something went wrong sending your message. Please try again in a moment.'
      )
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <Reveal className="contact__head">
          <span className="eyebrow">Section 03 &middot; Reach Us</span>
          <h2 className="contact__title">Let&rsquo;s talk about your next step</h2>
          <p className="contact__subtitle">
            Reach out directly, or drop your details and we&rsquo;ll get back
            to you with the right course path.
          </p>
        </Reveal>

        <div className="contact__grid">
          <Reveal delay="0.05s" className="contact__panel glass-card contact__panel--info">
            <h3>Contact us</h3>
            <p className="contact__lead">
              Prefer to reach out yourself? We&rsquo;re active here:
            </p>
            <ul className="contact__list">
              {CONTACT_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="contact__link"
                  >
                    <span className="contact__icon">{item.icon}</span>
                    <span>
                      <span className="contact__link-label">{item.label}</span>
                      <span className="contact__link-value">{item.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay="0.12s" className="contact__panel glass-card contact__panel--form">
            <h3>Tell us what you need</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="field__error">{errors.name}</p>}
              </div>

              <div className="field">
                <label htmlFor="contact">Contact number</label>
                <input
                  id="contact"
                  type="tel"
                  placeholder="Optional"
                  value={form.contact}
                  onChange={update('contact')}
                />
              </div>

              <div className="field">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="field__error">{errors.email}</p>}
              </div>

              <div className="field">
                <label htmlFor="concern">
                  Concern <span className="required">*</span>
                </label>
                <textarea
                  id="concern"
                  rows={4}
                  placeholder="What would you like help with?"
                  value={form.concern}
                  onChange={update('concern')}
                  aria-invalid={!!errors.concern}
                />
                {errors.concern && <p className="field__error">{errors.concern}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary contact__submit"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send message'}
              </button>

              {submitError && (
                <p className="contact__error">{submitError}</p>
              )}

              {submitted && (
                <p className="contact__success">
                  Thanks! We&rsquo;ve received your details and will be in touch.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
