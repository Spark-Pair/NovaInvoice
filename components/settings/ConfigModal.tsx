import React, { useMemo } from 'react';
import { Modal } from '../Modal';

const formatSectionName = (section: string) =>
  section.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const getChanges = (config = {}, originalConfig = {}) => {
  const changes = [];

  Object.entries(config || {}).forEach(([section, fields]: [string, any[]]) => {
    const originalFields = originalConfig?.[section] || [];

    fields.forEach((field) => {
      const originalField = originalFields.find((entry) => entry.key === field.key);

      if (!originalField || originalField.isVisible === field.isVisible) return;

      changes.push({
        section,
        label: field.label,
        isVisible: field.isVisible,
      });
    });
  });

  return changes;
};

export const ConfigModal = ({ isOpen, config, originalConfig, onClose, onChange }) => {
  const changes = useMemo(
    () => getChanges(config, originalConfig),
    [config, originalConfig]
  );

  const handleToggle = (section, key) => {
    onChange({
      ...config,
      [section]: config[section].map((field) =>
        field.key === key ? { ...field, isVisible: !field.isVisible } : field
      ),
    });
  };

  if (!isOpen || !config) return null;

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Invoice Format"
    >
      <div className="p-1">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-bold text-amber-900">
              {changes.length} unsaved {changes.length === 1 ? 'update' : 'updates'}
            </p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
              Saved when you click Save All Changes
            </span>
          </div>
          <p className="mt-2 text-sm text-amber-800">
            Select which fields should appear on your invoice. Required fields stay locked on.
          </p>
          {changes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {changes.map((change) => (
                <span
                  key={`${change.section}-${change.label}`}
                  className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900"
                >
                  {formatSectionName(change.section)}: {change.label} {change.isVisible ? 'shown' : 'hidden'}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {Object.entries(config).map(([section, fields]: [string, any[]]) => (
            <section key={section} className="border-b border-slate-200 pb-6 last:border-b-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  {formatSectionName(section)}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {fields.filter((field) => {
                    const originalField = originalConfig?.[section]?.find((entry) => entry.key === field.key);
                    return originalField && originalField.isVisible !== field.isVisible;
                  }).length}{' '}
                  unsaved
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fields.map((field) => {
                  const originalField = originalConfig?.[section]?.find((entry) => entry.key === field.key);
                  const isUpdated = !!originalField && originalField.isVisible !== field.isVisible;

                  return (
                    <div
                      key={field.key}
                      className={`rounded-xl border p-3 transition-all ${
                        field.isVisible
                          ? 'border-blue-100 bg-blue-50/50'
                          : 'border-gray-100 bg-gray-50'
                      } ${isUpdated ? 'ring-2 ring-amber-200' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="ml-1 text-red-500">*</span>}
                          </span>
                        </div>

                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={field.isVisible}
                            disabled={field.required}
                            onChange={() => handleToggle(section, field.key)}
                          />
                          <div className={`peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 ${field.required ? 'cursor-not-allowed opacity-50' : ''}`}></div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Modal>
  );
};
