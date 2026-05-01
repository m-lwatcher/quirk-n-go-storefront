import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveData } from '../context/LiveDataContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { useProductPreview } from '../hooks/useProductPreview'
import { useWallet } from '../context/WalletContext'
import { buildBasePayment } from '../lib/x402Base'
import { buildSolanaPaymentAuthorization, isLegacySolanaPaymentRequest } from '../lib/x402Solana'
import TrustBadge from '../components/TrustBadge'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const { liveProducts, backends } = useLiveData()
  const isMobile = useIsMobile()
  const product = liveProducts.find(p => p.id === id)
  const [copied, setCopied] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<{ loading: boolean; status: 'idle' | 'ready' | 'paid' | 'error'; details: any | null; error: string | null; unlocked: any | null }>({
    loading: false,
    status: 'idle',
    details: null,
    error: null,
    unlocked: null,
  })
  const preview = useProductPreview(product?.endpoint_url || '')
  const { connected, address, rawAddress, chain, walletName, solanaProvider, connect, error: walletError } = useWallet()

  if (!product) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Product not found</h1>
        <Link to="/marketplace" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          ← Back to marketplace
        </Link>
      </div>
    )
  }

  const related = liveProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(product.endpoint_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUnlock = async (solanaProviderKey?: 'jupiter') => {
    const preferredChain = product.chain === 'base' ? 'base' : 'solana'
    let activeChain = chain
    let activeRawAddress = rawAddress
    let activeSolanaProvider = solanaProvider

    setPaymentState({ loading: true, status: 'idle', details: null, error: null, unlocked: null })
    try {
      if (!connected || chain !== preferredChain || solanaProviderKey) {
        const session = await connect(preferredChain, solanaProviderKey ? { solanaProviderKey } : undefined)
        activeChain = session.chain
        activeRawAddress = session.rawAddress
        activeSolanaProvider = session.solanaProvider || null
      }
    } catch (err) {
      setPaymentState({ loading: false, status: 'error', details: null, error: err instanceof Error ? err.message : 'Wallet connection failed', unlocked: null })
      return
    }

    try {
      const res = await fetch(product.endpoint_url)
      const text = await res.text()
      let parsed: any = null
      try { parsed = JSON.parse(text) } catch {}

      if (res.status !== 402) {
        setPaymentState({ loading: false, status: 'error', details: parsed, error: `Expected 402 but got ${res.status}`, unlocked: null })
        return
      }

      const details = parsed || { status: 402, raw: text }

      if (isLegacySolanaPaymentRequest(details)) {
        if (!activeSolanaProvider) throw new Error('No Solana wallet provider selected')
        const { header, signature } = await buildSolanaPaymentAuthorization(details, activeSolanaProvider)
        const paid = await fetch(product.endpoint_url, { headers: { 'X-Payment-Authorization': header } })
        const paidText = await paid.text()
        let paidParsed: any = null
        try { paidParsed = JSON.parse(paidText) } catch { paidParsed = paidText }

        if (paid.ok) {
          setPaymentState({ loading: false, status: 'paid', details: { ...details, signature }, error: null, unlocked: paidParsed })
          return
        }

        setPaymentState({ loading: false, status: 'ready', details: { ...details, signature }, error: `Payment sent, but endpoint retry returned ${paid.status}`, unlocked: paidParsed })
        return
      }

      if ((activeChain || '').toLowerCase() === 'base' && activeRawAddress && window.ethereum) {
        const requirements = details?.accepts?.[0]
        const { header } = await buildBasePayment(requirements, activeRawAddress, window.ethereum)
        const paid = await fetch(product.endpoint_url, { headers: { 'X-PAYMENT': header } })
        const paidText = await paid.text()
        let paidParsed: any = null
        try { paidParsed = JSON.parse(paidText) } catch { paidParsed = paidText }
        if (paid.ok) {
          setPaymentState({ loading: false, status: 'paid', details, error: null, unlocked: paidParsed })
          return
        }
        setPaymentState({ loading: false, status: 'ready', details, error: `Signed payment retry returned ${paid.status}`, unlocked: paidParsed })
        return
      }

      setPaymentState({ loading: false, status: 'ready', details, error: null, unlocked: null })
    } catch (err) {
      setPaymentState({ loading: false, status: 'error', details: null, error: err instanceof Error ? err.message : 'request failed', unlocked: null })
    }
  }

  const handleCopySnippet = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSnippet(key)
    setTimeout(() => setCopiedSnippet(null), 2000)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 32, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
      >
        <Link to="/marketplace" style={{ color: 'var(--text-secondary)' }}>Marketplace</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? 28 : 48, alignItems: 'start' }}>
        {/* Main content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 48 }}>{product.familiar_emoji}</span>
            <div>
              <h1 style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                marginBottom: 4,
              }}>
                {product.name}
              </h1>
              <span style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
              by {product.familiar_name}
              </span>
              {'status' in product && (
                <span style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  background: product.status === 'online' ? 'rgba(52,211,153,0.15)' : product.status === 'degraded' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
                  color: product.status === 'online' ? '#34d399' : product.status === 'degraded' ? '#fbbf24' : '#f87171',
                  marginLeft: 8,
                }}>
                  ● {product.status}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            marginBottom: 32,
          }}>
            {product.description}
          </p>

          {/* Trust block */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Trust Signals
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 20 }}>
              <TrustMetric label="Uptime" value={`${product.uptime}%`} />
              <TrustMetric label="Hit Rate" value={`${product.hit_rate}%`} />
              <TrustMetric label="Trust Score" value={`${product.trust_score}/100`} />
              <TrustMetric label="Last Updated" value={product.last_updated} />
              <TrustMetric label="24h Requests" value={product.requests_24h.toLocaleString()} />
              <TrustMetric label="Total Requests" value={product.total_requests.toLocaleString()} />
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Update Frequency</span>
                <span style={{ color: 'var(--text-secondary)' }}>{product.update_frequency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Data Source</span>
                <span style={{ color: 'var(--text-secondary)', textAlign: 'right', maxWidth: '60%' }}>{product.data_source}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Curation</span>
                <span style={{
                  color: product.curation_type === 'human-reviewed' ? 'var(--accent-green)' : product.curation_type === 'hybrid' ? 'var(--accent-amber)' : 'var(--text-secondary)',
                  textTransform: 'capitalize',
                }}>{product.curation_type}</span>
              </div>
            </div>
          </div>

          {/* How to use */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Endpoint Usage
            </h3>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              This product is sold behind an x402 micropayment flow. First request the endpoint normally. The server responds with <code style={{ fontFamily: 'var(--font-mono)' }}>402 Payment Required</code> and payment instructions. Your client signs a payment on the listed rail, then retries with the payment header.
            </div>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              background: 'var(--bg-primary)',
              padding: 16,
              borderRadius: 12,
              overflow: 'auto',
              lineHeight: 1.6,
              border: '1px solid var(--border-subtle)',
              marginBottom: 12,
            }}>{`# 1) probe the endpoint
curl -i ${product.endpoint_url}

# 2) receive 402 Payment Required
# 3) build/sign payment for the ${product.endpoint_url.includes(':18801') ? 'Base' : product.endpoint_url.includes(':18800') ? 'Solana' : 'configured'} rail
# 4) retry with X-PAYMENT header`}</pre>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              background: 'var(--bg-primary)',
              padding: 16,
              borderRadius: 12,
              overflow: 'auto',
              lineHeight: 1.6,
              border: '1px solid var(--border-subtle)',
            }}>{`const res = await fetch('${product.endpoint_url}')
// expect 402 with payment instructions
// sign payment client-side
// retry with headers: { 'X-PAYMENT': '<signed-payment>' }`}</pre>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Product Trust Notes
            </h3>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {product.category === 'sports' && 'Sports products are scanner and signal feeds, not auto-betting services. They are meant to support research and decision-making, not replace judgment.'}
              {product.category === 'security' && 'Security products may be empty when no credible findings exist. That is a trust feature, not a bug — no filler vulnerabilities just to keep the feed busy.'}
              {product.category === 'crypto' && product.id === 'statement-scanner' && 'Statement and speech products are research feeds. They flag markets worth investigating, not guaranteed edges or execution advice.'}
              {product.category === 'crypto' && product.id !== 'statement-scanner' && 'Intel feeds are live alert streams, not guaranteed alpha. Their job is to surface potentially important signals quickly and transparently.'}
              {product.id === 'gas-commodities' && 'Commodities products are research-first. Always verify the exact settlement source, benchmark wording, and timing before putting capital behind a thesis.'}
              {product.category === 'ai' && 'AI model intel products are monitoring feeds. They help you notice releases, pricing shifts, and benchmark changes earlier, but still need human interpretation.'}
              {product.category === 'creative' && 'Creative trend products surface demand signals and market patterns. They are directional inputs, not guaranteed revenue forecasts.'}
              {product.category === 'gaming' && 'Gaming intel products track narrative and release-driven signals. They are best treated as a monitored feed, not a certainty machine.'}
              {product.category === 'pokemon' && 'Card-market products surface price movement and demand changes. Use them as structured scouting, not as guaranteed buy/sell advice.'}
              {product.category === 'stocks' && product.id !== 'gas-commodities' && 'Market analysis products are structured research tools. They organize signals and timing, but they do not replace your own risk management.'}
              {product.category === 'tax' && 'Tax products are operational reminders and structured guidance, not legal or CPA advice. Use them to stay ahead of deadlines and obvious operator mistakes.'}
              {product.category === 'infra' && 'Infrastructure intel products track important rails and standards early, but they are still a monitored feed — not a promise that every signal will matter commercially.'}
            </div>
          </div>

          {/* Live preview status */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Live Preview Status
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <PreviewPill kind={preview.kind || 'error'} />
              {preview.error && <PreviewMeta label={preview.error} />}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {preview.loading && 'Checking the live endpoint now.'}
              {!preview.loading && preview.kind === 'payment-required' && 'Endpoint is live and correctly returning 402 Payment Required before access.'}
              {!preview.loading && preview.kind === 'live' && 'Endpoint returned live data directly to the storefront preview.'}
              {!preview.loading && preview.kind === 'planned' && 'This route is still planned, so the page is showing a stored payload-shaped preview.'}
              {!preview.loading && preview.kind === 'error' && 'The live route did not return a clean preview just now, so the page may fall back to the stored example.'}
            </div>
          </div>

          {paymentState.status === 'paid' && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
            }}>
              <h3 style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                Unlocked Response
              </h3>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                background: 'var(--bg-primary)',
                padding: 16,
                borderRadius: 12,
                overflow: 'auto',
                lineHeight: 1.6,
                border: '1px solid var(--border-subtle)',
              }}>{typeof paymentState.unlocked === 'string' ? paymentState.unlocked : JSON.stringify(paymentState.unlocked, null, 2)}</pre>
            </div>
          )}

          {paymentState.status === 'ready' && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
            }}>
              <h3 style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                Signing-Ready Request
              </h3>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                This is the browser-side request object the final signing step will consume. It is pulled from the real x402 402 response, not a guessed placeholder.
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                background: 'var(--bg-primary)',
                padding: 16,
                borderRadius: 12,
                overflow: 'auto',
                lineHeight: 1.6,
                border: '1px solid var(--border-subtle)',
              }}>{JSON.stringify(buildSigningRequest(product.endpoint_url, paymentState.details), null, 2)}</pre>
            </div>
          )}

          {/* Developer handoff */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Use This In Your App
            </h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
              <DevCard
                title="Endpoint"
                value={product.endpoint_url}
                copied={copiedSnippet === 'endpoint'}
                onCopy={() => handleCopySnippet('endpoint', product.endpoint_url)}
              />
              <DevCard
                title="Curl Probe"
                value={`curl -i ${product.endpoint_url}`}
                copied={copiedSnippet === 'curl'}
                onCopy={() => handleCopySnippet('curl', `curl -i ${product.endpoint_url}`)}
              />
              <DevCard
                title="Fetch Starter"
                value={`const res = await fetch('${product.endpoint_url}')`}
                copied={copiedSnippet === 'fetch'}
                onCopy={() => handleCopySnippet('fetch', `const res = await fetch('${product.endpoint_url}')`)}
              />
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}>
              Quick integration summary: hit the endpoint, expect a 402 on protected routes, sign the payment on the listed rail, then retry with the listed payment header.
            </div>
          </div>

          {/* Live data summary */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Live Data Summary
            </h3>
            <LiveSummary preview={preview} />
          </div>

          {/* Sample output */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}>
            <h3 style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Recent Payload Preview
            </h3>
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
            }}>
              {preview.loading
                ? 'Loading live preview...'
                : preview.data
                  ? JSON.stringify(preview.data, null, 2)
                  : product.sample_output}
            </pre>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Purchase card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: 16,
            padding: 28,
            position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? 0 : 88,
          }}>
            {/* Top glow */}
            <div style={{
              position: 'absolute',
              top: -1,
              left: '15%',
              right: '15%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
              borderRadius: 2,
            }} />

            <div style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              marginBottom: 4,
            }}>
              {product.price}
            </div>
            <div style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: 16,
            }}>
              via x402 micropayment
            </div>

            <div style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: 20,
            }}>
              You get paid access to this live data product on the listed rail. This unlocks endpoint access only — it does not hand over wallet control or auto-execute trades for you.
            </div>

            <motion.button
              onClick={() => handleUnlock()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                background: 'var(--accent-cyan)',
                color: '#0a0b0f',
                border: 'none',
                padding: '14px 0',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
                marginBottom: 12,
              }}
            >
              {paymentState.loading ? 'Working…' : !connected || chain !== (product.chain === 'base' ? 'base' : 'solana') ? `Connect ${product.chain === 'base' ? 'Base' : 'Solana'} Wallet` : 'Unlock Endpoint'}
            </motion.button>

            {product.chain !== 'base' && (
              <button
                onClick={() => handleUnlock('jupiter')}
                disabled={paymentState.loading}
                style={{
                  width: '100%',
                  background: 'rgba(243, 197, 107, 0.10)',
                  color: 'var(--accent-amber)',
                  border: '1px solid rgba(243, 197, 107, 0.32)',
                  padding: '11px 0',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: paymentState.loading ? 'not-allowed' : 'pointer',
                  marginBottom: 12,
                }}
              >
                Connect / Pay with Jupiter
              </button>
            )}

            <div style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: 16,
            }}>
              {connected ? `${walletName || chain} connected · ${address}` : 'Pay per request · No subscription · BYO wallet/client'}
            </div>

            {walletError && (
              <div style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.18)',
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                fontSize: 12,
                color: '#fca5a5',
              }}>
                {walletError}
              </div>
            )}

            {paymentState.status !== 'idle' && (
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: paymentState.status === 'paid' || paymentState.status === 'ready' ? '#34d399' : '#f87171',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  {paymentState.status === 'paid' ? 'Endpoint Unlocked' : paymentState.status === 'ready' ? 'Payment Required Detected' : 'Unlock Flow Error'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: paymentState.status === 'ready' || paymentState.status === 'paid' ? 10 : 0 }}>
                  {paymentState.status === 'paid'
                    ? 'The endpoint accepted the signed wallet payment and returned live unlocked data.'
                    : paymentState.status === 'ready'
                    ? 'The endpoint responded with a protected access flow. Sign the payment with the connected wallet, then retry with the listed payment header.'
                    : paymentState.error}
                </div>
                {(paymentState.status === 'ready' || paymentState.status === 'paid') && (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <MiniKV label="Rail" value={String(extractPaymentDetails(paymentState.details).network || chain || 'unknown')} />
                    <MiniKV label="Asset" value={String(extractPaymentDetails(paymentState.details).asset || 'unknown')} />
                    <MiniKV label="Pay To" value={String(extractPaymentDetails(paymentState.details).payTo || 'unknown')} />
                    <MiniKV label="Max Amount" value={String(extractPaymentDetails(paymentState.details).maxAmountRequired || 'unknown')} />
                    <MiniKV label="Endpoint" value={product.endpoint_url} />
                    <MiniKV label="Header" value={extractPaymentDetails(paymentState.details).expectedHeader} />
                  </div>
                )}
              </div>
            )}

            <div style={{
              background: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.18)',
              borderRadius: 10,
              padding: 12,
              marginBottom: 24,
            }}>
              <div style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                Trust Framework
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                Live endpoint • Recent payload preview • Scanner-only intelligence product • No auto-execution on purchase
              </div>
            </div>

            {/* Endpoint */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 14,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                API Endpoint
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <code style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {product.endpoint_url}
                </code>
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Quick trust */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <TrustBadge label="Uptime" value={`${product.uptime}%`} good={product.uptime > 95} />
              <TrustBadge label="Hit Rate" value={`${product.hit_rate}%`} good={product.hit_rate > 60} />
              <TrustBadge label="Trust" value={`${product.trust_score}/100`} good={product.trust_score > 75} />
            </div>

            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 14,
            }}>
              <div style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                Live Status
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <EndpointPill endpoint={product.endpoint_url} kind="chain" backends={backends} />
                <EndpointPill endpoint={product.endpoint_url} kind="status" backends={backends} />
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}>
                Backed by a real x402 endpoint and scanner pipeline. Live routes are currently exposed on Base (:18801) and Solana (:18800). Purchases unlock data access only — they do not trigger autonomous trading or order execution.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <h2 style={{
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Related Products
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 280 : 340}px, 1fr))`,
            gap: 24,
          }}>
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function endpointMeta(endpoint: string, backends?: { key: 'base' | 'solana'; status: string }[]) {
  const e = endpoint.toLowerCase()
  if (e.includes(':18801')) {
    const state = backends?.find(b => b.key === 'base')?.status
    return { chain: 'Base', status: state === 'online' ? 'Live' : state === 'offline' ? 'Offline' : 'Checking', color: state === 'online' ? '#60a5fa' : state === 'offline' ? '#f87171' : '#fbbf24' }
  }
  if (e.includes(':18800')) {
    const state = backends?.find(b => b.key === 'solana')?.status
    return { chain: 'Solana', status: state === 'online' ? 'Live' : state === 'offline' ? 'Offline' : 'Checking', color: state === 'online' ? '#34d399' : state === 'offline' ? '#f87171' : '#fbbf24' }
  }
  return { chain: 'Planned', status: 'Planned', color: '#a1a1aa' }
}

function EndpointPill({ endpoint, kind, backends }: { endpoint: string; kind: 'chain' | 'status'; backends?: { key: 'base' | 'solana'; status: string }[] }) {
  const meta = endpointMeta(endpoint, backends)
  const label = kind === 'chain' ? meta.chain : meta.status
  const color = kind === 'status' && meta.status !== 'Live' ? '#a1a1aa' : meta.color
  return (
    <span style={{
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      color,
      background: `${color}15`,
      padding: '4px 10px',
      borderRadius: 6,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  )
}

function summarizePreview(data: unknown) {
  if (!data || typeof data !== 'object') return []
  const obj = data as Record<string, any>
  const rows: { label: string; value: string }[] = []

  const count = obj.count ?? obj.candidate_count ?? obj.research_count ?? null
  if (count !== null && count !== undefined) rows.push({ label: 'Items', value: String(count) })

  const generated = obj.generated_at ?? obj.updated_at ?? null
  if (generated) rows.push({ label: 'Updated', value: String(generated).replace('T', ' ').slice(0, 19) })

  const source = obj.source ?? null
  if (source) rows.push({ label: 'Source', value: String(source) })

  const scanType = obj.scan_type ?? null
  if (scanType) rows.push({ label: 'Type', value: String(scanType) })

  const firstList = obj.signals || obj.alerts || obj.findings || obj.markets || obj.research || null
  if (Array.isArray(firstList) && firstList.length > 0) {
    const first = firstList[0]
    if (first?.ticker) rows.push({ label: 'Sample ticker', value: String(first.ticker) })
    else if (first?.headline) rows.push({ label: 'Sample headline', value: String(first.headline) })
    else if (first?.repo) rows.push({ label: 'Sample repo', value: String(first.repo) })
  }

  return rows
}

function LiveSummary({ preview }: { preview: { loading: boolean; data: unknown | null; error: string | null; kind?: string } }) {
  const rows = summarizePreview(preview.data)
  if (preview.loading) {
    return <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Checking live endpoint…</div>
  }
  if (preview.kind === 'payment-required') {
    return <SummaryGrid rows={[{ label: 'State', value: '402 payment required' }, { label: 'Meaning', value: 'endpoint is live and protected' }]} />
  }
  if (rows.length === 0) {
    return <SummaryGrid rows={[{ label: 'State', value: preview.kind || 'unknown' }, { label: 'Message', value: preview.error || 'using stored preview' }]} />
  }
  return <SummaryGrid rows={rows} />
}

function SummaryGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
      {rows.map(row => (
        <div key={row.label} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
            {row.label}
          </div>
          <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
            {row.value}
          </div>
        </div>
      ))}
    </div>
  )
}

function extractPaymentDetails(details: any) {
  if (isLegacySolanaPaymentRequest(details)) {
    return {
      network: details.network,
      payTo: details.payment_address,
      asset: details.asset_address,
      maxAmountRequired: details.max_amount_required,
      resource: details.resource,
      scheme: details.asset_type,
      x402Version: 'legacy-solana',
      expectedHeader: 'X-Payment-Authorization',
    }
  }

  const accept = details?.accepts?.[0] || null
  return {
    network: accept?.network || null,
    payTo: accept?.payTo || null,
    asset: accept?.asset || null,
    maxAmountRequired: accept?.maxAmountRequired || accept?.amount || null,
    resource: accept?.resource || null,
    scheme: accept?.scheme || null,
    x402Version: details?.x402Version || null,
    expectedHeader: 'X-PAYMENT',
  }
}

function buildSigningRequest(endpoint: string, details: any) {
  const payment = extractPaymentDetails(details)
  return {
    endpoint,
    x402Version: payment.x402Version,
    scheme: payment.scheme,
    network: payment.network,
    resource: payment.resource || endpoint,
    payTo: payment.payTo,
    asset: payment.asset,
    maxAmountRequired: payment.maxAmountRequired,
    expectedHeader: payment.expectedHeader,
  }
}

function MiniKV({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text-secondary)', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

function DevCard({ title, value, copied, onCopy }: { title: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      padding: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {title}
        </span>
        <button
          onClick={onCopy}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.6 }}>
        {value}
      </code>
    </div>
  )
}

function PreviewPill({ kind }: { kind: 'live' | 'payment-required' | 'planned' | 'error' }) {
  const config = {
    live: { label: 'Live Data', color: '#34d399' },
    'payment-required': { label: '402 Ready', color: '#60a5fa' },
    planned: { label: 'Planned', color: '#a1a1aa' },
    error: { label: 'Preview Error', color: '#f87171' },
  }[kind]
  return (
    <span style={{
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      color: config.color,
      background: `${config.color}15`,
      padding: '4px 10px',
      borderRadius: 6,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    }}>
      {config.label}
    </span>
  )
}

function PreviewMeta({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
      background: 'rgba(255,255,255,0.04)',
      padding: '4px 10px',
      borderRadius: 6,
    }}>
      {label}
    </span>
  )
}

function TrustMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        letterSpacing: '0.5px',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-primary)',
      }}>
        {value}
      </div>
    </div>
  )
}
