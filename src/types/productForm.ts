import type { ProductStatus } from '@/types/products';

export interface ProductImage {
  id: string;
  url: string;
  name: string;
  isPrimary: boolean;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  purchaseUrl: string;
  categoryId: string;
  colorId: string;
  materialId: string;
  styleIds: string[];
  images: ProductImage[];
  status: ProductStatus;
}

export type ProductFormErrors = Partial<Record<keyof Omit<ProductFormValues, 'status'>, string>>;
