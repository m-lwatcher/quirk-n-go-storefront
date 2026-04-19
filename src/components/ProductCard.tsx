import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import type { LiveProduct } from '../hooks/useLiveData'
import TrustBadge from './TrustBadge'

interface Props {
  product: Product | LiveProduct
  index: number
}

export default function ProductCard({ product, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          padding: 24,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border-glow)'
            el.style.background = 'var(--bg-card-hover)'
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = '0 8px 32px rgba(0, 224, 255, 0.06)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border-subtle)'
            el.style.background = 'var(--bg-card)'
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Top glow line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
            opacity: 0.3,
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{product.familiar_emoji}</span>
              <div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}>
                  {product.name}
                </h3>
                <span style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}>
                  by {product.familiar_name}
                </span>
              </div>
            </div>
            <CategoryBadge category={product.category} />
          </div>

          {/* Description */}
          <p style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <TrustBadge label="Uptime" value={`${product.uptime}%`} good={product.uptime > 95} />
            <TrustBadge label="Hit Rate" value={`${product.hit_rate}%`} good={product.hit_rate > 60} />
            <TrustBadge label="Updated" value={product.last_updated} good />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <EndpointBadge endpoint={product.endpoint_url} />
          </div>
          <div style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            marginBottom: 16,
            letterSpacing: '0.2px',
          }}>
            scanner-only • pay-per-request • no auto-execution
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--accent-cyan)',
            }}>
              {product.price}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              {'status' in product && (
                <span style={{
                  fontSize: 9,
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  background: product.status === 'online' ? 'rgba(52,211,153,0.15)' : product.status === 'degraded' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
                  color: product.status === 'online' ? '#34d399' : product.status === 'degraded' ? '#fbbf24' : '#f87171',
                }}>
                  {product.status}
                </span>
              )}
              <StatusDot status={'status' in product ? product.status : 'online'} />
              {('requests_live' in product ? product.requests_live : product.requests_24h).toLocaleString()} req/24h
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    sports: '#34d399',
    crypto: '#a78bfa',
    security: '#f87171',
    stocks: '#ffb347',
    pokemon: '#f472b6',
    ai: '#60a5fa',
    gaming: '#4ade80',
    creative: '#c084fc',
    commodities: '#fbbf24',
    tax: '#f59e0b',
    infra: '#22c55e',
  }
  const color = colors[category] || '#00e0ff'
  return (
    <span style={{
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      color,
      background: `${color}15`,
      padding: '3px 10px',
      borderRadius: 6,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {category}
    </span>
  )
}

function inferEndpointMeta(endpoint: string) {
  const e = endpoint.toLowerCase()
  if (e.includes(':18801')) return { chain: 'Base', status: 'Live', color: '#60a5fa' }
  if (e.includes(':18800')) return { chain: 'Solana', status: 'Live', color: '#34d399' }
  return { chain: 'Planned', status: 'Planned', color: '#a1a1aa' }
}

function EndpointBadge({ endpoint }: { endpoint: string }) {
  const meta = inferEndpointMeta(endpoint)
  return (
    <>
      <span style={{
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: meta.color,
        background: `${meta.color}15`,
        padding: '4px 10px',
        borderRadius: 6,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}>
        {meta.chain}
      </span>
      <span style={{
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: meta.status === 'Live' ? '#34d399' : '#a1a1aa',
        background: meta.status === 'Live' ? 'rgba(52,211,153,0.15)' : 'rgba(161,161,170,0.15)',
        padding: '4px 10px',
        borderRadius: 6,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}>
        {meta.status}
      </span>
    </>
  )
}

function StatusDot({ status = 'online' }: { status?: string }) {
  const color = status === 'online' ? 'var(--accent-green)' : status === 'degraded' ? '#fbbf24' : '#f87171'
  return (
    <span style={{
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: color,
      display: 'inline-block',
      animation: status === 'online' ? 'pulse 2s ease-in-out infinite' : 'none',
    }} />
  )
}
