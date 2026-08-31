'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Insira um formato de e-mail válido.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const loginData = {
        email: email,
        password: password
      };
      
      console.log('Objeto JSON obtido:', JSON.stringify(loginData, null, 2));
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div>
          <h1 className={styles.brandTitle}>
            Piê <span className={styles.brandSubtitle}>/ para lojas</span>
          </h1>
        </div>
        <div>
          <h2 className={styles.mainHeading}>Sua loja dentro<br />do closet de clientes.</h2>
          <p className={styles.description}>
            Cadastre seus produtos uma vez. Piê recomenda cada peça para as clientes cujo estilo e colorimetria combinam com ela.
          </p>
        </div>
        <div className={styles.statsContainer}>
          <div>
            <p className={styles.statNumber}>32 mil</p>
            <p className={styles.statLabel}>PEÇAS NA VITRINE</p>
          </div>
          <div>
            <p className={styles.statNumber}>148</p>
            <p className={styles.statLabel}>LOJAS ATIVAS</p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Acessar o painel</h2>
          <p className={styles.formSubtitle}>Use o e-mail cadastrado no pedido da sua loja.</p>

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                placeholder="marina@atelienove.com.br"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Senha</label>
              <div className={styles.inputContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePasswordBtn}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.primaryBtn}
              >
                {isLoading ? 'Carregando...' : 'Entrar no painel'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/cadastro')}
                className={styles.secondaryBtn}
                disabled={isLoading}
              >
                Cadastrar loja
              </button>
            </div>
          </form>

          <div className={styles.footerText}>
            Esqueceu a senha? <a href="/recuperar-senha" className={styles.link}>Recuperar acesso</a>
          </div>
        </div>
      </div>
    </div>
  );
}
