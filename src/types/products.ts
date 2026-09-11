export type ProductStatus = 'PUBLICADO' | 'RASCUNHO' | 'PAUSADO';

export interface Product {
  id: string;
  photoUrl: string | null;
  name: string;
  code: string;
  piece: string;
  style: string;
  color: string;
  sizes: string[];
  price: number;
  status: ProductStatus;
}

export interface ProductFilters {
  search: string;
  style: string;
  piece: string;
  status: ProductStatus | '';
}
