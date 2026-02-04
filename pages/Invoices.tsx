import * as XLSX from "xlsx";
import React, { useState, useEffect, useMemo } from 'react';
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
  Clock,
  Upload,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { CreateInvoiceModal } from '../components/invoices/CreateInvoiceModal';
import { BulkUploadModal } from '../components/invoices/BulkUploadModal';
import { InvoicePreview } from './InvoicePreview';
import { InvoiceFilterModal } from '../components/invoices/InvoiceFilterModal';
import { AddBuyerModal } from '../components/buyers/AddBuyerModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Invoice, Buyer, Entity } from '../types';
import api from '@/axios';
import Loader from '@/components/Loader';
import { EditInvoiceModal } from "@/components/invoices/EditInvoiceModal";
import { useAppToast } from "@/components/toast/toast";
import { useGlobalLoader } from "@/hooks/LoaderContext";

const Invoices: React.FC = () => {
  const toast = useAppToast();
  const { showLoader, hideLoader } = useGlobalLoader();

  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState<Number>(0);
  const [totalRecords, setTotalRecords] = useState<Number>(0);
  const [stats, setStats] = useState({});
    
  const [isLoading, setIsLoading] = useState(true);        // initial full page
  const [isTableLoading, setIsTableLoading] = useState(false); // pagination only

  const [buyers, setBuyers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState<{ title: string; message: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({ title: '', message: '', onConfirm: () => {}, type: 'info' });
  
  const [filters, setFilters] = useState<any>({});
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const itemsPerPage = 30;

  const currencySymbol = useMemo(() => {
    const setting = localStorage.getItem('app_currency') || 'Dollar ($)';
    return setting.includes('Rs') ? 'Rs.' : '$';
  }, []);

  useEffect(() => {
    fetchInvoices(currentPage, true);
  }, [currentPage, appliedFilters]);

  const buildFilterParams = () => {
    const params: Record<string, any> = {};

    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'Select...'
      ) {
        params[key] = value;
      }
    });

    return params;
  };

  const fetchInvoices = async (page = 1, showTableLoader = false) => {
    try {
      showTableLoader ? setIsTableLoading(true) : setIsLoading(true);

      const filterParams = buildFilterParams();

      const { data } = await api.get('/invoices', {
        params: {
          page,
          limit: itemsPerPage,
          ...filterParams, // 🔥 filters + pagination together
        },
      });

      const formattedInvoices = data.invoices.map((invoice: any) => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        date: new Date(invoice.date).toISOString().split("T")[0],
        documentType: invoice.documentType,
        salesman: invoice.salesman,
        referenceNumber: invoice.referenceNumber,
        buyer: {...invoice.buyer, address: invoice.buyer.fullAddress},
        relatedEntity: invoice.relatedEntity,
        items: invoice.items,
        isSent: invoice.isSent,
        totalValue: invoice.totalValue
      }));
      
      setInvoices(formattedInvoices);
      setTotalPages(data.meta.totalPages);
      setTotalRecords(data.meta.total);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsTableLoading(false);
    }
  };

  const startRow = (currentPage - 1) * itemsPerPage + 1;
  const endRow = Math.min(currentPage * itemsPerPage, totalRecords);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setCurrentPage(newPage);
    setPageInput(newPage.toString());
  };

  const handleAddInvoice = (invoice) => {
    handleClearFilters();
    setIsModalOpen(false);
    setSelectedInvoice(invoice);
  };

  const handleUpdateEntity = (invoice) => {
    handleClearFilters();
    setIsEditModalOpen(false);
    setSelectedInvoice(invoice);
  };

  useEffect(() => {
    fetchBuyers();
  }, [])

  const fetchBuyers = async () => {
    const { data } = await api.get("/invoices/buyers");
    setBuyers(data.buyers);
  };

  const handleAddBuyer = (buyer: Buyer) => {
    fetchBuyers();
    setIsBuyerModalOpen(false);
  };

  const deleteInvoice = (invoice) => {
    setConfirmationConfig({
      title: 'Delete Invoice?',
      message: 'Are you sure you want to delete this invoice? This action cannot be undone.',
      type: 'danger',

      onConfirm: async () => {
        showLoader();
        try {
          const { data } = await api.delete(
            `/invoices/${invoice.id}/`
          );

          handleApplyFilters();
        
          toast.success("Status updated successfully!")
        } catch (error) {
          console.error("Failed to update status!", error)
          toast.error(error.response?.data?.message || error.message || 'Failed to update status!')
        } finally {
          hideLoader();
          setIsConfirmationOpen(false);
        }
      },
    });

    setIsConfirmationOpen(true);
  }

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setPageInput('1');
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
    setPageInput('1');
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const statusColors = {
    'Sent': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Not-Sent': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };

  const exportData = async () => {
    showLoader();
    try {
      const filterParams = buildFilterParams();

      const { data } = await api.get("/invoices", {
        params: {
          noLimit: true,
          ...filterParams,
        },
      });

      // 🔥 Flatten invoices → items
      const rows = data.invoices.flatMap((invoice) =>
        invoice.items.map((item) => ({
          "Invoice Number": invoice.invoiceNumber,
          "Invoice Date": new Date(invoice.date).toISOString().split("T")[0],
          "Reference Number": invoice.referenceNumber,
          "Document Type": invoice.documentType,
          "Salesman": invoice.salesman,

          "Buyer Name": invoice.buyer?.buyerName,
          "Buyer NTN": invoice.buyer?.ntn,
          "Buyer CNIC": invoice.buyer?.cnic,
          "Buyer STRN": invoice.buyer?.strn,
          "Buyer Address": invoice.buyer?.address,
          "Buyer Province": invoice.buyer?.province,
          "Buyer Registration Type": invoice.buyer?.registrationType,

          "Seller Name": invoice.relatedEntity?.businessName,
          "Seller NTN": invoice.relatedEntity?.ntn,
          "Seller CNIC": invoice.relatedEntity?.cnic,
          "Seller STRN": invoice.relatedEntity?.strn,
          "Seller Address": invoice.relatedEntity?.address,
          "Seller Province": invoice.relatedEntity?.province,

          "UOM": item.uom,
          "HS Code": item.hsCode,
          "Description": item.description,
          "Sale Type": item.saleType,
          "Quantity": item.quantity,
          "Rate": item.rate,
          "Unit Price": item.unitPrice,
          "Sales Value": item.salesValue,
          "Discount": item.discount,
          "Other Discount": item.otherDiscount,
          "Trade Discount": item.tradeDiscount,
          "Sales Tax": item.salesTax,
          "Sales Tax Withheld": item.salesTaxWithheld,
          "Extra Tax": item.extraTax,
          "Further Tax": item.furtherTax, // renamed for clarity
          "FED": item.federalExciseDuty,
          "SRO Schedule No": item.sroScheduleNo,
          "SRO Item Serial No": item.sroItemSerialNo,
          "236G": item.t236g,
          "236H": item.t236h,
          "Fixed Value": item.fixedValue,
          "Item Total Value": item.totalItemValue,

          "Invoice Total": invoice.totalValue,
          "Is Sent": invoice.isSent ? "Yes" : "No",
        }))
      );

      // 🧾 Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // 📘 Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

      // 💾 Download
      XLSX.writeFile(
        workbook,
        `Invoices_${new Date().toISOString().slice(0, 10)}.xlsx`
      );

      toast.success("Data exported succcessfully!")
    } catch (error) {
      console.error("Failed to export data!", error)
      toast.error(error.response?.data?.message || error.message || 'Failed to export data!')
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto flex flex-col h-full">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Records</h1>
            <p className="text-slate-500">Professional compliant invoicing for your global operations.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsBulkUploadOpen(true)} 
              icon={<Upload size={20} />} 
              className="rounded-2xl h-12"
            >
              Upload
            </Button>
            <Button disabled={!buyers} onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />} className="rounded-2xl shadow-xl shadow-indigo-500/10 h-12">
              New Invoice
            </Button>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex items-center gap-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50">
                <Calendar size={32} />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Invoices</p>
                <h3 className="text-4xl font-black mt-1">{totalRecords}</h3>
              </div>
            </Card>
            <Card className="flex items-center gap-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50 dark:bg-slate-800/50">
                <ArrowUpRight size={32} />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Sent Invoices</p>
                <h3 className="text-4xl font-black mt-1">{stats.sentInvoices}</h3>
              </div>
            </Card>
            <Card className="flex items-center gap-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30">
                <Clock size={32} />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Pending Invoices</p>
                <h3 className="text-4xl font-black mt-1">{ totalRecords - stats.sentInvoices }</h3>
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
                <Button onClick={exportData} variant="secondary" icon={<Download size={16} />} className="rounded-xl h-11">Export</Button>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto relative grow custom-scrollbar">
              {isTableLoading && (
                <div className="absolute inset-0 z-30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader size="sm" />
                </div>
              )}
            
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-20 bg-slate-50/90 dark:bg-[#080C1C] backdrop-blur-md">
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-5">Document</th>
                    <th className="px-6 py-5">Buyer</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Value</th>
                    <th className="px-6 py-5">Dateq</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {invoices.map(inv => {
                    const b = buyers.find(x => x.id === inv.buyerId);
                    return (
                      <tr 
                        key={inv.id} 
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden border border-white dark:border-slate-800 shadow-sm">
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{inv.invoiceNumber}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.documentType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{inv.buyer.buyerName || 'Unknown Buyer'}</p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{inv.buyer.ntn ? 'NTN: '+inv.buyer.ntn : 'CNIC: '+inv.buyer.cnic}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[inv.isSent ? 'Sent' : 'Not-Sent']}`}>
                            {inv.isSent ? 'Sent' : 'Not Sent'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {/* <p className="font-black text-slate-900 dark:text-white">{currencySymbol}{inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p> */}
                          <p className="font-black text-slate-900 dark:text-white">{currencySymbol}{inv.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-500">{inv.date}</span>
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
                                <button onClick={() => {setSelectedInvoice(inv); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                  <Eye size={14} /> View Invoice
                                </button>
                                <button onClick={() => {setSelectedInvoice(inv); setIsEditModalOpen(true); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                  <Edit2 size={14} /> Edit Invoice
                                </button>
                                <button onClick={() => {setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                  <Send size={14} /> Send to FBR
                                </button>
                                
                                {!inv.isSent && (
                                <>
                                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                                  <button 
                                    onClick={() => { setActiveContextMenu(null); deleteInvoice(inv); }} 
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors uppercase tracking-widest"
                                  >
                                    <Trash2 size={14} /> Delete Invoice
                                  </button>
                                </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {invoices.length === 0 && (
                <div className="py-20 flex flex-col items-center">
                  <EmptyState message="No invoices matching your criteria." />
                  <Button variant="ghost" onClick={handleClearFilters} className="mt-2 text-xs font-bold uppercase tracking-widest">Reset All Filters</Button>
                </div>
              )}
            </div>
          </Card>
        </>
        )}
      </div>

      <CreateInvoiceModal 
        isOpen={isModalOpen && !isBuyerModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddInvoice}
        buyers={buyers}
        onAddNewBuyer={() => {
          setIsBuyerModalOpen(true);
        }}
      />
      
      <EditInvoiceModal 
        isOpen={isEditModalOpen && selectedInvoice && !isBuyerModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedInvoice(null); }} 
        onUpdate={handleUpdateEntity}
        invoice={selectedInvoice}
        buyers={buyers}
        onAddNewBuyer={() => {
          setIsBuyerModalOpen(true);
        }}
      />

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
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
        }}
        onAdd={handleAddBuyer}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        type={confirmationConfig.type}
      />

      {selectedInvoice && !isEditModalOpen && (
        <InvoicePreview
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
};

export default Invoices;
