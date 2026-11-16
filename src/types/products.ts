export interface CsvImportErrorRow {
  line: number;
  column: string;
  value: string;
  problem: string;
}

export interface CsvImportResult {
  filename: string;
  totalLines: number;
  imported: number;
  errors: number;
  duplicates: number;
  errorRows: CsvImportErrorRow[];
}

export type ProductStatus = 'PUBLISHED' | 'DRAFT' | 'PAUSED';

export type ProductGender = 'FEMININO' | 'MASCULINO' | 'UNISSEX';

export interface Product {
  id: string;
  photoUrl: string | null;
  name: string;
  code: string;
  gender: ProductGender | null;
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
