'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, PackageOpen, Plus, RefreshCw, SearchX } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, ProductFilters, ProductStatus } from '@/types/products';
import {
  getProducts,
  getProductCount,
  updateProductAvailability,
  deleteProduct,
  duplicateProduct,
} from '@/lib/products/ProductsService';
import { EMPTY_FILTERS, filterProducts, uniqueValues } from '@/lib/products/products.filters';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductsMetrics } from '@/components/products/ProductsMetrics';
import { ProductsFilter } from '@/components/products/ProductsFilter';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsPagination } from '@/components/products/ProductsPagination';
import { StoreHeader } from '@/components/layout/StoreHeader/StoreHeader';
import Button from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import styles from './page.module.css';

type Status = 'loading' | 'error' | 'ready';

const PER_PAGE_OPTIONS = [5, 10, 20];

export default function ProductsPage() {
  const router = useRouter();
  const { user, isInitializing } = useAuth();
  const companyId = user?.id ?? '';
  const [status, setStatus] = useState<Status>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(() => {
    if (typeof window === 'undefined') return 5;
    const saved = Number(localStorage.getItem('products:perPage'));
    return PER_PAGE_OPTIONS.includes(saved) ? saved : 5;
  });
  const [pendingAvailabilityIds, setPendingAvailabilityIds] = useState<Set<string>>(new Set());
  const [pendingActionIds, setPendingActionIds] = useState<Set<string>>(new Set());
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [publishedCount, setPublishedCount] = useState<number | null>(null);
  const [draftCount, setDraftCount] = useState<number | null>(null);

  const isFirstLoad = useRef(true);
  const [isFetching, setIsFetching] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 400);

  const refreshCounts = useCallback(() => {
    if (!companyId) return;
    Promise.all([getProductCount(companyId, 'PUBLISHED'), getProductCount(companyId, 'DRAFT')])
      .then(([pub, draft]) => {
        setPublishedCount(pub);
        setDraftCount(draft);
      })
      .catch(() => {
        toast.error('Não foi possível atualizar o resumo do catálogo. Tente novamente.', {
          id: 'products-count-error',
        });
      });
  }, [companyId]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const fetchProducts = useCallback(() => {
    let active = true;
    if (!companyId) return () => {};

    if (isFirstLoad.current) {
      setStatus('loading');
    } else {
      setIsFetching(true);
    }

    getProducts(companyId, {
      search: debouncedSearch,
      status: filters.status,
      page: currentPage,
      size: perPage,
    })
      .then(({ items, total: serverTotal }) => {
        if (!active) return;
        isFirstLoad.current = false;
        setProducts(items);
        setTotal(serverTotal);
        setStatus('ready');
        setIsFetching(false);
      })
      .catch(() => {
        if (!active) return;
        isFirstLoad.current = false;
        setStatus((s) => (s === 'ready' ? 'ready' : 'error'));
        setIsFetching(false);
      });

    return () => {
      active = false;
    };
  }, [companyId, debouncedSearch, filters.status, currentPage, perPage]);

  useEffect(() => {
    return fetchProducts();
  }, [fetchProducts]);

  const retryProducts = () => {
    if (!companyId) {
      window.location.reload();
      return;
    }
    fetchProducts();
  };

  const styleOptions = useMemo(() => uniqueValues(products, 'style'), [products]);
  const pieceOptions = useMemo(() => uniqueValues(products, 'piece'), [products]);
  const filteredProducts = useMemo(
    () => filterProducts(products, { ...filters, search: '', status: '' }),
    [products, filters],
  );

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const pageStatus = !companyId && !isInitializing ? 'error' : status;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const hasClientFilters = filters.piece !== '' || filters.style !== '' || filters.size !== '';
  const resultsLabel = hasClientFilters
    ? `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} na página`
    : `${total} produto${total !== 1 ? 's' : ''}`;

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
      await updateProductAvailability(product.id, nextStatus, companyId);
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? { ...item, status: nextStatus } : item)),
      );
      toast.success(
        nextStatus === 'PUBLISHED'
          ? `${product.name} disponibilizado no catálogo.`
          : `${product.name} retirado do catálogo.`,
      );
      refreshCounts();
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

  const handleDuplicate = async (product: Product) => {
    setPendingActionIds((current) => new Set(current).add(product.id));
    try {
      await duplicateProduct(product.id, companyId);
      toast.success(`Cópia de "${product.name}" criada.`);
      refreshCounts();
      if (currentPage === 1) {
        const { items, total: serverTotal } = await getProducts(companyId, {
          search: filters.search,
          status: filters.status,
          page: 1,
          size: perPage,
        });
        setProducts(items);
        setTotal(serverTotal);
      } else {
        setCurrentPage(1);
      }
    } catch {
      toast.error('Não foi possível duplicar o produto. Tente novamente.');
    } finally {
      setPendingActionIds((current) => {
        const next = new Set(current);
        next.delete(product.id);
        return next;
      });
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const target = productToDelete;
    setProductToDelete(null);
    setPendingActionIds((current) => new Set(current).add(target.id));
    try {
      await deleteProduct(target.id);
      toast.success(`"${target.name}" foi excluído.`);
      setProducts((current) => current.filter((p) => p.id !== target.id));
      setTotal((t) => t - 1);
      refreshCounts();
    } catch {
      toast.error('Não foi possível excluir o produto. Tente novamente.');
    } finally {
      setPendingActionIds((current) => {
        const next = new Set(current);
        next.delete(target.id);
        return next;
      });
    }
  };

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Produtos</h1>
            <p className={styles.subtitle}>
              Gerencie as peças, disponibilidade e variações exibidas na sua vitrine.
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="primary"
              className={styles.newProductButton}
              onClick={() => router.push('/products/new')}
            >
              <Plus size={18} strokeWidth={2.25} />
              <span>Novo produto</span>
            </Button>
          </div>
        </header>

        {pageStatus === 'loading' && (
          <div className={styles.skeletonWrapper} aria-busy="true" aria-label="Carregando produtos">
            <div className={styles.skeletonMetrics}>
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
            </div>
            <div className={styles.catalogCard}>
              <div className={styles.skeletonFilterBar} />
              <div className={styles.skeletonRows}>
                <div className={styles.skeletonRow} />
                <div className={styles.skeletonRow} />
                <div className={styles.skeletonRow} />
                <div className={styles.skeletonRow} />
              </div>
            </div>
          </div>
        )}

        {pageStatus === 'error' && (
          <section className={styles.stateCard} role="alert">
            <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
              <AlertCircle size={22} />
            </div>
            <h2 className={styles.stateTitle}>Não foi possível carregar os produtos</h2>
            <p className={styles.stateDescription}>
              {!companyId && !isInitializing
                ? 'Não foi possível identificar a loja. Recarregue a página e tente novamente.'
                : 'Ocorreu uma falha ao buscar o catálogo da loja. Verifique sua conexão e tente novamente.'}
            </p>
            <Button
              type="button"
              variant="secondary"
              className={styles.retryButton}
              onClick={retryProducts}
            >
              <RefreshCw size={15} />
              Tentar novamente
            </Button>
          </section>
        )}

        {pageStatus === 'ready' && (
          <>
            <ProductsMetrics publishedCount={publishedCount} draftCount={draftCount} />

            <section className={styles.catalogCard}>
              <div className={styles.filterSection}>
                <ProductsFilter
                  filters={filters}
                  styleOptions={styleOptions}
                  pieceOptions={pieceOptions}
                  resultsLabel={resultsLabel}
                  onFiltersChange={applyFilters}
                />
              </div>

              <div className={isFetching ? styles.tableFetching : styles.tableBody}>
                {total === 0 && !hasActiveFilters && (
                  <div className={styles.emptyState}>
                    <div className={styles.stateIcon}>
                      <PackageOpen size={22} />
                    </div>
                    <h2 className={styles.stateTitle}>Nenhum produto cadastrado ainda</h2>
                    <p className={styles.stateDescription}>
                      Comece adicionando a primeira peça para montar o catálogo da sua loja.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => router.push('/products/new')}
                    >
                      <Plus size={16} />
                      Cadastrar primeiro produto
                    </Button>
                  </div>
                )}

                {((total === 0 && hasActiveFilters) ||
                  (total > 0 && filteredProducts.length === 0)) && (
                  <div className={styles.emptyState}>
                    <div className={styles.stateIcon}>
                      <SearchX size={22} />
                    </div>
                    <h2 className={styles.stateTitle}>Nenhum produto encontrado</h2>
                    <p className={styles.stateDescription}>
                      Não encontramos peças com os filtros selecionados. Tente ajustar ou limpar a
                      busca.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => applyFilters(EMPTY_FILTERS)}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}

                {filteredProducts.length > 0 && (
                  <div className={styles.tableSection}>
                    <ProductsTable
                      products={filteredProducts}
                      pendingAvailabilityIds={pendingAvailabilityIds}
                      pendingActionIds={pendingActionIds}
                      onToggleAvailability={requestAvailabilityChange}
                      onDuplicate={handleDuplicate}
                      onDelete={setProductToDelete}
                    />
                    <footer className={styles.tableFooter}>
                      <label className={styles.perPageLabel}>
                        Exibindo
                        <select
                          className={styles.perPageSelect}
                          value={perPage}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            localStorage.setItem('products:perPage', String(n));
                            setPerPage(n);
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
                    </footer>
                  </div>
                )}
              </div>
            </section>
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

      {productToDelete && (
        <ConfirmDialog
          title="Excluir produto?"
          description={`"${productToDelete.name}" será excluído permanentemente. Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          isConfirming={pendingActionIds.has(productToDelete.id)}
          onConfirm={confirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
}
