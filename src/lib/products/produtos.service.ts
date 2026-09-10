import type { Produto } from '../../types/produto';
import { MOCK_PRODUTOS } from './produtos.mock';

const LATENCIA_SIMULADA_MS = 600;

export async function getProdutos(): Promise<Produto[]> {
  await new Promise((resolve) => setTimeout(resolve, LATENCIA_SIMULADA_MS));
  return MOCK_PRODUTOS;
}
