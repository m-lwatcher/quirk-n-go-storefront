import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<any>
      on?: (event: string, cb: (...args: any[]) => void) => void
      removeListener?: (event: string, cb: (...args: any[]) => void) => void
    }
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey?: { toString: () => string } }>
      disconnect: () => Promise<void>
      publicKey?: { toString: () => string }
      signAndSendTransaction?: (transaction: import('@solana/web3.js').Transaction) => Promise<{ signature?: string } | string>
    }
  }
}

interface WalletContextType {
  connected: boolean
  address: string | null
  rawAddress: string | null
  chain: 'base' | 'solana' | null
  error: string | null
  connect: (chain: 'base' | 'solana') => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

function shorten(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chain, setChain] = useState<'base' | 'solana' | null>(null)
  const [rawAddress, setRawAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const value = useMemo(() => ({
    connected,
    address,
    chain,
    rawAddress,
    error,
    connect: async (nextChain: 'base' | 'solana') => {
      setError(null)
      try {
        if (nextChain === 'base') {
          if (!window.ethereum) throw new Error('No EVM wallet detected')
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const raw = accounts?.[0]
          if (!raw) throw new Error('No account returned')
          try {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2105' }] })
          } catch {}
          setConnected(true)
          setChain('base')
          setRawAddress(String(raw))
          setAddress(shorten(String(raw)))
          return
        }

        if (!window.solana?.connect) throw new Error('No Solana wallet detected')
        const res = await window.solana.connect()
        const raw = res?.publicKey?.toString?.() || window.solana.publicKey?.toString?.()
        if (!raw) throw new Error('No Solana account returned')
        setConnected(true)
        setChain('solana')
        setRawAddress(String(raw))
        setAddress(shorten(String(raw)))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wallet connection failed')
        setConnected(false)
        setChain(null)
        setRawAddress(null)
        setAddress(null)
      }
    },
    disconnect: async () => {
      try {
        if (chain === 'solana' && window.solana?.disconnect) await window.solana.disconnect()
      } catch {}
      setConnected(false)
      setChain(null)
      setRawAddress(null)
      setAddress(null)
    },
  }), [connected, address, rawAddress, chain, error])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
