import { createContext, useContext, type ReactNode } from 'react'
import { useLiveProducts, type LiveProduct, type LiveEvent } from '../hooks/useLiveData'
import { useBackendHealth, type BackendHealth } from '../hooks/useBackendHealth'

interface LiveDataContextType {
  liveProducts: LiveProduct[]
  events: LiveEvent[]
  totalRequests: number
  backends: BackendHealth[]
  getProduct: (id: string) => LiveProduct | undefined
}

const LiveDataContext = createContext<LiveDataContextType | null>(null)

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const data = useLiveProducts()
  const backends = useBackendHealth()
  return (
    <LiveDataContext.Provider value={{ ...data, backends }}>
      {children}
    </LiveDataContext.Provider>
  )
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext)
  if (!ctx) throw new Error('useLiveData must be used within LiveDataProvider')
  return ctx
}
