
import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  Shield, 
  Palette, 
  Coins, 
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';

const CURRENCY_OPTIONS = ['Dollar ($)', 'Rs (₨)'];

const Settings: React.FC = () => {
  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'Dollar ($)');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('app_currency', currency);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <SettingsIcon className="text-indigo-600" size={32} />
            System Settings
          </h1>
          <p className="text-slate-500 mt-1">Configure your global workspace preferences and localization.</p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800"
            >
              <CheckCircle2 size={16} />
              Settings Saved Successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Localization Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <Globe size={18} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Localization & Currency</h3>
          </div>
          <Card className="p-8">
            <div className="max-w-md space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Preferred Currency Unit</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose the currency symbol to be used across the application for dashboards, reports, and generated documents.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/10">
                  <Coins size={24} />
                </div>
                <div className="flex-1">
                  <Select 
                    options={CURRENCY_OPTIONS}
                    value={currency}
                    onChange={setCurrency}
                    placeholder="Select currency..."
                  />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Display Section (Placeholder for symmetry) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <Palette size={18} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Appearance (System)</h3>
          </div>
          <Card className="p-8 opacity-60">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Compact Table View</p>
                <p className="text-xs text-slate-500">Reduce padding in lists for a more data-dense interface.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-not-allowed">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </Card>
        </section>

        {/* Notifications & Security (Placeholders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <Bell size={18} className="text-slate-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Alerts</h3>
            </div>
            <Card className="p-6 opacity-60 flex flex-col items-center justify-center text-center py-12">
               <Bell size={32} className="text-slate-300 mb-4" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notification Channels coming soon</p>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <Shield size={18} className="text-slate-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security</h3>
            </div>
            <Card className="p-6 opacity-60 flex flex-col items-center justify-center text-center py-12">
               <Shield size={32} className="text-slate-300 mb-4" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Multi-factor Authentication</p>
            </Card>
          </section>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <Button 
          onClick={handleSave} 
          icon={<Save size={18} />} 
          className="px-10 h-14 rounded-2xl shadow-xl shadow-indigo-500/20"
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
