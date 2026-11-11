'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { createCompanySchema, type CreateCompanyFormData } from '@/app/admin/schema';
import { useCreateCompany } from '@/hooks/useCreateCompany';
import Button from '@/components/ui/Button';

import styles from './createCompanyModal.module.css';

const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

interface CreateCompanyModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCompanyModal({ open, onClose }: CreateCompanyModalProps) {
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
      aria-labelledby="create-company-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {open && <CreateCompanyForm onClose={onClose} />}
    </dialog>
  );
}

function CreateCompanyForm({ onClose }: Pick<CreateCompanyModalProps, 'onClose'>) {
  const { mutateAsync, isPending } = useCreateCompany();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    mode: 'onBlur',
  });

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCNPJ(e.target.value);
    setValue('cnpj', maskedValue, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateCompanyFormData) => {
    try {
      await mutateAsync(data);
      toast.success('Empresa cadastrada com sucesso!', {
        description: `${data.razaoSocial} foi adicionada ao painel.`,
      });
      onClose();
    } catch {
      toast.error('Não foi possível cadastrar a empresa. Tente novamente.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <header className={styles.header}>
        <h2 id="create-company-title" className={styles.title}>
          Cadastrar Nova Empresa
        </h2>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fechar"
          disabled={isPending}
        >
          <X size={20} />
        </button>
      </header>

      <div className={styles.fieldsGrid}>
        <label className={styles.field}>
          <span className={styles.label}>Razão social *</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Nove Confecções Ltda"
            {...register('razaoSocial')}
            disabled={isPending}
          />
          {errors.razaoSocial && <span className={styles.error}>{errors.razaoSocial.message}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Nome da marca *</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Ex: Ateliê Nove"
            {...register('nomeMarca')}
            disabled={isPending}
          />
          {errors.nomeMarca && <span className={styles.error}>{errors.nomeMarca.message}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>CNPJ *</span>
          <input
            type="text"
            className={styles.input}
            placeholder="00.000.000/0001-00"
            maxLength={18}
            {...register('cnpj')}
            onChange={handleCnpjChange}
            disabled={isPending}
          />
          {errors.cnpj && <span className={styles.error}>{errors.cnpj.message}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>E-mail de contato *</span>
          <input
            type="email"
            className={styles.input}
            placeholder="contato@suamarca.com.br"
            {...register('email')}
            disabled={isPending}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </label>
      </div>

      <footer className={styles.footer}>
        <Button
          type="button"
          variant="secondary"
          className={styles.btnCancel}
          onClick={onClose}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className={styles.btnSubmit} disabled={isPending}>
          {isPending ? 'Salvando...' : 'Cadastrar Empresa'}
        </Button>
      </footer>
    </form>
  );
}
