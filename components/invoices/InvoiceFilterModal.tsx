
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';

const DOCUMENT_TYPES = ['Sale Invoice', 'Purchase Invoice', 'Debit Note', 'Credit Note'];

interface InvoiceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
}

export const InvoiceFilterModal: React.FC<InvoiceFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply,
  onClear
}) => {
  const updateFilter = (key: string, value: string) => {
    if (value === 'Select...') value = '';
    setFilters({ ...filters, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '110%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-5 top-5 bottom-5 w-[calc(100%-40px)] max-w-md bg-white dark:bg-[#080C1C] z-[101] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-none flex flex-col border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden"
          >
            <div className="p-8 pb-6 flex items-center justify-between bg-white dark:bg-[#080C1C] relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <Filter size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Ledger Filters</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Advanced Search</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-2 space-y-10 custom-scrollbar">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Document Info</h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="space-y-4">
                    <Input 
                      label="Invoice Number" 
                      placeholder="INV-2024..." 
                      value={filters.invoiceNumber || ''}
                      onChange={(e) => updateFilter('invoiceNumber', e.target.value)}
                    />
                    <Input 
                      label="Buyer Name" 
                      placeholder="Search company..." 
                      value={filters.buyerName || ''}
                      onChange={(e) => updateFilter('buyerName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Classifications</h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="space-y-4">
                    <Select 
                      label="Document Type"
                      options={DOCUMENT_TYPES}
                      value={filters.documentType || ''}
                      onChange={(val) => updateFilter('documentType', val)}
                      placeholder="All Types"
                    />
                  </div>
                </div>

                <div className="space-y-4 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Issue Period</h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="From" 
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                    />
                    <Input 
                      label="To" 
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-[#080C1C]/80 backdrop-blur-md flex gap-4">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl font-black uppercase tracking-widest text-[10px] h-14"
                onClick={onClear}
                icon={<RotateCcw size={16} />}
              >
                Reset
              </Button>
              <Button 
                className="flex-[2] rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 shadow-xl shadow-indigo-500/20"
                onClick={onApply}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
