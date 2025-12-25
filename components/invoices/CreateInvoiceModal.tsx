
import React, { useState, useMemo } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Invoice, InvoiceItem, Buyer } from '../../types';
import { Plus, Trash2, UserPlus, Info, Calculator, ShoppingCart, FileText, User as UserIcon } from 'lucide-react';
import { Card } from '../Card';
// Fix: Added missing import for motion from framer-motion
import { motion } from 'framer-motion';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (invoice: Invoice) => void;
  nextInvoiceNumber: string;
  buyers: Buyer[];
  onAddNewBuyer: () => void;
}

const DOCUMENT_TYPES = ['Sale Invoice', 'Debit Note', 'Credit Note'];
const SALE_TYPES = ['Goods at standard rate', 'Zero rated', 'Exempt', 'Reduced rate'];
const UOM_OPTIONS = ['Numbers', 'Pieces', 'Units', 'kg', 'mtr', 'ft'];

const INITIAL_ITEM: InvoiceItem = {
  id: '',
  hsCode: '',
  description: '',
  saleType: 'Goods at standard rate',
  quantity: 1,
  uom: 'Units',
  rate: 0,
  unitPrice: 0,
  salesValueExclTax: 0,
  salesTax: 0,
  discount: 0,
  otherDiscount: 0,
  taxWithheld: 0,
  extraTax: 0,
  furtherTax: 0,
  fedPayable: 0,
  t236g: 0,
  t236h: 0,
  tradeDiscount: 0,
  fixedValue: 0,
  totalItemValue: 0
};

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  nextInvoiceNumber,
  buyers,
  onAddNewBuyer
}) => {
  const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({
    number: nextInvoiceNumber,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentType: 'Sale Invoice',
    salesman: '',
    referenceNumber: '',
    buyerId: '',
    items: [{ ...INITIAL_ITEM, id: Math.random().toString() }]
  });

  const selectedBuyer = useMemo(() => 
    buyers.find(b => b.id === invoiceData.buyerId), 
    [invoiceData.buyerId, buyers]
  );

  const calculateItem = (item: InvoiceItem): InvoiceItem => {
    const valueExcl = item.quantity * item.unitPrice;
    const taxRate = item.saleType === 'Goods at standard rate' ? 0.18 : 0;
    const salesTax = (valueExcl - item.discount) * taxRate;
    
    const total = (valueExcl - item.discount - item.otherDiscount - item.tradeDiscount) + 
                  salesTax + item.extraTax + item.furtherTax + item.fedPayable + 
                  item.t236g + item.t236h - item.taxWithheld;

    return {
      ...item,
      salesValueExclTax: valueExcl,
      salesTax,
      totalItemValue: total
    };
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    const newItems = (invoiceData.items || []).map(item => {
      if (item.id === id) {
        return calculateItem({ ...item, ...updates });
      }
      return item;
    });
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...(invoiceData.items || []), { ...INITIAL_ITEM, id: Math.random().toString() }]
    });
  };

  const removeItem = (id: string) => {
    if ((invoiceData.items || []).length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: (invoiceData.items || []).filter(i => i.id !== id)
      });
    }
  };

  const totalInvoiceValue = useMemo(() => 
    (invoiceData.items || []).reduce((acc, curr) => acc + curr.totalItemValue, 0),
    [invoiceData.items]
  );

  const handleCreate = () => {
    if (!invoiceData.buyerId || !invoiceData.items?.length) return;
    
    const invoice: Invoice = {
      ...invoiceData as Invoice,
      id: Math.random().toString(36).substr(2, 9),
      entityId: '1', // Defaulting to first entity for demo
      status: 'Pending',
      total: totalInvoiceValue
    };
    onAdd(invoice);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Professional Invoice">
      <div className="space-y-8 h-[80vh] overflow-y-auto pr-4 custom-scrollbar scroll-smooth">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Invoice Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Invoice Number *" value={invoiceData.number} onChange={e => setInvoiceData({...invoiceData, number: e.target.value})} />
            <Input label="Invoice Date *" type="date" value={invoiceData.issueDate} onChange={e => setInvoiceData({...invoiceData, issueDate: e.target.value})} />
            <Input label="Due Date" type="date" value={invoiceData.dueDate} onChange={e => setInvoiceData({...invoiceData, dueDate: e.target.value})} />
            <Input label="Reference Number" placeholder="Optional" value={invoiceData.referenceNumber} onChange={e => setInvoiceData({...invoiceData, referenceNumber: e.target.value})} />
            <Select label="Document Type" options={DOCUMENT_TYPES} value={invoiceData.documentType || 'Sale Invoice'} onChange={val => setInvoiceData({...invoiceData, documentType: val as any})} />
            <Input label="Salesman" placeholder="Name" value={invoiceData.salesman} onChange={e => setInvoiceData({...invoiceData, salesman: e.target.value})} />
          </div>
        </div>

        {/* Section 2: Buyer Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                <UserIcon size={18} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Buyer Details</h3>
            </div>
            <Button variant="ghost" icon={<UserPlus size={16} />} className="text-xs h-8 px-3 rounded-lg" onClick={onAddNewBuyer}>
              Quick Add Buyer
            </Button>
          </div>
          
          <Select 
            placeholder="Select a registered buyer..."
            options={buyers.map(b => b.name)}
            value={selectedBuyer?.name || ''}
            onChange={val => {
              const b = buyers.find(x => x.name === val);
              setInvoiceData({...invoiceData, buyerId: b?.id || ''});
            }}
          />

          {selectedBuyer && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-x-8 gap-y-4"
            >
              {[
                { label: 'NTN', val: selectedBuyer.ntn },
                { label: 'STRN', val: selectedBuyer.strn || 'Unregistered' },
                { label: 'Type', val: selectedBuyer.registrationType },
                { label: 'Region', val: selectedBuyer.province },
                { label: 'Address', val: selectedBuyer.address, full: true }
              ].map((info, idx) => (
                <div key={idx} className={info.full ? 'w-full pt-2 border-t border-slate-200 dark:border-slate-800' : ''}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{info.label}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{info.val}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Section 3: Line Items */}
        <div className="space-y-4 pb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                <ShoppingCart size={18} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Invoice Items</h3>
            </div>
            <Button variant="secondary" icon={<Plus size={16} />} className="text-xs h-8 px-4 rounded-lg" onClick={addItem}>
              Add Line Item
            </Button>
          </div>

          <div className="space-y-6">
            {(invoiceData.items || []).map((item, index) => (
              <div key={item.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Item {index + 1}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <div className="md:col-span-1">
                    <Input label="HS Code *" placeholder="0101.1100" value={item.hsCode} onChange={e => updateItem(item.id, { hsCode: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <Input label="Description *" placeholder="Product or service details" value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} />
                  </div>
                  
                  <Select label="Sale Type *" options={SALE_TYPES} value={item.saleType} onChange={val => updateItem(item.id, { saleType: val })} />
                  <Input label="Quantity *" type="number" step="0.01" value={item.quantity} onChange={e => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })} />
                  <Select label="UOM *" options={UOM_OPTIONS} value={item.uom} onChange={val => updateItem(item.id, { uom: val })} />
                  <Input label="Unit Price *" type="number" step="0.01" value={item.unitPrice} onChange={e => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30">
                   <div className="space-y-0.5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Excl. Tax</p>
                     <p className="text-sm font-black text-slate-900 dark:text-white">{item.salesValueExclTax.toLocaleString()}</p>
                   </div>
                   <div className="space-y-0.5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Sales Tax</p>
                     <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{item.salesTax.toLocaleString()}</p>
                   </div>
                   <div className="md:col-span-2 text-right">
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Item Total</p>
                     <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{item.totalItemValue.toLocaleString()}</p>
                   </div>
                </div>

                {/* Advanced Tax Fields - Expandable in a real app, here flat for visibility */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 opacity-70 hover:opacity-100 transition-opacity">
                   <Input label="Discount" type="number" value={item.discount} onChange={e => updateItem(item.id, { discount: parseFloat(e.target.value) || 0 })} />
                   <Input label="Extra Tax" type="number" value={item.extraTax} onChange={e => updateItem(item.id, { extraTax: parseFloat(e.target.value) || 0 })} />
                   <Input label="Further Tax" type="number" value={item.furtherTax} onChange={e => updateItem(item.id, { furtherTax: parseFloat(e.target.value) || 0 })} />
                   <Input label="Withheld" type="number" value={item.taxWithheld} onChange={e => updateItem(item.id, { taxWithheld: parseFloat(e.target.value) || 0 })} />
                   <Input label="FED" type="number" value={item.fedPayable} onChange={e => updateItem(item.id, { fedPayable: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Amount</p>
          <h4 className="text-3xl font-black text-indigo-600 tracking-tighter">${totalInvoiceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none px-10 h-14 rounded-2xl" onClick={onClose}>Discard</Button>
          <Button 
            className="flex-1 sm:flex-none px-10 h-14 rounded-2xl shadow-xl shadow-indigo-500/20" 
            onClick={handleCreate}
            disabled={!invoiceData.buyerId || totalInvoiceValue === 0}
            icon={<Calculator size={20} />}
          >
            Generate & Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
};
