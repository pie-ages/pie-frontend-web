'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { StoreHeader } from '@/components/layout/StoreHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createAdmin, getApiErrorMessage } from '@/lib/admin/AdminService';
import { ADMIN_PASSWORD_MIN_LENGTH, validateAdminForm } from '@/lib/admin/admin-form.validation';
import {
  EMPTY_ADMIN_FORM_VALUES,
  type AdminFormErrors,
  type AdminFormValues,
} from '@/types/adminForm';

import styles from './page.module.css';

export default function NewAdminPage() {
  const router = useRouter();
  const [values, setValues] = useState<AdminFormValues>(EMPTY_ADMIN_FORM_VALUES);
  const [errors, setErrors] = useState<AdminFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateAdminForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Corrija os campos destacados.', { id: 'admin-create-error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdmin({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      toast.success(`Administrador ${values.name.trim()} criado.`);
      router.push('/admin');
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Não foi possível criar o administrador. Tente novamente.'),
        { id: 'admin-create-error' },
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <Link href="/admin" className={styles.breadcrumb}>
          <ChevronLeft size={16} />
          Voltar para empresas
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Novo administrador</h1>
          <p className={styles.subtitle}>
            Cadastre uma pessoa para ajudar a gerenciar a plataforma Piê.
          </p>
        </header>

        <div className={styles.warning} role="note">
          <ShieldAlert size={18} className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>
            Esta conta será criada com <strong>perfil de administrador</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Nome"
            name="name"
            placeholder="Ex: Marina Bezerra"
            autoComplete="off"
            value={values.name}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.name}
            required
            className={styles.fullWidth}
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="nome@pie.com.br"
            autoComplete="off"
            value={values.email}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.email}
            required
            className={styles.fullWidth}
          />

          <Input
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={`Mínimo de ${ADMIN_PASSWORD_MIN_LENGTH} caracteres`}
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.password}
            required
          />

          <Input
            label="Confirmar senha"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.confirmPassword}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={styles.togglePasswordBtn}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className={styles.actions}>
            <Link href="/admin" className={styles.cancelLink}>
              Cancelar
            </Link>
            <Button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? 'Criando administrador...' : 'Criar administrador'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
