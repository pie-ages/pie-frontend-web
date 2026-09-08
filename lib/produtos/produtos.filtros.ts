import type { FiltrosProdutos, Produto } from '../../types/produto';

export const FILTROS_VAZIOS: FiltrosProdutos = {
  busca: '',
  estilo: '',
  peca: '',
  status: '',
};

export function valoresUnicos(produtos: Produto[], campo: 'estilo' | 'peca'): string[] {
  const valores = new Set(produtos.map((produto) => produto[campo]));
  return [...valores].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function filtrarProdutos(produtos: Produto[], filtros: FiltrosProdutos): Produto[] {
  const busca = filtros.busca.trim().toLowerCase();

  return produtos.filter((produto) => {
    const casaBusca =
      busca === '' ||
      produto.nome.toLowerCase().includes(busca) ||
      produto.codigo.toLowerCase().includes(busca);
    const casaEstilo = filtros.estilo === '' || produto.estilo === filtros.estilo;
    const casaPeca = filtros.peca === '' || produto.peca === filtros.peca;
    const casaStatus = filtros.status === '' || produto.status === filtros.status;

    return casaBusca && casaEstilo && casaPeca && casaStatus;
  });
}
