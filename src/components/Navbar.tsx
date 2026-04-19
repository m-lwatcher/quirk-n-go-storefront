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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        background: 'rgba(10, 11, 15, 0.85)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-amber))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            Quirk-N-Go
          </span>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            background: 'var(--accent-cyan-dim)',
            padding: '2px 8px',
            borderRadius: 4,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            beta
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: 8,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-cyan-dim)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
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
