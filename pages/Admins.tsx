import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, KeyRound, LogOut, MoreVertical, Plus, Power, ShieldCheck, UserCog, Users } from 'lucide-react';
import api from '@/axios';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import Loader from '@/components/Loader';
import { Modal } from '@/components/Modal';
import { ResetPasswordModal } from '@/components/entities/ResetPasswordModal';
import { useAppToast } from '@/components/toast/toast';
import { useGlobalLoader } from '@/hooks/LoaderContext';

type AdminUser = {
  _id: string;
  name: string;
  username: string;
  role: 'admin';
  createdAt: string;
  isLoggedIn: boolean;
  isActive: boolean;
};

const EMPTY_FORM = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const Admins: React.FC = () => {
  const toast = useAppToast();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetAdmin, setResetAdmin] = useState<AdminUser | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState<{
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  });
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/users/admins');
      setAdmins(data.admins || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const closeContextMenu = () => setActiveContextMenu(null);
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, []);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setForm(EMPTY_FORM);
  };

  const createAdmin = async () => {
    if (!form.name.trim() || !form.username.trim() || !form.password) {
      toast.error('Name, username and password are required');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    showLoader();
    try {
      const { data } = await api.post('/users/admins', {
        name: form.name,
        username: form.username,
        password: form.password,
      });

      setAdmins((current) => [data.admin, ...current]);
      closeCreateModal();
      toast.success('Admin created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      hideLoader();
    }
  };

  const resetPassword = async (adminId: string, adminName: string, password: string) => {
    showLoader();
    try {
      const { data } = await api.patch(
        `/users/admins/${adminId}/reset-password`,
        { password }
      );

      setAdmins((current) =>
        current.map((admin) =>
          admin._id === adminId
            ? { ...admin, isLoggedIn: false }
            : admin
        )
      );
      setResetAdmin(null);
      toast.success(
        data.loggedOutSessions > 0
          ? `${adminName}'s password was reset and active sessions were logged out`
          : `${adminName}'s password was reset`
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      hideLoader();
    }
  };

  const logoutSessions = (admin: AdminUser) => {
    setConfirmationConfig({
      title: 'Logout Administrator',
      message: `Log ${admin.name} out from all active sessions?`,
      type: 'warning',
      onConfirm: async () => {
        showLoader();
        try {
          const { data } = await api.patch(`/users/admins/${admin._id}/logout`);
          setAdmins((current) =>
            current.map((item) =>
              item._id === admin._id ? { ...item, isLoggedIn: false } : item
            )
          );
          toast.success(data.message);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to logout admin');
        } finally {
          hideLoader();
          setIsConfirmationOpen(false);
        }
      },
    });
    setIsConfirmationOpen(true);
  };

  const toggleStatus = (admin: AdminUser) => {
    const nextStatus = admin.isActive ? 'deactivate' : 'activate';
    setConfirmationConfig({
      title: `${admin.isActive ? 'Deactivate' : 'Activate'} Administrator`,
      message: `Are you sure you want to ${nextStatus} ${admin.name}?${
        admin.isActive ? ' Active sessions will be logged out.' : ''
      }`,
      type: admin.isActive ? 'danger' : 'info',
      onConfirm: async () => {
        showLoader();
        try {
          const { data } = await api.patch(
            `/users/admins/${admin._id}/toggle-status`
          );
          setAdmins((current) =>
            current.map((item) =>
              item._id === admin._id
                ? {
                    ...item,
                    isActive: data.admin.isActive,
                    isLoggedIn: data.admin.isActive ? item.isLoggedIn : false,
                  }
                : item
            )
          );
          toast.success(data.message);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update admin');
        } finally {
          hideLoader();
          setIsConfirmationOpen(false);
        }
      },
    });
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 h-full">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Administrators
            </h1>
            <p className="text-slate-500">Create and review firm administrator accounts.</p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            icon={<Plus size={18} />}
            className="h-12 rounded-2xl"
          >
            Create Admin
          </Button>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Total Admins</p>
                  <p className="text-3xl font-black mt-1">{admins.length}</p>
                </div>
              </Card>
              <Card className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Managed Role</p>
                  <p className="text-lg font-black mt-1">Firm Admin</p>
                </div>
              </Card>
            </div>

            <Card className="p-0 overflow-hidden grow">
              {admins.length === 0 ? (
                <div className="py-20">
                  <EmptyState message="No administrator accounts yet." />
                </div>
              ) : (
                <div className="overflow-auto h-full custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-[#080C1C]">
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-5">Administrator</th>
                        <th className="px-6 py-5">Username</th>
                        <th className="px-6 py-5">Role</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-6 py-5">Session</th>
                        <th className="px-6 py-5">Created</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {admins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-black">
                                {admin.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{admin.name}</p>
                                <p className="text-xs text-slate-400">Administrator account</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-mono text-sm text-slate-600 dark:text-slate-300">
                            {admin.username}
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                              <UserCog size={13} />
                              Admin
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              admin.isActive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              admin.isLoggedIn
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              <span className={`h-2 w-2 rounded-full ${admin.isLoggedIn ? 'bg-amber-500' : 'bg-slate-400'}`} />
                              {admin.isLoggedIn ? 'Logged In' : 'Offline'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                              <Calendar size={14} />
                              {new Date(admin.createdAt).toISOString().slice(0, 10)}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right relative overflow-visible">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveContextMenu(
                                  activeContextMenu === admin._id ? null : admin._id
                                );
                              }}
                              title="Admin actions"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-700"
                            >
                              <MoreVertical size={18} />
                            </button>

                            <AnimatePresence>
                              {activeContextMenu === admin._id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute right-6 top-14 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden text-left"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setResetAdmin(admin);
                                      setActiveContextMenu(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"
                                  >
                                    <KeyRound size={14} /> Reset Password
                                  </button>
                                  <button
                                    onClick={() => {
                                      logoutSessions(admin);
                                      setActiveContextMenu(null);
                                    }}
                                    disabled={!admin.isLoggedIn}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <LogOut size={14} /> Logout Sessions
                                  </button>
                                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                                  <button
                                    onClick={() => {
                                      toggleStatus(admin);
                                      setActiveContextMenu(null);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors uppercase tracking-widest ${
                                      admin.isActive
                                        ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                                        : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                    }`}
                                  >
                                    <Power size={14} />
                                    {admin.isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        title="Create Administrator"
        size="lg"
      >
        <div className="space-y-5">
          <Input
            label="Full Name *"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Administrator name"
          />
          <Input
            label="Username *"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value.toLowerCase() }))}
            placeholder="admin.username"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password *"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Minimum 6 characters"
            />
            <Input
              label="Confirm Password *"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              onKeyDown={(event) => event.key === 'Enter' && createAdmin()}
              placeholder="Repeat password"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeCreateModal} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={createAdmin} icon={<ShieldCheck size={16} />} className="rounded-xl">
              Create Admin
            </Button>
          </div>
        </div>
      </Modal>

      <ResetPasswordModal
        isOpen={!!resetAdmin}
        onClose={() => setResetAdmin(null)}
        onReset={resetPassword}
        subjectName={resetAdmin?.name || ''}
        subjectId={resetAdmin?._id || ''}
        subjectLabel="Admin"
        minimumLength={6}
        logoutNotice
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        type={confirmationConfig.type}
      />
    </>
  );
};

export default Admins;
