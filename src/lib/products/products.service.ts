import type { Product, ProductStatus } from '@/types/products';
import { MOCK_PRODUCTS } from './products.mock';

const SIMULATED_LATENCY_MS = 600;

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_PRODUCTS;
}

export async function updateProductAvailability(
  productId: string,
  status: ProductStatus,
): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  const product = MOCK_PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    throw new Error('Produto não encontrado');
  }

  product.status = status;
  return product;
}
