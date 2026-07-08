import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { createSignupUser } from '../api/signup'
import './AuthPages.css'

const initialForm = {
  fullName: '',
  email: '',
  contact: '',
  password: '',
  confirmPassword: '',
}

function SignUp() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }

    if (!form.contact.trim()) {
      next.contact = 'Contact number is required'
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.contact.trim())) {
      next.contact = 'Enter a valid contact number'
    }

    if (!form.password) {
      next.password = 'Password is required'
    } else if (form.password.length < 8) {
      next.password = 'Use at least 8 characters'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Please re-enter your password'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      await createSignupUser(form)
      setSubmitted(true)
      setForm(initialForm)
    } catch (err) {
      setSubmitError(
        'Something went wrong creating your account. Please try again in a moment.'
      )
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="container auth-page__container">
        <Reveal className="auth-card glass-card">
          <div className="auth-card__head">
            <span className="eyebrow">Join CreativeSkillNexus</span>
            <h1>Create your account</h1>
            <p>Start your AI-matched path to the right course, in minutes.</p>
          </div>

          {submitted ? (
            <div className="auth-success">
              <p>
                You&rsquo;re all set! Your account request has been received.
              </p>
              <NavLink to="/signin" className="btn btn-primary">
                Go to Sign in
              </NavLink>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={update('fullName')}
                  aria-invalid={!!errors.fullName}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="field__error">{errors.fullName}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="email">
                  Email Id <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                />
                {errors.email && <p className="field__error">{errors.email}</p>}
              </div>

              <div className="field">
                <label htmlFor="contact">
                  Contact Number <span className="required">*</span>
                </label>
                <input
                  id="contact"
                  type="tel"
                  placeholder="e.g. 7036305638"
                  value={form.contact}
                  onChange={update('contact')}
                  aria-invalid={!!errors.contact}
                  autoComplete="tel"
                />
                {errors.contact && (
                  <p className="field__error">{errors.contact}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={update('password')}
                    aria-invalid={!!errors.password}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <p className="field__error">{errors.password}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">
                  Re-enter Password <span className="required">*</span>
                </label>
                <div className="password-input">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="field__error">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={submitting}
              >
                {submitting ? 'Creating account...' : 'Sign up'}
              </button>

              {submitError && <p className="auth-error">{submitError}</p>}

              <p className="auth-switch">
                Already have an account? <NavLink to="/signin">Sign in</NavLink>
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default SignUp
