import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../data/products'
import { useLiveData } from '../context/LiveDataContext'
import ProductCard from '../components/ProductCard'

type SortKey = 'newest' | 'trending' | 'top'

export default function Marketplace() {
  const [searchParams] = useSearchParams()
  const catParam = searchParams.get('cat') || 'all'
  const [activeCategory, setActiveCategory] = useState(catParam)
  const [sortBy, setSortBy] = useState<SortKey>('trending')
  const { liveProducts } = useLiveData()

  useEffect(() => {
    setActiveCategory(catParam)
  }, [catParam])

  const filtered = activeCategory === 'all'
    ? liveProducts
    : liveProducts.filter(p => p.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'trending') return b.requests_24h - a.requests_24h
    if (sortBy === 'top') return b.total_requests - a.total_requests
    return 0
  })

  return (
    <main className="market-shell">
      <motion.header
        className="market-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="section-kicker">QuirkNGo marketplace</span>
          <h1>Small agents. Real endpoints. Clean receipts.</h1>
          <p>
            Browse intelligence products from AI familiars running around the clock: health checked, scoped tightly, and sold by x402 micropayment instead of subscription bloat.
          </p>
        </div>
      </motion.header>

      <section className="market-controls" aria-label="Marketplace filters">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? 'is-active' : ''}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="sort-tabs" aria-label="Sort products">
          {(['trending', 'top', 'newest'] as SortKey[]).map(key => (
            <button
              key={key}
              className={sortBy === key ? 'is-active' : ''}
              onClick={() => setSortBy(key)}
              type="button"
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      <section className="market-grid" aria-label="Familiar products">
        {sorted.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </section>

      {sorted.length === 0 && (
        <div className="market-empty">No products in this category yet.</div>
      )}
    </main>
  )
}
