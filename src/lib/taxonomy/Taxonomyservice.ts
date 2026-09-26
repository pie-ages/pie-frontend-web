import type { Taxonomy } from '@/types/taxonomy';
import Api from '@/lib/api';

let cache: Taxonomy | null = null;

export async function getTaxonomy(): Promise<Taxonomy> {
  if (cache) return cache;
  const { data } = await Api.get<Taxonomy>('/taxonomy');
  cache = data;
  return cache;
}

export const SIZES_BY_CATEGORY: Record<string, string[]> = {
  vestido: ['pp', 'p', 'm', 'g', 'gg', 'xgg', 'u'],
  blazer: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  blusa: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  camisa: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  camiseta: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  casaco: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  jaqueta: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  moletom: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  saia: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  calca: ['34', '36', '38', '40', '42', '44'],
  short: ['34', '36', '38', '40', '42', '44'],
  bermuda: ['34', '36', '38', '40', '42', '44'],
  sapato: ['33', '34', '35', '36', '37', '38', '39', '40', '41'],
};
