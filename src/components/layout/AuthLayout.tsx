import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div>
          <h1 className={styles.brandTitle}>
            Piê <span className={styles.brandSubtitle}>/ para lojas</span>
          </h1>
        </div>
        <div>
          <h2 className={styles.mainHeading}>
            Sua loja dentro
            <br />
            do closet de clientes.
          </h2>
          <p className={styles.description}>
            Cadastre seus produtos uma vez. Piê recomenda cada peça para as clientes cujo estilo e
            colorimetria combinam com ela.
          </p>
        </div>
        <div className={styles.statsContainer}>
          <div>
            <p className={styles.statNumber}>32 mil</p>
            <p className={styles.statLabel}>PEÇAS NA VITRINE</p>
          </div>
          <div>
            <p className={styles.statNumber}>148</p>
            <p className={styles.statLabel}>LOJAS ATIVAS</p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>{children}</div>
    </div>
  );
}
