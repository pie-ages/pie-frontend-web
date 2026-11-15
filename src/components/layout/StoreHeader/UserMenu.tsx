'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Pencil } from 'lucide-react';
import { Avatar } from './Avatar';
import { EditProfileModal, type ProfileFormData } from './EditProfileModal';
import styles from './userMenu.module.css';

interface UserMenuProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
  loading?: boolean;
  onSignOut: () => void | Promise<void>;
  onUpdateProfile: (data: ProfileFormData) => Promise<void>;
}

export function UserMenu({
  name,
  email,
  avatarUrl,
  loading = false,
  onSignOut,
  onUpdateProfile,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = name || email.split('@')[0] || 'Minha conta';

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (loading) {
    return (
      <div className={styles.skeleton} aria-hidden="true">
        <span className={styles.skeletonAvatar} />
        <span className={styles.skeletonLines}>
          <span className={styles.skeletonLine} />
          <span className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        </span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menu da conta de ${displayName}`}
      >
        <Avatar name={displayName} src={avatarUrl} size={40} />
        <span className={styles.triggerInfo}>
          <span className={styles.triggerName}>{displayName}</span>
          {email && <span className={styles.triggerEmail}>{email}</span>}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.menuHeader}>
            <Avatar name={displayName} src={avatarUrl} size={48} />
            <div className={styles.menuInfo}>
              <span className={styles.menuLabel}>Conectado como</span>
              <span className={styles.menuName}>{displayName}</span>
              {email && <span className={styles.menuEmail}>{email}</span>}
            </div>
          </div>

          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false);
              setEditing(true);
            }}
          >
            <Pencil size={18} />
            Editar perfil
          </button>

          <button
            type="button"
            role="menuitem"
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
            onClick={onSignOut}
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      )}

      <EditProfileModal
        open={editing}
        onClose={() => setEditing(false)}
        initial={{ name, email, avatarUrl }}
        onSubmit={onUpdateProfile}
      />
    </div>
  );
}
