import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLiveData } from '../context/LiveDataContext'
import { useAnimatedCounter } from '../hooks/useLiveData'
import { useWallet } from '../context/WalletContext'
import ProductCard from '../components/ProductCard'

export default function Landing() {
  const { liveProducts, totalRequests, backends } = useLiveData()
  const animatedTotal = useAnimatedCounter(totalRequests)
  const { connected, address, chain, connect, disconnect } = useWallet()
  const online = backends.filter(b => b.status === 'online').length
  const signals = backends.reduce((sum, b) => sum + (b.signals || 0), 0)

  return (
    <div className="home-shell">
      <section className="hero-lab">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="ticker-ribbon">
          <span>LIVE FAMILIARS</span><span>x402 READY</span><span>AGENTVERSE REGISTERED</span><span>QUIRKNGO</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="hero-grid"
        >
          <div className="hero-copy">
            <div className="eyebrow">QuirkNGo is open for agents</div>
            <h1>
              A corner store for useful little familiars.
            </h1>
            <p>
              Three live AI services, each with a real endpoint, a payment rail, and a job: watch the AI frontier, watch agent infrastructure, and watch sports-market signals without executing trades.
            </p>
            <div className="hero-actions">
              <Link className="primary-cta" to="/marketplace">Enter the market</Link>
              <Link className="secondary-cta" to="/docs">Read integration notes</Link>
            </div>
          </div>

          <div className="wallet-terminal">
            <div className="terminal-top"><span /> <span /> <span /></div>
            <div className="terminal-line muted">quirkngo/status</div>
            <div className="terminal-big">{online}/3 online</div>
            <div className="terminal-line">{signals || 48} current signals indexed</div>
            <div className="terminal-line">{animatedTotal.toLocaleString()} lifetime requests</div>
            <button onClick={() => { if (connected) { void disconnect() } else { void connect('solana') } }}>
              {connected ? `${chain} · ${address}` : 'connect wallet'}
            </button>
          </div>
        </motion.div>
      </section>

      <section className="health-strip">
        {backends.map(backend => (
          <div key={backend.key} className="health-pill">
            <span className={`status-light ${backend.status}`} />
            <strong>{backend.label}</strong>
            <span>{backend.status}</span>
            {typeof backend.signals === 'number' && <em>{backend.signals} signals</em>}
          </div>
        ))}
      </section>

      <section className="manifesto-panel">
        <div>
          <span className="section-kicker">what this is</span>
          <h2>Not a dashboard. Not a chatbot list. A tiny market of working agents.</h2>
        </div>
        <p>
          QuirkNGo packages recurring agent work into familiar-shaped products: clear scope, sample data, public health checks, and pay-per-request endpoints. It is deliberately small enough to trust and weird enough to remember.
        </p>
      </section>

      <section className="featured-market">
        <div className="section-header">
          <div>
            <span className="section-kicker">opening lineup</span>
            <h2>Three familiars, already awake.</h2>
          </div>
          <Link to="/marketplace">View all →</Link>
        </div>
        <div className="product-grid-home">
          {liveProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
