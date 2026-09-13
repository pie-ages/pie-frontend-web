import type { Product, ProductFilters } from '@/types/products';

export const SIZES_BY_PIECE: Record<string, string[]> = {
  Camiseta: ['PP', 'P', 'M', 'G', 'GG'],
  Camisa: ['PP', 'P', 'M', 'G', 'GG'],
  Vestido: ['PP', 'P', 'M', 'G', 'GG'],
  Blazer: ['PP', 'P', 'M', 'G', 'GG'],
  Casaco: ['PP', 'P', 'M', 'G', 'GG'],
  Calça: ['34', '36', '38', '40', '42', '44'],
  Saia: ['PP', 'P', 'M', 'G', 'GG'],
  Sapato: ['33', '34', '35', '36', '37', '38', '39', '40', '41'],
  Sandália: ['33', '34', '35', '36', '37', '38', '39', '40', '41'],
  Bota: ['33', '34', '35', '36', '37', '38', '39', '40', '41'],
};

export const EMPTY_FILTERS: ProductFilters = {
  search: '',
  style: '',
  piece: '',
  size: '',
  status: '',
};

export function uniqueValues(products: Product[], field: 'style' | 'piece'): string[] {
  const values = new Set(products.map((product) => product[field]));
  return [...values].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const search = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      search === '' ||
      product.name.toLowerCase().includes(search) ||
      product.code.toLowerCase().includes(search);
    const matchesStyle = filters.style === '' || product.style === filters.style;
    const matchesPiece = filters.piece === '' || product.piece === filters.piece;
    const matchesSize = filters.size === '' || product.sizes.includes(filters.size);
    const matchesStatus = filters.status === '' || product.status === filters.status;

    return matchesSearch && matchesStyle && matchesPiece && matchesSize && matchesStatus;
  });
}
