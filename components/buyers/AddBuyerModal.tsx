
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Buyer } from '../../types';

interface AddBuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (buyer: Buyer) => void;
}

export const AddBuyerModal: React.FC<AddBuyerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newBuyer, setNewBuyer] = useState<Partial<Buyer>>({ 
    name: '', 
    contactPerson: '', 
    email: '', 
    industry: '' 
  });

  const handleAdd = () => {
    if (newBuyer.name && newBuyer.email) {
      const buyer: Buyer = {
        id: Math.random().toString(36).substr(2, 9),
        name: newBuyer.name!,
        contactPerson: newBuyer.contactPerson || 'Unknown',
        email: newBuyer.email!,
        industry: newBuyer.industry || 'N/A',
        totalSpent: 0,
      };
      onAdd(buyer);
      setNewBuyer({ name: '', contactPerson: '', email: '', industry: '' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Buyer">
      <div className="space-y-6">
        <Input 
          label="Company Name" 
          placeholder="e.g. Acme Corp" 
          value={newBuyer.name}
          onChange={e => setNewBuyer({...newBuyer, name: e.target.value})}
        />
        <Input 
          label="Primary Contact Name" 
          placeholder="e.g. John Doe" 
          value={newBuyer.contactPerson}
          onChange={e => setNewBuyer({...newBuyer, contactPerson: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Contact Email" 
            type="email" 
            placeholder="contact@buyer.com" 
            value={newBuyer.email}
            onChange={e => setNewBuyer({...newBuyer, email: e.target.value})}
          />
          <Input 
            label="Industry" 
            placeholder="e.g. Healthcare" 
            value={newBuyer.industry}
            onChange={e => setNewBuyer({...newBuyer, industry: e.target.value})}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Discard</Button>
          <Button className="flex-1" onClick={handleAdd}>Save Buyer</Button>
        </div>
      </div>
    </Modal>
  );
};
