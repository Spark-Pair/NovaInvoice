import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Globe, Palette, Coins, Save, 
  CheckCircle2, FileText, BarChart3, Users, ChevronRight,
  ClipboardList, Contact2, LayoutPanelLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { ConfigModal } from '@/components/settings/ConfigModal';
import api from '@/axios';
import Loader from '@/components/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useAppToast } from '@/components/toast/toast';
import { useGlobalLoader } from '@/hooks/LoaderContext';

const CURRENCY_OPTIONS = ['Dollar ($)', 'Rs (₨)'];

export const SETTINGS_CONFIG = {
  invoiceFields: {
    invoices: [
      { label: "Invoice Number", key: "invoice_number", isVisible: true, required: true },
      { label: "Invoice Date", key: "invoice_date", isVisible: true, required: true },
      { label: "Reference Number", key: "reference_no", isVisible: true, required: false },
      { label: "Salesman", key: "salesman", isVisible: true, required: false },
    ]
  },

  buyerFields: {
    buyers: [
      { label: "Buyer Number", key: "buyer_number", isVisible: true, required: true },
      { label: "Name", key: "buyer_name", isVisible: true, required: true },
      { label: "NTN", key: "buyer_ntn", isVisible: true, required: false },
      { label: "CNIC", key: "buyer_cnic", isVisible: true, required: false },
      { label: "STRN", key: "buyer_strn", isVisible: true, required: false },
      { label: "Address", key: "buyer_address", isVisible: true, required: false },
      { label: "Province", key: "buyer_province", isVisible: true, required: false },
      { label: "Registration Type", key: "registration_type", isVisible: true, required: false },
    ]
  },

  invoicePreview: {
    business: [
      { label: "Business Name", key: "business_name", isVisible: true, required: true },
      { label: "NTN", key: "business_ntn", isVisible: true, required: false },
      { label: "CNIC", key: "business_cnic", isVisible: true, required: false },
      { label: "STRN", key: "business_strn", isVisible: true, required: false },
      { label: "Address", key: "business_address", isVisible: true, required: false },
      { label: "Province", key: "business_province", isVisible: true, required: false },
    ],

    buyer: [
      { label: "Name", key: "buyer_name", isVisible: true, required: true },
      { label: "NTN", key: "buyer_ntn", isVisible: true, required: false },
      { label: "CNIC", key: "buyer_cnic", isVisible: true, required: false },
      { label: "STRN", key: "buyer_strn", isVisible: true, required: false },
      { label: "Address", key: "buyer_address", isVisible: true, required: false },
      { label: "Province", key: "buyer_province", isVisible: true, required: false },
      { label: "Registration Type", key: "registration_type", isVisible: true, required: false },
    ],

    meta: [
      { label: "Invoice No", key: "invoice_number", isVisible: true, required: true },
      { label: "Invoice Date", key: "invoice_date", isVisible: true, required: true },
      { label: "Reference No", key: "reference_no", isVisible: true, required: false },
      { label: "Salesman", key: "salesman", isVisible: true, required: false },
    ],

    items: [
      { label: "UOM", key: "uom", isVisible: true, required: false },
      { label: "HS Code", key: "hs_code", isVisible: true, required: false },
      { label: "Description", key: "description", isVisible: true, required: true },
      { label: "Sale Type", key: "sale_type", isVisible: true, required: false },
      { label: "Quantity", key: "quantity", isVisible: true, required: true },
      { label: "Rate", key: "rate", isVisible: true, required: true },
      { label: "Unit Price", key: "unit_price", isVisible: true, required: true },
      { label: "Sales Value (Excl. Tax)", key: "sales_value", isVisible: true, required: true },
      { label: "Discount", key: "discount", isVisible: true, required: false },
      { label: "Other Discount", key: "other_discount", isVisible: true, required: false },
      { label: "Trade Discount", key: "trade_discount", isVisible: true, required: false },
      { label: "Sales Tax", key: "sales_tax", isVisible: true, required: false },
      { label: "Tax Withheld", key: "tax_withheld", isVisible: true, required: false },
      { label: "Extra Tax", key: "extra_tax", isVisible: true, required: false },
      { label: "Further Tax", key: "further_tax", isVisible: true, required: false },
      { label: "FED", key: "fed", isVisible: true, required: false },
      { label: "SRO Schedule", key: "sro_schedule", isVisible: true, required: false },
      { label: "SRO Serial", key: "sro_serial", isVisible: true, required: false },
      { label: "Total", key: "line_total", isVisible: true, required: true },
    ],

    totals: [
      { label: "Subtotal", key: "subtotal", isVisible: true, required: true },
      { label: "Total Discount", key: "total_discount", isVisible: true, required: false },
      { label: "Total Other Discount", key: "total_other_discount", isVisible: true, required: false },
      { label: "Total Trade Discount", key: "total_trade_discount", isVisible: true, required: false },
      { label: "Total Taxes (Charged)", key: "total_taxes", isVisible: true, required: false },
      { label: "Sales Tax (Applicable)", key: "sales_tax_applicable", isVisible: true, required: false },
      { label: "Extra Tax", key: "extra_tax_total", isVisible: true, required: false },
      { label: "Further Tax", key: "further_tax_total", isVisible: true, required: false },
      { label: "FED Payable", key: "fed_payable", isVisible: true, required: false },
      { label: "Sales Tax Withheld at Source", key: "sales_tax_withheld", isVisible: true, required: false },
      { label: "236G", key: "tax_236g", isVisible: true, required: false },
      { label: "236H", key: "tax_236h", isVisible: true, required: false },
    ],
  },
};

const Settings: React.FC = () => {
  const { updateSettings } = useAuth();
  const toast = useAppToast();
  const { showLoader, hideLoader } = useGlobalLoader();

  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'Dollar ($)');
  const [showSuccess, setShowSuccess] = useState(false);
  const [configs, setConfigs] = useState(SETTINGS_CONFIG);
  const [activeConfigKey, setActiveConfigKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users/settings');
      if (!data) return;
      
      if (data.configs && Object.keys(data.configs).length > 0) {
        setConfigs({ ...SETTINGS_CONFIG, ...data.configs });
      } else {
        setConfigs(SETTINGS_CONFIG);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    showLoader();
    try {
      const { data } = await api.patch('/users/settings', { settings: { configs } });

      updateSettings({ configs });

      toast.success("Saved settings succcessfully!");
    } catch (error) {
      console.error("Failed to save Settings", error);
      toast.error(error.response?.data?.message || error.message || 'Failed to export data!');
    } finally {
      hideLoader();
    }
  };

  const openConfigModal = (configType) => {
    setActiveConfigKey(configType);
  };

  return (
    <>
      { isLoading ? (
        <Loader />
      ): (
      <>
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                <SettingsIcon className="text-indigo-600" size={32} />
                System Settings
              </h1>
              <p className="text-slate-500 mt-1">Configure global preferences and document formats.</p>
            </div>
            <Button onClick={handleSave} icon={<Save size={18} />} className="px-8 h-12 rounded-xl">
              Save All Changes
            </Button>
          </div>

          <div className="space-y-12">
            {/* Localization Section */}
            <section>
              <SectionHeader icon={<Globe size={18} />} title="Localization" />
              <Card className="p-8">
                <div className="max-w-md flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shrink-0">
                    <Coins size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Preferred Currency</p>
                    <Select 
                      options={CURRENCY_OPTIONS} 
                      value={currency} 
                      onChange={setCurrency} 
                    />
                  </div>
                </div>
              </Card>
            </section>

            {/* Formats Section */}
            <section>
              <SectionHeader icon={<Palette size={18} />} title="Document Formats & Fields" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormatCard 
                  title="Invoice Fields" 
                  description="Toggle visibility for Tax IDs, Discounts, and Due Dates."
                  icon={<ClipboardList className="text-blue-600" />}
                  onClick={() => console.log('Open Invoice Fields')}
                />

                <FormatCard 
                  title="Invoice Format" 
                  description="Customize layout style, company branding, and typography."
                  icon={<LayoutPanelLeft className="text-indigo-600" />}
                  onClick={() => openConfigModal('invoicePreview')}
                />

                <FormatCard 
                  title="Invoices Report" 
                  description="Set default columns and filters for billing exports."
                  icon={<FileText className="text-violet-600" />}
                  onClick={() => console.log('Open Invoices Report')}
                />
                
                <FormatCard 
                  title="Buyer Fields" 
                  description="Configure customer data points like Phone, VAT, or Address."
                  icon={<Contact2 className="text-emerald-600" />}
                  onClick={() => console.log('Open Buyer Fields')}
                />

                <FormatCard 
                  title="Buyers Report" 
                  description="Customize demographic data and history in generated reports."
                  icon={<Users className="text-sky-600" />}
                  onClick={() => console.log('Open Buyers Report')}
                />
              </div>
            </section>

            {/* System & Privacy */}
            <section className="opacity-50 grayscale">
              <SectionHeader icon={<SettingsIcon size={18} />} title="Advanced System" />
              <Card className="p-12 flex flex-col items-center justify-center border-dashed">
                <p className="text-sm font-medium text-slate-400">Additional system configurations will appear here.</p>
              </Card>
            </section>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700"
              >
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Settings Saved</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ConfigModal
          isOpen={!!activeConfigKey}
          config={activeConfigKey ? configs[activeConfigKey] : null}
          onClose={() => setActiveConfigKey(null)}
          onSave={(updatedSubConfig) => {
            setConfigs((prev) => ({
              ...prev,
              [activeConfigKey!]: updatedSubConfig,
            }));

            setActiveConfigKey(null);
          }}
        />
      </>
      )}
    </>
  );
};

// --- Helper Components ---

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-slate-400">{icon}</span>
    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
  </div>
);

const FormatCard = ({ title, description, icon, onClick }: any) => (
  <Card 
    onClick={onClick}
    className="p-6 cursor-pointer hover:shadow-sm hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
  >
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
        {title}
        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </h4>
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      {React.cloneElement(icon as React.ReactElement, { size: 80 })}
    </div>
  </Card>
);

export default Settings;