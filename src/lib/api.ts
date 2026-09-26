import axios, { AxiosError } from 'axios';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
});

Api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pie_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

Api.interceptors.response.use(undefined, (error: AxiosError) => {
  console.warn('Erro na requisição:', error?.response?.data);
  if (error?.response?.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('pie_auth_token');
    window.location.href = '/login';
  }
  throw error;
});

export default Api;
