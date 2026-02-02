
import React, { useState, useRef } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Entity } from '../../types';
import { Upload, X, User as UserIcon, Lock } from 'lucide-react';
import api from '@/axios';
import Loader from '../Loader';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entity: Entity) => void;
}

const REGISTRATION_TYPES = [
  'Select...',
  'Registered',
  'Unregistered',
  'Unregistered Distributor',
  'Retail Customer'
];

const PROVINCES = [
  'Select...',
  'BALOCHISTAN',
  'AZAD JAMMU AND KASHMIR',
  'CAPITAL TERRITORY',
  'KHYBER PAKHTUNKHWA',
  'PUNJAB',
  'SINDH',
  'GILGIT BALTISTAN'
];

export const AddEntityModal: React.FC<AddEntityModalProps> = ({ isOpen, onClose, onAdd }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    registrationType: REGISTRATION_TYPES[0],
    ntn: '',
    cnic: '',
    strn: '',
    province: PROVINCES[0],
    fullAddress: '',
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (
      formData.businessName &&
      formData.registrationType &&
      formData.province &&
      formData.fullAddress &&
      formData.username &&
      formData.password &&
      (formData.ntn || formData.cnic)
    ) {
      setIsLoading(true);
      try {
        const payload = {
          image: logoPreview || '',
          businessName: formData.businessName,
          registrationType: formData.registrationType,
          ntn: formData.ntn,
          cnic: formData.cnic,
          strn: formData.strn,
          province: formData.province,
          fullAddress: formData.fullAddress,
          username: formData.username,
          password: formData.password,
        };

        const { data } = await api.post('/entities', payload);
        
        onAdd();

        // Reset form
        setFormData({
          businessName: '',
          registrationType: REGISTRATION_TYPES[0],
          ntn: '',
          cnic: '',
          strn: '',
          province: PROVINCES[0],
          fullAddress: '',
          username: '',
          password: ''
        });
        setLogoPreview(null);
      } catch (err: any) {
        alert(err.response?.data?.message || err.message || 'Failed to create entity');
      } finally {
        setIsLoading(false)
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Business Entity">
        <div className="grid gap-6">
          <div className="scrollable grid gap-6 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
              {logoPreview ? (
                <div className="relative group">
                  <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-contain rounded-xl border border-white shadow-md bg-white" />
                  <button 
                    onClick={() => setLogoPreview(null)}
                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Upload Company Logo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 mb-2">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Credentials Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="Username *" 
                        placeholder="admin_entity"
                        className="lowercase"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        icon={<UserIcon size={16} className="text-slate-400" />}
                      />
                      <Input 
                        label="Password *" 
                        type="password"
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        icon={<Lock size={16} className="text-slate-400" />}
                      />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Input 
                  label="Business Name *"
                  className="capitalize"
                  placeholder="Enter legally registered name" 
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                />
              </div>

              <Select 
                label="Registration Type *"
                options={REGISTRATION_TYPES as any}
                value={formData.registrationType || ""}
                onChange={val => setFormData({...formData, registrationType: val as any})}
                placeholder="Choose type"
              />

              <Select 
                label="Province *"
                options={PROVINCES as any}
                value={formData.province || ""}
                onChange={val => setFormData({...formData, province: val as any})}
                placeholder="Select province"
              />

              <Input 
                label="NTN (National Tax Number)" 
                placeholder="0000000-0" 
                value={formData.ntn}
                onChange={e => setFormData({...formData, ntn: e.target.value})}
              />
              
              <Input 
                label="CNIC" 
                placeholder="00000-0000000-0" 
                value={formData.cnic}
                onChange={e => setFormData({...formData, cnic: e.target.value})}
              />

              <div className="md:col-span-2">
                <Input 
                  label="STRN (Sales Tax Registration Number)" 
                  placeholder="00-00-0000-000-00" 
                  value={formData.strn}
                  onChange={e => setFormData({...formData, strn: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-slate-500 ml-1">Full Address *</label>
                  <textarea 
                    rows={3}
                    placeholder="Shop/Office number, Street, Area, City"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    value={formData.fullAddress}
                    onChange={e => setFormData({...formData, fullAddress: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" className="flex-1 rounded-2xl" onClick={onClose}>Cancel</Button>
            <Button 
              className="flex-1 rounded-2xl shadow-lg shadow-indigo-500/20" 
              onClick={handleAdd}
              disabled={!formData.businessName || (!formData.ntn && !formData.cnic) || !formData.fullAddress || !formData.username || !formData.password}
            >
              Create Entity
            </Button>
          </div>
        </div>
      </Modal>
            
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 z-[100]">
          <Loader label="Loading..." />
        </div>
      )}
    </>
  );
};
