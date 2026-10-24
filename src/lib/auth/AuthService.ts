import axios from 'axios';

import Api from '@/lib/api';
import type { LoginResponse } from '@/shared/auth';
import { clearSession, saveSession } from '@/utils/auth-storage';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(`${Api.defaults.baseURL}/auth/login`, {
    email,
    password,
  });
  saveSession(data.accessToken, data.refreshToken, data.expiresIn, data.user?.role);
  return data;
}

export async function refresh(refreshToken: string): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(`${Api.defaults.baseURL}/auth/refresh`, {
    refreshToken,
  });
  saveSession(data.accessToken, data.refreshToken, data.expiresIn, data.user?.role);
  return data;
}

export async function logout(): Promise<void> {
  await Api.post('/auth/logout').catch(() => {});
  clearSession();
}
