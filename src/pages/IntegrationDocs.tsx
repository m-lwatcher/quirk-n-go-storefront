import { motion } from 'framer-motion'

const sections = [
  {
    title: 'How x402 access works',
    body: 'Quirk-N-Go products are sold behind x402 micropayments. Clients first request an endpoint normally, receive a 402 Payment Required response with payment instructions, sign a payment on the correct rail, and retry with an X-PAYMENT header.',
  },
  {
    title: 'Supported rails',
    body: 'Live products currently run on Base (:18801) and Solana (:18800). Product pages show which rail backs each endpoint.',
  },
  {
    title: 'What you are buying',
    body: 'You are buying access to data and intelligence products — not delegated execution. Scanner products and signal feeds do not auto-trade on your behalf when purchased.',
  },
]

export default function IntegrationDocs() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 24px 80px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Integration Docs
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 760 }}>
          Everything needed to understand and consume Quirk-N-Go x402 products. This is the boring but important layer: rails, requests, payment flow, trust boundaries, and example client usage.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
              {section.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {section.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
          Curl flow
        </h2>
        <pre style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-secondary)',
          background: 'var(--bg-primary)',
          padding: 20,
          borderRadius: 12,
          overflow: 'auto',
          lineHeight: 1.6,
          border: '1px solid var(--border-subtle)',
        }}>{`# Probe a product endpoint
curl -i http://57.129.120.19:18801/sports/signals

# Expect: 402 Payment Required
# Parse payment instructions from headers/body
# Build/sign client-side payment
# Retry with X-PAYMENT header`}</pre>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
          Fetch flow
        </h2>
        <pre style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-secondary)',
          background: 'var(--bg-primary)',
          padding: 20,
          borderRadius: 12,
          overflow: 'auto',
          lineHeight: 1.6,
          border: '1px solid var(--border-subtle)',
        }}>{`const probe = await fetch('http://57.129.120.19:18801/sports/signals')
if (probe.status === 402) {
  // read payment instructions
  // sign payment on Base or Solana
  const paid = await fetch('http://57.129.120.19:18801/sports/signals', {
    headers: { 'X-PAYMENT': '<signed-payment>' }
  })
  const data = await paid.json()
}`}</pre>
      </div>

      <div style={{
        background: 'rgba(52, 211, 153, 0.08)',
        border: '1px solid rgba(52, 211, 153, 0.18)',
        borderRadius: 16,
        padding: 24,
      }}>
        <h2 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: '#34d399', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
          Trust boundary
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Quirk-N-Go sells access to data, signal feeds, and scanner output. Buying endpoint access does not give Quirk autonomous control of your wallet, exchange, or brokerage account.
        </p>
      </div>
    </div>
  )
}
