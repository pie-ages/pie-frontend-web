'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import FormHeader from '@/components/ui/FormHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import {
  requestPasswordRecovery,
  revokeRecoverySession,
  updatePassword,
  verifyRecoveryCode,
} from '@/lib/auth/AuthService';
import {
  normalizeRecoveryCode,
  validateNewPassword,
  validateRecoveryCode,
  validateRecoveryEmail,
} from '@/lib/auth/password-recovery.validation';
import type { NewPasswordErrors, NewPasswordValues } from '@/types/passwordRecovery';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error';

import styles from './forgot-password.module.css';

const ERROR_TOAST_ID = 'recovery-error';

type RecoveryStep = 'email' | 'code' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [step, setStep] = useState<RecoveryStep>('email');
  const [email, setEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isInitializing, router]);

  const handleCodeSent = (recoveryEmail: string) => {
    setEmail(recoveryEmail);
    setStep('code');
  };

  const handleVerified = (token: string) => {
    setRecoveryToken(token);
    setStep('password');
  };

  const handleBack = () => {
    toast.dismiss(ERROR_TOAST_ID);
    setRecoveryToken(null);
    setStep('email');
  };

  const handlePasswordReset = () => {
    router.replace('/login');
    toast.success('Senha redefinida!', {
      description: 'Entre com a sua nova senha para acessar sua conta.',
    });
  };

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        {step === 'email' && (
          <RequestCodeStep
            initialEmail={email}
            onCodeSent={handleCodeSent}
            onBackToLogin={() => router.push('/login')}
          />
        )}

        {step === 'code' && (
          <VerifyCodeStep email={email} onVerified={handleVerified} onBack={handleBack} />
        )}

        {step === 'password' && recoveryToken && (
          <NewPasswordStep
            recoveryToken={recoveryToken}
            onPasswordReset={handlePasswordReset}
            onBack={handleBack}
          />
        )}
      </div>
    </AuthLayout>
  );
}

interface RequestCodeStepProps {
  initialEmail: string;
  onCodeSent: (email: string) => void;
  onBackToLogin: () => void;
}

function RequestCodeStep({ initialEmail, onCodeSent, onBackToLogin }: RequestCodeStepProps) {
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(undefined);
    toast.dismiss(ERROR_TOAST_ID);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    const validationError = validateRecoveryEmail(normalizedEmail);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    toast.dismiss(ERROR_TOAST_ID);
    setIsLoading(true);

    try {
      await requestPasswordRecovery(normalizedEmail);
      onCodeSent(normalizedEmail);
    } catch (error) {
      toast.error(getRequestCodeErrorMessage(error), { id: ERROR_TOAST_ID });
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormHeader
        title="Recuperar acesso"
        subtitle="Informe o e-mail da sua conta e enviaremos um código de 6 dígitos para redefinir sua senha."
      />

      <form onSubmit={handleSubmit} className={styles.formGrid} noValidate>
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="contato@suamarca.com.br"
          value={email}
          onChange={handleChange}
          disabled={isLoading}
          error={emailError}
          required
        />

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? 'Enviando...' : 'Enviar código'}
          </Button>

          <Button type="button" onClick={onBackToLogin} disabled={isLoading} variant="secondary">
            Voltar para o login
          </Button>
        </div>
      </form>
    </>
  );
}

interface VerifyCodeStepProps {
  email: string;
  onVerified: (recoveryToken: string) => void;
  onBack: () => void;
}

function VerifyCodeStep({ email, onVerified, onBack }: VerifyCodeStepProps) {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const isBusy = isVerifying || isResending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(normalizeRecoveryCode(e.target.value));
    setCodeError(undefined);
    toast.dismiss(ERROR_TOAST_ID);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateRecoveryCode(code);
    if (validationError) {
      setCodeError(validationError);
      return;
    }

    toast.dismiss(ERROR_TOAST_ID);
    setIsVerifying(true);

    try {
      const recoveryToken = await verifyRecoveryCode(email, code);
      onVerified(recoveryToken);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Não foi possível verificar o código. Tente novamente.'),
        { id: ERROR_TOAST_ID },
      );
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    toast.dismiss(ERROR_TOAST_ID);
    setIsResending(true);

    try {
      await requestPasswordRecovery(email);
      setCode('');
      setCodeError(undefined);
      toast.success('Novo código solicitado. Confira seu e-mail.');
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Não foi possível reenviar o código. Tente novamente.'),
        { id: ERROR_TOAST_ID },
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <FormHeader
        title="Verificar código"
        subtitle={`Se houver uma conta com ${email}, você receberá um código de 6 dígitos. Confira também a caixa de spam.`}
      />

      <form onSubmit={handleVerify} className={styles.formGrid} noValidate>
        <Input
          label="Código"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={handleChange}
          disabled={isBusy}
          error={codeError}
          required
        />

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={isBusy} variant="primary">
            {isVerifying ? 'Verificando...' : 'Verificar código'}
          </Button>

          <Button type="button" onClick={handleResend} disabled={isBusy} variant="secondary">
            {isResending ? 'Reenviando...' : 'Reenviar código'}
          </Button>

          <Button type="button" onClick={onBack} disabled={isBusy} variant="secondary">
            Voltar
          </Button>
        </div>
      </form>
    </>
  );
}

interface NewPasswordStepProps {
  recoveryToken: string;
  onPasswordReset: () => void;
  onBack: () => void;
}

function NewPasswordStep({ recoveryToken, onPasswordReset, onBack }: NewPasswordStepProps) {
  const [values, setValues] = useState<NewPasswordValues>({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<NewPasswordErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    toast.dismiss(ERROR_TOAST_ID);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateNewPassword(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    toast.dismiss(ERROR_TOAST_ID);
    setIsLoading(true);

    try {
      await updatePassword(recoveryToken, values.password);
    } catch (error) {
      toast.error(getResetPasswordErrorMessage(error), { id: ERROR_TOAST_ID });
      setIsLoading(false);
      return;
    }

    revokeRecoverySession(recoveryToken).catch(() => {});
    onPasswordReset();
  };

  return (
    <>
      <FormHeader
        title="Nova senha"
        subtitle="Escolha uma nova senha para voltar a acessar sua conta."
      />

      <form onSubmit={handleSubmit} className={styles.formGrid} noValidate>
        <Input
          label="Senha"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          disabled={isLoading}
          error={errors.password}
          required
          rightElement={
            <PasswordVisibilityButton
              isVisible={showPassword}
              onToggle={() => setShowPassword((visible) => !visible)}
            />
          }
        />

        <Input
          label="Confirmar Senha"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          error={errors.confirmPassword}
          required
          rightElement={
            <PasswordVisibilityButton
              isVisible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((visible) => !visible)}
            />
          }
        />

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? 'Salvando...' : 'Salvar senha'}
          </Button>

          <Button type="button" onClick={onBack} disabled={isLoading} variant="secondary">
            Voltar
          </Button>
        </div>
      </form>
    </>
  );
}

interface PasswordVisibilityButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

function PasswordVisibilityButton({ isVisible, onToggle }: PasswordVisibilityButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.togglePasswordBtn}
      aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
    >
      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function getRequestCodeErrorMessage(error: unknown): string {
  if (getApiErrorStatus(error) === 400) return 'Insira um formato de e-mail válido.';
  return getApiErrorMessage(error, 'Não foi possível enviar o código. Tente novamente.');
}

function getResetPasswordErrorMessage(error: unknown): string {
  if (getApiErrorStatus(error) === 401)
    return 'Seu código expirou. Volte e solicite um novo código.';
  return getApiErrorMessage(error, 'Não foi possível redefinir a senha. Tente novamente.');
}
