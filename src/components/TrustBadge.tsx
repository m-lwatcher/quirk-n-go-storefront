interface Props {
  label: string
  value: string
  good?: boolean
}

export default function TrustBadge({ label, value, good }: Props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: good ? 'var(--accent-green)' : 'var(--accent-amber)',
      background: good ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255, 179, 71, 0.08)',
      padding: '4px 10px',
      borderRadius: 6,
    }}>
      <span style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: good ? 'var(--accent-green)' : 'var(--accent-amber)',
      }} />
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}
