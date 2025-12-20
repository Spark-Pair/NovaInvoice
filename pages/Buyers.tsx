
import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, Globe, Briefcase } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { Buyer } from '../types';

const INITIAL_BUYERS: Buyer[] = [
  { id: '1', name: 'Global Tech Corp', contactPerson: 'Sarah Wilson', email: 'sarah@globaltech.com', industry: 'Software', totalSpent: 45000 },
  { id: '2', name: 'Greenway Retail', contactPerson: 'Michael Brown', email: 'm.brown@greenway.com', industry: 'Retail', totalSpent: 12500 },
  { id: '3', name: 'Skyline Architects', contactPerson: 'Emma Davis', email: 'emma@skyline.build', industry: 'Design', totalSpent: 67000 },
];

const Buyers: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>(INITIAL_BUYERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState<Partial<Buyer>>({ name: '', contactPerson: '', email: '', industry: '' });

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
      setBuyers([buyer, ...buyers]);
      setNewBuyer({ name: '', contactPerson: '', email: '', industry: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Buyers Directory</h1>
          <p className="text-slate-500">View and manage your clients and customer relationships.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
          New Buyer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map(buyer => (
          <Card key={buyer.id} className="relative group hover:border-indigo-400 dark:hover:border-indigo-600 transition-all p-0 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                  {buyer.name.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lifetime Value</p>
                  <p className="text-lg font-bold text-indigo-600">${buyer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{buyer.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
                <Briefcase size={14} /> {buyer.industry}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Mail size={16} /> {buyer.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Globe size={16} /> {buyer.contactPerson}
                </div>
              </div>
            </div>
            
            <div className="flex border-t border-slate-100 dark:border-slate-800">
              <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Edit Profile</button>
              <div className="w-[1px] bg-slate-100 dark:bg-slate-800"></div>
              <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">View Invoices</button>
            </div>
          </Card>
        ))}
        {buyers.length === 0 && <div className="col-span-full"><EmptyState message="No buyers found." /></div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Buyer">
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
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button className="flex-1" onClick={handleAdd}>Save Buyer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Buyers;
