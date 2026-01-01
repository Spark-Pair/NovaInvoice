
import React, { useState, useEffect } from 'react';
import { 
  Plus,
  MoreVertical, 
  Filter, 
  Download, 
  Building2, 
  MapPin, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Eye,
  Power,
  KeyRound,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { AddEntityModal } from '../components/entities/AddEntityModal';
import { EditEntityModal } from '../components/entities/EditEntityModal';
import { ResetPasswordModal } from '../components/entities/ResetPasswordModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { EntityDetailsModal } from '../components/entities/EntityDetailsModal';
import { EntityFilterModal } from '../components/entities/EntityFilterModal';
import { Entity } from '../types';
import api from '@/axios';
import Loader from '@/components/Loader';

const Entities: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState<{ title: string; message: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({ title: '', message: '', onConfirm: () => {}, type: 'info' });

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/entities'); // GET /api/entities
        // Transform backend data to match your frontend Entity type
        const formattedEntities = data.map((e: any) => ({
          id: e._id,
          businessName: e.businessName,
          registrationType: e.registrationType,
          ntn: e.ntn,
          cnic: e.cnic,
          strn: e.strn,
          province: e.province,
          fullAddress: e.fullAddress,
          status: e.isActive ? 'Active' : 'Inactive', // or compute from e if you store status in backend
          createdAt: new Date(e.createdAt).toISOString().split('T')[0],
          username: e.user?.username || '',
          logoUrl: e.image || undefined,
        }));
        setEntities(formattedEntities);
      } catch (err: any) {
        console.error(err);
        // setError(err.response?.data?.message || err.message || 'Failed to fetch entities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<any>({});
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const itemsPerPage = 50;

  // Filter Logic
  const filteredEntities = entities.filter(entity => {
    const f = appliedFilters;
    if (f.username && !entity.username?.toLowerCase().includes(f.username.toLowerCase())) return false;
    if (f.businessName && !entity.businessName.toLowerCase().includes(f.businessName.toLowerCase())) return false;
    if (f.registrationType && entity.registrationType !== f.registrationType) return false;
    if (f.province && entity.province !== f.province) return false;
    if (f.status && entity.status !== f.status) return false;
    if (f.ntn && !entity.ntn.includes(f.ntn)) return false;
    if (f.cnic && !entity.cnic.includes(f.cnic)) return false;
    if (f.strn && (!entity.strn || !entity.strn.includes(f.strn))) return false;
    if (f.dateFrom && entity.createdAt < f.dateFrom) return false;
    if (f.dateTo && entity.createdAt > f.dateTo) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEntities.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntities = filteredEntities.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const page = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(page);
    setPageInput(page.toString());
  };

  const handleAddEntity = (entity: Entity) => {
    setEntities([entity, ...entities]);
    setIsAddModalOpen(false);
  };

  const handleUpdateEntity = (updatedEntity: Entity) => {
    setEntities(entities.map(e => e.id === updatedEntity.id ? updatedEntity : e));
    setIsEditModalOpen(false);
    setSelectedEntity(null);
  };

  const toggleStatus = (entity: Entity) => {
    const newStatus = entity.status === 'Active' ? 'Inactive' : 'Active';

    setConfirmationConfig({
      title: `${newStatus === 'Active' ? 'Activate' : 'Deactivate'} Entity`,
      message: `Are you sure you want to set ${entity.businessName} as ${newStatus}?`,
      type: newStatus === 'Active' ? 'info' : 'danger',

      onConfirm: async () => {
        try {
          const { data } = await api.patch(
            `/entities/${entity.id}/toggle-status`
          );

          setSelectedEntity(prev => prev ? { ...prev, status: newStatus } : null);
          

          setEntities(prev =>
            prev.map(e =>
              e.id === entity.id
                ? {
                    ...e,
                    status: data.entity.isActive ? 'Active' : 'Inactive',
                  }
                : e
            )
          );
        } catch (err) {
          console.error('Failed to toggle entity status', err);
        } finally {
          setIsConfirmationOpen(false);
        }
      },
    });

    setIsConfirmationOpen(true);
  };

  const handleResetPassword = () => {
    setIsConfirmationOpen(true);
    setConfirmationConfig({
      title: 'Password Updated',
      message: 'The password has been successfully reset for this entity.',
      type: 'info',
      onConfirm: () => setIsConfirmationOpen(false)
    });
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

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Business Entities</h1>
          <p className="text-slate-500">Manage legal profiles for your business units and distribution points.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus size={20} />} className="rounded-2xl shadow-indigo-100 h-12">
          Add Entity
        </Button>
      </div>
      
      {isLoading ? (
        <Loader />
      ) : (
      <>
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
              <Button variant="secondary" icon={<Download size={16} />} className="rounded-xl h-11">Export</Button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto relative grow custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-slate-50/90 dark:bg-[#080C1C] backdrop-blur-md">
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-black uppercase tracking-wider">
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
                  <tr 
                    key={entity.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedEntity(entity)}
                  >
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
                          <p className="text-[10px] font-black text-slate-400 tracking-widest mt-0.5 flex gap-1 items-center"><UserIcon size={12} className="text-slate-400" /> <span>{entity.username}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NTN: <span className="text-xs text-slate-700 dark:text-slate-300 font-mono font-bold tracking-normal">{entity.ntn}</span></p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CNIC: <span className="text-xs text-slate-700 dark:text-slate-300 font-mono font-bold tracking-normal">{entity.cnic}</span></p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{entity.registrationType}</span>
                        {entity.strn && <span className="text-[9px] font-mono text-indigo-500 font-black uppercase tracking-widest">STRN Active</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{entity.province}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        entity.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {entity.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative overflow-visible">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveContextMenu(activeContextMenu === entity.id ? null : entity.id);
                        }}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      <AnimatePresence>
                        {activeContextMenu === entity.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-6 top-14 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button onClick={() => {setSelectedEntity(entity); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                              <Eye size={14} /> View Details
                            </button>
                            <button onClick={() => {setSelectedEntity(entity); setIsEditModalOpen(true); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                              <Edit2 size={14} /> Edit Profile
                            </button>
                            <button onClick={() => {setSelectedEntity(entity); setIsResetPasswordModalOpen(true); setActiveContextMenu(null)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                              <KeyRound size={14} /> Reset Password
                            </button>
                            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                            <button 
                              onClick={() => { toggleStatus(entity); setActiveContextMenu(null); }} 
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors uppercase tracking-widest ${
                                entity.status === 'Active' ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              }`}
                            >
                              <Power size={14} /> {entity.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEntities.length === 0 && (
              <div className="py-20 flex flex-col items-center">
                <EmptyState message="No business entities matching your criteria." />
                <Button variant="ghost" onClick={handleClearFilters} className="mt-2 text-xs font-bold uppercase tracking-widest">Reset All Filters</Button>
              </div>
            )}
          </div>
        </Card>
      </>
      )}

      <AddEntityModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddEntity} 
      />

      <EditEntityModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedEntity(null); }} 
        onUpdate={handleUpdateEntity}
        entity={selectedEntity}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onReset={handleResetPassword}
        entityName={selectedEntity?.businessName || ''}
      />

      <EntityFilterModal
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

      <EntityDetailsModal
        isOpen={!!selectedEntity && !isEditModalOpen && !isResetPasswordModalOpen && !isConfirmationOpen}
        onClose={() => setSelectedEntity(null)}
        entity={selectedEntity}
        onEdit={() => setIsEditModalOpen(true)}
        onResetPassword={() => setIsResetPasswordModalOpen(true)}
        onToggleStatus={() => selectedEntity && toggleStatus(selectedEntity)}
      />
    </div>
  );
};

export default Entities;
