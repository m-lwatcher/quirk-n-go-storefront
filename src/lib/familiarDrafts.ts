export type FamiliarDraft = {
  id: string
  name: string
  niche: string
  nicheName: string
  nicheIcon: string
  personality: string
  personalityName: string
  purpose: string
  watches: string
  produces: string
  buyer: string
  updateFrequency: string
  destination: 'dashboard' | 'x402' | 'both'
  rail: 'solana' | 'base'
  price: string
  endpointPath: string
  samplePath: string
  createdAt: string
  status: 'draft' | 'live'
}

const KEY = 'quirkngo:familiar-drafts'

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'familiar'
}

export function getFamiliarDrafts(): FamiliarDraft[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveFamiliarDraft(draft: FamiliarDraft) {
  if (typeof window === 'undefined') return
  const existing = getFamiliarDrafts().filter(item => item.id !== draft.id)
  window.localStorage.setItem(KEY, JSON.stringify([draft, ...existing].slice(0, 24)))
}

export function destinationLabel(destination: FamiliarDraft['destination']) {
  if (destination === 'dashboard') return 'Dashboard archive'
  if (destination === 'x402') return 'Paid x402 endpoint'
  return 'Dashboard + paid endpoint'
}
