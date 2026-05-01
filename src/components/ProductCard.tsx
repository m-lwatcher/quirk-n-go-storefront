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
  const requests = 'requests_live' in product ? product.requests_live : product.requests_24h
  const status = 'status' in product ? product.status : 'online'

  return (
    <motion.article
      className="product-card-frame"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link to={`/product/${product.id}`} className="product-card" aria-label={`Open ${product.name}`}>
        <div className="product-card__rail" />

        <header className="product-card__header">
          <div className="product-card__identity">
            {product.avatar_url ? (
              <img className="product-card__avatar" src={product.avatar_url} alt="" />
            ) : (
              <span className="product-card__emoji">{product.familiar_emoji}</span>
            )}
            <div className="product-card__titleblock">
              <h3>{product.name}</h3>
              <span>by {product.familiar_name}</span>
            </div>
          </div>
          <CategoryBadge category={product.category} />
        </header>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__badges" aria-label="Reliability metrics">
          <TrustBadge label="Uptime" value={`${product.uptime}%`} good={product.uptime > 95} />
          <TrustBadge label="Hit Rate" value={`${product.hit_rate}%`} good={product.hit_rate > 60} />
          <TrustBadge label="Updated" value={product.last_updated} good />
        </div>

        <div className="product-card__endpoint">
          <EndpointBadge endpoint={product.endpoint_url} />
          <span className="product-card__safety">scanner-only · no auto-execution</span>
        </div>

        <footer className="product-card__footer">
          <div>
            <span className="product-card__price">{product.price}</span>
            <span className="product-card__price-note">x402 protected endpoint</span>
          </div>
          <div className="product-card__traffic">
            {status && <StatusLabel status={status} />}
            <span>{requests.toLocaleString()} req/24h</span>
          </div>
        </footer>
      </Link>
    </motion.article>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const labels: Record<string, string> = {
    ai: 'AI Intel',
    infra: 'Infra',
    sports: 'Sports',
  }

  return <span className={`category-chip category-chip--${category}`}>{labels[category] || category}</span>
}

function inferEndpointMeta(endpoint: string) {
  const e = endpoint.toLowerCase()
  if (e.includes('aifieldnotes') || e.includes('infra.') || e.includes('sports.')) {
    return { chain: 'Solana USDC', status: '402 Live', tone: 'gold' }
  }
  if (e.includes(':18801')) return { chain: 'Base USDC', status: '402 Live', tone: 'blue' }
  if (e.includes(':18800')) return { chain: 'Solana USDC', status: '402 Live', tone: 'green' }
  return { chain: 'Planned', status: 'Planned', tone: 'muted' }
}

function EndpointBadge({ endpoint }: { endpoint: string }) {
  const meta = inferEndpointMeta(endpoint)
  return (
    <div className="endpoint-stack">
      <span className={`endpoint-chip endpoint-chip--${meta.tone}`}>{meta.chain}</span>
      <span className="endpoint-chip endpoint-chip--live">{meta.status}</span>
    </div>
  )
}

function StatusLabel({ status = 'online' }: { status?: string }) {
  return (
    <span className={`status-label status-label--${status}`}>
      <span />
      {status}
    </span>
  )
}
