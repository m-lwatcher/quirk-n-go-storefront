import { useEffect, useState } from 'react'

interface PreviewState {
  loading: boolean
  data: unknown | null
  error: string | null
}

export function useProductPreview(endpoint: string) {
  const [state, setState] = useState<PreviewState>({
    loading: true,
    data: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ loading: true, data: null, error: null })
      try {
        const res = await fetch(endpoint)
        const text = await res.text()
        let parsed: unknown = text
        try { parsed = JSON.parse(text) } catch {}

        if (!cancelled) {
          setState({
            loading: false,
            data: parsed,
            error: res.ok ? null : `HTTP ${res.status}`,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            loading: false,
            data: null,
            error: err instanceof Error ? err.message : 'request failed',
          })
        }
      }
    }

    if (endpoint.includes(':18800') || endpoint.includes(':18801')) {
      load()
    } else {
      setState({ loading: false, data: null, error: 'planned endpoint' })
    }

    return () => {
      cancelled = true
    }
  }, [endpoint])

  return state
}
