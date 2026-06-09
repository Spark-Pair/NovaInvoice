import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';

interface SelectProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type DropdownPosition = {
  left: number;
  top?: number;
  bottom?: number;
  width: number;
  maxHeight: number;
  placement: 'top' | 'bottom';
};

const VIEWPORT_GAP = 8;
const PREFERRED_HEIGHT = 320;
const MIN_USEFUL_HEIGHT = 180;

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const currentIndex = filteredOptions.findIndex((option) => option === value);

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_GAP;
    const spaceAbove = rect.top - VIEWPORT_GAP;
    const placement =
      spaceBelow < MIN_USEFUL_HEIGHT && spaceAbove > spaceBelow ? 'top' : 'bottom';
    const availableHeight = placement === 'bottom' ? spaceBelow : spaceAbove;
    const maxHeight = Math.max(120, Math.min(PREFERRED_HEIGHT, availableHeight));
    const width = Math.min(rect.width, viewportWidth - VIEWPORT_GAP * 2);
    const left = Math.min(
      Math.max(VIEWPORT_GAP, rect.left),
      viewportWidth - width - VIEWPORT_GAP
    );
    setPosition({
      left,
      top: placement === 'bottom' ? rect.bottom + VIEWPORT_GAP : undefined,
      bottom:
        placement === 'top'
          ? viewportHeight - rect.top + VIEWPORT_GAP
          : undefined,
      width,
      maxHeight,
      placement,
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleViewportChange = () => updatePosition();
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen]);

  const handleKeyboard = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (!filteredOptions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex =
        currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
      onChange(filteredOptions[nextIndex]);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
      onChange(filteredOptions[previousIndex]);
    }
  };

  const dropdown =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {isOpen && position && (
              <motion.div
                ref={dropdownRef}
                initial={{
                  opacity: 0,
                  y: position.placement === 'bottom' ? 4 : -4,
                  scale: 0.98,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: position.placement === 'bottom' ? 4 : -4,
                  scale: 0.98,
                }}
                style={{
                  position: 'fixed',
                  left: position.left,
                  top: position.top,
                  bottom: position.bottom,
                  width: position.width,
                  maxHeight: position.maxHeight,
                }}
                className="z-[200] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                onKeyDown={handleKeyboard}
              >
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#080C1C] border-none rounded-lg text-sm focus:ring-0 outline-none"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                </div>

                <ul className="min-h-0 flex-1 overflow-y-auto p-1 custom-scrollbar">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <li
                        key={option}
                        onClick={() => {
                          onChange(option);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${
                          value === option
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        {option}
                        {value === option && <Check size={16} />}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-8 text-center text-sm text-slate-400">
                      No options found
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyboard}
      className={`flex flex-col gap-1.5 w-full ${className}`}
    >
      {label && (
        <label className="text-sm font-semibold text-slate-500 ml-1">
          {label}
        </label>
      )}

      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        className={`group flex items-center justify-between px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
        }`}
      >
        <span
          className={`text-sm truncate ${
            !value
              ? 'text-slate-400'
              : 'text-slate-900 dark:text-slate-100 font-medium'
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-indigo-500' : ''
          }`}
        />
      </div>

      {dropdown}
    </div>
  );
};
