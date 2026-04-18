import { createContext, useContext, type ReactNode } from 'react'
import { useLiveProducts, type LiveProduct, type LiveEvent } from '../hooks/useLiveData'

interface LiveDataContextType {
  liveProducts: LiveProduct[]
  events: LiveEvent[]
  totalRequests: number
  getProduct: (id: string) => LiveProduct | undefined
}

const LiveDataContext = createContext<LiveDataContextType | null>(null)

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const data = useLiveProducts()
  return (
    <LiveDataContext.Provider value={data}>
      {children}
    </LiveDataContext.Provider>
  )
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext)
  if (!ctx) throw new Error('useLiveData must be used within LiveDataProvider')
  return ctx
}
