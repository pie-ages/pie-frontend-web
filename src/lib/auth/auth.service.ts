import Api from '@/lib/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface UserSummary {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
}

interface LoginResponse {
  token: string;
  user: UserSummary;
}

const TOKEN_KEY = 'pie_auth_token';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await Api.post<LoginResponse>('/auth/login', {
    email,
    password,
  } satisfies LoginRequest);
  return data;
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
