import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, TrendingUp, Plus, DollarSign, X } from 'lucide-react';
import { Goal } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatRelative } from '../utils/date';
import { useBudget } from '../store/budget';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');
  const { addToGoal, envelopes } = useBudget();
  
  const pct = Math.min(100, Math.round((goal.saved / goal.targetAmount) * 100));
  const remaining = goal.targetAmount - goal.saved;
  const isComplete = pct >= 100;
  
  // Find linked envelope if exists
  const linkedEnvelope = goal.linkedEnvelopeId 
    ? envelopes.find(e => e.id === goal.linkedEnvelopeId)
    : undefined;

  // Generate dynamic gradient based on progress
  const progressGradient = isComplete
    ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)'
    : 'linear-gradient(90deg, #10b981, #06b6d4)';

  const handleContribute = () => {
    const amount = parseFloat(contributeAmount);
    if (!isNaN(amount) && amount > 0) {
      addToGoal(goal.id, amount);
      setContributeAmount('');
      setShowContributeModal(false);
    }
  };

  return (
    <motion.div
      className="card group relative overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        border: isComplete ? '1px solid #10b98140' : '1px solid #06b6d420',
      }}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isComplete
            ? 'radial-gradient(circle at 50% 0%, #10b98115, transparent 70%)'
            : 'radial-gradient(circle at 50% 0%, #06b6d415, transparent 70%)',
        }}
      />

      {/* Success celebration effect for completed goals */}
      {isComplete && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </motion.div>
      )}

      {/* Floating action buttons */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 flex gap-1 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(goal)}
              className="p-2 rounded-lg backdrop-blur-xl border transition-all duration-200"
              style={{
                background: '#06b6d420',
                borderColor: '#06b6d440',
                boxShadow: '0 0 20px #06b6d430',
              }}
            >
              <Pencil className="size-3.5 text-cyan-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(goal)}
              className="p-2 rounded-lg bg-rose-500/20 backdrop-blur-xl border border-rose-500/40 transition-all duration-200 hover:bg-rose-500/30"
              style={{
                boxShadow: '0 0 20px #f43f5e30',
              }}
            >
              <Trash2 className="size-3.5 text-rose-400" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content */}
      <div className="relative z-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="font-semibold text-lg flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <motion.div
                animate={isComplete ? { rotate: [0, 360] } : { scale: [1, 1.2, 1] }}
                transition={
                  isComplete
                    ? { duration: 2, repeat: Infinity, ease: 'linear' }
                    : { duration: 2, repeat: Infinity }
                }
              >
                {isComplete ? '🎉' : '🎯'}
              </motion.div>
              {goal.name}
            </div>
            {goal.targetDate && (
              <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 block">
                📅 {formatRelative(goal.targetDate)}
              </span>
            )}
            {linkedEnvelope && (
              <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: linkedEnvelope.color }}
                />
                Linked to {linkedEnvelope.name}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: isComplete ? '#10b981' : '#06b6d4' }}
            >
              {formatCurrency(goal.saved)}
            </span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              of <span className="text-neutral-700 dark:text-neutral-300 font-medium">{formatCurrency(goal.targetAmount)}</span>
            </span>
          </div>

          {/* Progress bar with glow */}
          <div className="relative">
            <div className="h-3 rounded-full bg-neutral-200/70 dark:bg-neutral-800/50 overflow-hidden border border-neutral-300/60 dark:border-neutral-700/50">
              <motion.div
                className="h-full relative"
                style={{
                  background: progressGradient,
                  boxShadow: isComplete ? '0 0 15px #10b98180' : '0 0 10px #06b6d480',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: isComplete
                      ? 'linear-gradient(90deg, transparent, #10b98140, transparent)'
                      : 'linear-gradient(90deg, transparent, #06b6d440, transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>

            {/* Percentage badge */}
            <motion.div
              className="absolute -top-1 -right-1 text-[10px] px-2 py-0.5 rounded-full font-bold border"
              style={{
                background: isComplete ? '#10b98120' : '#06b6d420',
                borderColor: isComplete ? '#10b98140' : '#06b6d440',
                color: isComplete ? '#10b981' : '#06b6d4',
                boxShadow: isComplete ? '0 0 10px #10b98130' : '0 0 10px #06b6d430',
              }}
              animate={{ scale: isComplete ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1.5, repeat: isComplete ? Infinity : 0 }}
            >
              {pct}%
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-xs">
            {remaining > 0 ? (
              <>
                <span className="text-neutral-400 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  {formatCurrency(remaining)} to go
                </span>
              </>
            ) : (
              <motion.span
                className="text-emerald-400 font-bold flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Goal reached! 🎉
              </motion.span>
            )}
          </div>

          {/* Contribute Button */}
          {!isComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowContributeModal(true)}
              className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #10b98120, #06b6d420)',
                borderColor: '#06b6d450',
                color: '#06b6d4',
                boxShadow: '0 0 20px #06b6d420',
              }}
            >
              <Plus className="size-4" />
              Contribute to Goal
            </motion.button>
          )}
        </div>
      </div>

      {/* Contribute Modal - Using Portal to render at root level */}
      {showContributeModal && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowContributeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-md rounded-2xl border-2 p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
                borderColor: '#06b6d450',
                boxShadow: '0 0 60px #06b6d430',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 opacity-20 rounded-2xl"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, #06b6d440, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        boxShadow: '0 0 20px #06b6d440',
                      }}
                    >
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Contribute to Goal</h3>
                      <p className="text-xs text-neutral-400">{goal.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContributeModal(false)}
                    className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                {/* Goal Progress Info */}
                <div className="mb-6 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-400">Current Progress</span>
                    <span className="text-sm font-bold text-brand-400">{pct}%</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-neutral-400">Saved:</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(goal.saved)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Remaining:</span>
                    <span className="font-bold text-cyan-400">{formatCurrency(remaining)}</span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Amount to Contribute
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">₱</span>
                    <input
                      type="number"
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border-2 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
                      style={{
                        borderColor: '#06b6d420',
                      }}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleContribute();
                      }}
                    />
                  </div>
                  
                  {/* Quick amount buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[100, 500, 1000, 5000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setContributeAmount(amt.toString())}
                        className="py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 hover:scale-105"
                        style={{
                          background: '#06b6d410',
                          borderColor: '#06b6d430',
                          color: '#06b6d4',
                        }}
                      >
                        ₱{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowContributeModal(false)}
                    className="flex-1 py-3 rounded-xl font-semibold border-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContribute}
                    disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                    className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      boxShadow: '0 4px 20px #06b6d440',
                    }}
                  >
                    Contribute
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}