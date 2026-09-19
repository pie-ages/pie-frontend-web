'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpFromLine, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, ProductFilters, ProductStatus } from '@/types/products';
import { getProducts, updateProductAvailability } from '@/lib/products/products.service';
import { EMPTY_FILTERS, filterProducts, uniqueValues } from '@/lib/products/products.filters';
import { ProductsMetrics } from '@/components/products/ProductsMetrics';
import { ProductsFilter } from '@/components/products/ProductsFilter';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsPagination } from '@/components/products/ProductsPagination';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import styles from './page.module.css';

type Status = 'loading' | 'error' | 'ready';

const PER_PAGE_OPTIONS = [5, 10, 20];

export default function ProductsPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [pendingAvailabilityIds, setPendingAvailabilityIds] = useState<Set<string>>(new Set());
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading');
    getProducts({
      search: filters.search,
      status: filters.status,
      page: currentPage,
      size: perPage,
    })
      .then(({ items, total: serverTotal }) => {
        if (!active) return;
        setProducts(items);
        setTotal(serverTotal);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [filters.search, filters.status, currentPage, perPage]);

  const styleOptions = useMemo(() => uniqueValues(products, 'style'), [products]);
  const pieceOptions = useMemo(() => uniqueValues(products, 'piece'), [products]);
  const filteredProducts = useMemo(
    () => filterProducts(products, { ...filters, search: '', status: '' }),
    [products, filters],
  );

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const resultsLabel = `${filteredProducts.length} de ${total} produtos`;

  const applyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const applyAvailabilityChange = async (product: Product, nextStatus: ProductStatus) => {
    setPendingAvailabilityIds((current) => new Set(current).add(product.id));

    try {
      await updateProductAvailability(product.id, nextStatus);
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? { ...item, status: nextStatus } : item)),
      );
      toast.success(
        nextStatus === 'PUBLISHED'
          ? `${product.name} disponibilizado no catálogo.`
          : `${product.name} retirado do catálogo.`,
      );
    } catch {
      toast.error('Não foi possível atualizar a disponibilidade. Tente novamente.', {
        id: `availability-error-${product.id}`,
      });
    } finally {
      setPendingAvailabilityIds((current) => {
        const next = new Set(current);
        next.delete(product.id);
        return next;
      });
    }
  };

  const requestAvailabilityChange = (product: Product) => {
    if (product.status === 'PUBLISHED') {
      setProductToRemove(product);
      return;
    }

    applyAvailabilityChange(product, 'PUBLISHED');
  };

  const confirmRemoval = async () => {
    if (!productToRemove) return;
    await applyAvailabilityChange(productToRemove, 'PAUSED');
    setProductToRemove(null);
  };

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.pretitle}>Ateliê Nove</p>
            <h1 className={styles.title}>Produtos</h1>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton}>
              <ArrowUpFromLine size={16} style={{ color: 'inherit' }} />
              Importar CSV
            </button>
            <Link href="/products/new" className={styles.primaryButton}>
              <Plus size={16} style={{ color: 'inherit' }} />
              Novo produto
            </Link>
          </div>
        </header>

        {status === 'loading' && <p className={styles.notice}>Carregando produtos…</p>}

        {status === 'error' && (
          <p className={`${styles.notice} ${styles.noticeError}`}>
            Não foi possível carregar os produtos. Tente novamente mais tarde.
          </p>
        )}

        {status === 'ready' && (
          <>
            <ProductsMetrics />

            <ProductsFilter
              filters={filters}
              styleOptions={styleOptions}
              pieceOptions={pieceOptions}
              resultsLabel={resultsLabel}
              onFiltersChange={applyFilters}
            />

            {total === 0 && !hasActiveFilters && (
              <p className={styles.notice}>Nenhum produto cadastrado ainda.</p>
            )}

            {(total === 0 && hasActiveFilters) ||
              (total > 0 && filteredProducts.length === 0 && (
                <div className={styles.emptyState}>
                  <p>Nenhum produto encontrado com esses filtros.</p>
                  <button
                    type="button"
                    className={styles.clearFilters}
                    onClick={() => applyFilters(EMPTY_FILTERS)}
                  >
                    Limpar filtros
                  </button>
                </div>
              ))}

            {filteredProducts.length > 0 && (
              <div className={styles.tableSection}>
                <ProductsTable
                  products={filteredProducts}
                  pendingAvailabilityIds={pendingAvailabilityIds}
                  onToggleAvailability={requestAvailabilityChange}
                />
                <div className={styles.tableFooter}>
                  <label className={styles.perPageLabel}>
                    Exibindo
                    <select
                      className={styles.perPageSelect}
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      {PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    por página
                  </label>
                  <ProductsPagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={changePage}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {productToRemove && (
        <ConfirmDialog
          title="Retirar produto do catálogo?"
          description={`"${productToRemove.name}" vai parar de aparecer na vitrine. O produto não é apagado — você pode disponibilizá-lo novamente quando quiser.`}
          confirmLabel="Retirar"
          isConfirming={pendingAvailabilityIds.has(productToRemove.id)}
          onConfirm={confirmRemoval}
          onCancel={() => setProductToRemove(null)}
        />
      )}
    </div>
  );
}
