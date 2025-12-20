
import React from 'react';
import { Modal } from '../Modal';
import { Entity } from '../../types';
import { 
  Building2, 
  MapPin, 
  Fingerprint, 
  ShieldCheck, 
  Calendar, 
  FileText,
  Copy,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '../Button';

interface EntityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: Entity | null;
}

export const EntityDetailsModal: React.FC<EntityDetailsModalProps> = ({ isOpen, onClose, entity }) => {
  if (!entity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entity Specification">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center font-black text-5xl text-indigo-600 shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden shrink-0">
              {entity.logoUrl ? (
                <img src={entity.logoUrl} className="w-full h-full object-cover" />
              ) : (
                entity.businessName.charAt(0)
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xl border-4 border-white dark:border-slate-900">
              <ShieldCheck size={20} fill="currentColor" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {entity.businessName}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                {entity.status}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                {entity.registrationType}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-4 flex items-center justify-center md:justify-start gap-2 font-medium">
              <Calendar size={16} /> Established {entity.createdAt}
            </p>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Fingerprint size={16} /> Legal Identifiers
            </h4>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">NTN</p>
                <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-200">{entity.ntn}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">CNIC</p>
                <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-200">{entity.cnic}</p>
              </div>

              {entity.strn && (
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">
                  <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">STRN</p>
                  <p className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">{entity.strn}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <MapPin size={16} /> Location
            </h4>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Province</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-200">{entity.province}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Operating Address</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed mt-2 italic">
                  "{entity.fullAddress}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white relative overflow-hidden">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-indigo-100 text-xs font-black uppercase tracking-wider">Financial Status</p>
                <p className="text-xl font-black">Compliant Entity</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl h-12 px-6">
                Edit Record
              </Button>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none rounded-2xl h-12 px-6 shadow-xl" icon={<ArrowUpRight size={18} />}>
                View Reports
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
