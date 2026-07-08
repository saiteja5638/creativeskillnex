import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { fetchCourseHierarchyByName } from '../api/courses'
import './CourseDetails.css'

// Picks a fallback emoji when a pricing plan has no IMG field yet.
function planFallbackIcon(description = '') {
  const d = description.toLowerCase()
  if (d.includes('rabbit')) return '\u{1F407}'
  if (d.includes('tort')) return '\u{1F422}'
  return '\u{1F4E6}'
}

function CourseDetails() {
  const { courseName } = useParams()
  const decodedName = decodeURIComponent(courseName)

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    fetchCourseHierarchyByName(decodedName)
      .then((data) => {
        if (!cancelled) setCourse(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError('Could not load this course right now. Please try again shortly.')
        }
        // eslint-disable-next-line no-console
        console.error(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedName])

  if (loading) {
    return (
      <section className="course-details">
        <div className="container">
          <p className="course-details__status">Loading course...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="course-details">
        <div className="container">
          <p className="course-details__status course-details__status--error">{error}</p>
        </div>
      </section>
    )
  }

  if (!course) {
    return (
      <section className="course-details">
        <div className="container">
          <p className="course-details__status">
            We couldn&rsquo;t find &ldquo;{decodedName}&rdquo;.{' '}
            <Link to="/courses">Back to all courses</Link>
          </p>
        </div>
      </section>
    )
  }

  const steps = [...(course.courseHierarchy || [])].sort(
    (a, b) => a.LEVEL - b.LEVEL
  )
  const plans = course.coursePrice || []

  return (
    <section className="course-details">
      <div className="container">
        <Reveal className="course-details__head">
          <span className="eyebrow">Course</span>
          <h1>{course.NAME}</h1>
          <p>{course.DESCRIPTION}</p>
        </Reveal>

        {steps.length > 0 && (
          <Reveal delay="0.08s" className="course-details__section" as="div">
            <h2>Learning path</h2>
            <div className="stepper">
              {steps.map((step, i) => (
                <div className="stepper__item" key={step.ID}>
                  <div className="stepper__node glass-card">
                    <span className="stepper__level">{step.LEVEL}</span>
                    <span className="stepper__language">{step.LANGUAGE}</span>
                    <span className="stepper__duration">
                      {step.DURATION} {step.DURATION === 1 ? 'week' : 'weeks'}
                    </span>
                  </div>
                  {i < steps.length - 1 && <span className="stepper__arrow">&#8594;</span>}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {plans.length > 0 && (
          <Reveal delay="0.16s" className="course-details__section" as="div">
            <h2>Choose your pace</h2>
            <div className="plans-grid">
              {plans.map((plan) => (
                <div className="plan-card glass-card" key={plan.ID}>
                  <div className="plan-card__icon">
                    {plan.IMG ? (
                      <img src={plan.IMG} alt={plan.DESCRIPTION} />
                    ) : (
                      <span className="plan-card__emoji">
                        {planFallbackIcon(plan.DESCRIPTION)}
                      </span>
                    )}
                  </div>
                  <h3>{plan.DESCRIPTION}</h3>
                  <p className="plan-card__months">{plan.MONTHS} month{plan.MONTHS === 1 ? '' : 's'} plan</p>
                  <p className="plan-card__price">
                    &#8377;{plan.PRICE.toLocaleString('en-IN')}
                  </p>
                  <Link
                    to="/signup"
                    className="btn btn-primary plan-card__cta"
                  >
                    Get started
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export default CourseDetails