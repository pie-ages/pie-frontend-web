import type { Product } from '@/types/products';
import { MOCK_PRODUCTS } from './products.mock';

const SIMULATED_LATENCY_MS = 600;

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_PRODUCTS;
}
