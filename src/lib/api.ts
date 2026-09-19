import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export const apiClient = axios.create({ baseURL: BASE_URL });

export async function apiFetch<T>(path: string): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(path);
    return data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const message =
        (err.response.data as { message?: string })?.message ?? `HTTP ${err.response.status}`;
      throw new ApiError(message, err.response.status);
    }
    throw err;
  }
}
