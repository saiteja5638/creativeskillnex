import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page">
      <h1>404 — Page Not Found</h1>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </section>
  )
}

export default NotFound
