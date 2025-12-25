
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Printer,
  Send,
  Trash2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { CreateInvoiceModal } from '../components/invoices/CreateInvoiceModal';
import { InvoicePreview } from '../components/invoices/InvoicePreview';
import { InvoiceFilterModal } from '../components/invoices/InvoiceFilterModal';
import { AddBuyerModal } from '../components/buyers/AddBuyerModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Invoice, Buyer, Entity } from '../types';

// Demo Data
const MOCK_BUYERS: Buyer[] = [
  { id: '1', name: 'Global Tech Corp', registrationType: 'Registered', ntn: '8877665-4', cnic: '42101-5555555-1', strn: '12-00-1122-334-55', province: 'PUNJAB', address: 'Plot 12, Industrial Area, Lahore', status: 'Active', createdAt: '2024-01-20' },
  { id: '2', name: 'Greenway Retail', registrationType: 'Unregistered', ntn: '1122334-5', cnic: '42201-4444444-2', province: 'SINDH', address: 'Shop 4, Market Square, Karachi', status: 'Active', createdAt: '2024-02-15' },
];

const MOCK_ENTITY: Entity = {
  id: '1',
  businessName: 'Horizon Digital Holdings',
  registrationType: 'Registered',
  ntn: '1234567-1',
  cnic: '42101-1234567-1',
  strn: '12-34-5678-901-23',
  province: 'PUNJAB',
  fullAddress: 'Suite 402, Business Bay, Lahore',
  status: 'Active',
  createdAt: '2024-01-15'
};

const MOCK_INVOICES: Invoice[] = [
  { 
    id: '1', number: 'INV-2024-001', buyerId: '1', entityId: '1', status: 'Paid', issueDate: '2024-03-01', dueDate: '2024-03-15', total: 1475.00,
    documentType: 'Sale Invoice',
    items: [{ 
      id: 'i1', hsCode: '8471.3010', description: 'Enterprise Laptops', saleType: 'Goods at standard rate',
      quantity: 5, uom: 'Units', rate: 250, unitPrice: 250, salesValueExclTax: 1250, salesTax: 225, 
      discount: 0, otherDiscount: 0, taxWithheld: 0, extraTax: 0, furtherTax: 0, fedPayable: 0, 
      t236g: 0, t236h: 0, tradeDiscount: 0, fixedValue: 0, totalItemValue: 1475 
    }]
  },
  { 
    id: '2', number: 'INV-2024-002', buyerId: '2', entityId: '1', status: 'Pending', issueDate: '2024-03-10', dueDate: '2024-03-24', total: 850.00,
    documentType: 'Sale Invoice',
    items: [{ 
      id: 'i2', hsCode: '8517.1300', description: 'Smartphones', saleType: 'Goods at standard rate',
      quantity: 2, uom: 'Units', rate: 425, unitPrice: 425, salesValueExclTax: 850, salesTax: 153, 
      discount: 0, otherDiscount: 0, taxWithheld: 0, extraTax: 0, furtherTax: 0, fedPayable: 0, 
      t236g: 0, t236h: 0, tradeDiscount: 0, fixedValue: 0, totalItemValue: 1003 
    }]
  }
];

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [buyers, setBuyers] = useState<Buyer[]>(MOCK_BUYERS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  
  const [filters, setFilters] = useState<any>({});
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const itemsPerPage = 50;

  const filteredInvoices = invoices.filter(inv => {
    const f = appliedFilters;
    const buyer = buyers.find(b => b.id === inv.buyerId);
    if (f.number && !inv.number.toLowerCase().includes(f.number.toLowerCase())) return false;
    if (f.buyerName && !buyer?.name.toLowerCase().includes(f.buyerName.toLowerCase())) return false;
    if (f.status && inv.status !== f.status) return false;
    if (f.documentType && inv.documentType !== f.documentType) return false;
    if (f.dateFrom && inv.issueDate < f.dateFrom) return false;
    if (f.dateTo && inv.issueDate > f.dateTo) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const page = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(page);
    setPageInput(page.toString());
  };

  const handleAddInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
    setIsModalOpen(false);
    setSelectedInvoiceForPreview(invoice);
  };

  const handleAddBuyer = (buyer: Buyer) => {
    setBuyers([buyer, ...buyers]);
    setIsBuyerModalOpen(false);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
    setPageInput('1');
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setPageInput('1');
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const statusColors = {
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Overdue: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    Draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
  };

  const nextInvoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;

  return (
    <div>
      <div className="space-y-8 max-w-7xl mx-auto flex flex-col h-full">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Records</h1>
            <p className="text-slate-500">Professional compliant invoicing for your global operations.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />} className="rounded-2xl shadow-xl shadow-indigo-500/10 h-12">
            New Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50">
              <Calendar size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Documents</p>
              <h3 className="text-4xl font-black mt-1">{invoices.length}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50 dark:bg-slate-800/50">
              <ArrowUpRight size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Paid Volume</p>
              <h3 className="text-4xl font-black mt-1">${invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-rose-600 bg-rose-50 dark:bg-slate-800/50">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Outstanding</p>
              <h3 className="text-4xl font-black mt-1 text-rose-600">${invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</h3>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden p-0 grow flex flex-col shadow-xl">
          <div className="flex flex-wrap items-center justify-between p-5 gap-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#080C1C] p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePageChange(currentPage - 1); }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 transition-all text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-sm font-bold text-slate-400">Page</span>
                  <input 
                    type="text"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onBlur={() => handlePageChange(parseInt(pageInput))}
                    onKeyDown={(e) => e.key === 'Enter' && handlePageChange(parseInt(pageInput))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-sm font-bold text-slate-400">of {totalPages}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePageChange(currentPage + 1); }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 transition-all text-slate-600 dark:text-slate-400"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant={Object.keys(appliedFilters).length > 0 ? "primary" : "secondary"} 
                icon={<Filter size={16} />} 
                className={`rounded-xl h-11 transition-all ${Object.keys(appliedFilters).length > 0 ? 'ring-4 ring-indigo-500/10' : ''}`}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Filters {Object.keys(appliedFilters).length > 0 && `(${Object.keys(appliedFilters).length})`}
              </Button>
              <Button variant="secondary" icon={<Download size={16} />} className="rounded-xl h-11">Export Ledger</Button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto relative grow custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-slate-50/90 dark:bg-[#080C1C] backdrop-blur-md">
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-6 py-5">Document</th>
                  <th className="px-6 py-5">Buyer</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Value</th>
                  <th className="px-6 py-5">Maturity</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {paginatedInvoices.map(inv => {
                  const b = buyers.find(x => x.id === inv.buyerId);
                  return (
                    <tr 
                      key={inv.id} 
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedInvoiceForPreview(inv)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden border border-white dark:border-slate-800 shadow-sm">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{inv.number}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.documentType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{b?.name || 'Unknown Buyer'}</p>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{b?.ntn}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-slate-900 dark:text-white">${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-500">{inv.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right relative overflow-visible">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveContextMenu(activeContextMenu === inv.id ? null : inv.id);
                          }}
                          className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {activeContextMenu === inv.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-6 top-14 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden text-left"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button onClick={() => {setSelectedInvoiceForPreview(inv); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                <Eye size={14} /> View Document
                              </button>
                              <button onClick={() => {setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                <Download size={14} /> Download PDF
                              </button>
                              <button onClick={() => {setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                <Send size={14} /> Send to Buyer
                              </button>
                              <button onClick={() => {setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                <Printer size={14} /> Print
                              </button>
                              <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                              <button 
                                onClick={() => { setActiveContextMenu(null); setIsConfirmationOpen(true); }} 
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors uppercase tracking-widest"
                              >
                                <Trash2 size={14} /> Cancel Invoice
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredInvoices.length === 0 && (
              <div className="py-20 flex flex-col items-center">
                <EmptyState message="No documents match your filter criteria." />
                <Button variant="ghost" onClick={handleClearFilters} className="mt-2 text-xs font-bold uppercase tracking-widest">Reset All Filters</Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <CreateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddInvoice} 
        nextInvoiceNumber={nextInvoiceNumber}
        buyers={buyers}
        onAddNewBuyer={() => {
          setIsModalOpen(false);
          setIsBuyerModalOpen(true);
        }}
      />

      <InvoiceFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <AddBuyerModal
        isOpen={isBuyerModalOpen}
        onClose={() => {
          setIsBuyerModalOpen(false);
          setIsModalOpen(true);
        }}
        onAdd={handleAddBuyer}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => setIsConfirmationOpen(false)}
        title="Cancel Invoice?"
        message="Are you sure you want to cancel this invoice? This action cannot be undone and will void the financial record."
        type="danger"
      />

      {selectedInvoiceForPreview && (
        <InvoicePreview
          invoice={selectedInvoiceForPreview}
          entity={MOCK_ENTITY}
          buyer={buyers.find(b => b.id === selectedInvoiceForPreview.buyerId) || buyers[0]}
          onClose={() => setSelectedInvoiceForPreview(null)}
        />
      )}
    </div>
  );
};

export default Invoices;
