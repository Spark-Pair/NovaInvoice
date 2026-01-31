
import React, { useState, useEffect } from 'react';
// Import DOM-specific router components from react-router-dom
import { HashRouter } from 'react-router-dom';
// Import core routing components from react-router to resolve potential export missing errors in some environments
import { Routes, Route, Navigate } from 'react-router';
import { Theme } from './types';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Entities from './pages/Entities';
import Buyers from './pages/Buyers';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import NotAuthorized from './pages/NotAuthorized';

export default function App() {
  const { user, login, logout, isAuthorized, setUsingEntity } = useAuth();
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
            <>
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route
                path="*"
                element={
                  <div className="flex bg-slate-50 dark:bg-[#080C1C] text-slate-900 dark:text-slate-100 transition-colors duration-300 dotted-bg">
                    <Sidebar user={user} onLogout={logout} onDeselectEntity={() => setUsingEntity(null)} theme={theme} toggleTheme={toggleTheme} />
                    <main className="flex-1 ml-72 min-h-screen">
                      <div className={`p-8 pb-5 h-screen`}>
                        <Routes>
                          <Route path="/admin-dashboard" element={ isAuthorized({ roles: 'admin' }) ? <Dashboard /> : <Navigate to="/not-authorized" /> } />
                          <Route path="/dashboard" element={ isAuthorized({ roles: ['client'], allowAdminWithEntity: true }) ? <Dashboard /> : <Navigate to="/not-authorized" /> } />

                          <Route path="/entities" element={ isAuthorized({ roles: 'admin' }) ? <Entities /> : <Navigate to="/not-authorized" /> } />

                          <Route path="/buyers" element={ isAuthorized({ roles: ['client'], allowAdminWithEntity: true }) ? <Buyers /> : <Navigate to="/not-authorized" /> } />
                          <Route path="/invoices" element={ isAuthorized({ roles: ['client'], allowAdminWithEntity: true }) ? <Invoices /> : <Navigate to="/not-authorized" /> } />

                          <Route path="/admin-settings" element={ isAuthorized({ roles: 'admin' }) ? <Settings /> : <Navigate to="/not-authorized" /> } />
                          <Route path="/settings" element={ isAuthorized({ roles: ['client'], allowAdminWithEntity: true }) ? <Settings /> : <Navigate to="/not-authorized" /> } />

                          <Route path="*" element={ <Navigate to={ isAuthorized({ roles: 'admin' }) ? "/admin-dashboard" : isAuthorized(['client']) ? "/dashboard" : "" } /> } />
                        </Routes>
                      </div>
                    </main>
                  </div>
                }
              />
            </>
          )}
        </Routes>
      </div>
    </HashRouter>
  );
}
