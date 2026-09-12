'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StatusBadge } from '@/components/products/StatusBadge';
import { ProductForm } from '@/components/products/ProductForm';
import { getProductFormData, type ProductFormData } from '@/lib/products/products.service';
import { formatRelativeTime } from '@/lib/utils/date';
import styles from './page.module.css';

type PageStatus = 'loading' | 'error' | 'not-found' | 'ready';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <Link href="/products" className={styles.breadcrumb}>
          <ChevronLeft size={16} />
          Voltar para produtos
        </Link>

        <EditProductContent key={id} id={id} />
      </main>
    </div>
  );
}

function EditProductContent({ id }: { id: string }) {
  const [status, setStatus] = useState<PageStatus>('loading');
  const [data, setData] = useState<ProductFormData | null>(null);

  useEffect(() => {
    let active = true;

    getProductFormData(id)
      .then((result) => {
        if (!active) return;
        if (!result) {
          setStatus('not-found');
          return;
        }
        setData(result);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') {
    return <p className={styles.notice}>Carregando produto…</p>;
  }

  if (status === 'error') {
    return (
      <p className={`${styles.notice} ${styles.noticeError}`}>
        Não foi possível carregar os dados do produto. Tente novamente mais tarde.
      </p>
    );
  }

  if (status === 'not-found' || !data) {
    return <p className={`${styles.notice} ${styles.noticeError}`}>Produto não encontrado.</p>;
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{data.values.name}</h1>
          <StatusBadge status={data.values.status} />
        </div>
        <p className={styles.meta}>
          {data.code}
          <span className={styles.metaSep}>·</span>
          {formatRelativeTime(data.updatedAt)}
          {data.savedCount > 0 && (
            <>
              <span className={styles.metaSep}>·</span>
              {data.savedCount} clientes favoritaram esta peça
            </>
          )}
        </p>
      </div>

      <ProductForm mode="edit" productId={id} initialValues={data.values} />
    </>
  );
}
