import type { AxiosError } from 'axios';
import type { Product, ProductStatus } from '@/types/products';
import type { ProductFormData, ProductFormValues } from '@/types/productForm';
import type { TaxonomyTerm } from '@/types/taxonomy';
import { getTaxonomy } from '@/lib/taxonomy/Taxonomyservice';
import Api from '@/lib/api';

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
  styles: string[];
  sizes: string[];
  materials: string[];
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
  updatedAt: string | null;
  styles: string[] | null;
  sizes: string[] | null;
  materials: string[] | null;
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
  qs.set('sort', 'updatedAt,desc');
  if (params?.search) qs.set('search', params.search);
  if (params?.status) qs.set('status', params.status);
  if (params?.page != null) qs.set('page', String((params.page ?? 1) - 1));
  if (params?.size != null) qs.set('size', String(params.size));

  const [{ data }, taxonomy] = await Promise.all([
    Api.get<ApiProductsPage>(`/products/company/${companyId}${qs.size ? `?${qs}` : ''}`),
    getTaxonomy(),
  ]);

  return {
    total: data.total,
    items: data.items.map((p) => ({
      id: p.id,
      photoUrl: p.imageUrl ?? null,
      name: p.name,
      code: p.id.slice(0, 8).toUpperCase(),
      piece: findTermName(taxonomy.categories, p.category),
      style: findTermName(taxonomy.styles, p.styles?.[0]),
      color: findTermName(taxonomy.colors, p.color),
      materials: (p.materials ?? []).map((m) => findTermName(taxonomy.materials, m)),
      sizes: (p.sizes ?? []).map((s) => findTermName(taxonomy.sizes, s)),
      price: Number(p.price),
      status: p.status,
    })),
  };
}

export async function updateProductAvailability(
  productId: string,
  status: ProductStatus,
): Promise<void> {
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;
  const endpoint = status === 'PUBLISHED' ? 'publish' : 'unpublish';
  await Api.patch(`/products/${productId}/${endpoint}?companyId=${companyId}`);
}

export async function deleteProduct(id: string): Promise<void> {
  await Api.delete(`/products/${id}`);
}

export async function duplicateProduct(id: string): Promise<{ id: string }> {
  const formData = await getProductFormData(id);
  if (!formData) throw new Error('Produto não encontrado');
  return createProduct({ ...formData.values, name: `Cópia de ${formData.values.name}` });
}

function findTermId(terms: TaxonomyTerm[], idOrName: string | null | undefined): string {
  if (!idOrName) return '';
  return (
    (
      terms.find((t) => t.id === idOrName) ??
      terms.find((t) => t.name.toLowerCase() === idOrName.toLowerCase())
    )?.id ?? ''
  );
}

function findTermName(terms: TaxonomyTerm[], id: string | null | undefined): string {
  if (!id) return '';
  return terms.find((t) => t.id === id)?.name ?? id;
}

export type { ProductFormData };

export async function getProductFormData(id: string): Promise<ProductFormData | null> {
  try {
    const [{ data: p }, taxonomy] = await Promise.all([
      Api.get<ApiProductDetail>(`/products/${id}`),
      getTaxonomy(),
    ]);
    const values: ProductFormValues = {
      name: p.name,
      description: p.description ?? '',
      price: Number(p.price).toFixed(2).replace('.', ','),
      purchaseUrl: p.purchaseUrl ?? '',
      categoryId: findTermId(taxonomy.categories, p.category),
      colorId: findTermId(taxonomy.colors, p.color),
      styleId: findTermId(taxonomy.styles, p.styles?.[0]),
      materialIds: (p.materials ?? []).map((m) => m.toLowerCase()),
      sizeIds: (p.sizes ?? []).map((s) => s.toLowerCase()),
      images: p.imageUrl
        ? [{ id: `${p.id}-img-1`, url: p.imageUrl, name: `${p.id}-01.jpg`, isPrimary: true }]
        : [],
      status: p.status,
    };
    return { code: p.id, updatedAt: p.updatedAt ?? p.createdAt, savedCount: 0, values };
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 404) return null;
    throw err;
  }
}

export async function createProduct(values: ProductFormValues): Promise<{ id: string }> {
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;
  const { data } = await Api.post<{ id: string }>('/products', {
    name: values.name,
    description: values.description || null,
    category: values.categoryId || null,
    color: values.colorId || null,
    styles: values.styleId ? [values.styleId] : [],
    materials: values.materialIds,
    sizes: values.sizeIds,
    price: parseFloat(values.price.replace(',', '.')),
    imageUrl: values.images[0]?.url ?? null,
    purchaseUrl: values.purchaseUrl || null,
    companyId,
  });
  return data;
}

export async function updateProduct(id: string, values: ProductFormValues): Promise<void> {
  await Api.put(`/products/${id}`, {
    name: values.name || null,
    description: values.description || null,
    category: values.categoryId || null,
    color: values.colorId || null,
    styles: values.styleId ? [values.styleId] : null,
    materials: values.materialIds,
    sizes: values.sizeIds.length > 0 ? values.sizeIds : null,
    price: values.price ? parseFloat(values.price.replace(',', '.')) : null,
    imageUrl: values.images[0]?.url ?? null,
    purchaseUrl: values.purchaseUrl || null,
    companyId: null,
  });
}
