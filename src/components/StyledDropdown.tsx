import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const StyledDropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} style={{ zIndex: isOpen ? 200 : 'auto' }}>
      {/* Dropdown Button */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 
          bg-white dark:bg-neutral-900/50
          border border-neutral-300 dark:border-neutral-700/30
          rounded-xl
          text-left text-neutral-900 dark:text-neutral-100
          hover:bg-neutral-50 dark:hover:bg-neutral-800/60
          hover:border-neutral-400 dark:hover:border-neutral-600/60
          focus:outline-none focus:ring-2 focus:ring-emerald-500/20
          transition-all duration-200
          backdrop-blur-sm
          shadow-sm hover:shadow-md
          flex items-center justify-between gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              {selectedOption.icon}
            </span>
          )}
          <span className={`${selectedOption ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'} truncate`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-neutral-600 dark:text-neutral-500" />
        </motion.div>
      </motion.button>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[500]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute top-full left-0 mt-2 z-[1000]
              bg-white dark:bg-neutral-900/80
              backdrop-blur-lg
              border border-neutral-300 dark:border-neutral-700/30
              rounded-xl
              shadow-xl shadow-black/10 dark:shadow-black/30
              overflow-hidden
              max-h-64 overflow-y-auto
              min-w-[250px]
              scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent
            `}
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left
                  flex items-center gap-3
                  text-neutral-900 dark:text-neutral-100
                  hover:bg-emerald-500/20 dark:hover:bg-emerald-500/10
                  hover:text-emerald-600 dark:hover:text-emerald-400
                  transition-all duration-150
                  border-b border-neutral-200 dark:border-neutral-700/30 last:border-b-0
                  ${value === option.value ? 'bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : ''}
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                {option.icon && (
                  <span className="text-current opacity-70">
                    {option.icon}
                  </span>
                )}
                <span className="font-medium">{option.label}</span>
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
