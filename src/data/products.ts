export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: string
  price_numeric: number
  familiar_name: string
  familiar_emoji: string
  avatar_url?: string
  endpoint_url: string
  sample_url?: string
  agentverse_address?: string
  uptime: number
  hit_rate: number
  last_updated: string
  sample_output: string
  trust_score: number
  requests_24h: number
  total_requests: number
  update_frequency: string
  data_source: string
  curation_type: 'automated' | 'human-reviewed' | 'hybrid'
  endpoint_status?: 'live' | 'beta' | 'planned'
  chain?: 'base' | 'solana' | 'multi' | 'none'
  safety_note?: string
}

export const categories = [
  { id: 'all', name: 'All Familiars', icon: '🏪', color: '#f3c56b' },
  { id: 'ai', name: 'AI Intel', icon: '📓', color: '#7dd3fc' },
  { id: 'infra', name: 'Agent Infra', icon: '🛰️', color: '#34d399' },
  { id: 'sports', name: 'Sports Signals', icon: '📡', color: '#fb7185' },
]

export const products: Product[] = [
  {
    id: 'aifieldnotes-intelligence-feed',
    name: 'AIFieldNotes Intelligence Feed',
    description: 'A field-notebook familiar that watches the AI agent ecosystem: model releases, agent-commerce rails, protocol shifts, weird research, and practical signals worth knowing before they become obvious.',
    category: 'ai',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'AIFieldNotes',
    familiar_emoji: '📓',
    avatar_url: '/familiars/aifieldnotes.jpg',
    endpoint_url: 'https://aifieldnotes.quirkngo.com/ai/signals',
    sample_url: 'https://aifieldnotes.quirkngo.com/ai/sample',
    agentverse_address: 'agent1qvje0gr4ue28g3rt6cn0fuyuwg56hklg2fv6e0acscwtgj47869xylrmhxh',
    uptime: 99.4,
    hit_rate: 74,
    last_updated: 'live',
    sample_output: JSON.stringify({
      familiar: 'AIFieldNotes',
      type: 'agent_ecosystem_signal',
      headline: 'Agent payments and x402 rails are moving from experiment to distribution layer',
      why_it_matters: 'Small autonomous services can sell data directly without a SaaS checkout flow.',
      source_mix: ['protocol docs', 'agent ecosystem feeds', 'model/provider news']
    }, null, 2),
    trust_score: 91,
    requests_24h: 186,
    total_requests: 4200,
    update_frequency: 'Every 6 hours plus manual refreshes',
    data_source: 'AI ecosystem feeds, x402/agent-commerce sources, curated research notes',
    curation_type: 'hybrid',
    endpoint_status: 'live',
    chain: 'solana',
    safety_note: 'Research/intelligence feed only. No external account actions.'
  },
  {
    id: 'quirk-infra-watch',
    name: 'Quirk Infra Watch',
    description: 'A lighthouse familiar for the agent-payment stack. Watches x402, Agentverse, ACP, wallet/payment rails, infra changes, and early signals that agent commerce is becoming usable.',
    category: 'infra',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Infra Watch',
    familiar_emoji: '🛰️',
    avatar_url: '/familiars/infra-watch.jpg',
    endpoint_url: 'https://infra.quirkngo.com/signals',
    sample_url: 'https://infra.quirkngo.com/sample',
    agentverse_address: 'agent1qg3nx8r5jrxd75c063gcz56xc9xwaj8ep99yjqww29vcmqzsckcej07yhyp',
    uptime: 99.2,
    hit_rate: 81,
    last_updated: 'live',
    sample_output: JSON.stringify({
      familiar: 'Quirk Infra Watch',
      type: 'agent_infra_signal',
      area: 'x402 / Agentverse / payment rails',
      summary: 'Tracks whether the rails agents need to sell useful work are becoming real, stable, and discoverable.',
      signal_count: 13
    }, null, 2),
    trust_score: 90,
    requests_24h: 143,
    total_requests: 3100,
    update_frequency: 'Daily refresh with event-driven updates',
    data_source: 'x402 ecosystem, Fetch.ai/Agentverse, payment rail docs, infrastructure releases',
    curation_type: 'automated',
    endpoint_status: 'live',
    chain: 'solana',
    safety_note: 'Infrastructure watch feed only. No wallet custody, no trading, no secret exposure.'
  },
  {
    id: 'quirk-sports-desk',
    name: 'Quirk Sports Desk',
    description: 'A scanner-only sports-market signal board built from dry-run Kalshi artifacts: runner-approved candidates, MLS edge checks, and MLB specialist recheck/watch states.',
    category: 'sports',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Sports Desk',
    familiar_emoji: '📡',
    avatar_url: '/familiars/sports-desk.jpg',
    endpoint_url: 'https://sports.quirkngo.com/signals',
    sample_url: 'https://sports.quirkngo.com/sample',
    agentverse_address: 'agent1qw0gf6v6y2tp9ucr25qw2ha6jzr96dn85k2wmgcrnjnxjq2y6wqajlxk4u7',
    uptime: 99.1,
    hit_rate: 68,
    last_updated: 'live',
    sample_output: JSON.stringify({
      familiar: 'Quirk Sports Desk',
      mode: 'dry_run_research_only',
      signal_count: 29,
      example: 'NBA runner-approved candidate, MLS dry-run edge, MLB specialist watch/recheck',
      note: 'Does not place bets.'
    }, null, 2),
    trust_score: 86,
    requests_24h: 211,
    total_requests: 5100,
    update_frequency: 'Refreshes from dry-run sports artifacts',
    data_source: 'Kalshi dry-run outputs, sports scanner artifacts, specialist review boards',
    curation_type: 'hybrid',
    endpoint_status: 'live',
    chain: 'solana',
    safety_note: 'Informational only. This familiar never places bets or executes trades.'
  },
]
