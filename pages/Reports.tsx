import * as XLSX from "xlsx";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  FileText,
  ChevronLeft, 
  ChevronRight,
  RefreshCcw,
  User,
  Hash
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import api from '@/axios';
import Loader from '@/components/Loader';
import { useAppToast } from "@/components/toast/toast";
import { useGlobalLoader } from "@/hooks/LoaderContext";

const ReportsPage: React.FC = () => {
  const toast = useAppToast();
  const { showLoader, hideLoader } = useGlobalLoader();

  // Data States
  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Report Specific Filter States
  const [filterValues, setFilterValues] = useState({
    startDate: '',
    endDate: '',
    invoiceNumber: '',
    buyerName: '',
    documentType: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const currencySymbol = useMemo(() => {
    const setting = localStorage.getItem('app_currency') || 'Dollar ($)';
    return setting.includes('Rs') ? 'Rs.' : '$';
  }, []);

  // Fetch Logic
  const fetchReport = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: itemsPerPage,
        ...filterValues
      };

      const { data } = await api.get('/invoices', { params });
      
      setInvoices(data.invoices);
      setTotalPages(data.meta.totalPages);
      setTotalRecords(data.meta.total);
    } catch (err) {
      toast.error("Failed to fetch report data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(currentPage);
  }, [currentPage]);

  const handleApplyReport = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReport(1);
  };

  const handleReset = () => {
    setFilterValues({
      startDate: '',
      endDate: '',
      invoiceNumber: '',
      buyerName: '',
      documentType: ''
    });
    setCurrentPage(1);
  };

  // Export Logic (modified for reports)
  const exportReport = async () => {
    showLoader();
    try {
      const { data } = await api.get("/invoices", {
        params: { noLimit: true, ...filterValues },
      });

      const rows = data.invoices.flatMap((inv) =>
        inv.items.map((item) => ({
          "Invoice #": inv.invoiceNumber,
          "Date": inv.date,
          "Buyer": inv.buyer?.buyerName,
          "Type": inv.documentType,
          "Total Value": inv.totalValue,
          "Item": item.description,
          "Qty": item.quantity,
          "Rate": item.rate
        }))
      );

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `Report_${filterValues.startDate || 'all'}_to_${filterValues.endDate || 'now'}.xlsx`);
      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Invoice Reports</h1>
          <p className="text-slate-500 text-sm">Generate and export detailed transaction data.</p>
        </div>
        <Button onClick={exportReport} variant="primary" icon={<Download size={18} />} className="rounded-xl">
          Export Report (.xlsx)
        </Button>
      </div>

      {/* Report Control Panel */}
      <Card className="p-6 border-none shadow-sm bg-white dark:bg-slate-900">
        <form onSubmit={handleApplyReport} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterValues.startDate}
                onChange={(e) => setFilterValues({...filterValues, startDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterValues.endDate}
                onChange={(e) => setFilterValues({...filterValues, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Buyer Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                placeholder="Search Buyer..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterValues.buyerName}
                onChange={(e) => setFilterValues({...filterValues, buyerName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Invoice Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                placeholder="INV-001..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterValues.invoiceNumber}
                onChange={(e) => setFilterValues({...filterValues, invoiceNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit" variant="primary" className="h-10 grow rounded-xl">Generate</Button>
            <Button type="button" variant="secondary" onClick={handleReset} className="h-10 px-3 rounded-xl">
              <RefreshCcw size={18} />
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden p-0 border-none shadow-xl">
        {isLoading ? (
          <div className="py-20"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-[#080C1C]">
                <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {inv.buyer?.buyerName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase">
                        {inv.documentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">
                      {currencySymbol}{inv.totalValue?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoices.length === 0 && (
              <div className="py-20 flex flex-col items-center">
                <EmptyState message="No records found for the selected period." />
              </div>
            )}
          </div>
        )}

        {/* Simplified Pagination */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500 font-bold uppercase">
            Total Records: {totalRecords}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className="h-8 px-2" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm font-black px-4 py-1.5">
              {currentPage} / {totalPages}
            </span>
            <Button 
              variant="secondary" 
              className="h-8 px-2" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;