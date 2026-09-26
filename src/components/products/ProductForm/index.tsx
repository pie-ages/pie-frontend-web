'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Taxonomy } from '@/types/taxonomy';
import type { ProductFormErrors, ProductFormValues } from '@/types/productForm';
import type { ProductStatus } from '@/types/products';
import { getTaxonomy, SIZES_BY_CATEGORY } from '@/lib/taxonomy/taxonomy.service';
import {
  createProduct,
  updateProduct,
  updateProductAvailability,
  deleteProduct,
} from '@/lib/products/products.service';
import {
  filterPriceInput,
  normalizePurchaseUrl,
  validateDraftForm,
  validateProductForm,
} from '@/lib/products/product-form.validation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
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
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const toggleSize = (id: string) => {
    setValues((prev) => ({
      ...prev,
      sizeIds: prev.sizeIds.includes(id)
        ? prev.sizeIds.filter((sizeId) => sizeId !== id)
        : [...prev.sizeIds, id],
    }));
    setErrors((prev) => ({ ...prev, sizeIds: undefined }));
  };

  const toggleMaterial = (id: string) => {
    setValues((prev) => ({
      ...prev,
      materialIds: prev.materialIds.includes(id)
        ? prev.materialIds.filter((mId) => mId !== id)
        : [...prev.materialIds, id],
    }));
  };

  const submit = async (targetStatus: ProductStatus) => {
    const formErrors =
      targetStatus === 'DRAFT' ? validateDraftForm(values) : validateProductForm(values);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error(
        targetStatus === 'DRAFT'
          ? 'Informe o nome do produto antes de salvar.'
          : 'Revise os campos destacados antes de continuar.',
        { id: 'product-form-error' },
      );
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
      let savedId: string;
      if (mode === 'create') {
        const result = await createProduct(payload);
        savedId = result.id;
      } else {
        await updateProduct(productId!, payload);
        savedId = productId!;
      }

      const originalStatus = mode === 'create' ? 'DRAFT' : initialValues.status;
      if (targetStatus !== originalStatus && targetStatus !== 'DRAFT') {
        await updateProductAvailability(savedId, targetStatus);
      }

      toast.success(
        mode === 'create' ? 'Produto criado com sucesso.' : 'Alterações salvas com sucesso.',
      );
      router.push('/products');
    } catch {
      toast.error('Não foi possível salvar o produto. Tente novamente.', {
        id: 'product-form-error',
      });
      setSubmitting(false);
      setSubmittingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    setDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success('Produto excluído com sucesso.');
      router.push('/products');
    } catch {
      toast.error('Não foi possível excluir o produto. Tente novamente.', {
        id: 'delete-product-error',
      });
      setDeleting(false);
    }
  };

  const handleToggleAvailability = async (targetStatus: ProductStatus) => {
    if (!productId) return;
    setTogglingAvailability(true);
    try {
      await updateProductAvailability(productId, targetStatus);
      toast.success(
        targetStatus === 'PUBLISHED'
          ? 'Produto publicado na Vitrine.'
          : 'Produto pausado na Vitrine.',
      );
      router.push('/products');
    } catch {
      toast.error('Não foi possível alterar a disponibilidade. Tente novamente.', {
        id: 'product-availability-error',
      });
      setTogglingAvailability(false);
    }
  };

  const taxonomyLoading = taxonomyStatus === 'loading';
  const taxonomyError = taxonomyStatus === 'error';

  return (
    <>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
        <div className={styles.layout}>
          <ProductImagesField
            images={values.images}
            onChange={(images) => updateField('images', images)}
            error={errors.images}
            hint={
              mode === 'create'
                ? 'Fundo neutro e peça inteira no quadro. A primeira foto é a que aparece na Vitrine do app.'
                : undefined
            }
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
                <span>Não foi possível carregar as opções de categoria, cor e estilo.</span>
                <button type="button" className={styles.retryButton} onClick={handleRetryTaxonomy}>
                  Tentar novamente
                </button>
              </div>
            )}

            <div className={styles.fieldsRow3}>
              <Select
                label="Peça"
                value={values.categoryId}
                onChange={(event) => {
                  setValues((prev) => ({ ...prev, categoryId: event.target.value, sizeIds: [] }));
                  setErrors((prev) => ({ ...prev, categoryId: undefined, sizeIds: undefined }));
                }}
                options={taxonomy?.categories.map((c) => ({ value: c.id, label: c.name })) ?? []}
                placeholder={taxonomyLoading ? 'Carregando...' : 'Selecione'}
                disabled={taxonomyLoading || taxonomyError}
                error={errors.categoryId}
                required
              />

              <Select
                label="Estilo"
                value={values.styleId}
                onChange={(event) => updateField('styleId', event.target.value)}
                options={taxonomy?.styles.map((c) => ({ value: c.id, label: c.name })) ?? []}
                placeholder={taxonomyLoading ? 'Carregando...' : 'Selecione'}
                disabled={taxonomyLoading || taxonomyError}
                error={errors.styleId}
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
            </div>

            <div className={styles.stylesGroup}>
              <span className={styles.stylesLabel}>
                Tamanhos disponíveis <span className={styles.requiredAsterisk}>*</span>
              </span>
              {!values.categoryId && (
                <span className={styles.mutedText}>
                  Selecione uma peça para ver os tamanhos disponíveis.
                </span>
              )}
              {values.categoryId && (
                <div className={styles.chipsRow}>
                  {taxonomyLoading && (
                    <span className={styles.mutedText}>Carregando tamanhos...</span>
                  )}
                  {!taxonomyLoading &&
                    !taxonomyError &&
                    taxonomy?.sizes
                      .filter((size) =>
                        (SIZES_BY_CATEGORY[values.categoryId] ?? []).includes(size.id),
                      )
                      .map((size) => {
                        const selected = values.sizeIds.includes(size.id);
                        return (
                          <button
                            key={size.id}
                            type="button"
                            className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                            onClick={() => toggleSize(size.id)}
                            aria-pressed={selected}
                          >
                            {size.name}
                          </button>
                        );
                      })}
                </div>
              )}
              {errors.sizeIds && <span className={styles.errorMessage}>{errors.sizeIds}</span>}
            </div>

            <div className={styles.stylesGroup}>
              <span className={styles.stylesLabel}>Materiais</span>
              <div className={styles.chipsRow}>
                {taxonomyLoading && (
                  <span className={styles.mutedText}>Carregando materiais...</span>
                )}
                {!taxonomyLoading &&
                  !taxonomyError &&
                  taxonomy?.materials.map((material) => {
                    const selected = values.materialIds.includes(material.id);
                    return (
                      <button
                        key={material.id}
                        type="button"
                        className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                        onClick={() => toggleMaterial(material.id)}
                        aria-pressed={selected}
                      >
                        {material.name}
                      </button>
                    );
                  })}
              </div>
              {!taxonomyLoading && !taxonomyError && values.materialIds.length === 0 && (
                <span className={styles.mutedText}>Nenhum material selecionado.</span>
              )}
            </div>

            <div className={styles.fieldsRow2}>
              <Input
                label="Preço"
                placeholder="0,00"
                inputMode="decimal"
                leftElement={<span>R$</span>}
                value={values.price}
                onChange={(event) => updateField('price', filterPriceInput(event.target.value))}
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
                  onClick={() => submit('PUBLISHED')}
                >
                  {submitting && submittingStatus === 'PUBLISHED'
                    ? 'Publicando...'
                    : 'Publicar produto'}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={submitting}
                  onClick={() => submit('DRAFT')}
                >
                  {submitting && submittingStatus === 'DRAFT'
                    ? 'Salvando...'
                    : 'Salvar como rascunho'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={submitting || togglingAvailability || deleting}
                  onClick={() => submit(values.status)}
                >
                  {submitting && submittingStatus === values.status
                    ? 'Salvando...'
                    : 'Salvar alterações'}
                </button>
                {values.status === 'PUBLISHED' ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={submitting || togglingAvailability || deleting}
                    onClick={() => handleToggleAvailability('PAUSED')}
                  >
                    {togglingAvailability ? 'Pausando...' : 'Pausar na Vitrine'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={submitting || togglingAvailability || deleting}
                    onClick={() => handleToggleAvailability('PUBLISHED')}
                  >
                    {togglingAvailability ? 'Publicando...' : 'Publicar na Vitrine'}
                  </button>
                )}
              </>
            )}
          </div>

          {mode === 'create' && (
            <span className={styles.helperText}>A peça aparece na Vitrine em até 5 minutos.</span>
          )}

          {mode === 'edit' && (
            <button
              type="button"
              className={styles.deleteButton}
              disabled={submitting || togglingAvailability || deleting}
              onClick={() => setShowDeleteConfirm(true)}
            >
              {deleting ? 'Excluindo...' : 'Excluir produto'}
            </button>
          )}
        </div>
      </form>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Excluir produto?"
          description="Este produto será excluído permanentemente. Essa ação não pode ser desfeita."
          confirmLabel="Excluir"
          isConfirming={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
