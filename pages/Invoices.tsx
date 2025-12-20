import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Download, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { Invoice, InvoiceItem } from '../types';

const MOCK_INVOICES: Invoice[] = [
  { 
    id: '1', number: 'INV-2024-001', buyerId: '1', entityId: '1', status: 'Paid', issueDate: '2024-03-01', dueDate: '2024-03-15', total: 1250.00,
    items: [{ id: 'i1', description: 'Web Design Services', quantity: 1, price: 1250 }]
  },
  { 
    id: '2', number: 'INV-2024-002', buyerId: '2', entityId: '1', status: 'Pending', issueDate: '2024-03-05', dueDate: '2024-03-20', total: 3400.00,
    items: [{ id: 'i2', description: 'SEO Optimization', quantity: 1, price: 3400 }]
  },
  { 
    id: '3', number: 'INV-2024-003', buyerId: '3', entityId: '2', status: 'Overdue', issueDate: '2024-02-15', dueDate: '2024-03-01', total: 850.50,
    items: [{ id: 'i3', description: 'Consulting', quantity: 1, price: 850.50 }]
  },
];

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, price: 0 });
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    buyerId: '1',
    entityId: '1',
    items: [],
    status: 'Draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  });

  const addItem = () => {
    if (newItem.description) {
      const items = [...(newInvoice.items || []), { ...newItem, id: Math.random().toString() }];
      setNewInvoice({ ...newInvoice, items });
      setNewItem({ description: '', quantity: 1, price: 0 });
    }
  };

  const handleCreate = () => {
    const total = (newInvoice.items || []).reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const invoice: Invoice = {
      ...newInvoice as Invoice,
      id: Math.random().toString(),
      total,
    };
    setInvoices([invoice, ...invoices]);
    setIsModalOpen(false);
  };

  const statusColors = {
    Paid: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Overdue: 'bg-rose-100 text-rose-700',
    Draft: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-slate-500">Track payments, create drafts, and monitor cash flow.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Scheduled Invoices</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Paid this Month</p>
            <p className="text-2xl font-bold">$14,200</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl">
            <MoreVertical size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Outstanding</p>
            <p className="text-2xl font-bold text-rose-600">$4,550</p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search number or buyer..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
          </div>
          <Button variant="ghost" icon={<Download size={16} />}>Export List</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-sm font-medium">
                <th className="px-6 py-4">Invoice Number</th>
                <th className="px-6 py-4">Buyer ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <td className="px-6 py-4 font-bold">{inv.number}</td>
                  <td className="px-6 py-4 text-slate-500">Buyer #{inv.buyerId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                    ${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && <EmptyState message="No invoices found." />}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Invoice">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Invoice #" value={newInvoice.number} onChange={e => setNewInvoice({...newInvoice, number: e.target.value})} />
            <Input label="Due Date" type="date" value={newInvoice.dueDate} onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Line Items</h4>
            <div className="space-y-2">
              {newInvoice.items?.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="flex-1 text-sm">{item.description}</span>
                  <span className="text-xs font-mono text-slate-500">x{item.quantity}</span>
                  <span className="font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 items-end bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Input 
                className="bg-transparent border-none focus:ring-0" 
                placeholder="Description" 
                value={newItem.description} 
                onChange={e => setNewItem({...newItem, description: e.target.value})} 
              />
              <Input 
                className="w-20 bg-transparent border-none focus:ring-0" 
                type="number" 
                placeholder="Qty" 
                value={newItem.quantity} 
                onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})} 
              />
              <Input 
                className="w-28 bg-transparent border-none focus:ring-0" 
                type="number" 
                placeholder="Price" 
                value={newItem.price} 
                onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})} 
              />
              {/* Fixed: Removed the unsupported 'size' property to resolve TypeScript error */}
              <Button variant="secondary" onClick={addItem} className="h-10">Add</Button>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate}>Save Invoice</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Invoices;
