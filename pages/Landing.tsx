
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { Theme } from '../types';

interface LandingProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Landing: React.FC<LandingProps> = ({ theme, toggleTheme }) => (
  <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
    <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
        <Zap fill="currentColor" /> NovaInvoice
      </div>
      <div className="flex gap-4 items-center">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <Link to="/login"><Button variant="ghost">Log In</Button></Link>
        <Link to="/login"><Button>Get Started</Button></Link>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-6 pt-20 text-center flex flex-col items-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
      >
        Invoicing for the <span className="text-indigo-600">Modern</span> Business.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10"
      >
        The most beautiful, automated invoicing platform ever built. Scale your revenue with world-class design.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/login">
          <Button className="px-10 py-4 text-lg rounded-3xl" icon={<ArrowRight size={20} />}>Start Free Trial</Button>
        </Link>
      </motion.div>
    </main>
  </div>
);

export default Landing;
