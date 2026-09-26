import Link from 'next/link';
import type { Product } from '@/types/products';
import { Copy, Loader2, Pause, Pencil, Play, Trash2 } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import styles from './styles.module.css';

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface ProductsTableProps {
  products: Product[];
  pendingAvailabilityIds: Set<string>;
  pendingActionIds: Set<string>;
  onToggleAvailability: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({
  products,
  pendingAvailabilityIds,
  pendingActionIds,
  onToggleAvailability,
  onDuplicate,
  onDelete,
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
            <th className={styles.th}>Material</th>
            <th className={styles.th}>Preço</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th} />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isAvailable = product.status === 'PUBLISHED';
            const isPending = pendingAvailabilityIds.has(product.id);
            const isActionPending = pendingActionIds.has(product.id);

            return (
              <tr key={product.id} className={styles.row}>
                <td className={`${styles.td} ${styles.photoCell}`}>
                  {product.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.photoUrl} alt={product.name} className={styles.photo} />
                  ) : (
                    <div className={styles.photo} aria-hidden="true" />
                  )}
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
                <td className={`${styles.td} ${styles.softText}`}>
                  <span className={styles.materialText} title={product.materials.join(', ')}>
                    {product.materials.length > 0 ? product.materials.join(', ') : '—'}
                  </span>
                </td>
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
                      title={isAvailable ? 'Retirar do catálogo' : 'Publicar no catálogo'}
                      onClick={() => onToggleAvailability(product)}
                      disabled={isPending || isActionPending}
                    >
                      {isPending ? (
                        <Loader2
                          size={15}
                          className={styles.spinner}
                          style={{ color: 'inherit' }}
                        />
                      ) : isAvailable ? (
                        <Pause size={15} style={{ color: 'inherit' }} />
                      ) : (
                        <Play size={15} style={{ color: 'inherit' }} />
                      )}
                    </button>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className={styles.actionButton}
                      aria-label="Editar produto"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      className={styles.actionButton}
                      aria-label="Duplicar produto"
                      title="Duplicar"
                      onClick={() => onDuplicate(product)}
                      disabled={isActionPending}
                    >
                      {isActionPending ? (
                        <Loader2
                          size={15}
                          className={styles.spinner}
                          style={{ color: 'inherit' }}
                        />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.delete}`}
                      aria-label="Excluir produto"
                      title="Excluir"
                      onClick={() => onDelete(product)}
                      disabled={isActionPending}
                    >
                      <Trash2 size={15} />
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
