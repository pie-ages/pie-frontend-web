import axios from 'axios';

import type { ApiErrorResponse } from '@/shared/api';

export const CONNECTION_ERROR_MESSAGE =
  'Não foi possível conectar. Verifique sua conexão e tente novamente.';

export function getApiErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;
  if (!error.response) return CONNECTION_ERROR_MESSAGE;
  return error.response.data?.message || fallback;
}
