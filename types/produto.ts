export type ProdutoStatus = 'PUBLICADO' | 'RASCUNHO' | 'PAUSADO';

export interface Produto {
  id: string;
  fotoUrl: string | null;
  nome: string;
  codigo: string;
  peca: string;
  estilo: string;
  cor: string;
  tamanhos: string[];
  preco: number;
  status: ProdutoStatus;
}

export interface FiltrosProdutos {
  busca: string;
  estilo: string;
  peca: string;
  status: ProdutoStatus | '';
}
