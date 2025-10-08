/**
 * Month Navigator - Navigate between months with animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface MonthNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function MonthNavigator({ currentDate, onDateChange }: MonthNavigatorProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePreviousMonth = () => {
    setSlideDirection('left');
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    setSlideDirection('right');
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    onDateChange(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onDateChange(newDate);
    setIsDatePickerOpen(false);
  };

  const handleYearChange = (delta: number) => {
    const newDate = new Date(currentYear + delta, currentMonth, 1);
    onDateChange(newDate);
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative">
      {/* Main Month Display with Navigation Arrows */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Month Button */}
        <motion.button
          onClick={handlePreviousMonth}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 transition-colors"
          title="Previous Month"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </motion.button>

        {/* Month & Year Display (Clickable) */}
        <motion.button
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden"
        >
          <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={`${currentYear}-${currentMonth}`}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                {isCurrentMonth() && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    Current
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.button>

        {/* Next Month Button */}
        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 transition-colors"
          title="Next Month"
        >
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </motion.button>
      </div>

      {/* Date Picker Dropdown - Rendered via Portal */}
      {isDatePickerOpen && createPortal(
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDatePickerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />

            {/* Picker Panel - Fixed positioning to escape parent container constraints */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed z-[70] card bg-neutral-900/98 border-cyan-500/30 backdrop-blur-xl shadow-2xl p-6"
              style={{
                top: '50%',
                left: '50%',
                width: 'calc(100% - 2rem)',
                maxWidth: '400px'
              }}
            >
              {/* Year Selector */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-700">
                <motion.button
                  onClick={() => handleYearChange(-1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-400" />
                </motion.button>
                
                <span className="text-lg font-bold text-cyan-400">{currentYear}</span>
                
                <motion.button
                  onClick={() => handleYearChange(1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </motion.button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-2">
                {monthNames.map((month, index) => {
                  const isSelected = index === currentMonth;
                  const isCurrent = (() => {
                    const today = new Date();
                    return index === today.getMonth() && currentYear === today.getFullYear();
                  })();

                  return (
                    <motion.button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-500/50'
                          : isCurrent
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-neutral-800/50 text-neutral-300 border border-neutral-700 hover:bg-neutral-700/50 hover:border-neutral-600'
                      }`}
                    >
                      {month.slice(0, 3)}
                    </motion.button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-3 pt-3 border-t border-neutral-700">
                <motion.button
                  onClick={() => {
                    onDateChange(new Date());
                    setIsDatePickerOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-sm font-medium hover:border-green-400/50 transition-all"
                >
                  Go to Current Month
                </motion.button>
              </div>
            </motion.div>
          </>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
