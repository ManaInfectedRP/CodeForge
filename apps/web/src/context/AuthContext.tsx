import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserDto } from '@codeforge/shared';
import { api } from '../lib/api';
import { disconnectChatSocket } from '../lib/socket';

interface AuthContextValue {
  user: UserDto | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserDto>;
  register: (username: string, email: string, password: string) => Promise<UserDto>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // the auth cookie (if any) is sent automatically; a 401 just means logged-out
    api
      .get<UserDto>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post<UserDto>('/auth/login', { email, password });
    setUser(data);
    return data;
  }

  async function register(username: string, email: string, password: string) {
    const { data } = await api.post<UserDto>('/auth/register', { username, email, password });
    setUser(data);
    return data;
  }

  async function logout() {
    await api.post('/auth/logout').catch(() => {});
    setUser(null);
    disconnectChatSocket();
  }

  async function refreshUser() {
    const { data } = await api.get<UserDto>('/auth/me');
    setUser(data);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
