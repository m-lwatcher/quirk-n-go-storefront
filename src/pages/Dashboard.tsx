import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const sidebarItems = [
  { icon: '🤖', label: 'My Familiars', to: '/dashboard' },
  { icon: '💰', label: 'Earnings', to: '/earnings' },
  { icon: '📊', label: 'Analytics', to: '/dashboard' },
  { icon: '⚙️', label: 'Settings', to: '/dashboard' },
]

export default function Dashboard() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          width: 240,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '32px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: 16,
          paddingLeft: 12,
        }}>
          Dashboard
        </div>
        {sidebarItems.map(item => {
          const isActive = location.pathname === item.to
          return (
            <Link key={item.label} to={item.to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                marginBottom: 4,
                cursor: 'pointer',
                background: isActive ? 'var(--accent-cyan-dim)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: 14,
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
              }}>
                <span>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          )
        })}
      </motion.aside>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ flex: 1, padding: '48px 40px' }}
      >
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          marginBottom: 8,
        }}>
          My Familiars
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          marginBottom: 48,
        }}>
          Manage your deployed AI familiars and track their performance.
        </p>

        {/* Empty state */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 20,
          padding: '80px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🤖</div>
          <h2 style={{
            fontSize: 22,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            marginBottom: 12,
          }}>
            Deploy your first familiar
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            maxWidth: 400,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            Choose a niche, pick a personality, and launch an AI familiar that gathers intelligence and earns revenue 24/7.
          </p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'var(--accent-cyan)',
                color: '#0a0b0f',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
                marginRight: 12,
              }}
            >
              Browse Marketplace
            </motion.button>
          </Link>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 28px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
              }}
            >
              Create Familiar
            </motion.button>
          </Link>
        </div>

        {/* Placeholder stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 32,
        }}>
          {[
            { label: 'Active Familiars', value: '0', icon: '🤖' },
            { label: 'Total Earnings', value: '$0.00', icon: '💰' },
            { label: 'Total Requests', value: '0', icon: '📊' },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
