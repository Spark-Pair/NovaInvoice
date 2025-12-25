
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Printer, 
  Send, 
  X, 
  Zap, 
  MapPin, 
  Building2, 
  User as UserIcon, 
  Hash, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { Button } from '../Button';
import { Invoice, Entity, Buyer } from '../../types';

interface InvoicePreviewProps {
  invoice: Invoice;
  entity: Entity;
  buyer: Buyer;
  onClose: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, entity, buyer, onClose }) => {
  const subtotal = invoice.items.reduce((acc, curr) => acc + curr.salesValueExclTax, 0);
  const totalTax = invoice.items.reduce((acc, curr) => acc + curr.salesTax + curr.extraTax + curr.furtherTax + curr.fedPayable, 0);
  const totalDiscount = invoice.items.reduce((acc, curr) => acc + curr.discount + curr.otherDiscount + curr.tradeDiscount, 0);
  
  const currencySymbol = useMemo(() => {
    const setting = localStorage.getItem('app_currency') || 'Dollar ($)';
    return setting.includes('Rs') ? 'Rs.' : '$';
  }, []);

  const currencyLabel = useMemo(() => {
    const setting = localStorage.getItem('app_currency') || 'Dollar ($)';
    return setting.includes('Rs') ? 'PKR' : 'USD';
  }, []);

  return (
    <div className="fixed inset-0 z-[120] bg-slate-100 dark:bg-[#04060b] flex flex-col">
      {/* Action Bar */}
      <div className="h-20 bg-white dark:bg-[#080C1C] border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <X size={20} />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em]">Preview: {invoice.number}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Printer size={16} />} className="rounded-xl h-11">Print</Button>
          <Button variant="secondary" icon={<Download size={16} />} className="rounded-xl h-11">Download PDF</Button>
          <Button icon={<Send size={16} />} className="rounded-xl h-11 shadow-lg shadow-indigo-500/20 px-8">Send to Buyer</Button>
        </div>
      </div>

      {/* Invoice Document Body */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1000px] mx-auto bg-white dark:bg-[#080C1C] shadow-2xl rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 min-h-full flex flex-col"
        >
          {/* Document Header */}
          <div className="p-12 pb-0 flex justify-between items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-3 font-black text-2xl text-indigo-600 tracking-tighter">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={20} fill="currentColor" />
                </div>
                NovaInvoice
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{invoice.documentType}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Hash size={14} /> {invoice.number}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> Issued: {invoice.issueDate}</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-4">
              <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${
                invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {invoice.status}
              </span>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Parties Section */}
          <div className="p-12 grid grid-cols-2 gap-20">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 dark:border-indigo-900/20 pb-2">From (Business Entity)</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <Building2 size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white leading-tight">{entity.businessName}</p>
                    <p className="text-xs text-slate-500">{entity.registrationType}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p className="flex items-start gap-2"><MapPin size={16} className="text-slate-300 mt-0.5" /> {entity.fullAddress}</p>
                  <p className="flex items-center gap-2"><CreditCard size={16} className="text-slate-300" /> NTN: <span className="font-mono font-bold">{entity.ntn}</span></p>
                  {entity.strn && <p className="flex items-center gap-2"><CreditCard size={16} className="text-slate-300" /> STRN: <span className="font-mono font-bold">{entity.strn}</span></p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border-b border-emerald-50 dark:border-emerald-900/20 pb-2">To (Buyer Info)</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <UserIcon size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white leading-tight">{buyer.name}</p>
                    <p className="text-xs text-slate-500">{buyer.registrationType}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p className="flex items-start gap-2"><MapPin size={16} className="text-slate-300 mt-0.5" /> {buyer.address}</p>
                  <p className="flex items-center gap-2"><CreditCard size={16} className="text-slate-300" /> NTN: <span className="font-mono font-bold">{buyer.ntn}</span></p>
                  {buyer.strn && <p className="flex items-center gap-2"><CreditCard size={16} className="text-slate-300" /> STRN: <span className="font-mono font-bold">{buyer.strn}</span></p>}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-1 px-12">
            <div className="border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Item & HS Code</th>
                    <th className="px-6 py-4 text-center">Qty / UOM</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Excl. Tax</th>
                    <th className="px-6 py-4 text-right">Tax (18%)</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900 dark:text-white">{item.description}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">HS: {item.hsCode}</p>
                      </td>
                      <td className="px-6 py-5 text-center font-medium">
                        {item.quantity} <span className="text-[10px] text-slate-400 font-black uppercase">{item.uom}</span>
                      </td>
                      <td className="px-6 py-5 text-right font-medium">{item.unitPrice.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right font-medium">{item.salesValueExclTax.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right font-bold text-indigo-500">{item.salesTax.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right font-black text-slate-900 dark:text-white">{item.totalItemValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="p-12 mt-auto grid grid-cols-2 gap-10 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="space-y-4">
               {invoice.salesman && (
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                   <UserIcon size={14} /> Salesperson: <span className="font-bold text-slate-900 dark:text-white">{invoice.salesman}</span>
                 </div>
               )}
               <div className="p-6 rounded-3xl bg-white dark:bg-[#080C1C] border border-slate-200 dark:border-slate-800 shadow-sm">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Note / Reference</p>
                 <p className="text-xs text-slate-500 leading-relaxed italic">
                   {invoice.referenceNumber ? `Internal Ref: ${invoice.referenceNumber}` : 'No additional notes provided for this document.'}
                 </p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 px-6">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal (Excl. Tax)</span>
                  <span className="text-slate-900 dark:text-white">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Calculated Sales Tax</span>
                  <span className="text-indigo-600 font-bold">+{totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Total Discounts Applied</span>
                  <span className="text-rose-600 font-bold">-{totalDiscount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="h-[1px] bg-slate-200 dark:bg-slate-800 mx-6" />

              <div className="px-6 py-4 rounded-3xl bg-indigo-600 text-white flex justify-between items-center shadow-xl shadow-indigo-500/20">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Grand Total</p>
                  <p className="text-3xl font-black tracking-tighter">{currencySymbol}{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <CreditCard size={32} className="opacity-20" />
              </div>
            </div>
          </div>

          <div className="p-12 pt-0 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Thank you for your business</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
