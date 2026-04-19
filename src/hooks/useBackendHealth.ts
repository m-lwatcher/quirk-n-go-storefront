import { useEffect, useState } from 'react'

export interface BackendHealth {
  key: 'base' | 'solana'
  label: string
  url: string
  status: 'checking' | 'online' | 'offline'
  lastChecked: string | null
  message?: string
}

const HEALTH_TARGETS: BackendHealth[] = [
  {
    key: 'base',
    label: 'Base rail',
    url: 'http://57.129.120.19:18801/health',
    status: 'checking',
    lastChecked: null,
  },
  {
    key: 'solana',
    label: 'Solana rail',
    url: 'http://15.204.52.182:18800/health',
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
            await res.json().catch(() => null)
            return {
              ...target,
              status: 'online' as const,
              lastChecked: new Date().toLocaleTimeString(),
              message: 'healthy',
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
