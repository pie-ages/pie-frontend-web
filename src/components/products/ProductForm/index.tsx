'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Taxonomy } from '@/types/taxonomy';
import type { ProductFormErrors, ProductFormValues } from '@/types/productForm';
import type { ProductStatus } from '@/types/products';
import { getTaxonomy } from '@/lib/taxonomy/taxonomy.service';
import { createProduct, updateProduct } from '@/lib/products/products.service';
import { normalizePurchaseUrl, validateProductForm } from '@/lib/products/product-form.validation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { ProductImagesField } from './ProductImagesField';
import styles from './styles.module.css';

type TaxonomyStatus = 'loading' | 'error' | 'ready';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
  initialValues: ProductFormValues;
}

export function ProductForm({ mode, productId, initialValues }: ProductFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);
  const [taxonomyStatus, setTaxonomyStatus] = useState<TaxonomyStatus>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState<ProductStatus | null>(null);

  const fetchTaxonomy = useCallback(() => {
    let cancelled = false;

    getTaxonomy()
      .then((data) => {
        if (cancelled) return;
        setTaxonomy(data);
        setTaxonomyStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setTaxonomyStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => fetchTaxonomy(), [fetchTaxonomy]);

  const handleRetryTaxonomy = () => {
    setTaxonomyStatus('loading');
    fetchTaxonomy();
  };

  const updateField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleStyle = (id: string) => {
    setValues((prev) => ({
      ...prev,
      styleIds: prev.styleIds.includes(id)
        ? prev.styleIds.filter((styleId) => styleId !== id)
        : [...prev.styleIds, id],
    }));
    setErrors((prev) => ({ ...prev, styleIds: undefined }));
  };

  const submit = async (targetStatus: ProductStatus) => {
    const formErrors = validateProductForm(values);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Revise os campos destacados antes de continuar.', { id: 'product-form-error' });
      return;
    }

    const payload: ProductFormValues = {
      ...values,
      purchaseUrl: normalizePurchaseUrl(values.purchaseUrl),
      status: targetStatus,
    };

    setSubmitting(true);
    setSubmittingStatus(targetStatus);

    try {
      if (mode === 'create') {
        await createProduct(payload);
        toast.success('Produto criado com sucesso.');
      } else if (productId) {
        await updateProduct(productId, payload);
        toast.success('Alterações salvas com sucesso.');
      }
      router.push('/products');
    } catch {
      toast.error('Não foi possível salvar o produto. Tente novamente.', {
        id: 'product-form-error',
      });
      setSubmitting(false);
      setSubmittingStatus(null);
    }
  };

  const taxonomyLoading = taxonomyStatus === 'loading';
  const taxonomyError = taxonomyStatus === 'error';

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <div className={styles.layout}>
        <ProductImagesField
          images={values.images}
          onChange={(images) => updateField('images', images)}
          error={errors.images}
        />

        <div className={styles.fieldsColumn}>
          <Input
            label="Nome do produto"
            placeholder="Ex: Vestido Midi Verde"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            error={errors.name}
            required
          />

          {taxonomyError && (
            <div className={styles.taxonomyError}>
              <span>Não foi possível carregar as opções de categoria, cor e material.</span>
              <button type="button" className={styles.retryButton} onClick={handleRetryTaxonomy}>
                Tentar novamente
              </button>
            </div>
          )}

          <div className={styles.fieldsRow3}>
            <Select
              label="Categoria"
              value={values.categoryId}
              onChange={(event) => updateField('categoryId', event.target.value)}
              options={taxonomy?.categories.map((c) => ({ value: c.id, label: c.name })) ?? []}
              placeholder={taxonomyLoading ? 'Carregando...' : 'Selecione'}
              disabled={taxonomyLoading || taxonomyError}
              error={errors.categoryId}
              required
            />

            <Select
              label="Cor"
              value={values.colorId}
              onChange={(event) => updateField('colorId', event.target.value)}
              options={taxonomy?.colors.map((c) => ({ value: c.id, label: c.name })) ?? []}
              placeholder={taxonomyLoading ? 'Carregando...' : 'Selecione'}
              disabled={taxonomyLoading || taxonomyError}
              error={errors.colorId}
              required
            />

            <Select
              label="Material"
              value={values.materialId}
              onChange={(event) => updateField('materialId', event.target.value)}
              options={taxonomy?.materials.map((c) => ({ value: c.id, label: c.name })) ?? []}
              placeholder={taxonomyLoading ? 'Carregando...' : 'Selecione'}
              disabled={taxonomyLoading || taxonomyError}
              error={errors.materialId}
              required
            />
          </div>

          <div className={styles.stylesGroup}>
            <span className={styles.stylesLabel}>
              Estilos <span className={styles.requiredAsterisk}>*</span>
            </span>
            <div className={styles.chipsRow}>
              {taxonomyLoading && <span className={styles.mutedText}>Carregando estilos...</span>}
              {!taxonomyLoading &&
                !taxonomyError &&
                taxonomy?.styles.map((style) => {
                  const selected = values.styleIds.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      type="button"
                      className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                      onClick={() => toggleStyle(style.id)}
                      aria-pressed={selected}
                    >
                      {style.name}
                    </button>
                  );
                })}
            </div>
            {errors.styleIds && <span className={styles.errorMessage}>{errors.styleIds}</span>}
          </div>

          <div className={styles.fieldsRow2}>
            <Input
              label="Preço"
              placeholder="0,00"
              inputMode="decimal"
              value={values.price}
              onChange={(event) => updateField('price', event.target.value)}
              error={errors.price}
              required
            />

            <Input
              label="Link para comprar"
              placeholder="https://sualoja.com.br/produto"
              value={values.purchaseUrl}
              onChange={(event) => updateField('purchaseUrl', event.target.value)}
              error={errors.purchaseUrl}
            />
          </div>

          <Textarea
            label="Descrição"
            placeholder="Modelagem, tecido, caimento — o que ajuda a cliente a decidir."
            rows={4}
            value={values.description}
            onChange={(event) => updateField('description', event.target.value)}
            error={errors.description}
          />
        </div>
      </div>

      <div className={styles.actionsBar}>
        <div className={styles.actionsGroup}>
          {mode === 'create' ? (
            <>
              <button
                type="button"
                className={styles.primaryButton}
                disabled={submitting}
                onClick={() => submit('PUBLICADO')}
              >
                {submitting && submittingStatus === 'PUBLICADO'
                  ? 'Publicando...'
                  : 'Publicar produto'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={submitting}
                onClick={() => submit('RASCUNHO')}
              >
                {submitting && submittingStatus === 'RASCUNHO'
                  ? 'Salvando...'
                  : 'Salvar como rascunho'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.primaryButton}
                disabled={submitting}
                onClick={() => submit(values.status)}
              >
                {submitting ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={submitting}
                onClick={() => router.push('/products')}
              >
                Cancelar
              </button>
            </>
          )}
        </div>

        {mode === 'create' && (
          <span className={styles.helperText}>A peça aparece na Vitrine em até 5 minutos.</span>
        )}
      </div>
    </form>
  );
}
