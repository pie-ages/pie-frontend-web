import type { CSSProperties } from 'react'

import { StatItem } from '@/design-system/components/StatItem'
import sidebarStyles from './CompanySignUpSidebar.module.css'

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '3rem',
    backgroundColor: 'var(--primary)',
    padding: '3rem',
    color: 'var(--primary-foreground)',
  },
  brandName: {
    fontSize: '0.875rem',
    fontWeight: 800,
    margin: 0,
  },
  brandSuffix: {
    fontWeight: 400,
    opacity: 0.7,
  },
  contentBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  heading: {
    fontSize: 'var(--text-display)',
    lineHeight: 'var(--text-display--line-height)',
    letterSpacing: 'var(--text-display--letter-spacing)',
    fontWeight: 800,
    margin: 0,
  },
  description: {
    maxWidth: 348,
    fontSize: 'var(--text-body)',
    lineHeight: 'var(--text-body--line-height)',
    color: 'color-mix(in oklch, var(--primary-foreground) 92%, transparent)',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: '2rem',
    borderTop: '2px solid var(--color-brand-secondary)',
    paddingTop: '1.25rem',
  },
}

export function CompanySignUpSidebar() {
  return (
    <div className={sidebarStyles.container} style={styles.container}>
      <p style={styles.brandName}>
        Piê <span style={styles.brandSuffix}>/ para lojas</span>
      </p>

      <div style={styles.contentBlock}>
        <h1 style={styles.heading}>
          Sua loja dentro
          <br />
          do closet clientes.
        </h1>
        <p style={styles.description}>
          Cadastre seus produtos uma vez. Piê recomenda cada peça para as
          clientes cujo estilo e colorimetria combinam com ela.
        </p>
      </div>

      <div style={styles.statsRow}>
        <StatItem value="32 mil" label="peças na vitrine" />
        <StatItem value="148" label="lojas ativas" />
      </div>
    </div>
  )
}
