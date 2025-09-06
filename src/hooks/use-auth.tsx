
"use client";

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';

export type User = {
  displayName: string;
  email: string;
};

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password?: string) => { success: boolean, message: string };
    logout: () => void;
    signup: (displayName: string, email: string, password: string) => { success: boolean, message: string };
    updateUser: (updatedUserData: Partial<User>) => void;
}


// This is a mock user store. In a real app, this would be a database.
const FAKE_USER_DB_KEY = 'ecoswap_users';

// Mock password hashing. In a real app, use a library like bcrypt.
const mockHash = (password: string) => `hashed_${password}`;

const getMockUsers = (): Map<string, any> => {
  if (typeof window === 'undefined') return new Map();
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const value = { isLoggedIn, user, login, logout, isLoading, updateUser, signup };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
