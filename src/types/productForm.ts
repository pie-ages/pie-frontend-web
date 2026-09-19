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
  styleId: string;
  sizeIds: string[];
  images: ProductImage[];
  status: ProductStatus;
}

export type ProductFormErrors = Partial<Record<keyof Omit<ProductFormValues, 'status'>, string>>;

export interface ProductFormData {
  code: string;
  updatedAt: string;
  savedCount: number;
  values: ProductFormValues;
}

export const EMPTY_PRODUCT_FORM_VALUES: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  purchaseUrl: '',
  categoryId: '',
  colorId: '',
  styleId: '',
  sizeIds: [],
  images: [],
  status: 'DRAFT',
};
