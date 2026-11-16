'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import styles from './storeHeader.module.css';

const COMPANY_NAV_ITEMS = [{ label: 'Produtos', href: '/products' }];

const ADMIN_NAV_ITEMS = [{ label: 'Empresas', href: '/admin' }];

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : COMPANY_NAV_ITEMS;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href={isAdmin ? '/admin' : '/products'} className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pie.svg" alt="Piê" className={styles.logo} />
            <span className={styles.divider} aria-hidden="true" />
            <span className={styles.badge}>{isAdmin ? 'Admin' : 'Painel da loja'}</span>
          </Link>

          <nav className={styles.nav} aria-label="Navegação do painel">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <UserMenu
          name={user?.name ?? ''}
          email={user?.email ?? ''}
          avatarUrl={user?.photoUrl ?? null}
          loading={!user}
          onSignOut={handleSignOut}
          onUpdateProfile={async () => {}}
        />
      </div>
    </header>
  );
}
