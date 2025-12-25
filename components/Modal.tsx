import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-[95vw]',
};

export const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title?: string; 
  size?: ModalSize;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, size = '2xl', children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          // className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto"
          className={`
            relative w-full ${SIZE_CLASSES[size]}
            bg-white dark:bg-slate-900
            rounded-[2.5rem]
            shadow-2xl
            border border-slate-200 dark:border-slate-800
            p-8 overflow-hidden overflow-y-auto
            max-h-[90vh]
          `}
        >
          {title && (
            <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
          )}
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors absolute top-8 right-8">
            <X size={20} />
          </button>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);