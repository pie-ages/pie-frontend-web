'use client';

import { useEffect, useState } from 'react';
import { Check, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { getCompanies, updateCompanyStatus, type AdminCompany } from '@/lib/company/CompanyService';
import { StoreHeader } from '@/components/layout/StoreHeader';
import styles from './page.module.css';

type PageStatus = 'loading' | 'error' | 'ready';
type FilterStatus = 'ALL' | 'PENDING' | 'ACTIVE' | 'INACTIVE';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativa',
  INACTIVE: 'Inativa',
};

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'ALL', label: 'Todas' },
  { key: 'PENDING', label: 'Pendentes' },
  { key: 'ACTIVE', label: 'Ativas' },
  { key: 'INACTIVE', label: 'Inativas' },
];

export default function AdminPage() {
  const [pageStatus, setPageStatus] = useState<PageStatus>('loading');
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('PENDING');
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    getCompanies(filter === 'ALL' ? undefined : filter)
      .then((data) => {
        if (!active) return;
        setCompanies(data);
        setPageStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setPageStatus('error');
      });

    return () => {
      active = false;
    };
  }, [filter, refreshKey]);

  const handleApprove = async (company: AdminCompany) => {
    setPendingIds((s) => new Set(s).add(company.id));
    try {
      await updateCompanyStatus(company.id, 'ACTIVE');
      toast.success(`${company.name} aprovada.`);
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } catch {
      toast.error('Não foi possível aprovar a loja.');
    } finally {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(company.id);
        return n;
      });
    }
  };

  const handleDeactivate = async (company: AdminCompany) => {
    setPendingIds((s) => new Set(s).add(company.id));
    try {
      await updateCompanyStatus(company.id, 'INACTIVE');
      toast.success(`${company.name} desativada.`);
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } catch {
      toast.error('Não foi possível desativar a loja.');
    } finally {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(company.id);
        return n;
      });
    }
  };

  const handleReactivate = async (company: AdminCompany) => {
    setPendingIds((s) => new Set(s).add(company.id));
    try {
      await updateCompanyStatus(company.id, 'ACTIVE');
      toast.success(`${company.name} reativada.`);
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } catch {
      toast.error('Não foi possível reativar a loja.');
    } finally {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(company.id);
        return n;
      });
    }
  };

  const pendingCount = companies.filter((c) => c.status === 'PENDING').length;

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Empresas</h1>
          <p className={styles.subtitle}>Gerencie e aprove as lojas cadastradas na plataforma.</p>
        </header>

        <div className={styles.statsBar}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{pendingCount}</span>
              <span className={styles.statLabel}>Pendentes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{companies.length}</span>
              <span className={styles.statLabel}>Nessa lista</span>
            </div>
          </div>

          <div className={styles.filterGroup}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`${styles.filterButton} ${filter === f.key ? styles.filterButtonActive : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            className={styles.reloadButton}
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={pageStatus === 'loading'}
          >
            <RefreshCw size={14} />
            Atualizar
          </button>
        </div>

        <hr className={styles.divider} />

        {pageStatus === 'loading' && <p className={styles.notice}>Carregando empresas…</p>}

        {pageStatus === 'error' && (
          <p className={`${styles.notice} ${styles.noticeError}`}>
            Não foi possível carregar as empresas.
          </p>
        )}

        {pageStatus === 'ready' && companies.length === 0 && (
          <p className={styles.notice}>Nenhuma empresa encontrada.</p>
        )}

        {pageStatus === 'ready' && companies.length > 0 && (
          <div className={styles.grid}>
            {companies.map((company) => (
              <div key={company.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.logoPlaceholder} />
                  <div>
                    <p className={styles.storeName}>{company.name}</p>
                    <span className={`${styles.statusBadge} ${styles[`status${company.status}`]}`}>
                      {STATUS_LABELS[company.status] ?? company.status}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFields}>
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>CNPJ</p>
                    <p className={styles.fieldValue}>{company.cnpj}</p>
                  </div>
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>E-mail</p>
                    <p className={styles.fieldEmail}>{company.email}</p>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {company.status === 'PENDING' && (
                    <>
                      <button
                        className={styles.approveButton}
                        disabled={pendingIds.has(company.id)}
                        onClick={() => handleApprove(company)}
                      >
                        <Check size={14} />
                        Aprovar
                      </button>
                      <button
                        className={styles.refuseButton}
                        disabled={pendingIds.has(company.id)}
                        onClick={() => handleDeactivate(company)}
                      >
                        <X size={14} />
                        Recusar
                      </button>
                    </>
                  )}

                  {company.status === 'ACTIVE' && (
                    <button
                      className={styles.refuseButton}
                      disabled={pendingIds.has(company.id)}
                      onClick={() => handleDeactivate(company)}
                    >
                      <X size={14} />
                      Desativar
                    </button>
                  )}

                  {company.status === 'INACTIVE' && (
                    <button
                      className={styles.approveButton}
                      disabled={pendingIds.has(company.id)}
                      onClick={() => handleReactivate(company)}
                    >
                      <Check size={14} />
                      Reativar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
