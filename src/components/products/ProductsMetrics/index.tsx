import styles from './styles.module.css';

const EXAMPLE_METRICS = [
  { label: 'Produtos publicados', value: '32' },
  { label: 'Rascunhos', value: '6' },
  { label: 'Salvos no closet', value: '1.204' },
  { label: 'Cliques para a loja', value: '318' },
];

export function ProductsMetrics() {
  return (
    <section className={styles.block} aria-label="Métricas de produtos">
      <div className={styles.grid}>
        {EXAMPLE_METRICS.map((metric) => (
          <div key={metric.label} className={styles.card}>
            <span className={styles.value}>{metric.value}</span>
            <span className={styles.label}>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
