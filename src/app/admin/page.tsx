'use client';

import { useEffect, useState } from 'react';
import { Check, RefreshCw, X, Plus, FileText, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { CreateCompanyModal } from './CreateCompanyModal';
import { getCompanies, updateCompanyStatus, type AdminCompany } from '@/lib/company/CompanyService';
import { StoreHeader } from '@/components/layout/StoreHeader/StoreHeader';
import Button from '@/components/ui/Button';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      toast.success(`${company.name} aprovada com sucesso.`);
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
      toast.success(`${company.name} foi desativada.`);
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
          <div>
            <h1 className={styles.title}>Empresas parceiras</h1>
            <p className={styles.subtitle}>
              Gerencie os acessos e informações das marcas na plataforma Piê.
            </p>
          </div>
        </header>

        <div className={styles.statsBar}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{pendingCount}</span>
              <span className={styles.statLabel}>Pendentes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{companies.length}</span>
              <span className={styles.statLabel}>Nesta lista</span>
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

          <div className={styles.actionGroup}>
            <Button
              variant="primary"
              className={styles.actionBtn}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              Cadastrar Empresa
            </Button>

            <Button
              variant="secondary"
              className={styles.actionBtn}
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={pageStatus === 'loading'}
            >
              <RefreshCw size={16} className={pageStatus === 'loading' ? styles.spin : ''} />
              Atualizar
            </Button>
          </div>
        </div>

        <hr className={styles.divider} />

        {pageStatus === 'loading' && (
          <div className={styles.emptyState}>
            <RefreshCw size={24} className={styles.spin} />
            <p className={styles.notice}>Carregando empresas…</p>
          </div>
        )}

        {pageStatus === 'error' && (
          <div className={styles.emptyState}>
            <p className={`${styles.notice} ${styles.noticeError}`}>
              Não foi possível carregar as empresas. Verifique sua conexão.
            </p>
          </div>
        )}

        {pageStatus === 'ready' && companies.length === 0 && (
          <div className={styles.emptyState}>
            <Building2 size={32} className={styles.emptyIcon} />
            <p className={styles.notice}>Nenhuma empresa encontrada com este filtro.</p>
          </div>
        )}

        {pageStatus === 'ready' && companies.length > 0 && (
          <div className={styles.grid}>
            {companies.map((company) => (
              <div key={company.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.logoPlaceholder}>
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.cardHeaderInfo}>
                    <p className={styles.storeName}>{company.name}</p>
                    <span className={`${styles.statusBadge} ${styles[`status${company.status}`]}`}>
                      {STATUS_LABELS[company.status] ?? company.status}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFields}>
                  <div className={styles.field}>
                    <FileText size={14} className={styles.fieldIcon} />
                    <div className={styles.fieldContent}>
                      <p className={styles.fieldLabel}>CNPJ</p>
                      <p className={styles.fieldValue}>{company.cnpj}</p>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <Mail size={14} className={styles.fieldIcon} />
                    <div className={styles.fieldContent}>
                      <p className={styles.fieldLabel}>E-mail de contato</p>
                      <p className={styles.fieldEmail}>{company.email}</p>
                    </div>
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
      <CreateCompanyModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
