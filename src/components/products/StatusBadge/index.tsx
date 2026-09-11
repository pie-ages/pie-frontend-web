import type { ProductStatus } from '@/types/products';
import styles from './styles.module.css';

const CLASS_BY_STATUS: Record<ProductStatus, string> = {
  PUBLICADO: styles.published,
  RASCUNHO: styles.draft,
  PAUSADO: styles.paused,
};

const LABEL_BY_STATUS: Record<ProductStatus, string> = {
  PUBLICADO: 'Publicado',
  RASCUNHO: 'Rascunho',
  PAUSADO: 'Pausado',
};

interface StatusBadgeProps {
  status: ProductStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${CLASS_BY_STATUS[status]}`}>{LABEL_BY_STATUS[status]}</span>
  );
}
