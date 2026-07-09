import { useCallback, useEffect, useRef, useState } from 'react'
import { slides } from '../data/carouselData'
import './Carousel.css'

const AUTOPLAY_MS = 5500

function Carousel() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const goTo = useCallback((i) => {
    setIndex((i + slides.length) % slides.length)
  }, [])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [])

  const pause = () => clearInterval(timerRef.current)
  const resume = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
  }

  return (
    <div
      className="carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      role="region"
      aria-label="Featured highlights"
    >
      <div className="carousel__glow" aria-hidden="true" />

      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`carousel__slide ${i === index ? 'is-active' : ''}`}
          aria-hidden={i !== index}
        >
          <div
            className="carousel__image"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="carousel__scrim" />
          <div className="carousel__content container">
            <span className="eyebrow">{slide.eyebrow}</span>
            <h1 className="carousel__title">{slide.title}</h1>
            <p className="carousel__text">{slide.text}</p>
            <div className="carousel__cta">
              <a href="#find-course" className="btn btn-primary">
                Find your course
              </a>
              <a href="/creativeskillnex/demo-registration" className="btn btn-ghost">
               Register for a demo
              </a>
            </div>
          </div>
        </div>
      ))}

      <button className="carousel__arrow carousel__arrow--prev" onClick={prev} aria-label="Previous slide">
        &#8249;
      </button>
      <button className="carousel__arrow carousel__arrow--next" onClick={next} aria-label="Next slide">
        &#8250;
      </button>

      <div className="carousel__dots">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            className={`carousel__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
