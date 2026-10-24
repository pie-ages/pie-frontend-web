'use client';

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { login, logout, refresh } from '@/lib/auth/AuthService';
import Api from '@/lib/api';
import type { User } from '@/shared/user';
import { clearSession, getAccessToken, getExpiresAt, getRefreshToken } from '@/utils/auth-storage';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
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
            setUser(data.user ?? null);
            setAuthenticated(true);
          } catch {
            clearSession();
          }
          return;
        }

        setAuthenticated(true);
        try {
          const { data } = await Api.get<User>('/auth/me');
          setUser(data);
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
    const sessionUser = data.user ?? null;
    setUser(sessionUser);
    setAuthenticated(true);
    return sessionUser;
  }

  async function signOut() {
    setUser(null);
    setAuthenticated(false);
    await logout();
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: authenticated, isInitializing, signIn, signOut }}
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
