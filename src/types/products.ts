export type ProductStatus = 'PUBLISHED' | 'DRAFT' | 'PAUSED';

export interface Product {
  id: string;
  photoUrl: string | null;
  name: string;
  code: string;
  piece: string;
  style: string;
  color: string;
  materials: string[];
  sizes: string[];
  price: number;
  status: ProductStatus;
}

export interface ProductFilters {
  search: string;
  style: string;
  piece: string;
  size: string;
  status: ProductStatus | '';
}
