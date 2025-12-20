import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Filter, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { Entity } from '../types';

const INITIAL_ENTITIES: Entity[] = [
  { id: '1', name: 'Horizon Holdings', taxId: 'TAX-00123', email: 'billing@horizon.com', status: 'Active', createdAt: '2024-01-15' },
  { id: '2', name: 'Vertex Solutions', taxId: 'TAX-99821', email: 'fin@vertex.io', status: 'Active', createdAt: '2024-02-10' },
  { id: '3', name: 'Stellar Logistics', taxId: 'TAX-44567', email: 'ops@stellar.co', status: 'Inactive', createdAt: '2023-11-20' },
];

const Entities: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntity, setNewEntity] = useState<Partial<Entity>>({ name: '', taxId: '', email: '', status: 'Active' });

  const handleAdd = () => {
    if (newEntity.name && newEntity.taxId) {
      const entity: Entity = {
        id: Math.random().toString(36).substr(2, 9),
        name: newEntity.name!,
        taxId: newEntity.taxId!,
        email: newEntity.email || '',
        status: (newEntity.status as 'Active' | 'Inactive') || 'Active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setEntities([entity, ...entities]);
      setNewEntity({ name: '', taxId: '', email: '', status: 'Active' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Business Entities</h1>
          <p className="text-slate-500">Manage your organization's legal and billing units.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
          Add Entity
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Filter entities..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <Button variant="secondary" icon={<Filter size={16} />}>Filters</Button>
          </div>
          <Button variant="ghost" icon={<Download size={16} />}>Export</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-sm font-medium">
                <th className="px-6 py-4">Entity Name</th>
                <th className="px-6 py-4">Tax ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {entities.map(entity => (
                <tr key={entity.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold">{entity.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{entity.taxId}</td>
                  <td className="px-6 py-4 text-slate-500">{entity.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      entity.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {entity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{entity.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {entities.length === 0 && <EmptyState message="No entities found. Click 'Add Entity' to create your first one." />}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Entity">
        <div className="space-y-6">
          <Input 
            label="Entity Legal Name" 
            placeholder="e.g. Acme Corporation" 
            value={newEntity.name}
            onChange={e => setNewEntity({...newEntity, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Tax Registration ID" 
              placeholder="TAX-XXXXX" 
              value={newEntity.taxId}
              onChange={e => setNewEntity({...newEntity, taxId: e.target.value})}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-500 ml-1">Account Status</label>
              <select 
                value={newEntity.status}
                onChange={e => setNewEntity({...newEntity, status: e.target.value as 'Active' | 'Inactive'})}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <Input 
            label="Billing Email" 
            type="email" 
            placeholder="billing@company.com" 
            value={newEntity.email}
            onChange={e => setNewEntity({...newEntity, email: e.target.value})}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd}>Create Entity</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Entities;
