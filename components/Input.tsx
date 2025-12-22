
import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-slate-500 ml-1">{label}</label>}
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500">
          {icon}
        </div>
      )}
      <input 
        className={`w-full ${icon ? 'pl-11' : 'px-4'} py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  </div>
);
