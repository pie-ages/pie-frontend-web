'use client';

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { login, logout, refresh } from '@/lib/auth/AuthService';
import Api from '@/lib/api';
import type { User } from '@/shared/user';
import { clearSession, getAccessToken, getExpiresAt, getRefreshToken } from '@/utils/auth-storage';

type ApiUser = User & { photo_url?: string | null };

function normalizeUser(raw: ApiUser | null | undefined): User | null {
  if (!raw) return null;
  return {
    ...raw,
    photoUrl: raw.photoUrl ?? raw.photo_url ?? null,
  };
}

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const token = getAccessToken();
        if (!token) return;

        const expiresAt = getExpiresAt();
        const isExpired = expiresAt !== null && Date.now() >= expiresAt - 30_000;

        if (isExpired) {
          const storedRefresh = getRefreshToken();
          if (!storedRefresh) {
            clearSession();
            return;
          }
          try {
            const data = await refresh(storedRefresh);
            setUser(normalizeUser(data.user));
            setAuthenticated(true);
          } catch {
            clearSession();
          }
          return;
        }

        setAuthenticated(true);
        try {
          const { data } = await Api.get<ApiUser>('/auth/me');
          setUser(normalizeUser(data));
        } catch {
          setUser(null);
        }
      } finally {
        setIsInitializing(false);
      }
    }

    init();
  }, []);

  async function signIn(email: string, password: string): Promise<User | null> {
    const data = await login(email, password);
    const sessionUser = normalizeUser(data.user);
    setUser(sessionUser);
    setAuthenticated(true);
    return sessionUser;
  }

  async function signOut() {
    setUser(null);
    setAuthenticated(false);
    await logout();
  }

  function updateUser(patch: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: authenticated, isInitializing, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
