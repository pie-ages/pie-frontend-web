import styles from './ProdutosPaginacao.module.css';

interface ProdutosPaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
}

export function ProdutosPaginacao({
  paginaAtual,
  totalPaginas,
  onMudarPagina,
}: ProdutosPaginacaoProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <nav className={styles.paginacao} aria-label="Paginação de produtos">
      <button
        type="button"
        className={styles.botao}
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual <= 1}
      >
        Anterior
      </button>

      <span className={styles.indicador}>
        Página {paginaAtual} de {totalPaginas}
      </span>

      <button
        type="button"
        className={styles.botao}
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual >= totalPaginas}
      >
        Próxima
      </button>
    </nav>
  );
}
