
import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Filter, Download, Building2, MapPin, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { AddEntityModal } from '../components/entities/AddEntityModal';
import { Entity } from '../types';

const INITIAL_ENTITIES: Entity[] = [
  { 
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
  },
  { 
    id: '2', 
    businessName: 'Vertex Solutions', 
    registrationType: 'Unregistered',
    ntn: '9988776-5',
    cnic: '42201-9876543-2',
    province: 'SINDH',
    fullAddress: 'Office 12, Tower A, I.I Chundrigar Road, Karachi',
    status: 'Active', 
    createdAt: '2024-02-10' 
  },
];

const Entities: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const itemsPerPage = 50;
  const totalPages = Math.max(1, Math.ceil(entities.length / itemsPerPage));
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntities = entities.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const page = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(page);
    setPageInput(page.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handleInputBlur = () => {
    const val = parseInt(pageInput);
    if (!isNaN(val)) {
      handlePageChange(val);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleAddEntity = (entity: Entity) => {
    setEntities([entity, ...entities]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Entities</h1>
          <p className="text-slate-500">Manage legal profiles for your business units and distribution points.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />} className="rounded-2xl shadow-indigo-100">
          Add Entity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-6 relative overflow-hidden">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50`}>
            <Building2 size={32} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Entities</p>
            <h3 className="text-4xl font-black mt-1">{entities.length}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-6 relative overflow-hidden">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50`}>
            <Tag size={32} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Registered Units</p>
            <h3 className="text-4xl font-black mt-1">{entities.filter(e => e.registrationType === 'Registered').length}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-6 relative overflow-hidden">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-slate-800/50`}>
            <MapPin size={32} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Provinces</p>
            <h3 className="text-4xl font-black mt-1">{new Set(entities.map(e => e.province)).size}</h3>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0 border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between p-5 gap-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
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
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
                    className="w-12 h-8 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-sm font-bold text-slate-400">of {totalPages}</span>
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 transition-all text-slate-600 dark:text-slate-400"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                Total {entities.length} records
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors border border-slate-100 dark:border-slate-800"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || entities.length === 0}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors border border-slate-100 dark:border-slate-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Filter size={16} />} className="rounded-xl">Filters</Button>
            <Button variant="secondary" icon={<Download size={16} />} className="rounded-xl">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-5">Entity & Details</th>
                <th className="px-6 py-5">Identifiers</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {paginatedEntities.map(entity => (
                <tr key={entity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden border border-white dark:border-slate-800 shadow-sm">
                        {entity.logoUrl ? (
                          <img src={entity.logoUrl} className="w-full h-full object-cover" />
                        ) : (
                          entity.businessName.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{entity.businessName}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{entity.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400">NTN: <span className="text-slate-700 dark:text-slate-300 font-mono">{entity.ntn}</span></p>
                      <p className="text-xs font-bold text-slate-400">CNIC: <span className="text-slate-700 dark:text-slate-300 font-mono">{entity.cnic}</span></p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{entity.registrationType}</span>
                      {entity.strn && <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">STRN Active</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-indigo-400" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{entity.province}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      entity.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {entity.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {entities.length === 0 && <EmptyState message="No business entities configured yet." />}
        </div>
      </Card>

      <AddEntityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddEntity} 
      />
    </div>
  );
};

export default Entities;
