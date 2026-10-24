'use client';

import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import styles from './pending.module.css';

export default function PendingPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <div className={styles.wrapper}>
        <div className={styles.icon}>⏳</div>
        <h1 className={styles.title}>Cadastro em análise</h1>
        <p className={styles.description}>
          Sua loja foi cadastrada e está aguardando aprovação da equipe do Piê. Você receberá um
          e-mail assim que for aprovada, geralmente em até 2 dias úteis.
        </p>
        <button type="button" className={styles.backButton} onClick={() => router.push('/login')}>
          Voltar para o login
        </button>
      </div>
    </AuthLayout>
  );
}
