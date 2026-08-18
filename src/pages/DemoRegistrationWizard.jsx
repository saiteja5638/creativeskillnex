import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { submitDemoRegistration } from '../api/demoRegistration'
import {
  BACKGROUND_GROUPS,
  EXPERIENCE_MIN,
  EXPERIENCE_MAX,
  EXPERIENCE_DEFAULT,
  formatExperience,
  INTERESTED_IN_OPTIONS,
  NAME_PATTERN,
  EMAIL_PATTERN,
  PHONE_PATTERN,
} from '../data/demoRegistrationConfig'
import './DemoRegistrationWizard.css'

const TOTAL_STEPS = 4

const ICONS = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8.5" cy="8" r="2.8" />
      <path d="M2.5 19c0-3 2.7-5 6-5s6 2 6 5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M15.5 14.2c2.4.3 4 1.9 4 4.8" strokeLinecap="round" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-1.8 5-5 1.8 1.8-5 5-1.8Z" strokeLinejoin="round" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
    </svg>
  ),
}

// ---- Week / slot helpers -------------------------------------------------

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const WEEKDAY_SLOTS = ['9:00 AM', '6:00 PM', '9:30 PM']
const WEEKEND_SLOTS = [
  '8:30 AM', '10:00 AM', '12:00 PM', '2:00 PM',
  '4:00 PM', '6:00 PM', '9:00 PM', '11:00 PM',
]

// Returns the 7 Date objects for the current week, Monday through Sunday.
function getCurrentWeekDates() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayIndex = today.getDay() // 0 = Sun ... 6 = Sat
  const mondayOffset = (dayIndex + 6) % 7 // days since Monday
  const monday = new Date(today)
  monday.setDate(today.getDate() - mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isPastDay(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// "9:00 AM" / "12:00 PM" -> minutes since midnight, for comparison/filtering.
function slotToMinutes(slot) {
  const [time, period] = slot.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

// Weekday -> 3 slots, Sat/Sun -> full slot list. If the date is today,
// any slot whose time has already passed is filtered out.
function getSlotsForDate(date) {
  const dayIndex = date.getDay()
  const isWeekend = dayIndex === 0 || dayIndex === 6
  const baseSlots = isWeekend ? WEEKEND_SLOTS : WEEKDAY_SLOTS

  const now = new Date()
  if (!isSameDay(date, now)) return baseSlots

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return baseSlots.filter((slot) => slotToMinutes(slot) > nowMinutes)
}

function formatDateLabel(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

// ---------------------------------------------------------------------------

const initialForm = {
  name: '',
  contactNo: '',
  email: '',
  background: '',
  experience: EXPERIENCE_DEFAULT,
  interestedIn: '',
  selectedDate: null, // Date object
  selectedSlot: '',
}

function DemoRegistrationWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const weekDates = getCurrentWeekDates()

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const pickDate = (date) => {
    if (isPastDay(date)) return
    setForm((f) => ({ ...f, selectedDate: date, selectedSlot: '' }))
    setErrors((e) => ({ ...e, selectedDate: undefined, selectedSlot: undefined }))
  }

  const pickSlot = (slot) => {
    setField('selectedSlot', slot)
    setErrors((e) => ({ ...e, selectedSlot: undefined }))
  }

  const validateStep = (targetStep) => {
    const next = {}

    if (targetStep === 1) {
      const name = form.name.trim()
      if (!name) {
        next.name = 'Name is required'
      } else if (!NAME_PATTERN.test(name)) {
        next.name = 'Use letters only (no numbers or symbols)'
      }

      if (form.contactNo.trim() && !PHONE_PATTERN.test(form.contactNo.trim())) {
        next.contactNo = 'Enter a valid phone number'
      }

      const email = form.email.trim()
      if (!email) {
        next.email = 'Email is required'
      } else if (!EMAIL_PATTERN.test(email)) {
        next.email = 'Enter a valid email address'
      }
    }

    if (targetStep === 2 && !form.background) {
      next.background = 'Please select your educational background'
    }

    if (targetStep === 3 && !form.interestedIn) {
      next.interestedIn = 'Pick what you\u2019re interested in learning'
    }

    if (targetStep === 4) {
      if (!form.selectedDate) {
        next.selectedDate = 'Please pick a date'
      }
      if (!form.selectedSlot) {
        next.selectedSlot = 'Please pick a time slot'
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const goBack = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(TOTAL_STEPS)) return

    setSubmitting(true)
    setSubmitError('')

    const preferredTimings = `${formatDateLabel(form.selectedDate)} \u2014 ${form.selectedSlot}`

    try {
      await submitDemoRegistration({
        name: form.name.trim(),
        contactNo: form.contactNo.trim(),
        email: form.email.trim(),
        background: form.background,
        experience: formatExperience(form.experience),
        interestedIn: form.interestedIn,
        preferredTimings,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        'Something went wrong submitting your registration. Please try again in a moment.'
      )
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const restart = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitError('')
    setSubmitted(false)
    setStep(1)
  }

  const STEP_TITLES = {
    1: 'Your details',
    2: 'Your educational background',
    3: 'What are you interested in',
    4: 'Pick your demo slot',
  }

  const availableSlots = form.selectedDate ? getSlotsForDate(form.selectedDate) : []

  if (submitted) {
    return (
      <section className="demo-wizard">
        <div className="container demo-wizard__container">
          <Reveal className="demo-success glass-card" as="div">
            <div className="demo-success__art" aria-hidden="true">
              <SuccessIllustration />
            </div>
            <span className="eyebrow demo-success__eyebrow">All set, {form.name.split(' ')[0]}!</span>
            <h1>Registration successful \uD83C\uDF89</h1>
            <p>
              Thanks so much for your interest \u2014 we&rsquo;re excited to have you
              join us for a demo session! Any updates about your session,
              timings, or joining details will be communicated to you through
              your registered email address{' '}
              <strong>{form.email}</strong>.
            </p>
            <p className="demo-success__note">
              Keep an eye on your inbox (and spam folder, just in case) over
              the next 24 hours.
            </p>
            <div className="demo-success__actions">
              <button className="btn btn-primary" onClick={restart}>
                Register another person
              </button>
              <Link to="/" className="btn btn-ghost">
                Back to home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section className="demo-wizard">
      <div className="container demo-wizard__container">
        <Reveal className="demo-wizard__head">
          <span className="eyebrow">Book a Free Demo</span>
          <h1>Register for your demo session</h1>
          <p>
            Tell us a bit about yourself and we&rsquo;ll set up a demo class
            that fits your background, interests, and schedule.
          </p>
        </Reveal>

        <Reveal className="demo-wizard__card glass-card" as="div">
          <div className="demo-wizard__step-badge">
            <span className="demo-wizard__pill">
              Step {step} of {TOTAL_STEPS}
            </span>
            <h2>{STEP_TITLES[step]}</h2>
          </div>

          {step === 1 && (
            <div className="details-step">
              <div className="field">
                <label htmlFor="dw-name">
                  Full name <span className="required">*</span>
                </label>
                <input
                  id="dw-name"
                  type="text"
                  placeholder="e.g. Spark Sai teja"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="field__error">{errors.name}</p>}
              </div>

              <div className="field">
                <label htmlFor="dw-contact">Contact number (optional)</label>
                <input
                  id="dw-contact"
                  type="tel"
                  placeholder="e.g. 8596******"
                  value={form.contactNo}
                  onChange={(e) => setField('contactNo', e.target.value)}
                  aria-invalid={!!errors.contactNo}
                />
                {errors.contactNo && (
                  <p className="field__error">{errors.contactNo}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="dw-email">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="dw-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="field__error">{errors.email}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="field">
              <label htmlFor="dw-background">
                Educational background <span className="required">*</span>
              </label>
              <select
                id="dw-background"
                value={form.background}
                onChange={(e) => setField('background', e.target.value)}
                aria-invalid={!!errors.background}
              >
                <option value="" disabled>
                  Select your stream
                </option>
                {BACKGROUND_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.background && (
                <p className="field__error">{errors.background}</p>
              )}

              <div className="trait-row" style={{ marginTop: '1.6rem' }}>
                <div className="trait-row__head">
                  <span>Work experience</span>
                  <span className="trait-row__value">
                    {formatExperience(form.experience)}
                  </span>
                </div>
                <input
                  type="range"
                  min={EXPERIENCE_MIN}
                  max={EXPERIENCE_MAX}
                  step={1}
                  value={form.experience}
                  onChange={(e) => setField('experience', Number(e.target.value))}
                />
                <div className="trait-row__scale">
                  <span>Fresher</span>
                  <span>{EXPERIENCE_MAX}+ years</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="option-grid option-grid--3">
                {INTERESTED_IN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-card ${form.interestedIn === opt.value ? 'is-selected' : ''}`}
                    onClick={() => setField('interestedIn', opt.value)}
                  >
                    <span className="option-card__icon">{ICONS[opt.icon]}</span>
                    {opt.label}
                    <span className="option-card__hint">{opt.hint}</span>
                  </button>
                ))}
              </div>
              {errors.interestedIn && (
                <p className="field__error">{errors.interestedIn}</p>
              )}
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="slot-step">
                <div className="field">
                  <label>
                    Select a date <span className="required">*</span>
                  </label>
                  <div className="date-strip">
                    {weekDates.map((date) => {
                      const selected =
                        form.selectedDate && isSameDay(date, form.selectedDate)
                      const disabled = isPastDay(date)
                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          className={`date-chip ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
                          disabled={disabled}
                          onClick={() => pickDate(date)}
                        >
                          <span className="date-chip__day">
                            {WEEKDAY_LABELS[(date.getDay() + 6) % 7]}
                          </span>
                          <span className="date-chip__num">{date.getDate()}</span>
                          <span className="date-chip__month">
                            {MONTH_LABELS[date.getMonth()]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.selectedDate && (
                    <p className="field__error">{errors.selectedDate}</p>
                  )}
                </div>

                <div className="field">
                  <label>
                    Select a time slot <span className="required">*</span>
                  </label>

                  {!form.selectedDate && (
                    <p className="slot-step__hint">Pick a date to see available slots.</p>
                  )}

                  {form.selectedDate && availableSlots.length === 0 && (
                    <p className="slot-step__hint">
                      No more slots left for this date \u2014 please pick another day.
                    </p>
                  )}

                  {form.selectedDate && availableSlots.length > 0 && (
                    <div className="chip-row">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`chip ${form.selectedSlot === slot ? 'is-selected' : ''}`}
                          onClick={() => pickSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.selectedSlot && (
                    <p className="field__error">{errors.selectedSlot}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary demo-wizard__submit"
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Book Slot'}
              </button>

              {submitError && (
                <p className="field__error field__error--center">{submitError}</p>
              )}
            </form>
          )}

          <div className="demo-wizard__nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={goBack}
              disabled={step === 1}
            >
              Back
            </button>
            {step < TOTAL_STEPS && (
              <button type="button" className="btn btn-primary" onClick={goNext}>
                Next
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// A small, friendly, hand-drawn-style success illustration — a party popper
// and confetti, built as plain SVG so no external image assets are needed.
function SuccessIllustration() {
  return (
    <svg viewBox="0 0 200 160" width="180" height="144">
      <g>
        <circle cx="100" cy="80" r="66" fill="rgba(124, 92, 255, 0.12)" />
        <circle cx="34" cy="34" r="5" fill="#22d3ee" />
        <circle cx="168" cy="40" r="4" fill="#ffb454" />
        <circle cx="150" cy="122" r="5" fill="#7c5cff" />
        <circle cx="26" cy="118" r="4" fill="#ffb454" />
        <rect x="150" y="20" width="8" height="8" rx="2" fill="#7c5cff" transform="rotate(20 154 24)" />
        <rect x="20" y="90" width="7" height="7" rx="2" fill="#22d3ee" transform="rotate(-15 23 93)" />
        <path
          d="M60 120 L84 70 L120 92 Z"
          fill="url(#popperGrad)"
        />
        <path
          d="M84 70 L92 52 M96 78 L112 64 M100 92 L120 88"
          stroke="#ffd39a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="130" cy="56" r="3.5" fill="#22d3ee" />
        <circle cx="140" cy="76" r="3" fill="#ffb454" />
        <circle cx="118" cy="50" r="3" fill="#7c5cff" />
        <circle cx="108" cy="100" r="3" fill="#22d3ee" />
        <path
          d="M60 120 q-8 10 -18 8"
          stroke="#7c5cff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="140" cy="108" r="10" fill="none" stroke="#22d3ee" strokeWidth="3" />
        <path d="M137 108 l2 3 l5 -6" stroke="#22d3ee" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <linearGradient id="popperGrad" x1="60" y1="120" x2="120" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default DemoRegistrationWizard