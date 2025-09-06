"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type User = {
  displayName: string;
  email: string;
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('ecoswap_token');
      const userData = localStorage.getItem('ecoswap_user');
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    localStorage.setItem('ecoswap_token', 'fake-jwt-token');
    localStorage.setItem('ecoswap_user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ecoswap_token');
    localStorage.removeItem('ecoswap_user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
    router.refresh();
  }, [router]);
  
  const updateUser = useCallback((updatedUserData: Partial<User>) => {
    if(user) {
        const newUser = { ...user, ...updatedUserData };
        localStorage.setItem('ecoswap_user', JSON.stringify(newUser));
        setUser(newUser);
    }
  }, [user]);

  return { isLoggedIn, user, login, logout, isLoading, updateUser };
}
