import axios from 'axios';

import Api from '@/lib/api';
import type { LoginResponse } from '@/shared/auth';
import { clearSession, saveSession } from '@/utils/auth-storage';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(`${Api.defaults.baseURL}/auth/company/login`, {
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

export async function requestPasswordRecovery(email: string): Promise<void> {
  await axios.post(`${Api.defaults.baseURL}/auth/recover`, { email });
}

export async function verifyRecoveryCode(email: string, code: string): Promise<string> {
  const { data } = await axios.post<LoginResponse>(`${Api.defaults.baseURL}/auth/recover/verify`, {
    email,
    code,
  });
  return data.accessToken;
}

export async function updatePassword(recoveryToken: string, password: string): Promise<void> {
  await axios.put(
    `${Api.defaults.baseURL}/auth/password`,
    { password },
    { headers: { Authorization: `Bearer ${recoveryToken}` } },
  );
}

export async function revokeRecoverySession(recoveryToken: string): Promise<void> {
  await axios.post(`${Api.defaults.baseURL}/auth/logout`, undefined, {
    headers: { Authorization: `Bearer ${recoveryToken}` },
  });
}
