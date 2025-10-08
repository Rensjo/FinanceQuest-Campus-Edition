import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar, Link2 } from 'lucide-react';
import { Goal } from '../types';
import { useBudget } from '../store/budget';
import { StyledDropdown } from './StyledDropdown';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal; // If provided, we're editing
}

export default function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const { addGoal, updateGoal, envelopes } = useBudget();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [linkedEnvelopeId, setLinkedEnvelopeId] = useState('');

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setTargetDate(goal.targetDate || '');
      setLinkedEnvelopeId(goal.linkedEnvelopeId || '');
    } else {
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setLinkedEnvelopeId('');
    }
  }, [goal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(targetAmount);
    if (!name.trim() || isNaN(amount) || amount <= 0) return;

    if (goal) {
      // Edit existing goal
      updateGoal(goal.id, {
        name: name.trim(),
        targetAmount: amount,
        targetDate: targetDate || undefined,
        linkedEnvelopeId: linkedEnvelopeId || undefined,
      });
    } else {
      // Add new goal
      addGoal({
        name: name.trim(),
        targetAmount: amount,
        targetDate: targetDate || undefined,
        linkedEnvelopeId: linkedEnvelopeId || undefined,
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
            borderColor: '#06b6d440',
            boxShadow: '0 0 60px #06b6d430, 0 20px 40px rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 0%, #06b6d440, transparent 70%)',
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
                  background: '#06b6d420',
                  border: '2px solid #06b6d440',
                  boxShadow: '0 0 20px #06b6d430',
                }}
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="size-5 text-cyan-400" />
              </motion.div>
              {goal ? 'Edit Goal' : 'New Savings Goal'}
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
            {/* Goal Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <Target className="size-4" />
                Goal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Laptop Fund, Emergency Savings, Vacation"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                style={{
                  boxShadow: '0 0 0 0 #06b6d420',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 20px #06b6d420';
                  e.target.style.borderColor = '#06b6d4';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '0 0 0 0';
                }}
                required
              />
            </div>

            {/* Target Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <DollarSign className="size-4" />
                Target Amount
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                required
              />
            </div>

            {/* Target Date (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <Calendar className="size-4" />
                Target Date <span className="text-xs text-neutral-500">(Optional)</span>
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
              />
            </div>

            {/* Linked Envelope (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-neutral-300">
                <Link2 className="size-4" />
                Link to Category <span className="text-xs text-neutral-500">(Optional)</span>
              </label>
              <StyledDropdown
                value={linkedEnvelopeId}
                onChange={setLinkedEnvelopeId}
                options={[
                  { value: '', label: 'None', icon: <X className="w-4 h-4" /> },
                  ...envelopes.map(env => ({
                    value: env.id,
                    label: env.name,
                    icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: env.color }} />
                  }))
                ]}
                placeholder="Select category"
              />
              <p className="text-xs text-neutral-500">
                Link this goal to a budget category to track related savings
              </p>
            </div>

            {/* Info box */}
            {goal && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-sm text-neutral-300">
                  💰 Current Savings: <span className="font-bold text-cyan-400">₱{goal.saved.toLocaleString()}</span>
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Use the "Add to Goal" feature on the dashboard to contribute funds
                </p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: '0 0 30px #06b6d440, 0 10px 20px rgba(0,0,0,0.3)',
              }}
            >
              {goal ? '💾 Save Changes' : '✨ Create Goal'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
