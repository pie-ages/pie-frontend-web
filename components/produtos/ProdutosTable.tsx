import type { Produto } from '../../types/produto';
import { StatusBadge } from './StatusBadge';
import styles from './ProdutosTable.module.css';

const formatadorPreco = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface ProdutosTableProps {
  produtos: Produto[];
}

export function ProdutosTable({ produtos }: ProdutosTableProps) {
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
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id} className={styles.row}>
              <td className={styles.td}>
                <div className={styles.foto} aria-hidden="true" />
              </td>
              <td className={styles.td}>
                <span className={styles.nome}>{produto.nome}</span>
                <span className={styles.codigo}>{produto.codigo}</span>
              </td>
              <td className={styles.td}>{produto.peca}</td>
              <td className={styles.td}>
                <span className={styles.chipEstilo}>{produto.estilo}</span>
              </td>
              <td className={styles.td}>{produto.cor}</td>
              <td className={styles.td}>{produto.tamanhos.join(' ')}</td>
              <td className={styles.td}>{formatadorPreco.format(produto.preco)}</td>
              <td className={styles.td}>
                <StatusBadge status={produto.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
