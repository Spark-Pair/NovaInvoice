import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Upload, 
  Info, 
  X, 
  CheckCircle2, 
  Download, 
  AlertCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Modal } from '../Modal';
import { Button } from '../Button';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      onClose();
    }, 2000);
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Bulk Invoice Upload" 
        size="2xl"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button 
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors text-xs font-black uppercase tracking-widest"
            >
              <Download size={16} /> Download Template
            </button>
            <button 
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-xs font-black uppercase tracking-widest"
            >
              <Info size={16} /> Expected Format Details
            </button>
          </div>

          {/* Upload Area - Made fully clickable */}
          <div 
            className={`
              relative p-12 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 cursor-pointer
              ${dragActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30'}
              flex flex-col items-center justify-center text-center hover:border-indigo-400 dark:hover:border-indigo-600
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => onButtonClick()}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              className="hidden" 
              accept=".xlsx, .xls" 
              onChange={handleChange} 
            />
            
            <div className={`
              w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl transition-all
              ${file ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'}
            `}>
              {file ? <CheckCircle2 size={40} /> : <FileSpreadsheet size={40} />}
            </div>

            {file ? (
              <div className="space-y-2">
                <p className="font-bold text-slate-900 dark:text-white text-lg">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }} 
                  className="text-rose-500 text-xs font-bold uppercase tracking-widest mt-2 hover:underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">Upload Your Excel File</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">Drag and drop your Excel file here, or click to browse</p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Supports: .xlsx, .xls</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>Max size: 10MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} /> Before you upload:
            </h5>
            <ul className="space-y-2">
              {[
                "Ensure your Excel file contains invoice and buyer information",
                "Include columns for Invoice Number, Date, Buyer Name, and item details",
                "Multiple line items per invoice are supported",
                "First row should contain column headers"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
            <Button variant="secondary" className="flex-1 rounded-2xl h-14" onClick={onClose}>Discard</Button>
            <Button 
              className="flex-[2] rounded-2xl h-14 shadow-xl shadow-indigo-500/20" 
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading & Validating..." : "Process Bulk Invoices"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Nested Information Modal */}
      <Modal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
        title="Expected Excel Format" 
        size="2xl"
      >
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">Sample Template</h5>
                <p className="text-xs text-slate-500">Includes all required and optional columns</p>
              </div>
            </div>
            <Button variant="secondary" icon={<Download size={16} />} className="rounded-xl h-10 px-4 text-xs font-bold uppercase tracking-widest">
              Download Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                <ChevronRight size={14} /> Required Buyer Details:
              </h6>
              <ul className="space-y-2 pl-4 border-l-2 border-emerald-50 dark:border-emerald-900/30">
                {[
                  "Invoice Number", "Invoice Date", "Buyer Name", 
                  "Buyer NTN or CNIC (either one)", "Buyer Address", 
                  "Buyer Province", "Buyer Registration Type"
                ].map((item, i) => (
                  <li key={i} className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</li>
                ))}
              </ul>
              
              <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pt-2">
                <ChevronRight size={14} /> Optional Buyer Details:
              </h6>
              <ul className="space-y-2 pl-4 border-l-2 border-slate-50 dark:border-slate-800/30">
                {["Invoice Ref No", "Scenario ID"].map((item, i) => (
                  <li key={i} className="text-xs font-medium text-slate-500 dark:text-slate-500 italic">{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h6 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                <ChevronRight size={14} /> Required Invoice Items:
              </h6>
              <ul className="space-y-2 pl-4 border-l-2 border-indigo-50 dark:border-indigo-900/30">
                {[
                  "HS Code", "Product Description", "Rate", "UOM", 
                  "Quantity", "Value Sales Excluding ST", "Sales Tax Applicable", 
                  "Sales Tax Withheld At Source", "Fixed Notified Value Or Retail Price", 
                  "Total Values", "Sale Type"
                ].map((item, i) => (
                  <li key={i} className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</li>
                ))}
              </ul>

              <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pt-2">
                <ChevronRight size={14} /> Optional Invoice Items:
              </h6>
              <ul className="space-y-2 pl-4 border-l-2 border-slate-50 dark:border-slate-800/30">
                {[
                  "Extra Tax", "Further Tax", "SRO Schedule No", 
                  "Federal Excise Duty Payable", "Discount", "SRO Item Serial Number"
                ].map((item, i) => (
                  <li key={i} className="text-xs font-medium text-slate-500 dark:text-slate-500 italic">{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button variant="primary" className="rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest" onClick={() => setShowInfo(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};