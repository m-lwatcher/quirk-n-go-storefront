import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

const niches = [
  { id: 'sports', name: 'Sports', icon: '⚾', color: '#34d399' },
  { id: 'crypto', name: 'Crypto / AI Intel', icon: '🔮', color: '#a78bfa' },
  { id: 'security', name: 'Security', icon: '🛡️', color: '#f87171' },
  { id: 'stocks', name: 'Stocks', icon: '📈', color: '#ffb347' },
  { id: 'pokemon', name: 'Pokémon TCG', icon: '🎴', color: '#f472b6' },
  { id: 'ai', name: 'AI Intelligence', icon: '🧠', color: '#60a5fa' },
  { id: 'svg', name: 'SVG / Laser', icon: '✂️', color: '#c084fc' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#4ade80' },
]

const personalities = [
  { id: 'analytical', name: 'Analytical', icon: '🔬', desc: 'Data-driven, precise, methodical' },
  { id: 'playful', name: 'Playful', icon: '🎪', desc: 'Fun, engaging, personality-forward' },
  { id: 'sharp', name: 'Sharp / Direct', icon: '⚡', desc: 'No fluff, straight to the point' },
  { id: 'calm', name: 'Calm Researcher', icon: '📚', desc: 'Thorough, patient, deep-dive oriented' },
  { id: 'trend', name: 'Trend Hunter', icon: '🔥', desc: 'Fast-moving, hype-aware, first-to-know' },
]

const stepLabels = ['Name', 'Niche', 'Personality', 'Confirm', 'Deploy']

export default function CreateFamiliar() {
  const [step, setStep] = useState(0)
  const isMobile = useIsMobile()
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')
  const [personality, setPersonality] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [progress, setProgress] = useState(0)

  const selectedNiche = niches.find(n => n.id === niche)
  const selectedPersonality = personalities.find(p => p.id === personality)

  const canNext = step === 0 ? name.trim().length > 0
    : step === 1 ? niche !== ''
    : step === 2 ? personality !== ''
    : true

  const handleDeploy = () => {
    setDeploying(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setDeploying(false)
            setDeployed(true)
          }, 400)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 300)
  }

  const next = () => {
    if (step === 3) {
      setStep(4)
      setTimeout(handleDeploy, 500)
    } else if (step < 4) {
      setStep(s => s + 1)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '28px 16px' : '48px 24px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: i <= step ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: i === step ? 600 : 400,
              letterSpacing: '0.5px',
            }}>
              {label}
            </div>
          ))}
        </div>
        <div style={{
          height: 3,
          background: 'var(--bg-card)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${((step + 1) / stepLabels.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-amber))',
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && <StepName name={name} setName={setName} />}
          {step === 1 && <StepNiche niche={niche} setNiche={setNiche} />}
          {step === 2 && <StepPersonality personality={personality} setPersonality={setPersonality} />}
          {step === 3 && <StepConfirm name={name} niche={selectedNiche} personality={selectedPersonality} />}
          {step === 4 && <StepDeploy deploying={deploying} deployed={deployed} progress={Math.min(progress, 100)} name={name} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 4 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              background: 'transparent',
              color: step === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '10px 24px',
              borderRadius: 10,
              fontSize: 14,
              fontFamily: 'var(--font-display)',
              cursor: step === 0 ? 'default' : 'pointer',
              opacity: step === 0 ? 0.4 : 1,
            }}
          >
            ← Back
          </button>
          <motion.button
            whileHover={canNext ? { scale: 1.03 } : {}}
            whileTap={canNext ? { scale: 0.98 } : {}}
            onClick={next}
            disabled={!canNext}
            style={{
              background: canNext ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: canNext ? '#0a0b0f' : 'var(--text-muted)',
              border: 'none',
              padding: '10px 28px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              cursor: canNext ? 'pointer' : 'default',
            }}
          >
            {step === 3 ? 'Deploy Familiar ⚡' : 'Next →'}
          </motion.button>
        </div>
      )}
    </div>
  )
}

function StepName({ name, setName }: { name: string; setName: (v: string) => void }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        Name your familiar
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
        Give it something memorable. This is how buyers will find it in the marketplace.
      </p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Quirk Sports Desk"
        autoFocus
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '16px 20px',
          fontSize: 18,
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
      />
      <div style={{
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        marginTop: 12,
      }}>
        {name.trim().length > 0 ? `✓ "${name.trim()}"` : 'Enter a name to continue'}
      </div>
    </div>
  )
}

function StepNiche({ niche, setNiche }: { niche: string; setNiche: (v: string) => void }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        Choose a niche
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
        What kind of intelligence will your familiar specialize in?
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 12,
      }}>
        {niches.map(n => (
          <motion.button
            key={n.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNiche(n.id)}
            style={{
              background: niche === n.id ? `${n.color}15` : 'var(--bg-card)',
              border: `1px solid ${niche === n.id ? n.color + '40' : 'var(--border-subtle)'}`,
              borderRadius: 14,
              padding: '20px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 28 }}>{n.icon}</span>
            <span style={{
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              color: niche === n.id ? n.color : 'var(--text-primary)',
            }}>
              {n.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function StepPersonality({ personality, setPersonality }: { personality: string; setPersonality: (v: string) => void }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        Pick a personality
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
        How should your familiar communicate its findings?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {personalities.map(p => (
          <motion.button
            key={p.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setPersonality(p.id)}
            style={{
              background: personality === p.id ? 'var(--accent-cyan-dim)' : 'var(--bg-card)',
              border: `1px solid ${personality === p.id ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
              borderRadius: 14,
              padding: '18px 20px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 28 }}>{p.icon}</span>
            <div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                color: personality === p.id ? 'var(--accent-cyan)' : 'var(--text-primary)',
                marginBottom: 2,
              }}>
                {p.name}
              </div>
              <div style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                {p.desc}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function StepConfirm({ name, niche, personality }: {
  name: string
  niche?: typeof niches[number]
  personality?: typeof personalities[number]
}) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        Confirm your familiar
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
        Review everything before deploying. You can always change settings later.
      </p>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top glow */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', opacity: 0.3,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 48 }}>{niche?.icon || '🤖'}</span>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{name}</h2>
            <span style={{
              fontSize: 12, fontFamily: 'var(--font-mono)',
              color: niche?.color || 'var(--text-muted)',
            }}>
              {niche?.name} · {personality?.name}
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16,
        }}>
          {[
            { label: 'Niche', value: niche?.name || '—', icon: niche?.icon },
            { label: 'Personality', value: personality?.name || '—', icon: personality?.icon },
            { label: 'Payment', value: 'x402 micropayments', icon: '💳' },
            { label: 'Status', value: 'Ready to deploy', icon: '🟢' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg-secondary)',
              borderRadius: 10,
              padding: '14px 16px',
            }}>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: 6,
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 14, fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)', fontWeight: 500,
              }}>
                {item.icon} {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Mock product preview */}
        <div style={{
          marginTop: 20, paddingTop: 20,
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            fontSize: 11, fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 12,
          }}>
            PRODUCTS YOUR FAMILIAR WILL SELL
          </div>
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                {niche?.name} Signals
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Real-time alerts and analysis
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-cyan)',
            }}>
              $0.001 / req
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepDeploy({ deploying, deployed, progress, name }: {
  deploying: boolean; deployed: boolean; progress: number; name: string
}) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      {deploying && !deployed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            Deploying {name}...
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 32 }}>
            Setting up your familiar's intelligence pipeline
          </p>
          <div style={{
            maxWidth: 400, margin: '0 auto', height: 6,
            background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-amber))',
              }}
            />
          </div>
          <div style={{
            fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 12,
          }}>
            {progress < 30 ? 'Initializing...' : progress < 60 ? 'Configuring intelligence feeds...' : progress < 90 ? 'Connecting to x402...' : 'Almost there...'}
          </div>
        </motion.div>
      )}

      {deployed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Particles */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: 0,
                }}
                transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: 8, height: 8, borderRadius: '50%',
                  background: ['var(--accent-cyan)', 'var(--accent-amber)', 'var(--accent-green)', '#a78bfa'][i % 4],
                }}
              />
            ))}
            <div style={{ fontSize: 72, marginBottom: 24 }}>✨</div>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            {name} is live!
          </h2>
          <p style={{
            fontSize: 14, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 40px',
          }}>
            Your familiar is now running 24/7, gathering intelligence and ready to earn.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'var(--accent-cyan)', color: '#0a0b0f', border: 'none',
                  padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  fontFamily: 'var(--font-display)', cursor: 'pointer',
                }}
              >
                Go to Dashboard
              </motion.button>
            </Link>
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'transparent', color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 500,
                  fontFamily: 'var(--font-display)', cursor: 'pointer',
                }}
              >
                View Marketplace
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}

      {!deploying && !deployed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Ready to deploy
          </h2>
        </motion.div>
      )}
    </div>
  )
}
