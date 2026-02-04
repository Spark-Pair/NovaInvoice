import React, { createContext, useContext, useState, useCallback } from 'react';
import Loader from '@/components/Loader';

interface LoaderContextType {
  showLoader: (label?: string) => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | undefined>('Loading...');

  const showLoader = useCallback((text?: string) => {
    setLabel(text || 'Loading...');
    setVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}

      {visible && (
        <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center">
          <Loader label={label} />
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useGlobalLoader must be used inside LoaderProvider');
  return ctx;
};
