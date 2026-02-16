'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { authAPI } from '@/lib/api';
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
} from '@/lib/auth';

export function useAuthState() {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);

      // Verify token is still valid
      authAPI.getMe()
        .then((user) => {
          setUserState(user);
          setUser(user);
        })
        .catch(() => {
          removeToken();
          removeUser();
          setTokenState(null);
          setUserState(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authAPI.getMe();
      setUserState(user);
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  return { user, token, isLoading, login, logout, refreshUser };
}
