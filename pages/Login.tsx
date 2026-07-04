import React, { useState } from 'react';
import { AlertTriangle, Lock, Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { User } from '../types';
import api from '@/axios';
import { useAppToast } from '@/components/toast/toast';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);
  const [error, setError] = useState('');
  const [showActiveSessionModal, setShowActiveSessionModal] = useState(false);

  const toast = useAppToast();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await api.post('/users/login', {
        username,
        password,
      });

      onLogin(res.data);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      if (err.response?.data?.code === 'ACTIVE_SESSION') {
        setConfirmPassword('');
        setShowActiveSessionModal(true);
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    if (!confirmPassword) {
      setError('Please enter your password again');
      return;
    }

    try {
      setForceLoading(true);
      setError('');

      const res = await api.post('/users/login', {
        username,
        password: confirmPassword,
        forceLogin: true,
      });

      setShowActiveSessionModal(false);
      onLogin(res.data);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      if (err.response?.data?.code === 'ACTIVE_SESSION') {
        setError('Could not replace the old session. Please refresh and try again, or ask support to clear this session.');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setForceLoading(false);
    }
  };

  return (
    <>
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
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />

            <input
              className="w-full px-4 py-3 rounded-xl border"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />

            {error && !showActiveSessionModal && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              className="w-full py-4 text-lg mt-4"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showActiveSessionModal}
        onClose={() => setShowActiveSessionModal(false)}
        title="Already Logged In"
        size="md"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 shrink-0" size={22} />
            <div>
              <p className="font-bold">This account is active somewhere else.</p>
              <p className="mt-1 text-sm leading-relaxed">
                Enter your password again to log out other devices and continue here.
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500 ml-1">Password</label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900"
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleForceLogin()}
                autoFocus
              />
            </div>
            {error && showActiveSessionModal && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowActiveSessionModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleForceLogin} disabled={forceLoading} className="rounded-xl">
              {forceLoading ? 'Logging in...' : 'Login Here'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;
