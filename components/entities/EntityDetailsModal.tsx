
import React from 'react';
import { Modal } from '../Modal';
import { Entity } from '../../types';
import { 
  Building2, 
  MapPin, 
  Fingerprint, 
  Calendar, 
  ExternalLink,
  Edit2,
  Power,
  Globe,
  KeyRound,
  User as UserIcon
} from 'lucide-react';
import { Button } from '../Button';

interface EntityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: Entity | null;
  onEdit?: () => void;
  onResetPassword?: () => void;
  onToggleStatus?: () => void;
}

export const EntityDetailsModal: React.FC<EntityDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  entity,
  onEdit,
  onResetPassword,
  onToggleStatus
}) => {
  if (!entity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col gap-8">
        {/* Header Section: Minimalist & Focused */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center font-bold text-4xl text-indigo-600 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              {entity.logoUrl ? (
                <img src={entity.logoUrl} alt={entity.businessName} className="w-full h-full object-cover" />
              ) : (
                entity.businessName.charAt(0)
              )}
            </div>
            {entity.status === 'Active' ? (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm" />
            ) : (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-400 rounded-full border-4 border-white dark:border-slate-900 shadow-sm" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {entity.businessName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                entity.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              }`}>
                {entity.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Building2 size={16} className="text-slate-400" />
                {entity.registrationType}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-slate-400" />
                {entity.createdAt}
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Legal Identifiers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              <Fingerprint size={14} />
              Taxation & Account
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Username</p>
                <div className="flex items-center gap-2">
                   <UserIcon size={14} className="text-indigo-500" />
                   <p className="text-sm font-mono font-bold text-indigo-700 dark:text-indigo-400">{entity.username || 'Not Set'}</p>
                </div>
              </div>

              {[
                { label: 'NTN', value: entity.ntn },
                { label: 'CNIC', value: entity.cnic },
                { label: 'STRN', value: entity.strn || 'Not Provided', highlight: !!entity.strn }
              ].map((item, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className={`text-sm font-mono font-bold ${item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.value}
                    </p>
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-800 rounded-lg">
                    <ExternalLink size={14} className="text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4 flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
              <MapPin size={14} />
              Operations Center
            </div>
            
            <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grow">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Region</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">{entity.province}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mailing Address</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {entity.fullAddress}
                </p>
              </div>

              <div className="pt-2">
                <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                  <Globe size={14} /> View on Map
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Action Footer: Simplified as requested */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary" 
              icon={<Edit2 size={16} />} 
              className="text-xs h-10 px-5 rounded-xl border-slate-200 uppercase tracking-widest"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button 
              variant="secondary" 
              icon={<KeyRound size={16} />} 
              className="text-xs h-10 px-5 rounded-xl border-slate-200 uppercase tracking-widest"
              onClick={onResetPassword}
            >
              Reset Password
            </Button>
            <Button 
              variant="ghost" 
              icon={<Power size={16} />} 
              className={`text-xs h-10 px-5 rounded-xl border uppercase tracking-widest font-black ${
                entity.status === 'Active' 
                  ? 'text-rose-500 border-rose-100 hover:bg-rose-50 dark:text-rose-500 dark:border-rose-900/30 dark:hover:bg-rose-900/10' 
                  : 'text-emerald-500 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-900/10'
              }`}
              onClick={onToggleStatus}
            >
              {entity.status === 'Active' ? 'Inactive' : 'Active'}
            </Button>
          </div>
          
          <Button variant="secondary" className="w-full sm:w-auto h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none shadow-lg" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
