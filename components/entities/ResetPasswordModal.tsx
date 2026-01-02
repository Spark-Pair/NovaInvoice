
import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { KeyRound, Lock, AlertCircle } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  entityName: string; 
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onReset, entityName, entityId }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    handleValidatePassword()
  }, [password, confirmPassword])
  
  const handleValidatePassword = () => {
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
  }

  const handleReset = () => {
    handleValidatePassword();
    onReset(entityId, entityName, password); // handles
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Entity Password">
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-start gap-3">
           <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
           <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
             You are resetting the password for <span className="font-bold underline">{entityName}</span>. 
             The new password will take effect immediately.
           </p>
        </div>

        <div className="space-y-4">
          <Input 
            label="New Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<Lock size={16} className="text-slate-400" />}
          />
          <Input 
            label="Confirm New Password" 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            icon={<Lock size={16} className="text-slate-400" />}
          />
          {/* {password != confirmPassword && <p className="text-xs font-bold text-rose-500 ml-1">Passwords do not match</p>} */}
          {error && <p className="text-xs font-bold text-rose-500 ml-1">{error}</p>}  
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" className="flex-1 rounded-2xl" onClick={onClose}>Cancel</Button>
          <Button 
            className="flex-1 rounded-2xl shadow-lg shadow-indigo-500/20" 
            icon={<KeyRound size={18} />}
            onClick={handleReset}
            disabled={error}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </Modal>
  );
};
