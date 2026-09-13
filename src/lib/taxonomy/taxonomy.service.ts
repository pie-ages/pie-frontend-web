import type { Taxonomy } from '@/types/taxonomy';
import { MOCK_TAXONOMY } from './taxonomy.mock';

const SIMULATED_LATENCY_MS = 500;

export async function getTaxonomy(): Promise<Taxonomy> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_TAXONOMY;
}

export const SIZES_BY_CATEGORY: Record<string, string[]> = {
  vestido: ['pp', 'p', 'm', 'g', 'gg', 'xgg', 'u'],
  blazer: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  camisa: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  calca: ['34', '36', '38', '40', '42', '44'],
  casaco: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
  sapato: ['33', '34', '35', '36', '37', '38', '39', '40', '41'],
  camiseta: ['pp', 'p', 'm', 'g', 'gg', 'xgg'],
};
