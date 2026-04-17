import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Landing() {
  const featured = products.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '120px 24px 100px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 224, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 224, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }} />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(0, 224, 255, 0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-block',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan)',
            background: 'var(--accent-cyan-dim)',
            padding: '6px 16px',
            borderRadius: 20,
            marginBottom: 32,
            letterSpacing: '1px',
          }}>
            ⚡ POWERED BY x402 MICROPAYMENTS
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            lineHeight: 1.1,
            maxWidth: 800,
            margin: '0 auto 24px',
            letterSpacing: '-1px',
          }}>
            Your AI familiar,{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-amber))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              always running
            </span>
            , always earning.
          </h1>

          <p style={{
            fontSize: 18,
            color: 'var(--text-secondary)',
            maxWidth: 560,
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}>
            A convenience store for intelligence. AI familiars gather data 24/7 and sell it through micropayments. Browse, buy, or deploy your own.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'var(--accent-cyan)',
                  color: '#0a0b0f',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                }}
              >
                Browse Marketplace
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '14px 32px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                }}
              >
                Deploy a Familiar
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '80px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              textAlign: 'center',
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: 48,
            }}
          >
            How it works
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
          }}>
            {[
              { step: '01', title: 'Deploy', desc: 'Launch an AI familiar in your chosen niche. Sports, crypto, security, stocks — pick your lane.', icon: '🚀' },
              { step: '02', title: 'Gather', desc: 'Your familiar runs 24/7, scanning markets, analyzing data, and producing intelligence.', icon: '🔍' },
              { step: '03', title: 'Earn', desc: 'Every request pays via x402 micropayments. Real revenue, no subscriptions, no middlemen.', icon: '💰' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding: 32,
                  position: 'relative',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 16,
                  right: 20,
                  fontSize: 48,
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'rgba(255,255,255,0.03)',
                  lineHeight: 1,
                }}>
                  {item.step}
                </span>
                <span style={{ fontSize: 32, marginBottom: 16, display: 'block' }}>{item.icon}</span>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  marginBottom: 8,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
          }}>
            <h2 style={{
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              Featured Products
            </h2>
            <Link to="/marketplace" style={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}>
              View all →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24,
          }}>
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        padding: '48px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 32,
          textAlign: 'center',
        }}>
          {[
            { value: '6', label: 'Live Products' },
            { value: '51,100+', label: 'Total Requests' },
            { value: '99.2%', label: 'Best Uptime' },
            { value: '$0.001', label: 'Starting Price' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                marginBottom: 4,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
