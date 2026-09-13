import type { StoreRequest, RequestStatus } from '@/types/store-requests';
import { MOCK_STORE_REQUESTS } from './store-requests.mock';

const SIMULATED_LATENCY_MS = 600;

export async function getStoreRequests(): Promise<StoreRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_STORE_REQUESTS;
}

export async function updateStoreRequestStatus(
  id: string,
  status: RequestStatus,
): Promise<StoreRequest> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const request = MOCK_STORE_REQUESTS.find((r) => r.id === id);
  if (!request) throw new Error(`Solicitação ${id} não encontrada`);
  request.status = status;
  return request;
}
