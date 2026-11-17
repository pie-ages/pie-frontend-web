'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { updateCompany, uploadCompanyLogo, removeCompanyLogo } from '@/lib/company/CompanyService';
import { type ProfileFormData } from './EditProfileModal';
import { UserMenu } from './UserMenu';
import styles from './storeHeader.module.css';

const ADMIN_NAV_ITEMS = [{ label: 'Empresas', href: '/admin' }];

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, updateUser } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  async function handleUpdateProfile(data: ProfileFormData) {
    if (!user) return;

    try {
      const updated = await updateCompany(user.id, { name: data.name, email: data.email });
      updateUser({ name: updated.name, email: updated.email });

      if (data.avatar) {
        const { photo_url } = await uploadCompanyLogo(user.id, data.avatar);
        const separator = photo_url.includes('?') ? '&' : '?';
        updateUser({ photoUrl: `${photo_url}${separator}t=${Date.now()}` });
      } else if (data.removeAvatar) {
        await removeCompanyLogo(user.id);
        updateUser({ photoUrl: null });
      }

      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      toast.error('Erro ao salvar o perfil.');
      throw err;
    }
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

          {isAdmin && (
            <nav className={styles.nav} aria-label="Navegação do painel">
              {ADMIN_NAV_ITEMS.map((item) => (
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
          )}
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
