import { isAxiosError } from 'axios';

import Api from '@/lib/api';

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreatedAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function createAdmin(payload: CreateAdminRequest): Promise<CreatedAdmin> {
  const { data } = await Api.post<CreatedAdmin>('/admins', payload);
  return data;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 403) {
      return 'Você não tem permissão para criar administradores.';
    }
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}
