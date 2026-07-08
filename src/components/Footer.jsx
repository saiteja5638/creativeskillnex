import { NavLink } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="navbar__logo-mark footer__mark">CSN</span>
          <span>
            CreativeSkill<span className="gradient-text">Nexus</span>
          </span>
        </div>
        <p className="footer__tagline">
          Find the course that fits you — not the other way around.
        </p>
        <nav className="footer__links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/upskill">Upskill</NavLink>
          <NavLink to="/career-jobs">Career Jobs</NavLink>
        </nav>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} CreativeSkillNexus. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
