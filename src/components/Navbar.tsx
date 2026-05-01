import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/create', label: 'Create Familiar' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/docs', label: 'Docs' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="site-nav"
    >
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          <span>Quirk-N-Go</span>
          <em>beta</em>
        </Link>

        <div className="site-nav__links" aria-label="Primary navigation">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
