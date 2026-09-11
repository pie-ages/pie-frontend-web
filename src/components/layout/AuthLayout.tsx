import Image from 'next/image';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoContainer}>
          <Image
            src="/pie.svg"
            alt="Logo Piê"
            width={160}
            height={96}
            className={styles.logoImage}
            priority
          />
          <span className={styles.logoSubtitle}>Para Lojas</span>
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
          <div className={styles.statItem}>
            <h3 className={styles.statTitle}>Match de Estilo Inteligente</h3>
            <p className={styles.statLabel}>Sua loja sugerida para o perfil perfeito de cliente.</p>
          </div>

          <div className={styles.statItem}>
            <h3 className={styles.statTitle}>Acesso Qualificado</h3>
            <p className={styles.statLabel}>
              Conecte seus produtos a clientes prontos para comprar.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>{children}</div>
    </div>
  );
}
