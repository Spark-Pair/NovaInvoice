import React from 'react';
import { Plus } from 'lucide-react';

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
      <Plus size={24} />
    </div>
    <p className="font-medium">{message}</p>
  </div>
);
