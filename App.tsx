
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Theme } from './types';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Entities from './pages/Entities';
import Buyers from './pages/Buyers';
import Invoices from './pages/Invoices';

export default function App() {
  const { user, login, logout } = useAuth();
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<Landing theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/login" element={<Login onLogin={login} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route
              path="*"
              element={
                <div className="flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                  <Sidebar user={user} onLogout={logout} theme={theme} toggleTheme={toggleTheme} />
                  <main className="flex-1 ml-72 min-h-screen">
                    <div className="p-8 pb-20">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/entities" element={<Entities />} />
                        <Route path="/buyers" element={<Buyers />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </HashRouter>
  );
}
