import Reveal from './Reveal'
import './CourseFinder.css'
import { Link } from "react-router-dom";

const ORBIT_SKILLS = ['SAP', 'React', 'AI/ML', 'Data', 'Finance', 'HR']

function CourseFinder() {
  return (
    <section className="finder" id="find-course">
      <div className="container finder__grid">
        <Reveal className="finder__copy">
          <span className="eyebrow">Section 02 &middot; Career Match</span>
          <h2 className="finder__title">
            Confused to find the right framework or course?
          </h2>
          <p className="finder__text">
            You&rsquo;re not the only one. Most learners freeze at the same
            question: <em>which platform is actually right for me?</em> Our
            AI-ML integrated career engine reads your interests, background
            and goals, then narrows thousands of options down to the courses
            most likely to work for you.
          </p>
          <p className="finder__text finder__text--muted">
            Every recommendation is trained on real success scenarios — the
            actual paths past learners took from &ldquo;undecided&rdquo; to
            hired, so you&rsquo;re following a route that has already worked,
            not a guess.
          </p>
          <Link to="/career-finder" className="btn btn-warm finder__cta">
            Find Career Course
          </Link>
        </Reveal>

        <Reveal delay="0.15s" className="finder__visual" as="div">
          <div className="orbit">
            <div className="orbit__core glass-card">
              <span>AI Match</span>
            </div>
            <div className="orbit__ring orbit__ring--1">
              {ORBIT_SKILLS.slice(0, 3).map((skill, i) => (
                <span key={skill} className="orbit__node" style={{ '--i': i }}>
                  <span className="orbit__node-label">{skill}</span>
                </span>
              ))}
            </div>
            <div className="orbit__ring orbit__ring--2">
              {ORBIT_SKILLS.slice(3).map((skill, i) => (
                <span key={skill} className="orbit__node" style={{ '--i': i }}>
                  <span className="orbit__node-label">{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CourseFinder
