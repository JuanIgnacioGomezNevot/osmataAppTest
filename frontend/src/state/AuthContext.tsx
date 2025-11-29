import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

type Role = 'AFILIADO' | 'EMPLEADO' | 'ADMIN';

type User = {
  id: number;
  nombre: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, string>) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('osmata_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('osmata_token', data.token);
    localStorage.setItem('osmata_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload: Record<string, string>) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('osmata_token', data.token);
    localStorage.setItem('osmata_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('osmata_token');
    localStorage.removeItem('osmata_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext debe utilizarse dentro de AuthProvider');
  return context;
}
