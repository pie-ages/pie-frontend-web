import type { AxiosError } from 'axios';
import type { Product, ProductStatus } from '@/types/products';
import type { ProductFormData, ProductFormValues } from '@/types/productForm';
import type { TaxonomyTerm } from '@/types/taxonomy';
import { MOCK_TAXONOMY } from '@/lib/taxonomy/taxonomy.mock';
import Api from '@/lib/api';

const SIMULATED_LATENCY_MS = 600;

interface ApiProduct {
  id: string;
  name: string;
  category: string;
  color: string;
  price: number;
  imageUrl: string | null;
  purchaseUrl: string | null;
  companyName: string;
  status: ProductStatus;
  style: string | null;
  sizes: string[];
}

interface ApiProductDetail {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  color: string | null;
  price: number;
  imageUrl: string | null;
  purchaseUrl: string | null;
  status: ProductStatus;
  companyName: string;
  createdAt: string;
  style: string | null;
  sizes: string[] | null;
}

interface ApiProductsPage {
  items: ApiProduct[];
  total: number;
  page: number;
  size: number;
}

export interface ProductsPage {
  items: Product[];
  total: number;
}

export async function getProducts(params?: {
  search?: string;
  status?: ProductStatus | '';
  page?: number;
  size?: number;
}): Promise<ProductsPage> {
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.status) qs.set('status', params.status);
  if (params?.page != null) qs.set('page', String((params.page ?? 1) - 1));
  if (params?.size != null) qs.set('size', String(params.size));

  const { data } = await Api.get<ApiProductsPage>(
    `/products/company/${companyId}${qs.size ? `?${qs}` : ''}`,
  );

  return {
    total: data.total,
    items: data.items.map((p) => ({
      id: p.id,
      photoUrl: p.imageUrl ?? null,
      name: p.name,
      code: '',
      piece: p.category ?? '',
      style: p.style ?? '',
      color: p.color ?? '',
      sizes: p.sizes ?? [],
      price: Number(p.price),
      status: p.status,
    })),
  };
}

export async function updateProductAvailability(
  _productId: string,
  _status: ProductStatus,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  // TODO PIE-28: replace with real API call to PATCH /products/{id}/publish or /unpublish
}

function findTermId(terms: TaxonomyTerm[], name: string | null | undefined): string {
  if (!name) return '';
  return terms.find((t) => t.name.toLowerCase() === name.toLowerCase())?.id ?? '';
}

export type { ProductFormData };

export async function getProductFormData(id: string): Promise<ProductFormData | null> {
  try {
    const { data: p } = await Api.get<ApiProductDetail>(`/products/${id}`);
    const values: ProductFormValues = {
      name: p.name,
      description: p.description ?? '',
      price: Number(p.price).toFixed(2).replace('.', ','),
      purchaseUrl: p.purchaseUrl ?? '',
      categoryId: findTermId(MOCK_TAXONOMY.categories, p.category),
      colorId: findTermId(MOCK_TAXONOMY.colors, p.color),
      styleId: findTermId(MOCK_TAXONOMY.styles, p.style),
      sizeIds: (p.sizes ?? []).map((s) => s.toLowerCase()),
      images: p.imageUrl
        ? [{ id: `${p.id}-img-1`, url: p.imageUrl, name: `${p.id}-01.jpg`, isPrimary: true }]
        : [],
      status: p.status,
    };
    return { code: p.id, updatedAt: p.createdAt, savedCount: 0, values };
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 404) return null;
    throw err;
  }
}

export async function createProduct(_values: ProductFormValues): Promise<{ id: string }> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return { id: `AN-${Math.floor(1000 + Math.random() * 9000)}` };
}

export async function updateProduct(_id: string, _values: ProductFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}
