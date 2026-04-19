import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '40px 24px',
      textAlign: 'center',
      background: 'var(--bg-secondary)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          <a href="https://github.com/m-lwatcher/familiar-app" target="_blank" rel="noopener"
            style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}>
            GitHub
          </a>
          <Link to="/docs" style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            Docs
          </Link>
          <Link to="/marketplace" style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            Marketplace
          </Link>
          <Link to="/create" style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            Create Familiar
          </Link>
        </div>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.5px',
        }}>
          Quirk-N-Go · A convenience store for intelligence · Powered by x402
        </p>
      </div>
    </footer>
  )
}
