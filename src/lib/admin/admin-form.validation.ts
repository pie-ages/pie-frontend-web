import type { AdminFormErrors, AdminFormValues } from '@/types/adminForm';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ADMIN_PASSWORD_MIN_LENGTH = 8;

export function validateAdminForm(values: AdminFormValues): AdminFormErrors {
  const errors: AdminFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Informe o nome.';
  }

  if (!values.email.trim()) {
    errors.email = 'Informe o e-mail.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Insira um formato de e-mail válido.';
  }

  if (!values.password) {
    errors.password = 'Informe a senha.';
  } else if (values.password.length < ADMIN_PASSWORD_MIN_LENGTH) {
    errors.password = `A senha deve ter ao menos ${ADMIN_PASSWORD_MIN_LENGTH} caracteres.`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirme a senha.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
}
