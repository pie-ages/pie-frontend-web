import type { ProductFilters, ProductStatus } from '@/types/products';
import { SIZES_BY_PIECE } from '@/lib/products/products.filters';
import styles from './styles.module.css';

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'PAUSED', label: 'Pausado' },
];

interface ProductsFilterProps {
  filters: ProductFilters;
  styleOptions: string[];
  pieceOptions: string[];
  resultsLabel: string;
  onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductsFilter({
  filters,
  styleOptions,
  pieceOptions,
  resultsLabel,
  onFiltersChange,
}: ProductsFilterProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className={styles.search}
          placeholder="Buscar por nome ou código"
          aria-label="Buscar produtos por nome ou código"
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
        />
      </div>

      <select
        className={styles.select}
        aria-label="Filtrar por estilo"
        value={filters.style}
        onChange={(event) => onFiltersChange({ ...filters, style: event.target.value })}
      >
        <option value="">Todos os estilos</option>
        {styleOptions.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Filtrar por peça"
        value={filters.piece}
        onChange={(event) => onFiltersChange({ ...filters, piece: event.target.value, size: '' })}
      >
        <option value="">Todas as peças</option>
        {pieceOptions.map((piece) => (
          <option key={piece} value={piece}>
            {piece}
          </option>
        ))}
      </select>

      {filters.piece !== '' && (
        <select
          className={styles.select}
          aria-label="Filtrar por tamanho"
          value={filters.size}
          onChange={(event) => onFiltersChange({ ...filters, size: event.target.value })}
        >
          <option value="">Todos os tamanhos</option>
          {(SIZES_BY_PIECE[filters.piece] ?? []).map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      )}

      <select
        className={styles.select}
        aria-label="Filtrar por status"
        value={filters.status}
        onChange={(event) =>
          onFiltersChange({ ...filters, status: event.target.value as ProductFilters['status'] })
        }
      >
        <option value="">Todos os status</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className={styles.counter}>{resultsLabel}</span>
    </div>
  );
}
