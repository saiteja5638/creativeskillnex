import { useReveal } from '../hooks/useReveal'

/**
 * Wraps children in a fade-up-on-scroll animation.
 * `delay` accepts a CSS time string, e.g. "0.1s".
 */
function Reveal({ children, delay = '0s', className = '', as: Tag = 'div' }) {
  const [ref, isVisible] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: isVisible ? delay : '0s' }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
