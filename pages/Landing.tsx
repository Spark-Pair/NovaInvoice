
import React from 'react';
import { motion } from 'framer-motion';
// Link is imported from react-router-dom to handle navigation
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, BarChart3, Globe } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { Theme } from '../types';

interface LandingProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Landing: React.FC<LandingProps> = ({ theme, toggleTheme }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#060812] overflow-hidden transition-colors duration-300 dotted-bg">
    <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto z-10 relative">
      <div className="flex items-center gap-3 font-black text-2xl text-indigo-600 tracking-tighter">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Zap size={20} fill="currentColor" />
        </div>
        NovaInvoice
      </div>
      <div className="flex gap-6 items-center">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Log In</Link>
        <Link to="/login"><Button className="rounded-2xl px-6 h-11 text-xs uppercase tracking-widest font-black shadow-xl shadow-indigo-500/10">Get Started</Button></Link>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center flex flex-col items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
      >
        Trusted by 10,000+ growing businesses
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900 dark:text-white"
      >
        Invoicing for the <br />
        <span className="text-indigo-600 bg-clip-text">Modern</span> Business.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium"
      >
        The most beautiful, automated invoicing platform ever built. <br className="hidden md:block" />
        Scale your revenue with world-class design and smart insights.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/login">
          <Button className="px-12 h-16 text-sm rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30" icon={<ArrowRight size={18} />}>
            Start Free Trial
          </Button>
        </Link>
        <Button variant="secondary" className="px-12 h-16 text-sm rounded-[2rem] font-black uppercase tracking-widest bg-white dark:bg-slate-900">
          Book a Demo
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
      >
        {[
          { icon: <ShieldCheck size={28} />, title: "Secure Data", desc: "Enterprise-grade encryption for all your financial documents." },
          { icon: <Globe size={28} />, title: "Global Ready", desc: "Multi-currency and localized taxation for international trade." },
          { icon: <BarChart3 size={28} />, title: "Smart Insights", desc: "AI-driven analytics to predict cash flow and growth patterns." }
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-left shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{feat.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </motion.div>
    </main>

    {/* Background Decorative Elements */}
    <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
  </div>
);

export default Landing;
