'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './styles.module.css';

const COMPANY_NAV_ITEMS = [
  { label: 'Produtos', redirect: '/products' },
  { label: 'Importar', redirect: '/import' },
];

const ADMIN_NAV_ITEMS = [{ label: 'Empresas', redirect: '/admin' }];

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName = user?.name ?? '';
  const displayEmail = user?.email ?? '';
  const isAdmin = user?.role === 'ADMIN';

  const navItems = isAdmin ? ADMIN_NAV_ITEMS : COMPANY_NAV_ITEMS;

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <div className={styles.brand}>
            <span className={styles.logoMark} aria-hidden="true" />
            <span className={styles.logoText}>Piê</span>
            <span className={styles.logoSubtitle}>{isAdmin ? 'ADMIN' : 'PAINEL DA LOJA'}</span>
          </div>

          <nav className={styles.nav} aria-label="Navegação do painel">
            {navItems.map((item) => (
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
            {initials}
          </span>
          <div className={styles.accountInfo}>
            <span className={styles.accountName}>{displayName}</span>
            <span className={styles.accountEmail}>{displayEmail}</span>
          </div>
          <button
            type="button"
            className={styles.signOutButton}
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
