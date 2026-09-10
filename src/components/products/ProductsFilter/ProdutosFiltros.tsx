import type { FiltrosProdutos, ProdutoStatus } from '../../types/produto';
import styles from './ProdutosFiltros.module.css';

const OPCOES_STATUS: { valor: ProdutoStatus; rotulo: string }[] = [
  { valor: 'PUBLICADO', rotulo: 'Publicado' },
  { valor: 'RASCUNHO', rotulo: 'Rascunho' },
  { valor: 'PAUSADO', rotulo: 'Pausado' },
];

interface ProdutosFiltrosProps {
  filtros: FiltrosProdutos;
  estilos: string[];
  pecas: string[];
  totalTexto: string;
  onFiltrosChange: (filtros: FiltrosProdutos) => void;
}

export function ProdutosFiltros({
  filtros,
  estilos,
  pecas,
  totalTexto,
  onFiltrosChange,
}: ProdutosFiltrosProps) {
  return (
    <div className={styles.barra}>
      <div className={styles.buscaWrapper}>
        <svg
          className={styles.buscaIcone}
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
          className={styles.busca}
          placeholder="Buscar por nome ou código"
          aria-label="Buscar produtos por nome ou código"
          value={filtros.busca}
          onChange={(evento) => onFiltrosChange({ ...filtros, busca: evento.target.value })}
        />
      </div>

      <select
        className={styles.select}
        aria-label="Filtrar por estilo"
        value={filtros.estilo}
        onChange={(evento) => onFiltrosChange({ ...filtros, estilo: evento.target.value })}
      >
        <option value="">Todos os estilos</option>
        {estilos.map((estilo) => (
          <option key={estilo} value={estilo}>
            {estilo}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Filtrar por peça"
        value={filtros.peca}
        onChange={(evento) => onFiltrosChange({ ...filtros, peca: evento.target.value })}
      >
        <option value="">Todas as peças</option>
        {pecas.map((peca) => (
          <option key={peca} value={peca}>
            {peca}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Filtrar por status"
        value={filtros.status}
        onChange={(evento) =>
          onFiltrosChange({ ...filtros, status: evento.target.value as FiltrosProdutos['status'] })
        }
      >
        <option value="">Todos os status</option>
        {OPCOES_STATUS.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>

      <span className={styles.contador}>{totalTexto}</span>
    </div>
  );
}
