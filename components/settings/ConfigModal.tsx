import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';

export const ConfigModal = ({ isOpen, config, onClose, onSave }) => {
  // Use local state to keep track of changes before saving
  const [localConfig, setLocalConfig] = useState(config);

  const handleToggle = (section, key) => {
    setLocalConfig((prev) => ({
      ...prev,
      [section]: prev[section].map((field) =>
        field.key === key ? { ...field, isVisible: !field.isVisible } : field
      ),
    }));
  };

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!localConfig) return null;

  const getModalName = () => {
    return "Invoice Format";
  }

  return (
    <Modal 
      size="5xl" 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Customize Invoice Format"
    >
      <div className="p-1">
        <p className="text-gray-500 mb-6">
          Select which fields should appear on your professional invoice. Fields marked with 
          <span className="text-red-500 ml-1">*</span> are required by default.
        </p>

        <div className="space-y-8">
          {Object.entries(localConfig).map(([section, fields]) => (
            <section key={section} className="border-b pb-6 last:border-b-0">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                {section} Settings
              </h3>
              
              {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <div 
                    key={field.key} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      field.isVisible ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </div>

                    {/* Custom Toggle Slider */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.isVisible}
                        disabled={field.required} // Prevent hiding required fields
                        onChange={() => handleToggle(section, field.key)}
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${field.required ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                Cancel
            </button>
            <button 
                onClick={() => onSave(localConfig)}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
                Apply Changes
            </button>
        </div>
      </div>
    </Modal>
  );
};