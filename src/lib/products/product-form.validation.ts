import type { ProductFormErrors, ProductFormValues } from '@/types/productForm';

const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

export function parsePrice(raw: string): number | null {
  const cleaned = raw.trim().replace(/[^\d.,]/g, '');
  if (!cleaned) return null;

  const normalized =
    cleaned.includes(',') && cleaned.includes('.')
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(',', '.');

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function isValidPurchaseUrl(value: string): boolean {
  return URL_PATTERN.test(value.trim());
}

export function normalizePurchaseUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Informe o nome do produto.';
  }

  const price = parsePrice(values.price);
  if (!values.price.trim()) {
    errors.price = 'Informe o preço.';
  } else if (price === null || price <= 0) {
    errors.price = 'Informe um preço válido.';
  }

  if (values.purchaseUrl.trim() && !isValidPurchaseUrl(values.purchaseUrl)) {
    errors.purchaseUrl = 'Informe uma URL válida (ex: https://sualoja.com.br/produto).';
  }

  if (!values.categoryId) {
    errors.categoryId = 'Selecione uma categoria.';
  }

  if (!values.colorId) {
    errors.colorId = 'Selecione uma cor.';
  }

  if (!values.styleId) {
    errors.styleId = 'Selecione um estilo.';
  }

  if (values.sizeIds.length === 0) {
    errors.sizeIds = 'Selecione ao menos um tamanho.';
  }

  if (values.images.length === 0) {
    errors.images = 'Envie ao menos uma imagem.';
  }

  return errors;
}
