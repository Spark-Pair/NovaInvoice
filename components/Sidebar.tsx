
import React, { useState, useEffect, useRef } from 'react';
// Link is DOM-specific, so it stays in react-router-dom
import { Link } from 'react-router-dom';
// useLocation is core logic, so we import from react-router to ensure compatibility
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Zap, 
  FileText,
  User as UserIcon,
  ChevronUp
} from 'lucide-react';
import { User, Theme } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, theme, toggleTheme }) => {
  const location = useLocation();
  const [showProfileActions, setShowProfileActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Building2 size={20} />, label: 'Entities', path: '/entities' },
    { icon: <Users size={20} />, label: 'Buyers', path: '/buyers' },
    { icon: <FileText size={20} />, label: 'Invoices', path: '/invoices' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 p-5">
      <div className="h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-6 z-40 transition-colors duration-300 rounded-3xl">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight">NovaInvoice</span>
        </div>

        <hr className="border border-slate-100 dark:border-slate-800 my-5" />

        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <hr className="border border-slate-100 dark:border-slate-800 my-5" />

        <div className="relative" ref={dropdownRef}>
          <AnimatePresence>
            {showProfileActions && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  <UserIcon size={18} />
                  <span>Account Profile</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-sm font-semibold"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setShowProfileActions(!showProfileActions)}
            className={`w-full flex items-center gap-3 p-3 rounded-3xl transition-all duration-200 group ${
              showProfileActions ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 transition-colors flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">Pro Account</p>
            </div>
            <ChevronUp size={16} className={`text-slate-400 transition-transform duration-300 ${showProfileActions ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  );
};
