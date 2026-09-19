import axios, { AxiosError } from 'axios';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
});

Api.interceptors.response.use(undefined, (error) => {
  console.warn('Erro na requisição:', (error as AxiosError)?.response?.data);
  throw error;
});

export default Api;
