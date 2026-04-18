import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

type Tab = 'familiars' | 'earnings' | 'analytics' | 'settings'

const sidebarItems: { icon: string; label: string; tab: Tab }[] = [
  { icon: '🤖', label: 'My Familiars', tab: 'familiars' },
  { icon: '💰', label: 'Earnings', tab: 'earnings' },
  { icon: '📊', label: 'Analytics', tab: 'analytics' },
  { icon: '⚙️', label: 'Settings', tab: 'settings' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('familiars')
  const isMobile = useIsMobile()

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          width: isMobile ? '100%' : 240,
          background: 'var(--bg-secondary)',
          borderRight: isMobile ? 'none' : '1px solid var(--border-subtle)',
          borderBottom: isMobile ? '1px solid var(--border-subtle)' : 'none',
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
          const isActive = activeTab === item.tab
          return (
            <div
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              style={{
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
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </motion.aside>

      {/* Main content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ flex: 1, padding: isMobile ? '28px 20px' : '48px 40px', overflow: 'auto' }}
      >
        {activeTab === 'familiars' && <FamiliarsTab />}
        {activeTab === 'earnings' && <EarningsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </motion.div>
    </div>
  )
}

/* ── Familiars Tab ── */
function FamiliarsTab() {
  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        My Familiars
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 48 }}>
        Manage your deployed AI familiars and track their performance.
      </p>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 20,
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🤖</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
          Deploy your first familiar
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Choose a niche, pick a personality, and launch an AI familiar that gathers intelligence and earns revenue 24/7.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/marketplace">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{
              background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
              padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-display)', cursor: 'pointer',
            }}>Browse Marketplace</motion.button>
          </Link>
          <Link to="/create">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{
              background: 'var(--accent-cyan)', color: '#0a0b0f', border: 'none',
              padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', cursor: 'pointer',
            }}>Create Familiar</motion.button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginTop: 32 }}>
        {[
          { label: 'Active Familiars', value: '0', icon: '🤖' },
          { label: 'Total Earnings', value: '$0.00', icon: '💰' },
          { label: 'Total Requests', value: '0', icon: '📊' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 24,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Earnings Tab ── */
function EarningsTab() {
  const weekData = [
    { day: 'Mon', amount: 0 }, { day: 'Tue', amount: 0 }, { day: 'Wed', amount: 0 },
    { day: 'Thu', amount: 0 }, { day: 'Fri', amount: 0 }, { day: 'Sat', amount: 0 }, { day: 'Sun', amount: 0 },
  ]
  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Earnings</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 48 }}>Track your familiar revenue and payouts.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Earned', value: '$0.00', color: 'var(--accent-cyan)' },
          { label: 'This Week', value: '$0.00', color: 'var(--accent-green)' },
          { label: 'Requests', value: '0', color: 'var(--accent-amber)' },
          { label: 'Active Products', value: '0', color: 'var(--accent-purple)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>Weekly Revenue</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {weekData.map(d => (
            <div key={d.day} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, height: 80, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${Math.max(d.amount, 2)}%`, background: 'var(--accent-cyan)', borderRadius: '6px 6px 0 0', opacity: 0.3 }} />
              </div>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 6, display: 'block' }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Deploy a familiar to start earning
        </div>
      </div>
    </>
  )
}

/* ── Analytics Tab ── */
function AnalyticsTab() {
  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Analytics</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 48 }}>Deep dive into your familiar performance metrics.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {[
          { title: 'Request Volume', icon: '📈', desc: 'Track request patterns and peak hours across all your familiars.' },
          { title: 'Revenue Breakdown', icon: '💎', desc: 'See which products and niches generate the most revenue.' },
          { title: 'Buyer Demographics', icon: '🌍', desc: 'Understand who is buying your intelligence products.' },
          { title: 'Trust Score Trends', icon: '🛡️', desc: 'Monitor how your trust scores change over time.' },
        ].map(card => (
          <div key={card.title} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 28,
          }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{card.icon}</span>
            <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 8 }}>{card.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{card.desc}</p>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 6 }}>Coming soon</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Settings Tab ── */
function SettingsTab() {
  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Settings</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 48 }}>Configure your account and familiar defaults.</p>

      {[
        { title: 'Wallet', desc: 'Connect your wallet for x402 micropayment payouts.', action: 'Connect Wallet', icon: '💳' },
        { title: 'API Keys', desc: 'Manage API keys for programmatic access to your familiars.', action: 'Generate Key', icon: '🔑' },
        { title: 'Notifications', desc: 'Set up alerts for earnings milestones and familiar status changes.', action: 'Configure', icon: '🔔' },
        { title: 'Default Personality', desc: 'Set the default personality archetype for new familiars.', action: 'Edit', icon: '🎭' },
      ].map(setting => (
        <div key={setting.title} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14,
          padding: 24, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 28 }}>{setting.icon}</span>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{setting.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{setting.desc}</p>
            </div>
          </div>
          <button style={{
            background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)',
            padding: '8px 16px', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
          }}>{setting.action}</button>
        </div>
      ))}
    </>
  )
}
