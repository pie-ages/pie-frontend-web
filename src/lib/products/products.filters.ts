import type { Product, ProductFilters } from '@/types/products';

export const EMPTY_FILTERS: ProductFilters = {
  search: '',
  style: '',
  piece: '',
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
    const matchesStatus = filters.status === '' || product.status === filters.status;

    return matchesSearch && matchesStyle && matchesPiece && matchesStatus;
  });
}
