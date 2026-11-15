'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Avatar } from './Avatar';
import styles from './editProfileModal.module.css';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ProfileFormData {
  name: string;
  email: string;
  avatar: File | null;
  removeAvatar: boolean;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initial: { name: string; email: string; avatarUrl?: string | null };
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

export function EditProfileModal({ open, onClose, initial, onSubmit }: EditProfileModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="edit-profile-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {open && <EditProfileForm initial={initial} onSubmit={onSubmit} onClose={onClose} />}
    </dialog>
  );
}

function EditProfileForm({
  initial,
  onSubmit,
  onClose,
}: Pick<EditProfileModalProps, 'initial' | 'onSubmit' | 'onClose'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [file, setFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentAvatar = previewUrl ?? (removeAvatar ? null : initial.avatarUrl);
  const hasAvatar = !!currentAvatar;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = '';
    if (!picked) return;

    if (!ACCEPTED_TYPES.includes(picked.type)) {
      setError('Formato inválido. Use PNG, JPG ou WebP.');
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError('A imagem deve ter no máximo 2 MB.');
      return;
    }

    setError(null);
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
    setRemoveAvatar(false);
  }

  function handleRemovePhoto() {
    setFile(null);
    setPreviewUrl(null);
    setRemoveAvatar(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Informe o nome.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), avatar: file, removeAvatar });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <header className={styles.header}>
        <h2 id="edit-profile-title" className={styles.title}>
          Editar perfil
        </h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>
      </header>

      <div className={styles.photoRow}>
        <Avatar name={name || initial.name} src={currentAvatar} size={72} />
        <div className={styles.photoActions}>
          <span className={styles.label}>Foto da empresa</span>
          <div className={styles.photoButtons}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              {hasAvatar ? 'Trocar foto' : 'Escolher foto'}
            </button>
            {hasAvatar && (
              <button
                type="button"
                className={styles.ghost}
                onClick={handleRemovePhoto}
                disabled={saving}
              >
                Remover
              </button>
            )}
          </div>
          <span className={styles.hint}>PNG, JPG ou WebP, até 2 MB.</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className={styles.fileInput}
          onChange={handleFileChange}
          tabIndex={-1}
        />
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Nome</span>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          disabled={saving}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>E-mail</span>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={saving}
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <footer className={styles.footer}>
        <button type="button" className={styles.secondary} onClick={onClose} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className={styles.primary} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </footer>
    </form>
  );
}
