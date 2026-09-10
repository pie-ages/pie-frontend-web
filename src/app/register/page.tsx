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

import styles from './register.module.css';

const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    site: '',
    razaoSocial: '',
    responsavel: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const finalValue = name === 'cnpj' ? maskCNPJ(value) : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    toast.dismiss('register-error');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      'nome',
      'cnpj',
      'razaoSocial',
      'responsavel',
      'email',
      'senha',
      'confirmarSenha',
    ];
    const hasEmptyFields = requiredFields.some(
      (field) => !formData[field as keyof typeof formData],
    );

    if (hasEmptyFields) {
      toast.error('Preencha todos os campos obrigatórios (*)', { id: 'register-error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Insira um formato de e-mail válido.', { id: 'register-error' });
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem.', { id: 'register-error' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log('Payload da API:', formData);
      setIsLoading(false);
      toast.success('Pedido enviado para análise!');
      router.push('/login');
    }, 2000);
  };

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <FormHeader
          title={<>Pedir entrada na plataforma</>}
          subtitle="A equipe do Piê revisa cada loja antes de liberar o painel. A resposta chega por e-mail em até 2 dias úteis."
        />

        <form onSubmit={handleRegister} className={styles.formGrid} noValidate>
          <Input
            label="Nome da marca"
            name="nome"
            placeholder="Ex: Ateliê Nove"
            value={formData.nome}
            onChange={handleChange}
            disabled={isLoading}
            required
            className={styles.fullWidth}
          />

          <Input
            label="CNPJ"
            name="cnpj"
            placeholder="00.000.000/0001-00"
            value={formData.cnpj}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <Input
            label="Site ou Instagram"
            name="site"
            placeholder="@atelie.nove"
            value={formData.site}
            onChange={handleChange}
            disabled={isLoading}
          />

          <Input
            label="Razão social"
            name="razaoSocial"
            placeholder="Nove Confecções Ltda"
            value={formData.razaoSocial}
            onChange={handleChange}
            disabled={isLoading}
            required
            className={styles.fullWidth}
          />

          <Input
            label="Responsável"
            name="responsavel"
            placeholder="Marina Bezerra"
            value={formData.responsavel}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <Input
            label="E-mail de contato"
            name="email"
            type="email"
            placeholder="contato@suamarca.com.br"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
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
          />

          <Input
            label="Confirmar Senha"
            name="confirmarSenha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirmarSenha}
            onChange={handleChange}
            disabled={isLoading}
            required
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

          <div className={styles.fullWidth}>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? 'Enviando pedido...' : 'Enviar pedido para análise'}
            </Button>
          </div>
        </form>

        <FormFooterLink text="Já possui cadastro?" linkText="Faça login" href="/login" />
      </div>
    </AuthLayout>
  );
}
