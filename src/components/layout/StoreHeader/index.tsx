'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from './styles.module.css';

const NAV_ITEMS = [
  { label: 'Produtos', redirect: '/products' },
  { label: 'Importar', redirect: '/import' },
];

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <div className={styles.brand}>
            <span className={styles.logoMark} aria-hidden="true" />
            <span className={styles.logoText}>Piê</span>
            <span className={styles.logoSubtitle}>PAINEL DA LOJA</span>
          </div>

          <nav className={styles.nav} aria-label="Navegação do painel">
            {NAV_ITEMS.map((item) => (
              <span
                key={item.label}
                className={`${styles.navItem} ${
                  pathname === item.redirect || pathname.startsWith(`${item.redirect}/`)
                    ? styles.navItemActive
                    : ''
                }`}
                onClick={() => {
                  router.push(item.redirect);
                }}
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>

        <div className={styles.account}>
          <span className={styles.avatar} aria-hidden="true">
            AN
          </span>
          <div className={styles.accountInfo}>
            <span className={styles.accountName}>Ateliê Nove</span>
            <span className={styles.accountEmail}>marina@atelienove.com.br</span>
          </div>
          <button type="button" className={styles.signOutButton}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
