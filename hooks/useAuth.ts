
import { useState, useCallback } from 'react';
import { User } from '../types';
import api from '@/axios';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = async () => {
    try {
      // 🔐 Invalidate session on backend
      await api.post('/users/logout');
    } catch (err) {
      // Even if API fails, still logout locally
      console.warn('Logout API failed, clearing local session');
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateSettings = (newSettings) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      settings: { ...user.settings, ...newSettings }
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthorized = useCallback(
    (allowedRoles: string[] = []) => {
      if (!user) return false;
      if (allowedRoles.length === 0) return true;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  return { user, login, logout, updateSettings, isAuthorized };
};
