import { useEffect, useState } from 'react'

export interface BackendHealth {
  key: 'aifieldnotes' | 'infra' | 'sports'
  label: string
  url: string
  status: 'checking' | 'online' | 'offline'
  lastChecked: string | null
  message?: string
  signals?: number
}

const HEALTH_TARGETS: BackendHealth[] = [
  {
    key: 'aifieldnotes',
    label: 'AIFieldNotes',
    url: 'https://aifieldnotes.quirkngo.com/health',
    status: 'checking',
    lastChecked: null,
  },
  {
    key: 'infra',
    label: 'Infra Watch',
    url: 'https://infra.quirkngo.com/health',
    status: 'checking',
    lastChecked: null,
  },
  {
    key: 'sports',
    label: 'Sports Desk',
    url: 'https://sports.quirkngo.com/health',
    status: 'checking',
    lastChecked: null,
  },
]

export function useBackendHealth() {
  const [backends, setBackends] = useState<BackendHealth[]>(HEALTH_TARGETS)

  useEffect(() => {
    let cancelled = false

    async function checkAll() {
      const results = await Promise.all(
        HEALTH_TARGETS.map(async target => {
          try {
            const res = await fetch(target.url, { method: 'GET' })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const body = await res.json().catch(() => ({}))
            return {
              ...target,
              status: 'online' as const,
              lastChecked: new Date().toLocaleTimeString(),
              message: body?.status || 'healthy',
              signals: typeof body?.signal_count === 'number' ? body.signal_count : undefined,
            }
          } catch (err) {
            return {
              ...target,
              status: 'offline' as const,
              lastChecked: new Date().toLocaleTimeString(),
              message: err instanceof Error ? err.message : 'unreachable',
            }
          }
        })
      )
      if (!cancelled) setBackends(results)
    }

    checkAll()
    const interval = setInterval(checkAll, 60000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return backends
}
