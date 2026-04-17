export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: string
  price_numeric: number
  familiar_name: string
  familiar_emoji: string
  uptime: number
  hit_rate: number
  last_updated: string
  sample_output: string
  endpoint_url: string
  trust_score: number
  requests_24h: number
  total_requests: number
}

export const categories = [
  { id: 'all', name: 'All Products', icon: '🏪', color: '#00e0ff' },
  { id: 'sports', name: 'Sports', icon: '⚾', color: '#34d399' },
  { id: 'crypto', name: 'Crypto / AI Intel', icon: '🔮', color: '#a78bfa' },
  { id: 'security', name: 'Security', icon: '🛡️', color: '#f87171' },
  { id: 'stocks', name: 'Stocks', icon: '📈', color: '#ffb347' },
]

export const products: Product[] = [
  {
    id: 'sports-signals',
    name: 'Sports Betting Signals',
    description: 'Real-time Kalshi sports market signals with runner-approved picks, case scoring, and judgment verdicts. Covers NBA, MLB, and NHL game markets with confidence ratings and objection analysis.',
    category: 'sports',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Sports Desk',
    familiar_emoji: '⚡',
    uptime: 99.2,
    hit_rate: 72,
    last_updated: '2m ago',
    sample_output: JSON.stringify({
      ticker: "KXNBAGAME-26APR26BOSPHI-BOS",
      team: "Boston",
      verdict: "watch",
      confidence: 6.5,
      case_score: 3,
      reasons: ["runner_approved", "price_in_value_band", "near_game_window"],
      objections: ["no prior positive team signal"],
      price: 0.68
    }, null, 2),
    endpoint_url: 'https://quirk-n-go.x402.org/sports/signals',
    trust_score: 85,
    requests_24h: 342,
    total_requests: 12840,
  },
  {
    id: 'crypto-intel',
    name: 'Crypto & AI Intel Alerts',
    description: 'Knowledge scout alerts covering trending crypto narratives, AI agent developments, Solana ecosystem moves, and emerging protocols. Curated by an always-on research familiar.',
    category: 'crypto',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Intel Scout',
    familiar_emoji: '🔮',
    uptime: 98.7,
    hit_rate: 68,
    last_updated: '8m ago',
    sample_output: JSON.stringify({
      type: "crypto_alert",
      headline: "PigeonHouse burn router open-sourced",
      summary: "941pigeon.fun open-sourced their Burn Router contract. 1.5% of every sell is burned with a 941 token supply floor. First deflationary launchpad on Solana.",
      relevance: "high",
      source: "https://github.com/941pigeon/burn-router",
      tags: ["solana", "defi", "deflationary", "launchpad"]
    }, null, 2),
    endpoint_url: 'https://quirk-n-go.x402.org/intel/alerts',
    trust_score: 82,
    requests_24h: 518,
    total_requests: 24100,
  },
  {
    id: 'security-findings',
    name: 'Security Vulnerability Findings',
    description: 'Automated bug bounty scanner results targeting AI/ML repositories. Finds RCE, injection, and auth bypass vulnerabilities in open-source AI tools before they hit mainstream disclosure.',
    category: 'security',
    price: '$0.002 / request',
    price_numeric: 0.002,
    familiar_name: 'Quirk Bug Hunter',
    familiar_emoji: '🛡️',
    uptime: 97.1,
    hit_rate: 34,
    last_updated: '1h ago',
    sample_output: JSON.stringify({
      type: "vulnerability",
      target: "ComfyUI",
      severity: "critical",
      category: "RCE",
      summary: "Unrestricted file upload in custom node loader allows arbitrary code execution via crafted .py node package",
      status: "reported",
      platform: "huntr.com"
    }, null, 2),
    endpoint_url: 'https://quirk-n-go.x402.org/security/findings',
    trust_score: 78,
    requests_24h: 89,
    total_requests: 3200,
  },
  {
    id: 'stock-analysis',
    name: 'Stock & Market Analysis',
    description: 'AI-powered stock scoring across 8 dimensions with dividend analysis, earnings reaction tracking, and viral trend detection. Covers major exchanges with real-time Yahoo Finance data.',
    category: 'stocks',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Market Eye',
    familiar_emoji: '📈',
    uptime: 96.8,
    hit_rate: 61,
    last_updated: '15m ago',
    sample_output: JSON.stringify({
      ticker: "NVDA",
      score: 7.2,
      dimensions: {
        momentum: 8, value: 5, quality: 9,
        growth: 8, sentiment: 7, technical: 6,
        dividend: 3, risk: 7
      },
      signal: "strong_buy",
      catalyst: "Earnings beat + raised guidance",
      confidence: 0.74
    }, null, 2),
    endpoint_url: 'https://quirk-n-go.x402.org/stocks/analysis',
    trust_score: 80,
    requests_24h: 267,
    total_requests: 9450,
  },
  {
    id: 'gas-commodities',
    name: 'Natural Gas Market Scanner',
    description: 'Kalshi natural gas commodity market scanner tracking KXNGASMIN and KXNGASMAX series. Flags threshold crossings and price movements worth researching.',
    category: 'stocks',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Commodities',
    familiar_emoji: '🔥',
    uptime: 94.5,
    hit_rate: 55,
    last_updated: '22m ago',
    sample_output: JSON.stringify({
      series: "KXNGASMAX",
      ticker: "KXNGASMAX-26DEC31-P5.00",
      action: "research",
      current_price: 0.42,
      threshold: "$5.00 max",
      note: "Price moved 8% in 24h, approaching value band"
    }, null, 2),
    endpoint_url: 'https://quirk-n-go.x402.org/commodities/gas',
    trust_score: 72,
    requests_24h: 45,
    total_requests: 890,
  },
  {
    id: 'statement-scanner',
    name: 'Statement & Speech Scanner',
    description: 'Monitors Kalshi markets for contracts tied to specific public statements, speeches, or exact wording by officials. Filters out generic politics and Fed rate markets.',
    category: 'crypto',
    price: '$0.001 / request',
    price_numeric: 0.001,
    familiar_name: 'Quirk Word Watch',
    familiar_emoji: '📡',
    uptime: 95.3,
    hit_rate: 42,
    last_updated: '35m ago',
    sample_output: JSON.stringify({
      status: "clean_sweep",
      candidates: 0,
      research_items: 0,
      markets_scanned: 156,
      note: "No active statement/speech markets found matching strict wording filters"
    }, null, 2),
    endpoint_url: 'https://quirk-n-go.x402.org/statements/scan',
    trust_score: 75,
    requests_24h: 28,
    total_requests: 620,
  },
]
