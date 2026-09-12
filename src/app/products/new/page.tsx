'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { ProductForm } from '@/components/products/ProductForm';
import { EMPTY_PRODUCT_FORM_VALUES } from '@/lib/products/product-form.mock';
import styles from './page.module.css';

export default function NewProductPage() {
  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <Link href="/products" className={styles.breadcrumb}>
          <ArrowLeft size={14} style={{ color: 'inherit' }} />
          Voltar para produtos
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Novo produto</h1>
          <p className={styles.subtitle}>
            Categoria, cor e material seguem a lista da taxonomia do Piê — é por eles que a peça
            entra nas recomendações certas.
          </p>
        </div>

        <ProductForm mode="create" initialValues={EMPTY_PRODUCT_FORM_VALUES} />
      </main>
    </div>
  );
}
