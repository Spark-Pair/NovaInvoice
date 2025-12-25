
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';

interface BuyerFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
}

const REGISTRATION_TYPES = [
  'Registered',
  'Unregistered',
  'Unregistered Distributor',
  'Retail Customer'
];

const PROVINCES = [
  'BALOCHISTAN',
  'AZAD JAMMU AND KASHMIR',
  'CAPITAL TERRITORY',
  'KHYBER PAKHTUNKHWA',
  'PUNJAB',
  'SINDH',
  'GILGIT BALTISTAN'
];

const STATUS_OPTIONS = ['Active', 'Inactive'];

export const BuyerFilterModal: React.FC<BuyerFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply,
  onClear
}) => {
  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Buyer Search</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Advanced Criteria</p>
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
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Buyer Profile</h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="space-y-4">
                    <Input 
                      label="Buyer Name" 
                      placeholder="e.g. Acme Corp" 
                      value={filters.name || ''}
                      onChange={(e) => updateFilter('name', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Compliance</h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="space-y-4">
                    <Input 
                      label="NTN" 
                      placeholder="0000000-0" 
                      value={filters.ntn || ''}
                      onChange={(e) => updateFilter('ntn', e.target.value)}
                    />
                    <Input 
                      label="CNIC" 
                      placeholder="00000-0000000-0" 
                      value={filters.cnic || ''}
                      onChange={(e) => updateFilter('cnic', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Geography & Status</h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="space-y-4">
                    <Select 
                      label="Registration"
                      options={REGISTRATION_TYPES}
                      value={filters.registrationType || ''}
                      onChange={(val) => updateFilter('registrationType', val)}
                      placeholder="All Types"
                    />
                    <Select 
                      label="Region"
                      options={PROVINCES}
                      value={filters.province || ''}
                      onChange={(val) => updateFilter('province', val)}
                      placeholder="All Provinces"
                    />
                    <Select 
                      label="Current Status"
                      options={STATUS_OPTIONS}
                      value={filters.status || ''}
                      onChange={(val) => updateFilter('status', val)}
                      placeholder="Any Status"
                    />
                  </div>
                </div>

                <div className="space-y-4 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Registration Date</h3>
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
                Clear
              </Button>
              <Button 
                className="flex-[2] rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 shadow-xl shadow-indigo-500/20"
                onClick={onApply}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
