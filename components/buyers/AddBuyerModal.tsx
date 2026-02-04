
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Buyer } from '../../types';
import api from '@/axios';
import Loader from '../Loader';
import { useGlobalLoader } from '@/hooks/LoaderContext';
import { useAppToast } from '../toast/toast';

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
  const toast = useAppToast();
  const { showLoader, hideLoader } = useGlobalLoader();

  const [formData, setFormData] = useState({
    buyerName: '',
    registrationType: REGISTRATION_TYPES[0],
    ntn: '',
    cnic: '',
    strn: '',
    province: PROVINCES[0],
    fullAddress: '',
  });

  const handleAdd = async () => {
    if (
      formData.buyerName && 
      formData.registrationType &&
      formData.province && 
      formData.fullAddress &&
      (formData.ntn || formData.cnic)
    ) {
      showLoader();
      try {
        const payload = {
          buyerName: formData.buyerName,
          registrationType: formData.registrationType,
          ntn: formData.ntn,
          cnic: formData.cnic,
          strn: formData.strn,
          province: formData.province,
          fullAddress: formData.fullAddress,
        };
        
        const { data } = await api.post('/buyers', payload);

        onAdd();

        // Reset form
        setFormData({
          buyerName: '',
          registrationType: REGISTRATION_TYPES[0],
          ntn: '',
          cnic: '',
          strn: '',
          province: PROVINCES[0],
          fullAddress: '',
        });
        
        toast.success("Entity registered successfully!")
      } catch (error: any) {
        console.error("Failed to add buyer!", error)
        toast.error(error.response?.data?.message || error.message || 'Failed to add buyer!')
      } finally {
        hideLoader()
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Register New Buyer">
        <div className="grid gap-6">
          <div className="scrollable grid gap-6 h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input 
                  label="Buyer Name *" 
                  placeholder="Enter buyer's legal name" 
                  value={formData.buyerName}
                  onChange={e => setFormData({...formData, buyerName: e.target.value})}
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
                label="NTN" 
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
              disabled={!formData.buyerName || (!formData.ntn && !formData.cnic) || !formData.fullAddress}
            >
              Save Buyer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
