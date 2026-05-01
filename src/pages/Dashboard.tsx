import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import { useLiveData } from '../context/LiveDataContext'
import { useWallet } from '../context/WalletContext'
import { destinationLabel, getFamiliarDrafts, type FamiliarDraft } from '../lib/familiarDrafts'

type Tab = 'familiars' | 'earnings' | 'analytics' | 'settings'
type Chain = 'solana' | 'base'

const sidebarItems: { icon: string; label: string; tab: Tab }[] = [
  { icon: '✦', label: 'Familiars', tab: 'familiars' },
  { icon: '¢', label: 'Earnings', tab: 'earnings' },
  { icon: '↗', label: 'Analytics', tab: 'analytics' },
  { icon: '⚙', label: 'Settings', tab: 'settings' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('familiars')
  const isMobile = useIsMobile()
  const { liveProducts, totalRequests, backends } = useLiveData()
  const wallet = useWallet()
  const online = backends.filter(b => b.status === 'online').length
  const liveRevenue = liveProducts.reduce((sum, p) => sum + p.requests_24h * p.price_numeric, 0)

  const connectWallet = async (chain: Chain) => {
    try {
      await wallet.connect(chain)
    } catch {
      // WalletContext owns the visible error.
    }
  }

  return (
    <div className="dashboard-shell">
      <motion.aside
        initial={{ opacity: 0, x: isMobile ? 0 : -18 }}
        animate={{ opacity: 1, x: 0 }}
        className="dashboard-rail"
      >
        <div className="dashboard-brand">
          <span>QuirkNGo</span>
          <strong>operator console</strong>
        </div>
        <nav className="dashboard-tabs" aria-label="Dashboard sections">
          {sidebarItems.map(item => {
            const isActive = activeTab === item.tab
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={isActive ? 'dashboard-tab dashboard-tab--active' : 'dashboard-tab'}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="dashboard-wallet-card">
          <div className="mini-label">wallet</div>
          <strong>{wallet.connected ? wallet.walletName || wallet.chain : 'not connected'}</strong>
          <span>{wallet.connected ? wallet.address : 'connect only when testing checkout'}</span>
          <div className="wallet-actions-mini">
            <button onClick={() => connectWallet('solana')}>Solana</button>
            <button onClick={() => connectWallet('base')}>Base</button>
          </div>
          {wallet.error && <em>{wallet.error}</em>}
        </div>
      </motion.aside>

      <motion.main
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="dashboard-main"
      >
        <section className="dashboard-hero-card">
          <div>
            <span className="section-kicker">clean operator view</span>
            <h1>{activeTitle(activeTab)}</h1>
            <p>{activeSubtitle(activeTab)}</p>
          </div>
          <div className="dashboard-hero-metrics">
            <Metric label="Live products" value={String(liveProducts.length)} />
            <Metric label="Backends online" value={`${online}/${backends.length || 3}`} />
            <Metric label="24h gross" value={`$${liveRevenue.toFixed(3)}`} />
            <Metric label="Requests" value={totalRequests.toLocaleString()} />
          </div>
        </section>

        {activeTab === 'familiars' && <FamiliarsTab products={liveProducts} />}
        {activeTab === 'earnings' && <EarningsTab products={liveProducts} />}
        {activeTab === 'analytics' && <AnalyticsTab products={liveProducts} />}
        {activeTab === 'settings' && <SettingsTab wallet={wallet} connectWallet={connectWallet} />}
      </motion.main>
    </div>
  )
}

function activeTitle(tab: Tab) {
  return {
    familiars: 'Your familiar storefront is alive.',
    earnings: 'Tiny payments, clean accounting.',
    analytics: 'Know what buyers are touching.',
    settings: 'Wallets, rails, and safety defaults.',
  }[tab]
}

function activeSubtitle(tab: Tab) {
  return {
    familiars: 'Manage live products and creator-built familiar blueprints without making the page feel homemade.',
    earnings: 'Track x402 request volume and estimated gross revenue before payout automation gets wired in.',
    analytics: 'A readable monitoring layer for demand, health, and trust signals across the marketplace.',
    settings: 'Connect burner wallets for testing. No seed phrases, no custody, no hidden execution.',
  }[tab]
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="dashboard-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function FamiliarsTab({ products }: { products: any[] }) {
  const [drafts] = useState<FamiliarDraft[]>(() => getFamiliarDrafts())
  return (
    <div className="dashboard-grid dashboard-grid--wide">
      <div className="dashboard-panel dashboard-panel--large">
        <div className="panel-header">
          <div>
            <span className="mini-label">deployed</span>
            <h2>Live familiar products</h2>
          </div>
          <Link className="dashboard-link-button" to="/create">Create familiar</Link>
        </div>
        <div className="familiar-table">
          {drafts.map(draft => (
            <div className="familiar-row" key={`draft-${draft.id}`}>
              <div className="familiar-avatar">{draft.nicheIcon}</div>
              <div>
                <strong>{draft.name}</strong>
                <span>{draft.purpose} · produces: {draft.produces} · info goes to {destinationLabel(draft.destination)}</span>
              </div>
              <ChainPill chain={draft.rail} />
              <em>blueprint</em>
            </div>
          ))}
          {products.map(product => (
            <Link to={`/product/${product.id}`} className="familiar-row" key={product.id}>
              <div className="familiar-avatar">{product.avatar_url ? <img src={product.avatar_url} alt="" /> : product.familiar_emoji}</div>
              <div>
                <strong>{product.name}</strong>
                <span>{product.description}</span>
              </div>
              <ChainPill chain={product.chain || 'solana'} />
              <em>{product.requests_24h.toLocaleString()} / 24h</em>
            </Link>
          ))}
        </div>
      </div>

      <div className="dashboard-panel">
        <span className="mini-label">next step</span>
        <h2>Deploy another familiar</h2>
        <p>Keep this clean: one familiar, one job, one payment rail, one payload shape buyers can understand.</p>
        <div className="flow-steps">
          <Step done label="Pick niche" />
          <Step done label="Attach endpoint" />
          <Step done label="Choose Solana or Base x402" />
          <Step label="Test with burner wallet" />
        </div>
        <Link className="primary-cta dashboard-full-cta" to="/create">Open creator</Link>
      </div>
    </div>
  )
}

function EarningsTab({ products }: { products: any[] }) {
  const rows = products.map(p => ({ ...p, gross: p.requests_24h * p.price_numeric }))
  const total = rows.reduce((sum, p) => sum + p.gross, 0)
  return (
    <div className="dashboard-grid">
      <div className="dashboard-panel dashboard-panel--large">
        <div className="panel-header">
          <div>
            <span className="mini-label">estimated</span>
            <h2>24h x402 gross</h2>
          </div>
          <strong className="big-money">${total.toFixed(3)}</strong>
        </div>
        <div className="earnings-bars">
          {rows.map(row => (
            <div className="earning-row" key={row.id}>
              <div>
                <strong>{row.name}</strong>
                <span>{row.requests_24h.toLocaleString()} requests × {row.price}</span>
              </div>
              <div className="bar-track"><span style={{ width: `${Math.max(8, (row.gross / Math.max(total, 0.001)) * 100)}%` }} /></div>
              <em>${row.gross.toFixed(3)}</em>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-panel">
        <span className="mini-label">payout status</span>
        <h2>Manual until proven</h2>
        <p>Checkout can take payments, but automatic payouts should stay conservative until we have real transaction logs and reconciliation.</p>
        <div className="flow-steps">
          <Step done label="x402 endpoints live" />
          <Step done label="Wallet signing UI" />
          <Step label="Transaction ledger" />
          <Step label="Creator payout automation" />
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab({ products }: { products: any[] }) {
  return (
    <div className="dashboard-grid dashboard-grid--wide">
      {products.map(product => (
        <div className="dashboard-panel analytics-card" key={product.id}>
          <div className="panel-header">
            <div>
              <span className="mini-label">{product.category}</span>
              <h2>{product.name}</h2>
            </div>
            <ChainPill chain={product.chain || 'solana'} />
          </div>
          <div className="analytics-strip">
            <Metric label="Uptime" value={`${product.uptime}%`} />
            <Metric label="Hit rate" value={`${product.hit_rate}%`} />
            <Metric label="Trust" value={`${product.trust_score}/100`} />
          </div>
          <p>{product.safety_note || 'Scanner-only intelligence product. No account actions.'}</p>
        </div>
      ))}
    </div>
  )
}

function SettingsTab({ wallet, connectWallet }: { wallet: ReturnType<typeof useWallet>; connectWallet: (chain: Chain) => Promise<void> }) {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-panel dashboard-panel--large">
        <div className="panel-header">
          <div>
            <span className="mini-label">wallet flow</span>
            <h2>Test checkout rails</h2>
          </div>
          <span className={wallet.connected ? 'rail-status rail-status--live' : 'rail-status'}>{wallet.connected ? 'connected' : 'not connected'}</span>
        </div>
        <div className="wallet-flow-grid">
          <WalletRailCard
            title="Solana x402"
            subtitle="Phantom, Jupiter, Solflare, Backpack"
            active={wallet.chain === 'solana'}
            onClick={() => connectWallet('solana')}
          />
          <WalletRailCard
            title="Base x402"
            subtitle="MetaMask, Coinbase Wallet, Rabby"
            active={wallet.chain === 'base'}
            onClick={() => connectWallet('base')}
          />
        </div>
        {wallet.error && <div className="dashboard-error">{wallet.error}</div>}
        <div className="flow-steps flow-steps--horizontal">
          <Step done={wallet.connected} label="Connect burner wallet" />
          <Step label="Open product page" />
          <Step label="Approve tiny USDC payment" />
          <Step label="Endpoint unlocks payload" />
        </div>
      </div>

      <div className="dashboard-panel">
        <span className="mini-label">safety defaults</span>
        <h2>Clean by design</h2>
        <p>No seed phrases. No custody. No auto-trading. Every paid unlock is a visible wallet approval.</p>
        <div className="settings-list">
          <span>✓ Burner wallet testing</span>
          <span>✓ Per-request pricing</span>
          <span>✓ Scanner-only product language</span>
          <span>✓ Human approval for payments</span>
        </div>
      </div>
    </div>
  )
}

function ChainPill({ chain }: { chain: string }) {
  const label = chain === 'base' ? 'Base USDC' : chain === 'multi' ? 'Multi-rail' : 'Solana USDC'
  return <span className={`chain-pill chain-pill--${chain}`}>{label}</span>
}

function Step({ label, done = false }: { label: string; done?: boolean }) {
  return <div className={done ? 'flow-step flow-step--done' : 'flow-step'}><span>{done ? '✓' : '·'}</span>{label}</div>
}

function WalletRailCard({ title, subtitle, active, onClick }: { title: string; subtitle: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={active ? 'wallet-rail-card wallet-rail-card--active' : 'wallet-rail-card'}>
      <strong>{title}</strong>
      <span>{subtitle}</span>
      <em>{active ? 'Connected rail' : 'Connect'}</em>
    </button>
  )
}
