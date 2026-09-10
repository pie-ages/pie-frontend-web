'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FiltrosProdutos, Produto } from '../../types/produto';
import { getProdutos } from '../../lib/produtos/produtos.service';
import {
  FILTROS_VAZIOS,
  filtrarProdutos,
  valoresUnicos,
} from '../../lib/produtos/produtos.filtros';
import { ProdutosFiltros } from '../../components/produtos/ProdutosFiltros';
import { ProdutosTable } from '../../components/produtos/ProdutosTable';
import { ProdutosPaginacao } from '../../components/produtos/ProdutosPaginacao';
import styles from './page.module.css';

type Status = 'carregando' | 'erro' | 'pronto';

const PRODUTOS_POR_PAGINA = 5;

export default function ProdutosPage() {
  const [status, setStatus] = useState<Status>('carregando');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtros, setFiltros] = useState<FiltrosProdutos>(FILTROS_VAZIOS);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    let ativo = true;

    getProdutos()
      .then((lista) => {
        if (!ativo) return;
        setProdutos(lista);
        setStatus('pronto');
      })
      .catch(() => {
        if (!ativo) return;
        setStatus('erro');
      });

    return () => {
      ativo = false;
    };
  }, []);

  const estilos = useMemo(() => valoresUnicos(produtos, 'estilo'), [produtos]);
  const pecas = useMemo(() => valoresUnicos(produtos, 'peca'), [produtos]);
  const produtosFiltrados = useMemo(() => filtrarProdutos(produtos, filtros), [produtos, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA));
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const inicio = (paginaSegura - 1) * PRODUTOS_POR_PAGINA;
  const produtosPagina = produtosFiltrados.slice(inicio, inicio + PRODUTOS_POR_PAGINA);
  const totalTexto = `${produtosFiltrados.length} de ${produtos.length} produtos`;

  const aplicarFiltros = (novosFiltros: FiltrosProdutos) => {
    setFiltros(novosFiltros);
    setPaginaAtual(1);
  };

  const mudarPagina = (pagina: number) => {
    setPaginaAtual(Math.min(Math.max(pagina, 1), totalPaginas));
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.titulo}>Produtos</h1>
        </header>

        {status === 'carregando' && <p className={styles.aviso}>Carregando produtos…</p>}

        {status === 'erro' && (
          <p className={`${styles.aviso} ${styles.avisoErro}`}>
            Não foi possível carregar os produtos. Tente novamente mais tarde.
          </p>
        )}

        {status === 'pronto' && (
          <>
            <ProdutosFiltros
              filtros={filtros}
              estilos={estilos}
              pecas={pecas}
              totalTexto={totalTexto}
              onFiltrosChange={aplicarFiltros}
            />

            {produtos.length === 0 && (
              <p className={styles.aviso}>Nenhum produto cadastrado ainda.</p>
            )}

            {produtos.length > 0 && produtosFiltrados.length === 0 && (
              <div className={styles.semResultado}>
                <p>Nenhum produto encontrado com esses filtros.</p>
                <button
                  type="button"
                  className={styles.limparFiltros}
                  onClick={() => aplicarFiltros(FILTROS_VAZIOS)}
                >
                  Limpar filtros
                </button>
              </div>
            )}

            {produtosFiltrados.length > 0 && (
              <>
                <ProdutosTable produtos={produtosPagina} />
                <ProdutosPaginacao
                  paginaAtual={paginaSegura}
                  totalPaginas={totalPaginas}
                  onMudarPagina={mudarPagina}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
