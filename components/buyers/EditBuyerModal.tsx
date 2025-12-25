
import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Buyer } from '../../types';

interface EditBuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (buyer: Buyer) => void;
  buyer: Buyer | null;
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

export const EditBuyerModal: React.FC<EditBuyerModalProps> = ({ isOpen, onClose, onUpdate, buyer }) => {
  const [formData, setFormData] = useState<Partial<Buyer>>({});

  useEffect(() => {
    if (buyer) {
      setFormData({ ...buyer });
    }
  }, [buyer, isOpen]);

  const handleUpdate = () => {
    if (buyer && formData.name && formData.ntn && formData.cnic && formData.address) {
      onUpdate({
        ...buyer,
        ...formData,
      } as Buyer);
    }
  };

  if (!buyer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Buyer Profile`}>
      <div className="grid gap-6">
        <div className="scrollable grid gap-6 h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Input 
                label="Buyer Name *" 
                placeholder="Enter buyer's legal name" 
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <Select 
              label="Registration Type *"
              options={REGISTRATION_TYPES as any}
              value={formData.registrationType || ""}
              onChange={val => setFormData({...formData, registrationType: val as any})}
              placeholder="Select type"
            />

            <Select 
              label="Province *"
              options={PROVINCES as any}
              value={formData.province || ""}
              onChange={val => setFormData({...formData, province: val as any})}
              placeholder="Select province"
            />

            <Input 
              label="NTN *" 
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
                label="STRN" 
                placeholder="00-00-0000-000-00" 
                value={formData.strn || ''}
                onChange={e => setFormData({...formData, strn: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-500 ml-1">Address *</label>
                <textarea 
                  rows={3}
                  placeholder="Street, Area, City"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  value={formData.address || ''}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" className="flex-1 rounded-2xl" onClick={onClose}>Discard</Button>
          <Button 
            className="flex-1 rounded-2xl shadow-lg shadow-indigo-500/20" 
            onClick={handleUpdate}
            disabled={!formData.name || !formData.ntn || !formData.cnic || !formData.address}
          >
            Update Buyer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
