import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function getScrollState() {
  if (typeof window === 'undefined') return { progress: 0, canMove: false }
  const doc = document.documentElement
  const max = Math.max(0, doc.scrollHeight - window.innerHeight)
  return {
    progress: max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0,
    canMove: max > 24,
  }
}

export default function PageMovementControls() {
  const location = useLocation()
  const [state, setState] = useState(() => getScrollState())

  useEffect(() => {
    const update = () => setState(getScrollState())
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [location.pathname])

  useEffect(() => {
    const timer = window.setTimeout(() => setState(getScrollState()), 250)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  function move(direction: 'up' | 'down') {
    const distance = Math.max(360, Math.round(window.innerHeight * 0.72))
    window.scrollBy({ top: direction === 'down' ? distance : -distance, behavior: 'smooth' })
  }

  function jump(position: 'top' | 'bottom') {
    const top = position === 'top' ? 0 : document.documentElement.scrollHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (!state.canMove) return null

  return (
    <nav className="page-movement" aria-label="Page movement controls">
      <button type="button" onClick={() => jump('top')} aria-label="Jump to top">⌂</button>
      <button type="button" onClick={() => move('up')} aria-label="Move page up">↑</button>
      <div
        className="page-movement__meter"
        aria-label={`Page ${Math.round(state.progress)} percent scrolled`}
        style={{ '--page-progress': `${state.progress}%` } as React.CSSProperties}
      >
        <span />
      </div>
      <button type="button" onClick={() => move('down')} aria-label="Move page down">↓</button>
      <button type="button" onClick={() => jump('bottom')} aria-label="Jump to bottom">⌄</button>
    </nav>
  )
}
