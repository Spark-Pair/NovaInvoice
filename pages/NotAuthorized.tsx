import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050814] px-6 dotted-bg">
      <div className="max-w-md w-full text-center bg-white dark:bg-[#0B1025] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-200 dark:border-slate-800">
        
        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          You don’t have permission to access this page.  
          If you believe this is a mistake, please contact your administrator.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            variant="secondary"
            className="flex-1 h-12 rounded-2xl"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>

          <Button
            className="flex-1 h-12 rounded-2xl"
            onClick={() => navigate('/')}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
