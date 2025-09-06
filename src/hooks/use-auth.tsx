
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type User = {
  displayName: string;
  email: string;
};

// This is a mock user store. In a real app, this would be a database.
const FAKE_USER_DB_KEY = 'ecoswap_users';

// Mock password hashing. In a real app, use a library like bcrypt.
const mockHash = (password: string) => `hashed_${password}`;

const getMockUsers = (): Map<string, any> => {
  try {
    const usersJson = localStorage.getItem(FAKE_USER_DB_KEY);
    return usersJson ? new Map(JSON.parse(usersJson)) : new Map();
  } catch {
    return new Map();
  }
};

const saveMockUsers = (users: Map<string, any>) => {
  try {
    localStorage.setItem(FAKE_USER_DB_KEY, JSON.stringify(Array.from(users.entries())));
  } catch (error) {
    console.error("Failed to save users to localStorage", error);
  }
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

  const signup = useCallback((displayName: string, email: string, password: string): { success: boolean, message: string } => {
    const users = getMockUsers();
    if (users.has(email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    
    const newUser = {
      displayName,
      email,
      passwordHash: mockHash(password),
    };
    users.set(email, newUser);
    saveMockUsers(users);

    login(email, password);

    return { success: true, message: 'Account created successfully!' };
  }, []);

  const login = useCallback((email: string, password?: string): { success: boolean, message: string } => {
    const users = getMockUsers();
    const storedUser = users.get(email);
    
    // Special case for test user for easier development
    if (email === 'test@example.com' && !storedUser) {
        const testUser = { displayName: 'Test User', email, passwordHash: mockHash('password') };
        users.set(email, testUser);
        saveMockUsers(users);
    }

    const userToLogin = users.get(email);

    if (!userToLogin) {
      return { success: false, message: 'No user found with this email.' };
    }

    if (password && userToLogin.passwordHash !== mockHash(password)) {
      return { success: false, message: 'Invalid password.' };
    }
    
    // In a real app, you'd get this from the successful login response
    const userDataForState: User = { displayName: userToLogin.displayName, email: userToLogin.email };

    localStorage.setItem('ecoswap_token', 'fake-jwt-token');
    localStorage.setItem('ecoswap_user', JSON.stringify(userDataForState));
    setIsLoggedIn(true);
    setUser(userDataForState);

    return { success: true, message: 'Logged in successfully.' };
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

  return { isLoggedIn, user, login, logout, isLoading, updateUser, signup };
}
