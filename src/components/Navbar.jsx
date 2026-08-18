import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from "/public/images/csn-logo.png";
import './Navbar.css'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '/demo-registration', label: 'Register Demo' },
  { to: '/career', label: 'Careers' },
  { to: '/OpportunityNexus', label: 'OpportunityNexus' },
  { to: '/about', label: 'About' }
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
    <div className="navbar__inner container">
  <NavLink
    to="/"
    className="navbar__logo"
    onClick={() => setOpen(false)}
  >
    <span className="navbar__logo-mark">
      <img src={logo} alt="CreativeSkill Nexus" />
    </span>

    <span className="navbar__logo-text">
      CreativeSkill<span className="gradient-text">Nexus</span>
    </span>
  </NavLink>

  <nav className="navbar__links navbar__links--desktop">
    {NAV_LINKS.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          `navbar__link ${isActive ? "is-active" : ""}`
        }
      >
        {link.label}
      </NavLink>
    ))}
  </nav>

  <div className="navbar__actions navbar__actions--desktop">
    <NavLink to="/signin" className="btn btn-ghost btn-sm">
      Sign in
    </NavLink>

    <NavLink to="/signup" className="btn btn-primary btn-sm">
      Sign up
    </NavLink>
  </div>

  <button
    className={`navbar__burger ${open ? "is-open" : ""}`}
    aria-label={open ? "Close menu" : "Open menu"}
    aria-expanded={open}
    onClick={() => setOpen((v) => !v)}
  >
    <span />
    <span />
    <span />
  </button>
</div>

      <div className={`navbar__mobile ${open ? 'is-open' : ''}`}>
        <nav className="navbar__links navbar__links--mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'is-active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="navbar__actions navbar__actions--mobile">
          <NavLink
            to="/signin"
            className="btn btn-ghost"
            onClick={() => setOpen(false)}
          >
            Sign in
          </NavLink>
          <NavLink
            to="/signup"
            className="btn btn-primary"
            onClick={() => setOpen(false)}
          >
            Sign up
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
