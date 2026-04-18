import { useState, useEffect, useCallback } from 'react'
import { products as staticProducts, type Product } from '../data/products'

export interface LiveProduct extends Product {
  status: 'online' | 'degraded' | 'offline'
  requests_live: number
  last_updated_ts: number
}

export interface LiveEvent {
  product: string
  buyer: string
  time: string
  type: 'purchase' | 'request'
  ts: number
}

const AGENT_PREFIXES = ['Agent', 'Bot', 'Familiar', 'Scout', 'Node']

function randomAgent(): string {
  const prefix = AGENT_PREFIXES[Math.floor(Math.random() * AGENT_PREFIXES.length)]
  const num = Math.floor(Math.random() * 9000) + 1000
  return `${prefix} #${num}`
}

function timeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

function pickStatus(uptime: number): 'online' | 'degraded' | 'offline' {
  const roll = Math.random() * 100
  if (roll < uptime) return 'online'
  if (roll < uptime + (100 - uptime) * 0.7) return 'degraded'
  return 'offline'
}

export function useLiveProducts() {
  const [liveProducts, setLiveProducts] = useState<LiveProduct[]>(() =>
    staticProducts.map(p => ({
      ...p,
      status: 'online' as const,
      requests_live: p.requests_24h,
      last_updated_ts: Date.now() - Math.floor(Math.random() * 600000),
    }))
  )

  const [events, setEvents] = useState<LiveEvent[]>(() => {
    const now = Date.now()
    return staticProducts.slice(0, 6).map((p, i) => ({
      product: p.name,
      buyer: randomAgent(),
      time: timeAgo((i + 1) * 45000),
      type: (Math.random() > 0.3 ? 'request' : 'purchase') as 'request' | 'purchase',
      ts: now - (i + 1) * 45000,
    }))
  })

  const [totalRequests, setTotalRequests] = useState(() =>
    staticProducts.reduce((s, p) => s + p.total_requests, 0)
  )

  // Tick every 3-8 seconds: bump a random product's request count and generate an event
  useEffect(() => {
    const tick = () => {
      const idx = Math.floor(Math.random() * staticProducts.length)
      const now = Date.now()

      setLiveProducts(prev => prev.map((p, i) => {
        if (i === idx) {
          const bump = Math.floor(Math.random() * 3) + 1
          return {
            ...p,
            requests_live: p.requests_live + bump,
            last_updated_ts: now,
            status: pickStatus(p.uptime),
          }
        }
        return p
      }))

      setTotalRequests(prev => prev + Math.floor(Math.random() * 3) + 1)

      const newEvent: LiveEvent = {
        product: staticProducts[idx].name,
        buyer: randomAgent(),
        time: 'just now',
        type: Math.random() > 0.3 ? 'request' : 'purchase',
        ts: now,
      }

      setEvents(prev => {
        const updated = [newEvent, ...prev.slice(0, 11)]
        // Update relative times
        return updated.map(e => ({
          ...e,
          time: e.ts === now ? 'just now' : timeAgo(now - e.ts),
        }))
      })
    }

    const interval = setInterval(tick, 3000 + Math.random() * 5000)
    return () => clearInterval(interval)
  }, [])

  const getProduct = useCallback((id: string) => {
    return liveProducts.find(p => p.id === id)
  }, [liveProducts])

  return { liveProducts, events, totalRequests, getProduct }
}

// Animated counter hook
export function useAnimatedCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const startVal = value

    function frame(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(startVal + (target - startVal) * eased))
      if (progress < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [target, duration])

  return value
}
