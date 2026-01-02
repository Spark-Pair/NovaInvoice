
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Entity } from '../../types';
import { Upload, X, ShieldAlert } from 'lucide-react';
import api from '@/axios';

interface EditEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (entity: Entity) => void;
  entity: Entity | null;
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

export const EditEntityModal: React.FC<EditEntityModalProps> = ({ isOpen, onClose, onUpdate, entity }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Entity>>({});

  useEffect(() => {
    if (entity) {
      setFormData({ ...entity });
      setLogoPreview(entity.logoUrl || null);
    }
  }, [entity, isOpen]);

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

  const handleUpdate = async () => {
    if (
      entity &&
      formData.businessName &&
      formData.registrationType &&
      formData.ntn &&
      formData.cnic &&
      formData.province &&
      formData.fullAddress
    ) {
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
        };

        console.log(payload);

        // 🔥 Update API call
        // const { data } = await api.put(`/entities/${entity.id}`, payload);
        // or PATCH if your backend uses patch:
        const { data } = await api.patch(`/entities/${entity.id}`, payload);

        onUpdate({
          id: data.entity._id,
          businessName: data.entity.businessName,
          registrationType: data.entity.registrationType,
          ntn: data.entity.ntn,
          cnic: data.entity.cnic,
          strn: data.entity.strn,
          province: data.entity.province,
          fullAddress: data.entity.fullAddress,
          logoUrl: data.entity.image || undefined,
          status: data.entity.status || 'Active',
          createdAt: new Date(data.entity.createdAt).toISOString().split('T')[0],
          username: data.entity.user?.username,
        });

        onClose();
      } catch (err: any) {
        alert(
          err.response?.data?.message ||
          err.message ||
          'Failed to update entity'
        );
      }
    }
  };

  if (!entity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${entity.businessName}`}>
      <div className="grid gap-6">
        <div className="scrollable grid gap-6 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Logo Update Section */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
            {logoPreview ? (
              <div className="relative group">
                <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-contain rounded-2xl border border-white dark:border-slate-700 shadow-md bg-white dark:bg-slate-800" />
                <button 
                  onClick={() => setLogoPreview(null)}
                  className="absolute -top-3 -right-3 p-1.5 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
                <div 
                  className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={24} className="text-white" />
                </div>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Update Profile Logo</p>
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
              <Input 
                label="Business Name *" 
                placeholder="Enter legally registered name" 
                value={formData.businessName || ''}
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
              label="NTN (National Tax Number) *" 
              placeholder="0000000-0" 
              value={formData.ntn || ''}
              onChange={e => setFormData({...formData, ntn: e.target.value})}
            />
            
            <Input 
              label="CNIC *" 
              placeholder="00000-0000000-0" 
              value={formData.cnic || ''}
              onChange={e => setFormData({...formData, cnic: e.target.value})}
            />

            <div className="md:col-span-2">
              <Input 
                label="STRN (Sales Tax Registration Number)" 
                placeholder="00-00-0000-000-00" 
                value={formData.strn || ''}
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
                  value={formData.fullAddress || ''}
                  onChange={e => setFormData({...formData, fullAddress: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" className="flex-1 rounded-2xl" onClick={onClose}>Discard Changes</Button>
          <Button 
            className="flex-1 rounded-2xl shadow-lg shadow-indigo-500/20" 
            onClick={handleUpdate}
            disabled={!formData.businessName || !formData.ntn || !formData.cnic || !formData.fullAddress}
          >
            Save Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
