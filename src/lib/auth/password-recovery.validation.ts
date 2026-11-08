import type { NewPasswordErrors, NewPasswordValues } from '@/types/passwordRecovery';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECOVERY_CODE_PATTERN = /^\d{6}$/;
const RECOVERY_CODE_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 6;

export function validateRecoveryEmail(email: string): string | undefined {
  if (!email) return 'Informe o e-mail.';
  if (!EMAIL_PATTERN.test(email)) return 'Insira um formato de e-mail válido.';
  return undefined;
}

export function normalizeRecoveryCode(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, RECOVERY_CODE_LENGTH);
}

export function validateRecoveryCode(code: string): string | undefined {
  return RECOVERY_CODE_PATTERN.test(code) ? undefined : 'Informe o código de 6 dígitos.';
}

export function validateNewPassword(values: NewPasswordValues): NewPasswordErrors {
  const errors: NewPasswordErrors = {};

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirme a senha.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
}
