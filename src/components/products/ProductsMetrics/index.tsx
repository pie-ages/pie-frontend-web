import styles from './styles.module.css';

interface ProductsMetricsProps {
  publishedCount: number | null;
  draftCount: number | null;
}

export function ProductsMetrics({ publishedCount, draftCount }: ProductsMetricsProps) {
  return (
    <section className={styles.metricsBar} aria-label="Resumo do catálogo">
      <div className={styles.metricItem}>
        <strong className={styles.metricValue}>{publishedCount ?? '—'}</strong>
        <span className={styles.metricLabel}>Produtos publicados</span>
      </div>

      <div className={styles.metricItem}>
        <strong className={styles.metricValue}>{draftCount ?? '—'}</strong>
        <span className={styles.metricLabel}>Rascunhos</span>
      </div>
    </section>
  );
}
