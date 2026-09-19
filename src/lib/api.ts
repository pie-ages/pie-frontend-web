const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError((err as { message?: string }).message ?? `HTTP ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}
