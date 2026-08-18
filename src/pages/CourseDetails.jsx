import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { fetchCourseHierarchyByName } from '../api/courses'
import { formatDate } from '../api/config'
import { submitDemoSlot } from '../api/demoSlot'
import './CourseDetails.css'

const WEEKDAY_SLOTS = ['9:00 AM', '6:00 PM', '9:30 PM']
const WEEKEND_SLOTS = [
  '8:30 AM',
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '9:00 PM',
  '11:00 PM',
]

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Builds Monday -> Sunday for the week containing "today".
function getCurrentWeekDates() {
  const today = new Date()
  const day = today.getDay() // 0 = Sun ... 6 = Sat
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(today.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

// Parses "9:30 PM" -> { hours: 21, minutes: 30 } for same-day comparisons.
function parseSlotTime(label) {
  const match = label.match(/(\d+):(\d+)\s?(AM|PM)/i)
  if (!match) return null
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridiem = match[3].toUpperCase()
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

function isSlotInPast(dateObj, label) {
  const parsed = parseSlotTime(label)
  if (!parsed) return false
  const slotTime = new Date(dateObj)
  slotTime.setHours(parsed.hours, parsed.minutes, 0, 0)
  return slotTime.getTime() <= Date.now()
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

  const weekDates = useMemo(() => getCurrentWeekDates(), [])

  const [bookingForm, setBookingForm] = useState({ name: '', email: '', contact: '' })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingErrors, setBookingErrors] = useState({})
  const [bookingStatus, setBookingStatus] = useState('idle') // idle | submitting | success | error

  const today = new Date()

  const availableSlots = useMemo(() => {
    if (!selectedDate) return []
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6
    const base = isWeekend ? WEEKEND_SLOTS : WEEKDAY_SLOTS
    if (!isSameDay(selectedDate, today)) return base
    return base.filter((slot) => !isSlotInPast(selectedDate, slot))
  }, [selectedDate]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectDate(date) {
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return
    setSelectedDate(date)
    setSelectedSlot('')
    if (bookingErrors.date) setBookingErrors((prev) => ({ ...prev, date: undefined }))
  }

  function handleBookingChange(field) {
    return (e) => {
      setBookingForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (bookingErrors[field]) {
        setBookingErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  function validateBooking() {
    const nextErrors = {}
    if (!bookingForm.name.trim()) nextErrors.name = 'Name is required.'
    if (!bookingForm.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!bookingForm.contact.trim()) nextErrors.contact = 'Contact number is required.'
    if (!selectedDate) nextErrors.date = 'Pick a date.'
    if (selectedDate && !selectedSlot) nextErrors.slot = 'Pick a time slot.'
    setBookingErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleBookingSubmit(e) {
    e.preventDefault()
    if (!validateBooking()) return

    setBookingStatus('submitting')
    try {
      await submitDemoSlot({
        name: bookingForm.name,
        email: bookingForm.email,
        contactNumber: bookingForm.contact,
        courseName: course.NAME,
        date: formatDate(selectedDate),
        day: DAY_FULL[selectedDate.getDay()],
        timeSlot: selectedSlot,
      })
      setBookingStatus('success')
    } catch (err) {
      setBookingStatus('error')
    }
  }

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

        <Reveal delay="0.16s" className="course-details__section" as="div">
          <h2>Book your demo slot</h2>

          <div className="demo-booking glass-card">
            {bookingStatus === 'success' ? (
              <p className="course-details__status">
                Your demo slot is booked. We&rsquo;ll see you then &mdash; a
                confirmation has been sent to {bookingForm.email}.
              </p>
            ) : (
              <form onSubmit={handleBookingSubmit} noValidate>
                <div className="demo-booking__week">
                  {weekDates.map((date) => {
                    const isPastDay =
                      date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    const isSelected = selectedDate && isSameDay(selectedDate, date)
                    return (
                      <button
                        type="button"
                        key={date.toISOString()}
                        className={`demo-booking__date${isSelected ? ' demo-booking__date--active' : ''}`}
                        disabled={isPastDay}
                        onClick={() => handleSelectDate(date)}
                      >
                        <span className="demo-booking__date-dow">{DAY_ABBR[date.getDay()]}</span>
                        <span className="demo-booking__date-num">{date.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
                {bookingErrors.date && (
                  <p className="demo-booking__field-error">{bookingErrors.date}</p>
                )}

                {selectedDate && (
                  <div className="demo-booking__slots">
                    {availableSlots.length === 0 ? (
                      <p className="demo-booking__field-error">
                        No slots left for this day &mdash; pick another date.
                      </p>
                    ) : (
                      availableSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          className={`demo-booking__slot${selectedSlot === slot ? ' demo-booking__slot--active' : ''}`}
                          onClick={() => {
                            setSelectedSlot(slot)
                            if (bookingErrors.slot) {
                              setBookingErrors((prev) => ({ ...prev, slot: undefined }))
                            }
                          }}
                        >
                          {slot}
                        </button>
                      ))
                    )}
                  </div>
                )}
                {bookingErrors.slot && (
                  <p className="demo-booking__field-error">{bookingErrors.slot}</p>
                )}

                <div className="demo-booking__row">
                  <div className="demo-booking__field">
                    <label htmlFor="demo-name">Name</label>
                    <input
                      id="demo-name"
                      type="text"
                      value={bookingForm.name}
                      onChange={handleBookingChange('name')}
                      placeholder="Your full name"
                    />
                    {bookingErrors.name && (
                      <p className="demo-booking__field-error">{bookingErrors.name}</p>
                    )}
                  </div>

                  <div className="demo-booking__field">
                    <label htmlFor="demo-email">Email</label>
                    <input
                      id="demo-email"
                      type="email"
                      value={bookingForm.email}
                      onChange={handleBookingChange('email')}
                      placeholder="you@example.com"
                    />
                    {bookingErrors.email && (
                      <p className="demo-booking__field-error">{bookingErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="demo-booking__row">
                  <div className="demo-booking__field">
                    <label htmlFor="demo-contact">Contact number</label>
                    <input
                      id="demo-contact"
                      type="tel"
                      value={bookingForm.contact}
                      onChange={handleBookingChange('contact')}
                      placeholder="+91 98765 43210"
                    />
                    {bookingErrors.contact && (
                      <p className="demo-booking__field-error">{bookingErrors.contact}</p>
                    )}
                  </div>

                  <div className="demo-booking__field">
                    <label htmlFor="demo-course">Course</label>
                    <input id="demo-course" type="text" value={course.NAME} disabled />
                  </div>
                </div>

                {bookingStatus === 'error' && (
                  <p className="course-details__status course-details__status--error">
                    Could not book your slot right now. Please try again shortly.
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary demo-booking__submit"
                  disabled={bookingStatus === 'submitting'}
                >
                  {bookingStatus === 'submitting' ? 'Booking...' : 'Book demo slot'}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CourseDetails