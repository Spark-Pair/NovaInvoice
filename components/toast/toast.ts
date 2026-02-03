import { useToast } from './ToastContext';

export const useAppToast = () => {
  const { show } = useToast();

  return {
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    info: (msg: string) => show(msg, 'info'),
    warning: (msg: string) => show(msg, 'warning'),
  };
};
