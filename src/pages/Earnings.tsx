import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

const sidebarItems = [
  { icon: '🤖', label: 'My Familiars', to: '/dashboard' },
  { icon: '💰', label: 'Earnings', to: '/earnings' },
  { icon: '📊', label: 'Analytics', to: '/dashboard' },
  { icon: '⚙️', label: 'Settings', to: '/dashboard' },
]

const earningsByProduct = [
  { name: 'Sports Betting Signals', revenue: '$52.18', requests: '12,840', avgPrice: '$0.004' },
  { name: 'Crypto & AI Intel Alerts', revenue: '$34.92', requests: '24,100', avgPrice: '$0.001' },
  { name: 'Stock & Market Analysis', revenue: '$22.67', requests: '9,450', avgPrice: '$0.002' },
  { name: 'Security Vulnerability Findings', revenue: '$11.84', requests: '3,200', avgPrice: '$0.004' },
  { name: 'Natural Gas Market Scanner', revenue: '$4.01', requests: '890', avgPrice: '$0.005' },
  { name: 'Statement & Speech Scanner', revenue: '$1.81', requests: '620', avgPrice: '$0.003' },
]

const topBuyers = [
  { id: 'Buyer #1', requests: 4218, spent: '$38.12' },
  { id: 'Buyer #2', requests: 2904, spent: '$24.67' },
  { id: 'Buyer #3', requests: 1832, spent: '$18.40' },
  { id: 'Buyer #4', requests: 1205, spent: '$12.05' },
  { id: 'Buyer #5', requests: 891, spent: '$8.91' },
]

const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const chartValues = [14.2, 18.7, 12.1, 22.4, 19.8, 24.3, 15.9]
const chartMax = Math.max(...chartValues)

export default function Earnings() {
  const location = useLocation()
  const isMobile = useIsMobile()

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          width: isMobile ? '100%' : 240,
          background: 'var(--bg-secondary)',
          borderRight: isMobile ? 'none' : '1px solid var(--border-subtle)',
          borderBottom: isMobile ? '1px solid var(--border-subtle)' : 'none',
          padding: '32px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: 16,
          paddingLeft: 12,
        }}>
          Dashboard
        </div>
        {sidebarItems.map(item => {
          const isActive = location.pathname === item.to
          return (
            <Link key={item.label} to={item.to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                marginBottom: 4,
                cursor: 'pointer',
                background: isActive ? 'var(--accent-cyan-dim)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: 14,
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
              }}>
                <span>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          )
        })}
      </motion.aside>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ flex: 1, padding: isMobile ? '28px 20px' : '48px 40px', maxWidth: 960 }}
      >
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          marginBottom: 8,
        }}>
          Earnings
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          marginBottom: 40,
        }}>
          Track revenue from your AI familiars and data products.
        </p>

        {/* Top stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {[
            { label: 'Total Earned', value: '$127.43', icon: '💰', color: 'var(--accent-cyan)' },
            { label: 'This Week', value: '$24.30', icon: '📈', color: 'var(--accent-green)' },
            { label: 'Total Requests', value: '51,100', icon: '📊', color: 'var(--accent-amber)' },
            { label: 'Active Products', value: '6', icon: '🏪', color: '#a78bfa' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: stat.color,
                marginBottom: 4,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart area */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          padding: 28,
          marginBottom: 32,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <h2 style={{
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }}>
              Revenue This Week
            </h2>
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-green)',
              background: 'rgba(52, 211, 153, 0.08)',
              padding: '4px 10px',
              borderRadius: 6,
            }}>
              +18.3% vs last week
            </span>
          </div>

          {/* Bar chart */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            height: 160,
            paddingBottom: 28,
            borderBottom: '1px solid var(--border-subtle)',
            position: 'relative',
          }}>
            {/* Y-axis labels */}
            {[25, 20, 15, 10, 5, 0].map(val => (
              <div key={val} style={{
                position: 'absolute',
                left: -36,
                bottom: 28 + (val / 25) * 132,
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                ${val}
              </div>
            ))}
            {/* Grid lines */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((pct, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 28 + pct * 132,
                height: 1,
                background: 'var(--border-subtle)',
              }} />
            ))}
            {/* Bars */}
            {chartDays.map((day, i) => (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: (chartValues[i] / chartMax) * 132 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{
                    width: '100%',
                    maxWidth: 40,
                    background: 'linear-gradient(180deg, var(--accent-cyan), rgba(0, 224, 255, 0.3))',
                    borderRadius: '6px 6px 2px 2px',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: -18,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 9,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-cyan)',
                    whiteSpace: 'nowrap',
                  }}>
                    ${chartValues[i].toFixed(0)}
                  </div>
                </motion.div>
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  position: 'absolute',
                  bottom: 8,
                }}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings by product */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          padding: 28,
          marginBottom: 32,
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            marginBottom: 20,
          }}>
            Earnings by Product
          </h2>

          {/* Header */}
          <div style={{
            display: isMobile ? 'none' : 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 12,
            padding: '0 0 12px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 8,
          }}>
            {['Product', 'Revenue', 'Requests', 'Avg Price'].map(h => (
              <div key={h} style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {earningsByProduct.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < earningsByProduct.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                alignItems: 'center',
              }}
            >
              <div style={{
                fontSize: 13,
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}>
                {item.name}
              </div>
              <div style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
              }}>
                {item.revenue}
              </div>
              <div style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}>
                {item.requests}
              </div>
              <div style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}>
                {item.avgPrice}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom row: Top Buyers + Wallet */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
          {/* Top Buyers */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
          }}>
            <h2 style={{
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              marginBottom: 16,
            }}>
              Top Buyers
            </h2>
            {topBuyers.map((buyer, i) => (
              <div key={buyer.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < topBuyers.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--accent-cyan-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                  }}>
                    {buyer.id}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                  }}>
                    {buyer.spent}
                  </div>
                  <div style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}>
                    {buyer.requests.toLocaleString()} req
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Wallet */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
          }}>
            <h2 style={{
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              marginBottom: 20,
            }}>
              Wallet
            </h2>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              padding: 20,
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
                Connected Wallet
              </div>
              <div style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}>
                8AQg...zJva
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                Solana Mainnet
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 12,
            }}>
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                padding: 16,
              }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.5px',
                  marginBottom: 6,
                }}>
                  SOL Balance
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                }}>
                  0.238
                </div>
              </div>
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                padding: 16,
              }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.5px',
                  marginBottom: 6,
                }}>
                  USDC Earned
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-cyan)',
                }}>
                  $127.43
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              background: 'rgba(0, 224, 255, 0.04)',
              borderRadius: 10,
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}>
                Payment Method
              </div>
              <div style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                fontWeight: 500,
              }}>
                x402 Micropayments
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
