'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import FormHeader from '@/components/ui/FormHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FormFooterLink from '@/components/ui/FormFooterLink';
import { login, saveToken } from '@/lib/auth/AuthService';

import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    toast.dismiss('login-error');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      toast.error('Por favor, preencha todos os campos.', { id: 'login-error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Insira um formato de e-mail válido.', { id: 'login-error' });
      return;
    }

    setIsLoading(true);

    try {
      const { token } = await login(formData.email, formData.senha);
      saveToken(token);
      toast.success('Login realizado com sucesso!');
      router.push('/products');
    } catch {
      toast.error('E-mail ou senha inválidos.', { id: 'login-error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <FormHeader
          title="Acessar o painel"
          subtitle="Use o e-mail cadastrado no pedido da sua loja."
        />

        <form onSubmit={handleLogin} className={styles.formGrid} noValidate>
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="contato@suamarca.com.br"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
            className={styles.fullWidth}
          />

          <Input
            label="Senha"
            name="senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.senha}
            onChange={handleChange}
            disabled={isLoading}
            required
            className={styles.fullWidth}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePasswordBtn}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className={styles.buttonGroup}>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? 'Acessando...' : 'Entrar no painel'}
            </Button>

            <Button
              type="button"
              onClick={() => router.push('/register')}
              disabled={isLoading}
              variant="secondary"
            >
              Cadastrar loja
            </Button>
          </div>
        </form>

        <FormFooterLink
          text="Esqueceu a senha?"
          linkText="Recuperar acesso"
          href="/esqueci-senha"
        />
      </div>
    </AuthLayout>
  );
}
