import type { ProdutoStatus } from '../../types/produto';
import styles from './StatusBadge.module.css';

const CLASSE_POR_STATUS: Record<ProdutoStatus, string> = {
  PUBLICADO: styles.publicado,
  RASCUNHO: styles.rascunho,
  PAUSADO: styles.pausado,
};

const ROTULO_POR_STATUS: Record<ProdutoStatus, string> = {
  PUBLICADO: 'Publicado',
  RASCUNHO: 'Rascunho',
  PAUSADO: 'Pausado',
};

interface StatusBadgeProps {
  status: ProdutoStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${CLASSE_POR_STATUS[status]}`}>
      {ROTULO_POR_STATUS[status]}
    </span>
  );
}
