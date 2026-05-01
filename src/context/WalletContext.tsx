import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Transaction } from '@solana/web3.js'

export type SolanaProvider = {
  isPhantom?: boolean
  isJupiter?: boolean
  isSolflare?: boolean
  isBackpack?: boolean
  publicKey?: { toString: () => string }
  connect: (args?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey?: { toString: () => string } } | void>
  disconnect?: () => Promise<void>
  signAndSendTransaction?: (transaction: Transaction) => Promise<{ signature?: string } | string>
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
}

type SolanaProviderKey = 'auto' | 'jupiter' | 'phantom' | 'solflare' | 'backpack'

type WalletConnection = {
  chain: 'base' | 'solana'
  rawAddress: string
  address: string
  walletName?: string
  solanaProvider?: SolanaProvider
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<any>
      on?: (event: string, cb: (...args: any[]) => void) => void
      removeListener?: (event: string, cb: (...args: any[]) => void) => void
    }
    solana?: SolanaProvider
    phantom?: { solana?: SolanaProvider }
    jupiter?: SolanaProvider | { solana?: SolanaProvider }
    Jupiter?: SolanaProvider | { solana?: SolanaProvider }
    solflare?: SolanaProvider
    backpack?: SolanaProvider
  }
}

interface WalletContextType {
  connected: boolean
  address: string | null
  rawAddress: string | null
  chain: 'base' | 'solana' | null
  walletName: string | null
  solanaProvider: SolanaProvider | null
  error: string | null
  connect: (chain: 'base' | 'solana', options?: { solanaProviderKey?: SolanaProviderKey }) => Promise<WalletConnection>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

function shorten(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function providerFrom(value: unknown): SolanaProvider | null {
  if (!value || typeof value !== 'object') return null
  const maybe = value as SolanaProvider
  if (typeof maybe.connect === 'function') return maybe
  const nested = (value as { solana?: SolanaProvider }).solana
  return nested && typeof nested.connect === 'function' ? nested : null
}

function getSolanaProviders() {
  const candidates: Array<{ key: SolanaProviderKey; name: string; provider: SolanaProvider | null }> = [
    { key: 'jupiter', name: 'Jupiter', provider: providerFrom(window.jupiter) || providerFrom(window.Jupiter) },
    { key: 'phantom', name: 'Phantom', provider: providerFrom(window.phantom?.solana) || (window.solana?.isPhantom ? window.solana : null) },
    { key: 'solflare', name: 'Solflare', provider: providerFrom(window.solflare) || (window.solana?.isSolflare ? window.solana : null) },
    { key: 'backpack', name: 'Backpack', provider: providerFrom(window.backpack) || (window.solana?.isBackpack ? window.solana : null) },
    { key: 'auto', name: 'Solana wallet', provider: providerFrom(window.solana) },
  ]

  const seen = new Set<SolanaProvider>()
  return candidates.filter((candidate) => {
    if (!candidate.provider || seen.has(candidate.provider)) return false
    seen.add(candidate.provider)
    return true
  })
}

function selectSolanaProvider(key: SolanaProviderKey = 'auto') {
  const providers = getSolanaProviders()
  if (key !== 'auto') {
    const exact = providers.find((candidate) => candidate.key === key)
    if (exact) return exact
    throw new Error(`${key[0].toUpperCase()}${key.slice(1)} wallet not detected. Open the site in that wallet browser or enable its extension.`)
  }
  const preferred = providers.find((candidate) => candidate.key === 'jupiter') || providers[0]
  if (!preferred) throw new Error('No Solana wallet detected. Try Phantom, Jupiter, Solflare, or Backpack.')
  return preferred
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chain, setChain] = useState<'base' | 'solana' | null>(null)
  const [rawAddress, setRawAddress] = useState<string | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [solanaProvider, setSolanaProvider] = useState<SolanaProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const value = useMemo(() => ({
    connected,
    address,
    chain,
    rawAddress,
    walletName,
    solanaProvider,
    error,
    connect: async (nextChain: 'base' | 'solana', options?: { solanaProviderKey?: SolanaProviderKey }) => {
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
          const nextAddress = shorten(String(raw))
          setConnected(true)
          setChain('base')
          setRawAddress(String(raw))
          setAddress(nextAddress)
          setWalletName('EVM wallet')
          setSolanaProvider(null)
          return { chain: 'base', rawAddress: String(raw), address: nextAddress, walletName: 'EVM wallet' }
        }

        const selected = selectSolanaProvider(options?.solanaProviderKey || 'auto')
        const res = await selected.provider.connect()
        const raw = res?.publicKey?.toString?.() || selected.provider.publicKey?.toString?.()
        if (!raw) throw new Error(`${selected.name} did not return a Solana account`)
        const nextAddress = shorten(String(raw))
        setConnected(true)
        setChain('solana')
        setRawAddress(String(raw))
        setAddress(nextAddress)
        setWalletName(selected.name)
        setSolanaProvider(selected.provider)
        return { chain: 'solana', rawAddress: String(raw), address: nextAddress, walletName: selected.name, solanaProvider: selected.provider }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Wallet connection failed'
        setError(message)
        setConnected(false)
        setChain(null)
        setRawAddress(null)
        setAddress(null)
        setWalletName(null)
        setSolanaProvider(null)
        throw new Error(message)
      }
    },
    disconnect: async () => {
      try {
        if (chain === 'solana' && solanaProvider?.disconnect) await solanaProvider.disconnect()
      } catch {}
      setConnected(false)
      setChain(null)
      setRawAddress(null)
      setAddress(null)
      setWalletName(null)
      setSolanaProvider(null)
    },
  }), [connected, address, rawAddress, chain, walletName, solanaProvider, error])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
