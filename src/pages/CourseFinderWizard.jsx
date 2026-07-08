import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { findRightCourse } from '../api/courseFinderConfig'
import {
  BACKGROUND_OPTIONS,
  INTEREST_AREA_OPTIONS,
  TRAITS_BY_INTEREST_AREA,
  TRAIT_SCORE_MIN,
  TRAIT_SCORE_MAX,
  TRAIT_SCORE_DEFAULT,
  WEEKLY_HOURS_MIN,
  WEEKLY_HOURS_MAX,
  WEEKLY_HOURS_DEFAULT,
  TOP_N_MIN,
  TOP_N_MAX,
  TOP_N_DEFAULT,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_PATTERN,
  EMAIL_PATTERN,
  PHONE_PATTERN,
} from '../data/courseFinderConfig'
import './CourseFinderWizard.css'

const TOTAL_STEPS = 5

const ICONS = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m2 9 10-5 10 5-10 5-10-5Z" strokeLinejoin="round" />
      <path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" strokeLinecap="round" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m5 18 5-5 4 4 3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
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
  bars: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h1.5A3.5 3.5 0 0 0 20 10.7C20 6.5 16.4 3 12 3Z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

const initialForm = {
  background: '',
  interestArea: '',
  traitScores: {},
  weeklyHoursAvailable: WEEKLY_HOURS_DEFAULT,
  topN: TOP_N_DEFAULT,
  name: '',
  contact: '',
}

function CourseFinderWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [results, setResults] = useState(null)

  const traits = useMemo(
    () => TRAITS_BY_INTEREST_AREA[form.interestArea] || [],
    [form.interestArea]
  )

  const setField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }))

  const setTrait = (traitCode, value) =>
    setForm((f) => ({
      ...f,
      traitScores: { ...f.traitScores, [traitCode]: value },
    }))

  // --- Per-step validation -------------------------------------------------

  const validateStep = (targetStep) => {
    const next = {}

    if (targetStep === 1 && !form.background) {
      next.background = 'Pick the option closest to your background'
    }

    if (targetStep === 2 && !form.interestArea) {
      next.interestArea = 'Pick one area you\u2019re drawn to'
    }

    if (targetStep === 3) {
      traits.forEach(({ trait }) => {
        const score = form.traitScores[trait]
        if (
          score === undefined ||
          score < TRAIT_SCORE_MIN ||
          score > TRAIT_SCORE_MAX
        ) {
          next.traits = `Every trait must be rated ${TRAIT_SCORE_MIN}-${TRAIT_SCORE_MAX}`
        }
      })
    }

    if (targetStep === 4) {
      const hours = Number(form.weeklyHoursAvailable)
      if (
        Number.isNaN(hours) ||
        hours < WEEKLY_HOURS_MIN ||
        hours > WEEKLY_HOURS_MAX
      ) {
        next.weeklyHoursAvailable = `Enter between ${WEEKLY_HOURS_MIN} and ${WEEKLY_HOURS_MAX} hours`
      }
      const topN = Number(form.topN)
      if (Number.isNaN(topN) || topN < TOP_N_MIN || topN > TOP_N_MAX) {
        next.topN = `Choose between ${TOP_N_MIN} and ${TOP_N_MAX} recommendations`
      }
    }

    if (targetStep === 5) {
      const name = form.name.trim()
      if (!name) {
        next.name = 'Name is required'
      } else if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
        next.name = `Name must be ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters`
      } else if (!NAME_PATTERN.test(name)) {
        next.name = 'Use letters only (no numbers or symbols)'
      }

      const contact = form.contact.trim()
      if (contact && !EMAIL_PATTERN.test(contact) && !PHONE_PATTERN.test(contact)) {
        next.contact = 'Enter a valid email or phone number'
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
    if (!validateStep(5)) return

    setSubmitting(true)
    setSubmitError('')
    setResults(null)

    try {
      const traitScores = traits.map(({ trait }) => ({
        trait,
        score: form.traitScores[trait] ?? TRAIT_SCORE_DEFAULT,
      }))

      const data = await findRightCourse({
        name: form.name.trim(),
        background: form.background,
        interestArea: form.interestArea,
        weeklyHoursAvailable: Number(form.weeklyHoursAvailable),
        traitScores,
        topN: Number(form.topN),
      })

      setResults(data)
    } catch (err) {
      setSubmitError(
        'Something went wrong getting your recommendations. Please try again in a moment.'
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
    setResults(null)
    setSubmitError('')
    setStep(1)
  }

  const STEP_TITLES = {
    1: 'Your background',
    2: 'What are you drawn to',
    3: 'Quick trait check (1-2 min)',
    4: 'Time you can commit',
    5: 'Get your recommendations',
  }

  return (
    <section className="finder-wizard">
      <div className="container finder-wizard__container">
        <Reveal className="finder-wizard__head">
          <span className="eyebrow">AI Course Finder</span>
          <h1>Find the course that actually fits you</h1>
          <p>
            Answer a few quick questions and we&rsquo;ll match you to the
            courses most likely to work for your background and goals.
          </p>
        </Reveal>

        {results ? (
          <Reveal className="finder-wizard__results glass-card" as="div">
            <h2>Your recommended courses</h2>
            <RecommendationList data={results} />
            <button className="btn btn-ghost" onClick={restart}>
              Start over
            </button>
          </Reveal>
        ) : (
          <Reveal className="finder-wizard__card glass-card" as="div">
            <div className="finder-wizard__step-badge">
              <span className="finder-wizard__pill">
                Step {step} of {TOTAL_STEPS}
              </span>
              <h2>{STEP_TITLES[step]}</h2>
            </div>

            {step === 1 && (
              <div className="option-grid option-grid--3">
                {BACKGROUND_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-card ${form.background === opt.value ? 'is-selected' : ''}`}
                    onClick={() => setField('background', opt.value)}
                  >
                    <span className="option-card__icon">{ICONS[opt.icon]}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {step === 1 && errors.background && (
              <p className="field__error">{errors.background}</p>
            )}

            {step === 2 && (
              <div className="option-grid option-grid--5">
                {INTEREST_AREA_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-card ${form.interestArea === opt.value ? 'is-selected' : ''}`}
                    onClick={() => setField('interestArea', opt.value)}
                  >
                    <span className="option-card__icon">{ICONS[opt.icon]}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {step === 2 && errors.interestArea && (
              <p className="field__error">{errors.interestArea}</p>
            )}

            {step === 3 && (
              <div className="trait-list">
                {traits.length === 0 && (
                  <p className="finder-wizard__hint">
                    Go back and pick an interest area first.
                  </p>
                )}
                {traits.map(({ trait, label }) => (
                  <div className="trait-row" key={trait}>
                    <div className="trait-row__head">
                      <span>{label}</span>
                      <span className="trait-row__value">
                        {form.traitScores[trait] ?? TRAIT_SCORE_DEFAULT}/
                        {TRAIT_SCORE_MAX}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={TRAIT_SCORE_MIN}
                      max={TRAIT_SCORE_MAX}
                      step={1}
                      value={form.traitScores[trait] ?? TRAIT_SCORE_DEFAULT}
                      onChange={(e) => setTrait(trait, Number(e.target.value))}
                    />
                  </div>
                ))}
                {errors.traits && <p className="field__error">{errors.traits}</p>}
              </div>
            )}

            {step === 4 && (
              <div className="commit-step">
                <div className="trait-row">
                  <div className="trait-row__head">
                    <span>Hours available per week</span>
                    <span className="trait-row__value">
                      {form.weeklyHoursAvailable} hrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={WEEKLY_HOURS_MIN}
                    max={WEEKLY_HOURS_MAX}
                    step={1}
                    value={form.weeklyHoursAvailable}
                    onChange={(e) =>
                      setField('weeklyHoursAvailable', Number(e.target.value))
                    }
                  />
                  {errors.weeklyHoursAvailable && (
                    <p className="field__error">{errors.weeklyHoursAvailable}</p>
                  )}
                </div>

                <div className="trait-row">
                  <div className="trait-row__head">
                    <span>Number of course matches to show</span>
                    <span className="trait-row__value">{form.topN}</span>
                  </div>
                  <input
                    type="range"
                    min={TOP_N_MIN}
                    max={TOP_N_MAX}
                    step={1}
                    value={form.topN}
                    onChange={(e) => setField('topN', Number(e.target.value))}
                  />
                  {errors.topN && <p className="field__error">{errors.topN}</p>}
                </div>
              </div>
            )}

            {step === 5 && (
              <form onSubmit={handleSubmit} noValidate className="details-step">
                <div className="field">
                  <label htmlFor="wizard-name">
                    Your name <span className="required">*</span>
                  </label>
                  <input
                    id="wizard-name"
                    type="text"
                    placeholder="e.g. Ananya"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    maxLength={NAME_MAX_LENGTH}
                  />
                  {errors.name && <p className="field__error">{errors.name}</p>}
                </div>

                <div className="field">
                  <label htmlFor="wizard-contact">Email or phone (optional)</label>
                  <input
                    id="wizard-contact"
                    type="text"
                    placeholder="you@example.com"
                    value={form.contact}
                    onChange={(e) => setField('contact', e.target.value)}
                    aria-invalid={!!errors.contact}
                  />
                  {errors.contact && (
                    <p className="field__error">{errors.contact}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary finder-wizard__submit"
                  disabled={submitting}
                >
                  {submitting ? 'Finding your courses...' : 'See my recommended courses \u2192'}
                </button>

                {submitError && <p className="field__error field__error--center">{submitError}</p>}
              </form>
            )}

            <div className="finder-wizard__nav">
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
        )}

        <p className="finder-wizard__footnote">
          Want to browse everything yourself instead?{' '}
          <Link to="/courses">See all courses</Link>
        </p>
      </div>
    </section>
  )
}

// Renders the findRightCourse response:
// { value: [{ courseId, courseName, matchScore, reasons, suggestedExperienceLevel,
//              suggestedPace, pricing: [{ pace, months, price }] }] }
function RecommendationList({ data }) {
  const list = Array.isArray(data)
    ? data
    : data?.value || data?.recommendations || data?.courses || null

  if (!Array.isArray(list) || list.length === 0) {
    return (
      <pre className="finder-wizard__raw">{JSON.stringify(data, null, 2)}</pre>
    )
  }

  return (
    <ul className="recommendation-list">
      {list.map((item, i) => {
        const name =
          item.courseName || item.NAME || item.name || `Recommendation ${i + 1}`
        const score = item.matchScore ?? item.score ?? item.SCORE
        const reasons = item.reasons || []
        const experienceLevel = item.suggestedExperienceLevel
        const suggestedPace = item.suggestedPace
        const pricing = item.pricing || []

        return (
          <li key={item.courseId || item.id || name + i} className="recommendation-card">
            <div className="recommendation-card__head">
              <h3>{name}</h3>
              {score !== undefined && (
                <span className="recommendation-card__score">
                  {Math.round(Number(score))}% match
                </span>
              )}
            </div>

            {(experienceLevel || suggestedPace) && (
              <div className="recommendation-card__badges">
                {experienceLevel && (
                  <span className="badge badge--fresher">{experienceLevel}</span>
                )}
                {suggestedPace && (
                  <span className="badge badge--type">
                    Suggested pace: {suggestedPace}
                  </span>
                )}
              </div>
            )}

            {reasons.length > 0 && (
              <ul className="recommendation-card__reasons">
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}

            {pricing.length > 0 && (
              <div className="recommendation-card__pricing">
                {pricing.map((plan) => (
                  <div className="recommendation-card__plan" key={plan.pace}>
                    <span className="recommendation-card__plan-pace">{plan.pace}</span>
                    <span className="recommendation-card__plan-months">
                      {plan.months} month{Number(plan.months) === 1 ? '' : 's'}
                    </span>
                    <span className="recommendation-card__plan-price">
                      &#8377;{Number(plan.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={`/courses/${encodeURIComponent(name)}`}
              className="recommendation-card__link"
            >
              View course &rarr;
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default CourseFinderWizard
