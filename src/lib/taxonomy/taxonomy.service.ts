import type { Taxonomy } from '@/types/taxonomy';
import { MOCK_TAXONOMY } from './taxonomy.mock';

const SIMULATED_LATENCY_MS = 500;

export async function getTaxonomy(): Promise<Taxonomy> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_TAXONOMY;
}
