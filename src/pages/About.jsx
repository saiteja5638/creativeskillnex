import { useState } from 'react';
import './About.css';
import { Link } from "react-router-dom";

const MISSING_AT_TRAINING = [
  'Real-time projects',
  'Working documentation',
  'Live APIs',
  'Any real resources',
];

const FEATURES = [
  {
    title: 'Real trainers, real time',
    body: 'Learn directly from technical trainers who build and deploy for a living — online or in person, your choice.',
  },
  {
    title: 'Full transparency',
    body: "See who's teaching you before you enroll. Every trainer's LinkedIn profile is public — no anonymous instructors.",
  },
  {
    title: 'Real projects, real resources',
    body: 'Work with live projects, working APIs, and documentation — not another slide deck.',
  },
  {
    title: 'Resume, built for hiring',
    body: 'Resume support built from what you actually shipped, not a generic template.',
  },
];

export default function About() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className="csn-about">
      {/* ---------- Hero ---------- */}
      <section className="csn-hero">
        <div className="csn-about__inner csn-hero__grid">
          <div>
            <span className="csn-eyebrow">About CreativeSkillNexus</span>
            <h1>
              Learn from people who <em>actually build</em> the thing you're
              learning.
            </h1>
            <p className="csn-lede">
              CreativeSkillNexus connects students directly with working
              developers and technical trainers — no mediation, no filler,
              just the training that gets you job-ready.
            </p>
            <div className="csn-hero__ctas">
              <a className="csn-btn csn-btn--primary" href="#connection">
                See how it works
              </a>
            </div>
          </div>

          <div className="csn-founder-card">
            <div className="csn-founder-card__photo">
              {!photoFailed ? (
                <img
                  src="/images/csn-profile.jpeg"
                  alt="Cherviralla Sai Teja, founder of CreativeSkillNexus"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <span>CST</span>
              )}
            </div>
            <h3>Cherviralla Sai Teja</h3>
            <p className="csn-founder-card__role">
              Technology Analyst · Founder, CreativeSkillNexus
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Story ---------- */}
      <section className="csn-story">
        <div className="csn-about__inner csn-story__grid">
          <div>
            <span className="csn-eyebrow">Why this exists</span>
            <h2>The gap nobody told me about</h2>
          </div>
          <div className="csn-story__body">
            <p>
              I'm <strong>Cherviralla Sai Teja</strong>, working today as a
              Technology Analyst — building and deploying real applications
              is part of my day job.
            </p>
            <p>
              It wasn't always that way. When I went through training
              institutes myself, I paid for courses that promised
              "real-time" experience and delivered none of it.
            </p>
            <blockquote className="csn-pullquote">
              No real-time projects. No documentation. No working APIs. Just
              slides — and a certificate at the end.
            </blockquote>
            <p>
              Here's what was actually missing from that training:
            </p>
            <ul className="csn-missing-list">
              {MISSING_AT_TRAINING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: '22px' }}>
              That gap is the reason CreativeSkillNexus exists — a platform
              that connects students and developers directly, so the person
              teaching you is the person who actually does the work.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Signature: connection diagram ---------- */}
      <section className="csn-connection" id="connection">
        <div className="csn-about__inner">
          <span className="csn-eyebrow" style={{ justifyContent: 'center' }}>
            No mediation
          </span>
          <h2>A direct line between you and the developer training you</h2>
          <p>
            Most platforms sit between the learner and the trainer. We built
            CreativeSkillNexus to remove that layer entirely.
          </p>

          <svg
            className="csn-connection__diagram"
            viewBox="0 0 720 220"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Diagram showing a learner connected directly to a trainer, with the platform crossed out as a middleman"
          >
            <line
              x1="160"
              y1="150"
              x2="560"
              y2="150"
              stroke="#4fd1c5"
              strokeWidth="2"
            />
            <circle cx="160" cy="150" r="52" fill="#101a2e" stroke="#4fd1c5" strokeWidth="2" />
            <text x="160" y="145" textAnchor="middle" fill="#eaf2f7" fontFamily="Space Grotesk, sans-serif" fontSize="15" fontWeight="600">
              You
            </text>
            <text x="160" y="164" textAnchor="middle" fill="#90a4c2" fontFamily="Inter, sans-serif" fontSize="11">
              the learner
            </text>

            <circle cx="560" cy="150" r="52" fill="#101a2e" stroke="#4fd1c5" strokeWidth="2" />
            <text x="560" y="145" textAnchor="middle" fill="#eaf2f7" fontFamily="Space Grotesk, sans-serif" fontSize="15" fontWeight="600">
              Trainer
            </text>
            <text x="560" y="164" textAnchor="middle" fill="#90a4c2" fontFamily="Inter, sans-serif" fontSize="11">
              working developer
            </text>

            <g opacity="0.55">
              <circle cx="360" cy="55" r="34" fill="none" stroke="#e2685f" strokeWidth="2" />
              <line x1="337" y1="32" x2="383" y2="78" stroke="#e2685f" strokeWidth="2" />
              <text x="360" y="105" textAnchor="middle" fill="#8ca0be" fontFamily="JetBrains Mono, monospace" fontSize="11">
                no middleman platform
              </text>
            </g>

            <text x="360" y="200" textAnchor="middle" fill="#4fd1c5" fontFamily="JetBrains Mono, monospace" fontSize="12">
              direct · transparent · real-time
            </text>
          </svg>
        </div>
      </section>

      {/* ---------- Differentiators ---------- */}
      <section className="csn-features">
        <div className="csn-about__inner">
          <span className="csn-eyebrow">What you actually get</span>
          <h2>Built to fix what training institutes skip</h2>
          <div className="csn-features__grid">
            {FEATURES.map((feature, i) => (
              <div className="csn-feature" key={feature.title}>
                <span className="csn-feature__index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Transparency / trainer LinkedIn band ---------- */}
      {/* <section className="csn-transparency" id="trainers">
        <div className="csn-about__inner csn-transparency__panel">
          <div>
            <span className="csn-transparency__badge">Transparency, by default</span>
            <h2>Every trainer is a public profile, not a promise</h2>
            <p>
              Other platforms tell you "real-time trainer" and leave it
              there. We publish LinkedIn profiles so you can see their real
              work history before you commit a single rupee.
            </p>
          </div>
          <div className="csn-trainer-strip">
            <div className="csn-trainer-row">
              <span>Cherviralla Sai Teja</span>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                linkedin.com ↗
              </a>
            </div>
            <div className="csn-trainer-row">
              <span>Add your trainers here</span>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                linkedin.com ↗
              </a>
            </div>
            <div className="csn-trainer-row">
              <span>Add your trainers here</span>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                linkedin.com ↗
              </a>
            </div>
          </div>
        </div>
      </section> */}

      {/* ---------- Closing CTA ---------- */}
      <section className="csn-cta">
        <div className="csn-about__inner">
          <span className="csn-eyebrow" style={{ justifyContent: 'center' }}>
            Get started
          </span>
          <h2>Learn the course that actually fits you</h2>
          <p>
            Tell us where you're starting from and we'll match you with a
            trainer and a track built around real projects — not a fixed
            syllabus.
          </p>
          <div className="csn-cta__ctas">
            <Link className="csn-btn csn-btn--primary" to="/courses">
              Find your course
            </Link>
            <Link className="csn-btn csn-btn--ghost" to="/demo-registration">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}