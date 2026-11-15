'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { uploadCompanyLogo } from '@/lib/company/CompanyService';
import { type ProfileFormData } from './EditProfileModal';
import { UserMenu } from './UserMenu';
import styles from './storeHeader.module.css';

const COMPANY_NAV_ITEMS = [
  { label: 'Produtos', href: '/products' },
  { label: 'Importar', href: '/import' },
];

const ADMIN_NAV_ITEMS = [{ label: 'Empresas', href: '/admin' }];

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, updateUser } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : COMPANY_NAV_ITEMS;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  async function handleUpdateProfile(data: ProfileFormData) {
    if (!user) return;

    if (data.avatar) {
      try {
        const { photo_url } = await uploadCompanyLogo(user.id, data.avatar);
        const separator = photo_url.includes('?') ? '&' : '?';
        updateUser({ photoUrl: `${photo_url}${separator}t=${Date.now()}` });
        toast.success('Logo da empresa atualizada com sucesso!');
      } catch (err) {
        toast.error('Erro ao enviar a logo da empresa.');
        throw err;
      }
      return;
    }

    if (data.removeAvatar) {
      toast.info('A remoção da logo ainda não está disponível.');
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href={isAdmin ? '/admin' : '/products'} className={styles.brand}>
            <Image
              src="/pie.svg"
              alt="Piê"
              width={96}
              height={48}
              priority
              className={styles.logo}
            />
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
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    </header>
  );
}
