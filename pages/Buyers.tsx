import * as XLSX from "xlsx";
import React, { useState, useEffect } from 'react';
import { 
  Plus,
  MoreVertical, 
  Filter, 
  Download, 
  Users, 
  MapPin, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Eye,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { AddBuyerModal } from '../components/buyers/AddBuyerModal';
import { EditBuyerModal } from '../components/buyers/EditBuyerModal';
import { BuyerDetailsModal } from '../components/buyers/BuyerDetailsModal';
import { BuyerFilterModal } from '../components/buyers/BuyerFilterModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Buyer } from '../types';
import api from '@/axios';
import Loader from '@/components/Loader';
import { useGlobalLoader } from "@/hooks/LoaderContext";
import { useAppToast } from "@/components/toast/toast";

const Buyers: React.FC = () => {
  const toast = useAppToast()
  const { showLoader, hideLoader } = useGlobalLoader();

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [stats, setStats] = useState<any>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState<{ title: string; message: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({ title: '', message: '', onConfirm: () => {}, type: 'info' });

  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<any>({});
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const itemsPerPage = 30;

  useEffect(() => {
    fetchBuyers(currentPage, true);
  }, [currentPage, appliedFilters]);

  const fetchBuyers = async (page = 1, showTableLoader = false) => {
    try {
      showTableLoader ? setIsTableLoading(true) : setIsLoading(true);

      const params: any = {
        page,
        limit: itemsPerPage,
        ...appliedFilters,
      };

      const { data } = await api.get("/buyers", { params });

      const formatted = data.data.map((b: any) => ({
        id: b._id,
        name: b.buyerName,
        registrationType: b.registrationType,
        ntn: b.ntn,
        cnic: b.cnic,
        strn: b.strn,
        province: b.province,
        address: b.fullAddress,
        status: b.isActive ? "Active" : "Inactive",
        createdAt: new Date(b.createdAt).toISOString().split("T")[0],
      }));

      setBuyers(formatted);
      setTotalPages(data.meta.totalPages);
      setTotalRecords(data.meta.total);
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsTableLoading(false);
    }
  };

  const startRow = (currentPage - 1) * itemsPerPage + 1;
  const endRow = Math.min(currentPage * itemsPerPage, totalRecords);

  const handlePageChange = (newPage: number) => {
    const page = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(page);
    setPageInput(page.toString());
  };

  const handleAddBuyer = () => {
    handleClearFilters();
    setIsAddModalOpen(false);
  };

  const handleUpdateBuyer = (updatedBuyer: Buyer) => {
    setBuyers(buyers.map(b => b.id === updatedBuyer.id ? updatedBuyer : b));
    setIsEditModalOpen(false);
    setSelectedBuyer(null);
  };

  const toggleStatus = (buyer: Buyer) => {
    const newStatus = buyer.status === 'Active' ? 'Inactive' : 'Active';

    setConfirmationConfig({
      title: `${newStatus === 'Active' ? 'Activate' : 'Deactivate'} Buyer`,
      message: `Are you sure you want to set ${buyer.name} as ${newStatus}?`,
      type: newStatus === 'Active' ? 'info' : 'danger',

      onConfirm: async () => {
        showLoader();
        try {
          const { data } = await api.patch(
            `/buyers/${buyer.id}/toggle-status`
          );

          setSelectedBuyer(prev => prev ? { ...prev, status: newStatus } : null);

          handleApplyFilters();
        
          toast.success("Status updated successfully!")
        } catch (error) {
          console.error("Failed to toggle buyer status!", error)
          toast.error(error.response?.data?.message || error.message || 'Failed to toggle buyer status!')
        } finally {
          hideLoader();
          setIsConfirmationOpen(false);
        }
      },
    });
    setIsConfirmationOpen(true);
  };

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

  const exportData = async () => {
    showLoader();
    try {
      const params: any = {
        noLimit: true,
        ...appliedFilters,
      };

      const { data } = await api.get("/buyers", { params });

      // 🔥 Format rows
      const rows = data.data.map((buyer: any, index: number) => ({
        "Sr #": index + 1,
        "Buyer Name": buyer.buyerName,
        "Registration Type": buyer.registrationType,
        "Province": buyer.province,
        "NTN": buyer.ntn || "-",
        "CNIC": buyer.cnic || "-",
        "STRN": buyer.strn || "-",
        "Full Address": buyer.fullAddress || "-",
        "Status": buyer.isActive ? "Active" : "Inactive",
        "Created Date": new Date(buyer.createdAt)
          .toISOString()
          .split("T")[0],
      }));

      // 🧾 Worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // 📘 Workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Buyers");

      // 💾 Download
      XLSX.writeFile(
        workbook,
        `Buyers_${new Date().toISOString().slice(0, 10)}.xlsx`
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
    <div className="max-w-7xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Buyers Directory</h1>
          <p className="text-slate-500">Manage your client relationships and billing profiles.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus size={20} />} className="rounded-2xl shadow-indigo-100 h-12">
          New Buyer
        </Button>
      </div>
      
      {isLoading ? (
        <Loader />
      ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-6 relative overflow-hidden">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50`}>
              <Users size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Buyers</p>
              <h3 className="text-4xl font-black mt-1">{totalRecords}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-6 relative overflow-hidden">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50`}>
              <Tag size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Buyers</p>
              <h3 className="text-4xl font-black mt-1">{stats.activeTotal}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-6 relative overflow-hidden">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50`}>
              <MapPin size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Provinces</p>
              <h3 className="text-4xl font-black mt-1">{stats.activeProvinceTotal}</h3>
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

              <div className="flex flex-col text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span>Rows per page: {itemsPerPage}</span>
                <span className="text-slate-400 normal-case font-semibold tracking-normal">
                  Showing {startRow}–{endRow} of {totalRecords}
                </span>
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
              <Button variant="secondary" onClick={exportData} icon={<Download size={16} />} className="rounded-xl h-11">Export</Button>
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
                  <th className="px-6 py-5">Buyer Name</th>
                  <th className="px-6 py-5">Identifiers</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {buyers.map(buyer => (
                  <tr 
                    key={buyer.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedBuyer(buyer)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden border border-white dark:border-slate-800 shadow-sm">
                          {buyer.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{buyer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NTN: <span className="text-xs text-slate-700 dark:text-slate-300 font-mono font-bold tracking-normal">{buyer.ntn}</span></p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CNIC: <span className="text-xs text-slate-700 dark:text-slate-300 font-mono font-bold tracking-normal">{buyer.cnic}</span></p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{buyer.registrationType}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{buyer.province}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        buyer.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative overflow-visible">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveContextMenu(activeContextMenu === buyer.id ? null : buyer.id);
                        }}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      <AnimatePresence>
                        {activeContextMenu === buyer.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-6 top-14 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button onClick={() => {setSelectedBuyer(buyer); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                              <Eye size={14} /> View Profile
                            </button>
                            <button onClick={() => {setSelectedBuyer(buyer); setIsEditModalOpen(true); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                              <Edit2 size={14} /> Edit Buyer
                            </button>
                            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                            <button 
                              onClick={() => { toggleStatus(buyer); setActiveContextMenu(null); }} 
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors uppercase tracking-widest ${
                                buyer.status === 'Active' ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              }`}
                            >
                              <Power size={14} /> {buyer.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {buyers.length === 0 && (
              <div className="py-20 flex flex-col items-center">
                <EmptyState message="No buyers found matching your criteria." />
                <Button variant="ghost" onClick={handleClearFilters} className="mt-2 text-xs font-bold uppercase tracking-widest">Reset All Filters</Button>
              </div>
            )}
          </div>
        </Card>
      </>
      )}

      <AddBuyerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddBuyer} 
      />

      <EditBuyerModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedBuyer(null); }} 
        onUpdate={handleUpdateBuyer}
        buyer={selectedBuyer}
      />

      <BuyerFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        type={confirmationConfig.type as any}
      />

      <BuyerDetailsModal
        isOpen={!!selectedBuyer && !isEditModalOpen && !isConfirmationOpen}
        onClose={() => setSelectedBuyer(null)}
        buyer={selectedBuyer}
        onEdit={() => setIsEditModalOpen(true)}
        onToggleStatus={() => selectedBuyer && toggleStatus(selectedBuyer)}
      />
    </div>
  );
};

export default Buyers;
