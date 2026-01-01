
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Buyer } from '../../types';

interface AddBuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (buyer: Buyer) => void;
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

export const AddBuyerModal: React.FC<AddBuyerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Buyer>>({
    name: '',
    registrationType: REGISTRATION_TYPES[0],
    ntn: '',
    cnic: '',
    strn: '',
    province: PROVINCES[0],
    address: '',
    status: 'Active'
  });

  const handleAdd = () => {
    if (
      formData.name && 
      formData.registrationType && 
      formData.ntn && 
      formData.cnic && 
      formData.province && 
      formData.address
    ) {
      const buyer: Buyer = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        registrationType: formData.registrationType as any,
        ntn: formData.ntn!,
        cnic: formData.cnic!,
        strn: formData.strn,
        province: formData.province as any,
        address: formData.address!,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAdd(buyer);
      setFormData({
        name: '',
        registrationType: REGISTRATION_TYPES[0],
        ntn: '',
        cnic: '',
        strn: '',
        province: PROVINCES[0],
        address: ''
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Buyer">
      <div className="grid gap-6">
        <div className="scrollable grid gap-6 h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Input 
                label="Buyer Name *" 
                placeholder="Enter buyer's legal name" 
                value={formData.name}
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
              value={formData.ntn}
              onChange={e => setFormData({...formData, ntn: e.target.value})}
            />
            
            <Input 
              label="CNIC *" 
              placeholder="00000-0000000-0" 
              value={formData.cnic}
              onChange={e => setFormData({...formData, cnic: e.target.value})}
            />

            <div className="md:col-span-2">
              <Input 
                label="STRN" 
                placeholder="00-00-0000-000-00" 
                value={formData.strn}
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
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
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
            disabled={!formData.name || !formData.ntn || !formData.cnic || !formData.address}
          >
            Save Buyer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
