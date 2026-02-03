import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// --- Individual Toast Item ---
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) => {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration || 3000;

  return (
    <motion.div
      layout
      // The "Wobble" Entrance: Starts above the screen, bounces into place
      initial={{ opacity: 0, y: -100, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // The "Wobble" Exit: Snaps back up with a slight bounce
      exit={{ opacity: 0, y: -100, scale: 0.5, transition: { duration: 0.4 } }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative overflow-hidden min-w-[300px] px-6 py-4 rounded-2xl shadow-2xl 
        flex items-center justify-between text-white font-bold
        ${toast.type === 'success' && 'bg-emerald-500 shadow-emerald-500/40'}
        ${toast.type === 'error' && 'bg-rose-500 shadow-rose-500/40'}
        ${toast.type === 'warning' && 'bg-amber-500 shadow-amber-500/40'}
        ${toast.type === 'info' && 'bg-indigo-600 shadow-indigo-600/40'}
      `}
      style={{ originX: 1 }}
    >
      <span className="drop-shadow-sm">{toast.message}</span>
      
      <button 
        onClick={() => onClose(toast.id)}
        className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
      
      {/* Loading Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: isPaused ? undefined : 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          onAnimationComplete={() => {
            if (!isPaused) onClose(toast.id);
          }}
          className="h-full bg-white/50"
        />
      </div>
    </motion.div>
  );
};

// --- Context & Provider ---
interface ToastContextType {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    setToasts(prev => [...prev, { id: crypto.randomUUID(), message, type, duration }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      
      {/* Top-Right Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto self-end">
              <ToastItem toast={t} onClose={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};