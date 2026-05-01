import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { saveFamiliarDraft, slugify, type FamiliarDraft } from '../lib/familiarDrafts'

const jobs = [
  {
    id: 'local',
    name: 'Local business helper',
    icon: '🏪',
    plain: 'Watches town chatter, weather, events, and busy nights.',
    example: 'Helps a bar, shop, or venue know when to staff up or post an offer.',
  },
  {
    id: 'sports',
    name: 'Sports signal scout',
    icon: '🏟️',
    plain: 'Watches injuries, schedules, line movement, and context.',
    example: 'Turns messy sports info into a short research note.',
  },
  {
    id: 'markets',
    name: 'Market watcher',
    icon: '📈',
    plain: 'Watches stocks, crypto, launches, rumors, and unusual moves.',
    example: 'Flags early signals without pretending to be financial advice.',
  },
  {
    id: 'internet',
    name: 'Internet trend finder',
    icon: '🧭',
    plain: 'Watches niches, creators, products, and conversations.',
    example: 'Finds what people are starting to care about before it is obvious.',
  },
  {
    id: 'security',
    name: 'Safety / security watch',
    icon: '🛡️',
    plain: 'Watches advisories, public repos, exposed systems, and alerts.',
    example: 'Summarizes what matters and what can be ignored.',
  },
  {
    id: 'custom',
    name: 'Something custom',
    icon: '✨',
    plain: 'Watches whatever corner of the world you care about.',
    example: 'Good for weird, personal, or very specific workflows.',
  },
]

const voices = [
  { id: 'plain', name: 'Plainspoken', desc: 'Short, useful, no jargon.' },
  { id: 'careful', name: 'Careful researcher', desc: 'Slower, sourced, confidence-aware.' },
  { id: 'direct', name: 'Direct operator', desc: 'Tell me what changed and what to do.' },
]

const stepLabels = ['Name', 'Job', 'Watch', 'Answer', 'Send', 'Review']

type Destination = 'dashboard' | 'x402' | 'both'
type Rail = 'solana' | 'base'

export default function CreateFamiliar() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [jobType, setJobType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [watches, setWatches] = useState('')
  const [produces, setProduces] = useState('')
  const [buyer, setBuyer] = useState('')
  const [voice, setVoice] = useState('plain')
  const [destination, setDestination] = useState<Destination>('dashboard')
  const [rail, setRail] = useState<Rail>('solana')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [progress, setProgress] = useState(0)

  const selectedJob = jobs.find(job => job.id === jobType)
  const selectedVoice = voices.find(item => item.id === voice)

  const canNext = step === 0 ? name.trim().length > 1
    : step === 1 ? Boolean(jobType) && purpose.trim().length > 5
    : step === 2 ? watches.trim().length > 5
    : step === 3 ? produces.trim().length > 5 && buyer.trim().length > 2
    : true

  const draft = useMemo(() => buildDraft(), [name, jobType, purpose, watches, produces, buyer, voice, destination, rail])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  function buildDraft(): FamiliarDraft {
    const id = slugify(name || 'my-familiar')
    return {
      id,
      name: name.trim() || 'My Familiar',
      niche: jobType || 'custom',
      nicheName: selectedJob?.name || 'Custom familiar',
      nicheIcon: selectedJob?.icon || '✨',
      personality: voice,
      personalityName: selectedVoice?.name || 'Plainspoken',
      purpose: purpose.trim(),
      watches: watches.trim(),
      produces: produces.trim(),
      buyer: buyer.trim(),
      updateFrequency: 'Checks on a schedule, then saves useful changes',
      destination,
      rail,
      price: destination === 'dashboard' ? 'Private dashboard' : 'Tiny paid unlock',
      endpointPath: `/${id}/signals`,
      samplePath: `/${id}/sample`,
      createdAt: new Date().toISOString(),
      status: 'live',
    }
  }

  function deploy() {
    saveFamiliarDraft(draft)
    setDeploying(true)
    setProgress(0)
    const timer = window.setInterval(() => {
      setProgress(value => {
        const nextValue = Math.min(100, value + 14)
        if (nextValue >= 100) {
          window.clearInterval(timer)
          window.setTimeout(() => {
            setDeploying(false)
            setDeployed(true)
          }, 280)
        }
        return nextValue
      })
    }, 220)
  }

  function next() {
    if (step === 5) {
      deploy()
      return
    }
    setStep(current => Math.min(current + 1, 5))
  }

  return (
    <main className="create-familiar-shell">
      <section className="create-familiar-hero">
        <div>
          <span className="section-kicker">Create a familiar</span>
          <h1>Start with the job. Hide the weird stuff.</h1>
          <p>
            A familiar is a tiny worker with one purpose: it watches something messy, writes a useful answer, and sends it where it belongs.
          </p>
        </div>
        <div className="create-familiar-rule" aria-hidden="true">
          <span>watch</span><b>→</b><span>notice</span><b>→</b><span>tell you</span>
        </div>
      </section>

      <section className="create-familiar-layout">
        <aside className="create-familiar-preview" aria-label="Familiar preview">
          <PreviewCard draft={draft} selectedJob={selectedJob} />
        </aside>

        <div className="create-familiar-workbench">
          <Progress step={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={deployed ? 'done' : deploying ? 'deploying' : step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="create-familiar-card"
            >
              {deploying || deployed ? (
                <LaunchState name={draft.name} progress={progress} deployed={deployed} />
              ) : (
                <>
                  {step === 0 && <StepName name={name} setName={setName} />}
                  {step === 1 && <StepJob jobType={jobType} setJobType={setJobType} purpose={purpose} setPurpose={setPurpose} />}
                  {step === 2 && <StepWatch watches={watches} setWatches={setWatches} selectedJob={selectedJob} />}
                  {step === 3 && <StepAnswer produces={produces} setProduces={setProduces} buyer={buyer} setBuyer={setBuyer} voice={voice} setVoice={setVoice} />}
                  {step === 4 && <StepSend destination={destination} setDestination={setDestination} rail={rail} setRail={setRail} advancedOpen={advancedOpen} setAdvancedOpen={setAdvancedOpen} />}
                  {step === 5 && <StepReview draft={draft} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {!deploying && !deployed && (
            <nav className="create-familiar-nav" aria-label="Create familiar navigation">
              <button type="button" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}>
                Back
              </button>
              <button type="button" className="create-familiar-next" onClick={next} disabled={!canNext}>
                {step === 5 ? 'Save familiar' : 'Next'}
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  )
}

function Progress({ step }: { step: number }) {
  return (
    <div className="create-familiar-progress">
      <div className="create-familiar-progress__labels">
        {stepLabels.map((label, index) => <span key={label} className={index <= step ? 'is-active' : ''}>{label}</span>)}
      </div>
      <div className="create-familiar-progress__track">
        <motion.span animate={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} transition={{ duration: 0.28 }} />
      </div>
    </div>
  )
}

function StepName({ name, setName }: { name: string; setName: (value: string) => void }) {
  return (
    <section>
      <p className="create-step-number">Step 1</p>
      <h2>Name it like a helper, not a product.</h2>
      <p className="create-step-copy">Pick something memorable. It can be practical, funny, local, or strange. The job comes next.</p>
      <label className="create-field">
        <span>Familiar name</span>
        <input value={name} onChange={event => setName(event.target.value)} placeholder="Weekend Scout, Deal Ghost, River Rock Watcher..." autoFocus />
      </label>
      <p className="create-soft-note">People can create their own familiar. “Fred” was just a test name.</p>
    </section>
  )
}

function StepJob({ jobType, setJobType, purpose, setPurpose }: {
  jobType: string
  setJobType: (value: string) => void
  purpose: string
  setPurpose: (value: string) => void
}) {
  return (
    <section>
      <p className="create-step-number">Step 2</p>
      <h2>What job should it do?</h2>
      <p className="create-step-copy">One clear job beats ten vague powers. Choose the closest lane, then say the purpose in plain English.</p>
      <div className="create-job-grid">
        {jobs.map(job => (
          <button key={job.id} type="button" onClick={() => setJobType(job.id)} className={jobType === job.id ? 'create-job-card is-selected' : 'create-job-card'}>
            <strong><span>{job.icon}</span>{job.name}</strong>
            <em>{job.plain}</em>
          </button>
        ))}
      </div>
      <label className="create-field">
        <span>Its purpose</span>
        <textarea value={purpose} onChange={event => setPurpose(event.target.value)} placeholder="Example: Warns local bar owners when the weekend is likely to be unusually busy." rows={3} />
      </label>
    </section>
  )
}

function StepWatch({ watches, setWatches, selectedJob }: {
  watches: string
  setWatches: (value: string) => void
  selectedJob?: typeof jobs[number]
}) {
  return (
    <section>
      <p className="create-step-number">Step 3</p>
      <h2>What should it watch?</h2>
      <p className="create-step-copy">List the places it should pay attention to. Public sources are easiest: calendars, websites, feeds, posts, alerts, scores, filings, or docs.</p>
      {selectedJob && <div className="create-example-strip"><b>{selectedJob.icon}</b><span>{selectedJob.example}</span></div>}
      <label className="create-field">
        <span>Watched sources</span>
        <textarea value={watches} onChange={event => setWatches(event.target.value)} placeholder="Local event calendars, weather, Facebook posts, sports schedules, venue announcements..." rows={5} />
      </label>
      <p className="create-soft-note">No private account access is needed for a first version. Start with sources anyone can check.</p>
    </section>
  )
}

function StepAnswer({ produces, setProduces, buyer, setBuyer, voice, setVoice }: {
  produces: string
  setProduces: (value: string) => void
  buyer: string
  setBuyer: (value: string) => void
  voice: string
  setVoice: (value: string) => void
}) {
  return (
    <section>
      <p className="create-step-number">Step 4</p>
      <h2>What answer should it make?</h2>
      <p className="create-step-copy">A good familiar does not dump data. It creates a small answer someone can actually use.</p>
      <label className="create-field">
        <span>Output</span>
        <textarea value={produces} onChange={event => setProduces(event.target.value)} placeholder="A short brief with: what changed, why it matters, confidence, sources, and the next step." rows={3} />
      </label>
      <label className="create-field">
        <span>Who is this for?</span>
        <input value={buyer} onChange={event => setBuyer(event.target.value)} placeholder="Bar owners, collectors, sports researchers, local operators..." />
      </label>
      <div className="create-choice-stack" aria-label="Voice options">
        {voices.map(item => (
          <button key={item.id} type="button" onClick={() => setVoice(item.id)} className={voice === item.id ? 'create-choice is-selected' : 'create-choice'}>
            <strong>{item.name}</strong>
            <span>{item.desc}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function StepSend({ destination, setDestination, rail, setRail, advancedOpen, setAdvancedOpen }: {
  destination: Destination
  setDestination: (value: Destination) => void
  rail: Rail
  setRail: (value: Rail) => void
  advancedOpen: boolean
  setAdvancedOpen: (value: boolean) => void
}) {
  return (
    <section>
      <p className="create-step-number">Step 5</p>
      <h2>Where should the answer go?</h2>
      <p className="create-step-copy">Keep it private while you test. If it becomes useful to other people or agents, make a paid link later.</p>
      <div className="create-destination-grid">
        <button type="button" onClick={() => setDestination('dashboard')} className={destination === 'dashboard' ? 'create-destination is-selected' : 'create-destination'}>
          <strong>My dashboard</strong>
          <span>Best first choice. Save each useful answer privately.</span>
        </button>
        <button type="button" onClick={() => setDestination('both')} className={destination === 'both' ? 'create-destination is-selected' : 'create-destination'}>
          <strong>Dashboard + paid link</strong>
          <span>Keep your copy and let others unlock the answer.</span>
        </button>
        <button type="button" onClick={() => setDestination('x402')} className={destination === 'x402' ? 'create-destination is-selected' : 'create-destination'}>
          <strong>Paid link only</strong>
          <span>For agent-to-agent or buyer access later.</span>
        </button>
      </div>
      <button type="button" className="create-advanced-toggle" onClick={() => setAdvancedOpen(!advancedOpen)}>
        {advancedOpen ? 'Hide' : 'Show'} optional payment settings
      </button>
      {advancedOpen && (
        <div className="create-advanced-panel">
          <p>Most people can ignore this. It only matters when another wallet or agent pays to unlock the familiar’s output.</p>
          <div className="create-choice-stack create-choice-stack--two">
            <button type="button" onClick={() => setRail('solana')} className={rail === 'solana' ? 'create-choice is-selected' : 'create-choice'}>
              <strong>Solana</strong><span>Fast tiny payments.</span>
            </button>
            <button type="button" onClick={() => setRail('base')} className={rail === 'base' ? 'create-choice is-selected' : 'create-choice'}>
              <strong>Base</strong><span>Builder / EVM wallet path.</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function StepReview({ draft }: { draft: FamiliarDraft }) {
  return (
    <section>
      <p className="create-step-number">Step 6</p>
      <h2>Review the job card.</h2>
      <p className="create-step-copy">If this sounds useful to a regular person, it is ready for a first version.</p>
      <div className="create-review-card">
        <div className="create-review-card__head"><span>{draft.nicheIcon}</span><div><h3>{draft.name}</h3><p>{draft.nicheName} · {draft.personalityName}</p></div></div>
        <dl>
          <div><dt>Job</dt><dd>{draft.purpose || 'Not set'}</dd></div>
          <div><dt>Watches</dt><dd>{draft.watches || 'Not set'}</dd></div>
          <div><dt>Makes</dt><dd>{draft.produces || 'Not set'}</dd></div>
          <div><dt>For</dt><dd>{draft.buyer || 'Not set'}</dd></div>
          <div><dt>Sends to</dt><dd>{destinationText(draft.destination)}</dd></div>
        </dl>
      </div>
    </section>
  )
}

function PreviewCard({ draft, selectedJob }: { draft: FamiliarDraft; selectedJob?: typeof jobs[number] }) {
  return (
    <div className="create-preview-card">
      <div className="create-preview-card__top">
        <span>{draft.nicheIcon}</span>
        <div><strong>{draft.name}</strong><em>{draft.nicheName}</em></div>
      </div>
      <p>{draft.purpose || selectedJob?.example || 'Give this familiar one useful job.'}</p>
      <div className="create-preview-list">
        <div><small>Watches</small><span>{draft.watches || 'Sources you choose'}</span></div>
        <div><small>Makes</small><span>{draft.produces || 'A short useful answer'}</span></div>
        <div><small>Goes to</small><span>{destinationText(draft.destination)}</span></div>
      </div>
    </div>
  )
}

function LaunchState({ name, progress, deployed }: { name: string; progress: number; deployed: boolean }) {
  if (deployed) {
    return (
      <section className="create-launch-state">
        <div className="create-launch-badge">✨</div>
        <h2>{name} is saved.</h2>
        <p>Your familiar blueprint is in the dashboard. Next step: connect real sources, test the first answer, then decide if it should become a paid link.</p>
        <div className="create-launch-actions">
          <Link to="/dashboard">Open dashboard</Link>
          <Link to="/marketplace">View live examples</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="create-launch-state">
      <div className="create-launch-badge">⚡</div>
      <h2>Saving {name}...</h2>
      <p>Building the job card and adding it to your dashboard.</p>
      <div className="create-launch-track"><motion.span animate={{ width: `${progress}%` }} /></div>
    </section>
  )
}

function destinationText(destination: Destination) {
  if (destination === 'dashboard') return 'Dashboard only'
  if (destination === 'x402') return 'Paid link'
  return 'Dashboard + paid link'
}
