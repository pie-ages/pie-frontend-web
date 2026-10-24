const KEYS = {
  access: 'pie_auth_token',
  refresh: 'pie_refresh_token',
  expiresAt: 'pie_expires_at',
};

export function saveSession(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  role?: string | null,
): void {
  localStorage.setItem(KEYS.access, accessToken);
  localStorage.setItem(KEYS.refresh, refreshToken);
  localStorage.setItem(KEYS.expiresAt, String(Date.now() + expiresIn * 1000));

  document.cookie = `pie_session=1; path=/; SameSite=Lax; max-age=${expiresIn}`;

  if (role === 'ADMIN') {
    document.cookie = `pie_role=ADMIN; path=/; SameSite=Lax; max-age=${expiresIn}`;
  } else {
    document.cookie = 'pie_role=; path=/; max-age=0';
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(KEYS.access);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(KEYS.refresh);
}

export function getExpiresAt(): number | null {
  const raw = localStorage.getItem(KEYS.expiresAt);
  if (!raw) return null;
  const n = Number(raw);
  return isNaN(n) ? null : n;
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.access);
  localStorage.removeItem(KEYS.refresh);
  localStorage.removeItem(KEYS.expiresAt);
  document.cookie = 'pie_session=; path=/; max-age=0';
  document.cookie = 'pie_role=; path=/; max-age=0';
}
