import type { CSSProperties } from 'react'

type StatItemProps = {
  value: string
  label: string
  style?: CSSProperties
}

export function StatItem({ value, label, style }: StatItemProps) {
  return (
    <div style={{ display: 'flex', flex: '1 1 0%', flexDirection: 'column', ...style }}>
      <p style={{
        fontSize: 'var(--text-stat)',
        lineHeight: 'var(--text-stat--line-height)',
        fontWeight: 800,
        color: 'var(--primary-foreground)',
        margin: 0,
      }}>
        {value}
      </p>
      <p style={{
        fontSize: 'var(--text-caption)',
        lineHeight: 'var(--text-caption--line-height)',
        letterSpacing: 'var(--text-caption--letter-spacing)',
        fontWeight: 400,
        color: 'var(--color-brand-secondary)',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        {label}
      </p>
    </div>
  )
}
