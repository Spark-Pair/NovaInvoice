
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: ConfirmationType;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false
}) => {
  const configs = {
    danger: {
      icon: <AlertTriangle size={32} className="text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      button: 'danger' as const,
      accent: 'border-rose-100 dark:border-rose-900/30'
    },
    warning: {
      icon: <AlertCircle size={32} className="text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      button: 'primary' as const, // Custom styling applied via className
      accent: 'border-amber-100 dark:border-amber-900/30'
    },
    info: {
      icon: <Info size={32} className="text-indigo-500" />,
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      button: 'primary' as const,
      accent: 'border-indigo-100 dark:border-indigo-900/30'
    },
    success: {
      icon: <CheckCircle2 size={32} className="text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      button: 'primary' as const,
      accent: 'border-emerald-100 dark:border-emerald-900/30'
    }
  };

  const config = configs[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border ${config.accent} text-center`}
          >
            <div className={`mx-auto w-20 h-20 rounded-[2rem] ${config.bg} flex items-center justify-center mb-6`}>
              {config.icon}
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white leading-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-2">
              {message}
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                variant={config.button} 
                className={`w-full h-12 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg ${
                  type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 border-none' : 
                  type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''
                }`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : confirmLabel}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-2xl text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800" 
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
