'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product, ProductFilters } from '@/types/products';
import { getProducts } from '@/lib/products/products.service';
import { EMPTY_FILTERS, filterProducts, uniqueValues } from '@/lib/products/products.filters';
import { ProductsMetrics } from '@/components/products/ProductsMetrics';
import { ProductsFilter } from '@/components/products/ProductsFilter';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsPagination } from '@/components/products/ProductsPagination';
import { StoreHeader } from '@/components/layout/StoreHeader';
import styles from './page.module.css';

type Status = 'loading' | 'error' | 'ready';

const PRODUCTS_PER_PAGE = 5;

export default function ProductsPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;

    getProducts()
      .then((list) => {
        if (!active) return;
        setProducts(list);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const styleOptions = useMemo(() => uniqueValues(products, 'style'), [products]);
  const pieceOptions = useMemo(() => uniqueValues(products, 'piece'), [products]);
  const filteredProducts = useMemo(() => filterProducts(products, filters), [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  const resultsLabel = `${filteredProducts.length} de ${products.length} produtos`;

  const applyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
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
              Importar CSV
            </button>
            <button type="button" className={styles.primaryButton}>
              Novo produto
            </button>
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

            {products.length === 0 && (
              <p className={styles.notice}>Nenhum produto cadastrado ainda.</p>
            )}

            {products.length > 0 && filteredProducts.length === 0 && (
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
            )}

            {filteredProducts.length > 0 && (
              <>
                <ProductsTable products={pageProducts} />
                <ProductsPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={changePage}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
