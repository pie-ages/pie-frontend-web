import type { ProductStatus } from '@/types/products';

export type ProductGender = 'FEMININO' | 'MASCULINO' | 'UNISSEX';

export const PRODUCT_GENDER_OPTIONS: { value: ProductGender; label: string }[] = [
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'UNISSEX', label: 'Unissex' },
];

export interface ProductImage {
  id: string;
  url: string;
  name: string;
  isPrimary: boolean;
  file?: File;
}

export interface ProductFormValues {
  name: string;
  gender: ProductGender | '';
  description: string;
  price: string;
  purchaseUrl: string;
  categoryId: string;
  colorId: string;
  styleId: string;
  materialIds: string[];
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
  gender: '',
  description: '',
  price: '',
  purchaseUrl: '',
  categoryId: '',
  colorId: '',
  styleId: '',
  materialIds: [],
  sizeIds: [],
  images: [],
  status: 'DRAFT',
};
