import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface WalletContextType {
  connected: boolean
  address: string | null
  chain: 'base' | 'solana' | null
  connect: (chain: 'base' | 'solana') => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

function fakeAddress(chain: 'base' | 'solana') {
  return chain === 'base'
    ? '0xb966...39bC'
    : '8AQg6b...zJva'
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chain, setChain] = useState<'base' | 'solana' | null>(null)

  const value = useMemo(() => ({
    connected,
    address,
    chain,
    connect: (nextChain: 'base' | 'solana') => {
      setConnected(true)
      setChain(nextChain)
      setAddress(fakeAddress(nextChain))
    },
    disconnect: () => {
      setConnected(false)
      setChain(null)
      setAddress(null)
    },
  }), [connected, address, chain])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
