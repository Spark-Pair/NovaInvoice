import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User } from '../types';
import api from '@/axios';
import { useAppToast } from '@/components/toast/toast';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toast = useAppToast();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await api.post('/users/login', {
        username,
        password,
      });

      onLogin(res.data); // {_id, username, token}
      toast.success("Logged in successfully!")
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C1C] p-4">
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl mb-4">
            <Zap fill="currentColor" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Log in to manage your invoices
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl border lowercase"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl border"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            className="w-full py-4 text-lg mt-4"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
