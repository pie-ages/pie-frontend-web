import type { ProductStatus } from '@/types/products';
import styles from './styles.module.css';

const CLASS_BY_STATUS: Record<ProductStatus, string> = {
  PUBLISHED: styles.published,
  DRAFT: styles.draft,
  PAUSED: styles.paused,
};

const LABEL_BY_STATUS: Record<ProductStatus, string> = {
  PUBLISHED: 'Publicado',
  DRAFT: 'Rascunho',
  PAUSED: 'Pausado',
};

interface StatusBadgeProps {
  status: ProductStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${CLASS_BY_STATUS[status]}`}>{LABEL_BY_STATUS[status]}</span>
  );
}
