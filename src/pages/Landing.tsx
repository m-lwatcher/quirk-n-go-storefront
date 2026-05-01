import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLiveData } from '../context/LiveDataContext'
import { useAnimatedCounter } from '../hooks/useLiveData'
import { useWallet } from '../context/WalletContext'
import ProductCard from '../components/ProductCard'

const jobCards = [
  {
    step: '01',
    title: 'Choose the job',
    copy: 'Tell the familiar what part of the world to watch: AI news, sports edges, local demand, market signals, anything with repeatable patterns.',
  },
  {
    step: '02',
    title: 'It watches for patterns',
    copy: 'The familiar checks the messy sources on a schedule, notices useful changes, and turns noise into a small, readable signal.',
  },
  {
    step: '03',
    title: 'Route the next action',
    copy: 'Send the output to a dashboard, another agent, a webhook, or a pay-per-use endpoint. The payment rails stay behind the curtain.',
  },
]

const plainExamples = [
  'A bar owner gets a weekend opportunity brief before staffing decisions.',
  'A trader gets scanner-only signals without handing the familiar a wallet.',
  'An AI builder gets protocol changes as clean agent-readable payloads.',
]

export default function Landing() {
  const { liveProducts, totalRequests, backends } = useLiveData()
  const animatedTotal = useAnimatedCounter(totalRequests)
  const { connected, address, chain, connect, disconnect } = useWallet()
  const online = backends.filter(b => b.status === 'online').length
  const signals = backends.reduce((sum, b) => sum + (b.signals || 0), 0)

  return (
    <div className="home-shell">
      <section className="hero-lab hero-lab--simple">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="ticker-ribbon">
          <span>LIVE FAMILIARS</span><span>WATCH</span><span>NOTICE</span><span>ROUTE</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="hero-grid"
        >
          <div className="hero-copy">
            <div className="eyebrow">Familiars with jobs</div>
            <h1>
              Put a tiny worker on the signals you keep missing.
            </h1>
            <p>
              QuirkNGo lets you deploy AI familiars that watch one messy corner of the world, spot useful patterns, and tell the right person, agent, or system what to do next.
            </p>
            <div className="hero-actions">
              <Link className="primary-cta" to="/create">Create a familiar</Link>
              <Link className="secondary-cta" to="/marketplace">Browse live examples</Link>
            </div>
            <div className="plain-proof" aria-label="Plain language examples">
              {plainExamples.map(example => <span key={example}>{example}</span>)}
            </div>
          </div>

          <div className="wallet-terminal job-terminal">
            <div className="terminal-top"><span /> <span /> <span /></div>
            <div className="terminal-line muted">today’s live shelf</div>
            <div className="terminal-big">{online}/3 awake</div>
            <div className="terminal-line">{signals || 48} signals currently indexed</div>
            <div className="terminal-line">{animatedTotal.toLocaleString()} requests served</div>
            <div className="job-terminal__recipe">
              <span>watch</span>
              <span>→</span>
              <span>detect</span>
              <span>→</span>
              <span>route</span>
            </div>
            <button onClick={() => { if (connected) { void disconnect() } else { void connect('solana') } }}>
              {connected ? `${chain} · ${address}` : 'optional wallet test'}
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

      <section className="manifesto-panel manifesto-panel--plain">
        <div>
          <span className="section-kicker">the simple pitch</span>
          <h2>Your best signals already wrote the playbook. A familiar watches for the pattern.</h2>
        </div>
        <p>
          This is not a chatbot directory and it is not a crypto storefront with friendlier colors. Each familiar has a plain job: what it watches, what it produces, who it helps, where the answer goes, and what it is not allowed to do.
        </p>
      </section>

      <section className="job-map" aria-label="How QuirkNGo works">
        {jobCards.map((card, index) => (
          <motion.article
            key={card.step}
            className="job-map-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <span>{card.step}</span>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </motion.article>
        ))}
      </section>

      <section className="featured-market">
        <div className="section-header">
          <div>
            <span className="section-kicker">live examples</span>
            <h2>Four familiars already doing the job.</h2>
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
