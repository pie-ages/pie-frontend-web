import styles from './styles.module.css';

type ProductsMetricsProps = {
  publishedCount: number | null;
  draftCount: number | null;
};

function formatCount(count: number | null): string {
  if (count === null) return '—';
  return count.toLocaleString('pt-BR');
}

export function ProductsMetrics({ publishedCount, draftCount }: ProductsMetricsProps) {
  const metrics = [
    { label: 'Produtos publicados', value: formatCount(publishedCount) },
    { label: 'Rascunhos', value: formatCount(draftCount) },
    { label: 'Salvos no closet', value: '—' },
    { label: 'Cliques para a loja', value: '—' },
  ];

  return (
    <section className={styles.block} aria-label="Métricas de produtos">
      <div className={styles.grid}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.card}>
            <span className={styles.value}>{metric.value}</span>
            <span className={styles.label}>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
