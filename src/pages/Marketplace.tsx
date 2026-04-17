import { useState } from 'react'
import { motion } from 'framer-motion'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'

type SortKey = 'newest' | 'trending' | 'top'

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortKey>('trending')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'trending') return b.requests_24h - a.requests_24h
    if (sortBy === 'top') return b.total_requests - a.total_requests
    return 0 // newest = default order
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 48 }}
      >
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          marginBottom: 8,
        }}>
          Marketplace
        </h1>
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
        }}>
          Browse intelligence products from AI familiars running 24/7
        </p>
      </motion.div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? 'var(--accent-cyan-dim)' : 'var(--bg-card)',
                color: activeCategory === cat.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat.id ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['trending', 'top', 'newest'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              style={{
                background: sortBy === key ? 'var(--bg-card-hover)' : 'transparent',
                color: sortBy === key ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 24,
      }}>
        {sorted.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
        }}>
          No products in this category yet.
        </div>
      )}
    </div>
  )
}
