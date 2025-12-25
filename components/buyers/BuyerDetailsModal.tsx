
import React from 'react';
import { Modal } from '../Modal';
import { Buyer } from '../../types';
import { 
  Building2, 
  MapPin, 
  Fingerprint, 
  Calendar, 
  Edit2,
  Power,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../Button';

interface BuyerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: Buyer | null;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

export const BuyerDetailsModal: React.FC<BuyerDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  buyer,
  onEdit,
  onToggleStatus
}) => {
  if (!buyer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-3xl text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">
              {buyer.name.charAt(0)}
            </div>
            {buyer.status === 'Active' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {buyer.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                buyer.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              }`}>
                {buyer.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={16} className="text-slate-400" />
                {buyer.registrationType}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-slate-400" />
                Joined: {buyer.createdAt}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              <Fingerprint size={14} />
              Taxation Info
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'NTN', value: buyer.ntn },
                { label: 'CNIC', value: buyer.cnic },
                { label: 'STRN', value: buyer.strn || 'Unregistered', highlight: !!buyer.strn }
              ].map((item, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className={`text-sm font-mono font-bold ${item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              <MapPin size={14} />
              Contact Address
            </div>
            
            <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grow">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Province</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">{buyer.province}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mailing Address</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {buyer.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary" 
              icon={<Edit2 size={16} />} 
              className="text-xs h-10 px-5 rounded-xl uppercase tracking-widest"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              icon={<Power size={16} />} 
              className={`text-xs h-10 px-5 rounded-xl border uppercase tracking-widest font-black ${
                buyer.status === 'Active' 
                  ? 'text-rose-500 border-rose-100 hover:bg-rose-50 dark:border-rose-900/30' 
                  : 'text-emerald-500 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-900/30'
              }`}
              onClick={onToggleStatus}
            >
              {buyer.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
          
          <Button variant="secondary" className="w-full sm:w-auto h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-slate-900" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
