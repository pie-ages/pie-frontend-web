import type { Product } from '@/types/products';
import type { ProductFormValues } from '@/types/productForm';
import { MOCK_PRODUCTS } from './products.mock';
import { MOCK_PRODUCT_FORM_DETAILS } from './product-form.mock';

const SIMULATED_LATENCY_MS = 600;

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_PRODUCTS;
}

export interface ProductFormData {
  code: string;
  values: ProductFormValues;
}

export async function getProductFormData(id: string): Promise<ProductFormData | null> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_PRODUCT_FORM_DETAILS[id] ?? null;
}

export async function createProduct(values: ProductFormValues): Promise<{ id: string }> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const id = `AN-${Math.floor(1000 + Math.random() * 9000)}`;
  MOCK_PRODUCT_FORM_DETAILS[id] = { code: id, values };
  return { id };
}

export async function updateProduct(id: string, values: ProductFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const existing = MOCK_PRODUCT_FORM_DETAILS[id];
  MOCK_PRODUCT_FORM_DETAILS[id] = { code: existing?.code ?? id, values };
}
