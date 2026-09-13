'use client';

import { useEffect, useState } from 'react';
import { Check, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import type { StoreRequest } from '@/types/store-requests';
import {
  getStoreRequests,
  updateStoreRequestStatus,
} from '@/lib/store-requests/store-requests.service';
import { StoreHeader } from '@/components/layout/StoreHeader';
import styles from './page.module.css';

type Status = 'loading' | 'error' | 'ready';

function formatSubmittedAt(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Enviado agora há pouco';
  if (diffHours < 24) return `Enviado há ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
  if (diffDays === 1) return 'Enviado ontem';
  return `Enviado há ${diffDays} dias`;
}

function getExternalLink(website: string | null): { url: string; label: string } | null {
  if (!website) return null;
  if (/instagram\.com/i.test(website)) {
    return {
      url: website.startsWith('http') ? website : `https://${website}`,
      label: 'Abrir Instagram',
    };
  }
  if (website.startsWith('http') || /\.[a-z]{2,}(\/|$)/i.test(website)) {
    const url = website.startsWith('http') ? website : `https://${website}`;
    return { url, label: 'Abrir site' };
  }
  return { url: `https://instagram.com/${website}`, label: 'Abrir Instagram' };
}

export default function StoreRequestsPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [requests, setRequests] = useState<StoreRequest[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getStoreRequests()
      .then((list) => {
        if (!active) return;
        setRequests(list);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const activeRequests = requests.filter((r) => r.status === 'AGUARDANDO');
  const waiting = activeRequests.length;
  const approvedToday = requests.filter((r) => r.status === 'APROVADA').length;
  const refusedToday = requests.filter((r) => r.status === 'RECUSADA').length;

  const handleAction = async (id: string, action: 'APROVADA' | 'RECUSADA') => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;

    setPendingIds((current) => new Set(current).add(id));
    try {
      const updated = await updateStoreRequestStatus(id, action);
      setRequests((current) => current.map((r) => (r.id === updated.id ? updated : r)));
      if (action === 'APROVADA') {
        toast.success(`${request.storeName} aprovada. Acesso enviado por e-mail.`);
      } else {
        toast(`${request.storeName} recusada.`);
      }
    } catch {
      toast.error('Não foi possível processar a solicitação. Tente novamente.');
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Solicitações de lojas</h1>
          <p className={styles.subtitle}>
            Lojas que pediram entrada na plataforma. Aprovar libera o painel de produtos e envia o
            acesso por e-mail.
          </p>
        </header>

        <div className={styles.statsBar}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong className={styles.statNumber}>{waiting}</strong>
              <span className={styles.statLabel}>aguardando</span>
            </div>
            <div className={styles.stat}>
              <strong className={styles.statNumber}>{approvedToday}</strong>
              <span className={styles.statLabel}>aprovadas hoje</span>
            </div>
            <div className={styles.stat}>
              <strong className={styles.statNumber}>{refusedToday}</strong>
              <span className={styles.statLabel}>recusadas hoje</span>
            </div>
          </div>
          <button
            type="button"
            className={styles.reloadButton}
            onClick={() => {
              setStatus('loading');
              setReloadKey((k) => k + 1);
            }}
            disabled={status === 'loading'}
          >
            <RefreshCw size={14} style={{ color: 'inherit' }} />
            Recarregar fila
          </button>
        </div>

        <hr className={styles.divider} />

        {status === 'loading' && <p className={styles.notice}>Carregando solicitações…</p>}

        {status === 'error' && (
          <p className={`${styles.notice} ${styles.noticeError}`}>
            Não foi possível carregar as solicitações. Tente novamente.
          </p>
        )}

        {status === 'ready' && activeRequests.length === 0 && (
          <p className={styles.notice}>Nenhuma solicitação aguardando aprovação.</p>
        )}

        {status === 'ready' && activeRequests.length > 0 && (
          <div className={styles.grid}>
            {activeRequests.map((request) => {
              const isPending = pendingIds.has(request.id);
              const externalLink = getExternalLink(request.website);
              const siteInstagram = request.website ?? '—';

              return (
                <div key={request.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.logoPlaceholder} aria-hidden="true" />
                    <div>
                      <p className={styles.storeName}>{request.storeName}</p>
                      <p className={styles.submittedAt}>{formatSubmittedAt(request.submittedAt)}</p>
                    </div>
                  </div>

                  <div className={styles.cardFields}>
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>Razão Social</p>
                      <p className={styles.fieldValue}>{request.razaoSocial}</p>
                    </div>
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>CNPJ</p>
                      <p className={styles.fieldValue}>{request.cnpj}</p>
                    </div>
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>Site / Instagram</p>
                      <p className={styles.fieldValue}>{siteInstagram}</p>
                    </div>
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>Responsável</p>
                      <p className={styles.fieldValue}>{request.responsavelName}</p>
                      <p className={styles.fieldEmail}>{request.responsavelEmail}</p>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.approveButton}
                      onClick={() => handleAction(request.id, 'APROVADA')}
                      disabled={isPending}
                    >
                      <Check size={14} style={{ color: 'inherit' }} />
                      Aprovar loja
                    </button>
                    <button
                      type="button"
                      className={styles.refuseButton}
                      onClick={() => handleAction(request.id, 'RECUSADA')}
                      disabled={isPending}
                    >
                      <X size={14} style={{ color: 'inherit' }} />
                      Recusar
                    </button>
                    {externalLink && (
                      <a
                        href={externalLink.url}
                        className={styles.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {externalLink.label}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
