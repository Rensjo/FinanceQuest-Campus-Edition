import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, DollarSign, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { Envelope } from '../types';
import { useBudget } from '../store/budget';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  envelope?: Envelope; // If provided, we're editing
}

const PRESET_COLORS = [
  '#22c55e', // green
  '#06b6d4', // cyan
  '#a78bfa', // purple
  '#f97316', // orange
  '#10b981', // emerald
  '#64748b', // slate
  '#f43f5e', // rose
  '#eab308', // yellow
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f59e0b', // amber
];

export default function EnvelopeModal({ isOpen, onClose, envelope }: EnvelopeModalProps) {
  const { addEnvelope, updateEnvelope } = useBudget();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [carryOver, setCarryOver] = useState(true);

  useEffect(() => {
    if (envelope) {
      setName(envelope.name);
      setColor(envelope.color);
      setMonthlyBudget(envelope.monthlyBudget.toString());
      setCarryOver(envelope.carryOver);
    } else {
      setName('');
      setColor('#22c55e');
      setMonthlyBudget('');
      setCarryOver(true);
    }
  }, [envelope, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budget = parseFloat(monthlyBudget);
    // Allow 0 or positive values, just check if it's a valid number
    if (!name.trim() || isNaN(budget) || budget < 0) return;

    if (envelope) {
      // Edit existing envelope
      updateEnvelope(envelope.id, {
        name: name.trim(),
        color,
        monthlyBudget: budget,
        carryOver,
      });
    } else {
      // Add new envelope
      addEnvelope({
        name: name.trim(),
        color,
        monthlyBudget: budget,
        carryOver,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
            borderColor: `${color}40`,
            boxShadow: `0 0 60px ${color}30, 0 20px 40px rgba(0,0,0,0.5)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${color}40, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <motion.div
                className="size-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `${color}20`,
                  border: `2px solid ${color}40`,
                  boxShadow: `0 0 20px ${color}30`,
                }}
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Palette className="size-5" style={{ color }} />
              </motion.div>
              {envelope ? 'Edit Category' : 'New Category'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
            >
              <X className="size-5" />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <Tag className="size-4" />
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Food, Transport, Entertainment"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                style={{
                  boxShadow: `0 0 0 0 ${color}20`,
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 20px ${color}20`;
                  e.target.style.borderColor = color;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '0 0 0 0';
                }}
                required
              />
            </div>

            {/* Monthly Budget */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <DollarSign className="size-4" />
                Monthly Budget
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                required
              />
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <Palette className="size-4" />
                Category Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <motion.button
                    key={presetColor}
                    type="button"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setColor(presetColor)}
                    className="relative size-12 rounded-xl transition-all"
                    style={{
                      background: presetColor,
                      border: color === presetColor ? `3px solid white` : '2px solid transparent',
                      boxShadow: color === presetColor ? `0 0 20px ${presetColor}60` : `0 0 10px ${presetColor}30`,
                    }}
                  >
                    {color === presetColor && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 rounded-xl"
                        style={{
                          border: `2px solid white`,
                          boxShadow: `0 0 30px ${presetColor}`,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Carryover Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                {carryOver ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                Carry Over Unused Balance
              </label>
              <motion.button
                type="button"
                onClick={() => setCarryOver(!carryOver)}
                className="w-full flex items-center justify-between p-4 rounded-xl border transition-all"
                style={{
                  background: carryOver ? `${color}15` : 'rgba(38, 38, 38, 0.5)',
                  borderColor: carryOver ? `${color}40` : '#404040',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-sm">
                  {carryOver ? 'Unused balance will carry over to next month' : 'Reset to budget amount each month'}
                </span>
                <motion.div
                  className="relative w-14 h-7 rounded-full transition-colors"
                  style={{
                    background: carryOver ? color : '#404040',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ x: carryOver ? 28 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.div>
              </motion.button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                boxShadow: `0 0 30px ${color}40, 0 10px 20px rgba(0,0,0,0.3)`,
              }}
            >
              {envelope ? '💾 Save Changes' : '✨ Create Category'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
