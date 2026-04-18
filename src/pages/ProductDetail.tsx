import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveData } from '../context/LiveDataContext'
import { useIsMobile } from '../hooks/useIsMobile'
import TrustBadge from '../components/TrustBadge'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const { liveProducts } = useLiveData()
  const isMobile = useIsMobile()
  const product = liveProducts.find(p => p.id === id)
  const [copied, setCopied] = useState(false)

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
              Sample Output
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
              {product.sample_output}
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
              marginBottom: 24,
            }}>
              via x402 micropayment
            </div>

            <motion.button
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
              Buy via x402
            </motion.button>

            <div style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Pay per request · No subscription
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TrustBadge label="Uptime" value={`${product.uptime}%`} good={product.uptime > 95} />
              <TrustBadge label="Hit Rate" value={`${product.hit_rate}%`} good={product.hit_rate > 60} />
              <TrustBadge label="Trust" value={`${product.trust_score}/100`} good={product.trust_score > 75} />
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
