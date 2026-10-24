import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { clearSession, getAccessToken, getRefreshToken, saveSession } from '@/utils/auth-storage';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
});

Api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const originalRequest = error.config as RetryConfig | undefined;

  if (
    error?.response?.status === 401 &&
    typeof window !== 'undefined' &&
    originalRequest &&
    !originalRequest._retry
  ) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        }>(`${Api.defaults.baseURL}/auth/refresh`, { refreshToken });

        saveSession(data.accessToken, data.refreshToken, data.expiresIn);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return Api(originalRequest);
      } catch {
        clearSession();
        window.location.href = '/login';
        throw error;
      }
    }

    clearSession();
    window.location.href = '/login';
  }

  throw error;
});

export default Api;
