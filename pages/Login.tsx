
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User } from '../types';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  
  const handleLogin = () => {
    onLogin({ 
      id: '1', 
      name: 'John Doe', 
      email: email || 'demo@novainvoice.com' 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C1C] p-4 transition-colors duration-300">
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl mb-4">
            <Zap fill="currentColor" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400">Log in to manage your invoices</p>
        </div>
        <div className="space-y-4">
          <input 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Email Address" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Password" 
            type="password" 
          />
          <Button 
            className="w-full py-4 text-lg mt-6" 
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
