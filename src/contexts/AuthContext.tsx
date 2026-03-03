import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../services/api';
import { AuthUser } from '../types/auth.types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.toString());
    }

    const savedToken = localStorage.getItem('authToken');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    const bootstrapAuth = async () => {
      try {
        const response = await apiClient.get<AuthUser>('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to load auth user:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
