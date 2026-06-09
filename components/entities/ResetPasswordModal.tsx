import React, { useEffect, useState } from 'react';
import { AlertCircle, KeyRound, Lock } from 'lucide-react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: (id: string, name: string, password: string) => void;
  subjectName: string;
  subjectId: string;
  subjectLabel?: string;
  minimumLength?: number;
  logoutNotice?: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onReset,
  subjectName,
  subjectId,
  subjectLabel = 'Entity',
  minimumLength = 6,
  logoutNotice = false,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!password && !confirmPassword) {
      setError('');
      return;
    }

    if (password.length < minimumLength) {
      setError(`Password must be at least ${minimumLength} characters`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
  }, [password, confirmPassword, minimumLength]);

  const closeModal = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const handleReset = () => {
    if (
      password.length < minimumLength ||
      password !== confirmPassword
    ) {
      return;
    }

    onReset(subjectId, subjectName, password);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={`Reset ${subjectLabel} Password`}
    >
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
            You are resetting the password for{' '}
            <span className="font-bold underline">{subjectName}</span>.
            {' '}The new password will take effect immediately.
            {logoutNotice && ' Any active sessions will be logged out.'}
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            icon={<Lock size={16} className="text-slate-400" />}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleReset()}
            icon={<Lock size={16} className="text-slate-400" />}
          />
          {error && (
            <p className="text-xs font-bold text-rose-500 ml-1">{error}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="secondary"
            className="flex-1 rounded-2xl"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-2xl shadow-lg shadow-indigo-500/20"
            icon={<KeyRound size={18} />}
            onClick={handleReset}
            disabled={!password || !!error}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </Modal>
  );
};
