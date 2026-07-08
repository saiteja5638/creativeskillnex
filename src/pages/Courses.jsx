import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { fetchCourses } from '../api/courses'
import './Courses.css'

// Experience values coming from the API are "Fresher" / "Experience".
// We label the second one "Upskill" in the UI since that's the audience it's for.
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Fresher', label: 'Fresher' },
  { key: 'Experience', label: 'Upskill' },
]

function Courses() {
  const [courses, setCourses] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    fetchCourses()
      .then((data) => {
        if (!cancelled) setCourses(data)
      })
      .catch((err) => {
        if (!cancelled) setError('Could not load courses right now. Please try again shortly.')
        // eslint-disable-next-line no-console
        console.error(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return courses
    return courses.filter((c) => c.EXPERIENCE === activeFilter)
  }, [courses, activeFilter])

  const goToCourse = (course) => {
    navigate(`/courses/${encodeURIComponent(course.NAME)}`)
  }

  return (
    <section className="courses-page">
      <div className="container">
        <Reveal className="courses-page__head">
          <span className="eyebrow">Explore</span>
          <h1>Courses</h1>
          <p>
            Browse every track we offer and filter by where you&rsquo;re
            starting from.
          </p>
        </Reveal>

        <Reveal delay="0.08s" className="courses-page__filters" as="div">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`courses-page__filter ${activeFilter === f.key ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        {loading && <p className="courses-page__status">Loading courses...</p>}
        {error && <p className="courses-page__status courses-page__status--error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="courses-page__status">No courses match this filter yet.</p>
        )}

        <div className="courses-grid">
          {filtered.map((course, i) => (
            <Reveal
              key={course.id}
              delay={`${Math.min(i * 0.05, 0.3)}s`}
              className="course-card glass-card"
              as="div"
            >
              <div
                className="course-card__inner"
                role="button"
                tabIndex={0}
                onClick={() => goToCourse(course)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    goToCourse(course)
                  }
                }}
              >
                <div className="course-card__badges">
                  <span className={`badge badge--${course.EXPERIENCE === 'Fresher' ? 'fresher' : 'experience'}`}>
                    {course.EXPERIENCE === 'Fresher' ? 'Fresher' : 'Upskill'}
                  </span>
                  <span className="badge badge--type">{course.TECHNOLOGY_TYPE}</span>
                </div>
                <h3>{course.NAME}</h3>
                <p>{course.DESCRIPTION}</p>
                <span className="course-card__cta">
                  View details <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses