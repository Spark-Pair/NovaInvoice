// AuthContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '@/axios';
import { User } from '../types';

type AuthContextType = {
    user: User | null;
    usingEntity: any;
    login: (u: User) => void;
    logout: () => Promise<void>;
    updateSettings: (s: any) => void;
    isAuthorized: (roles?: string[]) => boolean;
    setUsingEntity: (e: any) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [usingEntity, setUsingEntity] = useState<any>(() => {
        const saved = localStorage.getItem('usingEntity');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (u: User) => {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
    };

    const logout = async () => {
        try {
        await api.post('/users/logout');
        } finally {
        setUser(null);
        setUsingEntity(null);
        localStorage.removeItem('user');
        localStorage.removeItem('usingEntity');
        }
    };

    const updateSettings = (newSettings: any) => {
        if (!user) return;
        const updated = { ...user, settings: { ...user.settings, ...newSettings } };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    type AuthCheckOptions = {
    roles?: string[];
    allowAdminWithEntity?: boolean;
    };

    const isAuthorized = useCallback(
    ({ roles = [], allowAdminWithEntity = false }: AuthCheckOptions = {}) => {
        if (!user) return false;

        // Normal role check
        if (roles.includes(user.role)) return true;

        // Special case: admin acting as client
        if (
        allowAdminWithEntity &&
        user.role === 'admin' &&
        usingEntity
        ) {
        return true;
        }

        return false;
    },
    [user, usingEntity]
    );

    // persist entity
    const handleSetEntity = (entity: any) => {
        setUsingEntity(entity);
        localStorage.setItem('usingEntity', JSON.stringify(entity));
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            usingEntity,
            login,
            logout,
            updateSettings,
            isAuthorized,
            setUsingEntity: handleSetEntity,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};
