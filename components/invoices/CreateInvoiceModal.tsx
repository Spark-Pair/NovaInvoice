
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Invoice, InvoiceItem } from '../../types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (invoice: Invoice) => void;
  nextInvoiceNumber: string;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  nextInvoiceNumber 
}) => {
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, price: 0 });
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    number: nextInvoiceNumber,
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
    onAdd(invoice);
    // Reset local state if needed, though closure usually handles it
    setNewInvoice({
        number: nextInvoiceNumber,
        buyerId: '1',
        entityId: '1',
        items: [],
        status: 'Draft',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Invoice">
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
                <span className="flex-1 text-sm truncate">{item.description}</span>
                <span className="text-xs font-mono text-slate-500 shrink-0">x{item.quantity}</span>
                <span className="font-bold text-indigo-600 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 items-end bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="flex-1 space-y-1">
              <Input 
                className="bg-transparent border-none focus:ring-0 px-0" 
                placeholder="Description" 
                value={newItem.description} 
                onChange={e => setNewItem({...newItem, description: e.target.value})} 
              />
            </div>
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
            <Button variant="secondary" onClick={addItem} className="h-10 text-xs px-3">Add</Button>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleCreate}>Save Invoice</Button>
        </div>
      </div>
    </Modal>
  );
};
