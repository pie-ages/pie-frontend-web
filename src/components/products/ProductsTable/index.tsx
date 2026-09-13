import type { Product } from '@/types/products';
import { Copy, Eye, EyeOff, Loader2, Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import styles from './styles.module.css';

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface ProductsTableProps {
  products: Product[];
  pendingAvailabilityIds: Set<string>;
  onToggleAvailability: (product: Product) => void;
}

export function ProductsTable({
  products,
  pendingAvailabilityIds,
  onToggleAvailability,
}: ProductsTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Foto</th>
            <th className={styles.th}>Produto</th>
            <th className={styles.th}>Peça</th>
            <th className={styles.th}>Estilo</th>
            <th className={styles.th}>Cor</th>
            <th className={styles.th}>Tamanhos</th>
            <th className={styles.th}>Preço</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th} />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isAvailable = product.status === 'PUBLICADO';
            const isPending = pendingAvailabilityIds.has(product.id);

            return (
              <tr key={product.id} className={styles.row}>
                <td className={`${styles.td} ${styles.photoCell}`}>
                  <div className={styles.photo} aria-hidden="true" />
                </td>
                <td className={styles.td}>
                  <span className={styles.name}>{product.name}</span>
                  <span className={styles.code}>{product.code}</span>
                </td>
                <td className={`${styles.td} ${styles.softText}`}>{product.piece}</td>
                <td className={styles.td}>
                  <span className={styles.styleChip}>{product.style}</span>
                </td>
                <td className={`${styles.td} ${styles.softText}`}>{product.color}</td>
                <td className={`${styles.td} ${styles.regularText}`}>{product.sizes.join(' ')}</td>
                <td className={styles.td}>{priceFormatter.format(product.price)}</td>
                <td className={styles.td}>
                  <StatusBadge status={product.status} />
                </td>
                <td className={`${styles.td} ${styles.actionsCell}`}>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.actionButton}
                      aria-label={isAvailable ? 'Retirar do catálogo' : 'Disponibilizar produto'}
                      title={isAvailable ? 'Retirar do catálogo' : 'Disponibilizar'}
                      onClick={() => onToggleAvailability(product)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2
                          size={15}
                          className={styles.spinner}
                          style={{ color: 'inherit' }}
                        />
                      ) : isAvailable ? (
                        <EyeOff size={15} style={{ color: 'inherit' }} />
                      ) : (
                        <Eye size={15} style={{ color: 'inherit' }} />
                      )}
                    </button>
                    <button
                      type="button"
                      className={styles.actionButton}
                      aria-label="Editar produto"
                      title="Editar"
                    >
                      <Pencil size={15} style={{ color: 'inherit' }} />
                    </button>
                    <button
                      type="button"
                      className={styles.actionButton}
                      aria-label="Duplicar produto"
                      title="Duplicar"
                    >
                      <Copy size={15} style={{ color: 'inherit' }} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.delete}`}
                      aria-label="Excluir produto"
                      title="Excluir"
                    >
                      <Trash2 size={15} style={{ color: 'inherit' }} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
