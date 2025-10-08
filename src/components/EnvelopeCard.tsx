import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { Envelope } from '../types';
import { formatCurrency } from '../utils/currency';
import { useBudget } from '../store/budget';

interface EnvelopeCardProps {
  envelope: Envelope;
  onEdit: (envelope: Envelope) => void;
  onDelete: (envelope: Envelope) => void;
}

export default function EnvelopeCard({ envelope, onEdit, onDelete }: EnvelopeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { prefs } = useBudget();
  
  // Calculate percentage, handle division by zero
  const pct = envelope.monthlyBudget > 0 
    ? Math.max(0, Math.min(100, Math.round((envelope.balance / envelope.monthlyBudget) * 100)))
    : 0;

  return (
    <motion.div
      className="card group relative overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        border: `1px solid ${envelope.color}20`,
      }}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${envelope.color}15, transparent 70%)`,
        }}
      />

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
              onClick={() => onEdit(envelope)}
              className="p-2 rounded-lg backdrop-blur-xl border transition-all duration-200"
              style={{
                background: `${envelope.color}20`,
                borderColor: `${envelope.color}40`,
                boxShadow: `0 0 20px ${envelope.color}30`,
              }}
            >
              <Pencil className="size-3.5" style={{ color: envelope.color }} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(envelope)}
              className="p-2 rounded-lg bg-rose-500/20 backdrop-blur-xl border border-rose-500/40 transition-all duration-200 hover:bg-rose-500/30"
              style={{
                boxShadow: `0 0 20px #f43f5e30`,
              }}
            >
              <Trash2 className="size-3.5 text-rose-400" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content */}
      <div className="relative z-0">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <motion.div
              className="size-3 rounded-full"
              style={{ background: envelope.color }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {envelope.name}
          </div>
          <span
            className="badge px-3 py-1 text-xs font-bold"
            style={{
              borderColor: envelope.color,
              background: `${envelope.color}15`,
              color: envelope.color,
              boxShadow: `0 0 10px ${envelope.color}30`,
            }}
          >
            {pct}%
          </span>
        </div>

        <div className="mt-3 text-3xl font-bold tracking-tight" style={{ color: envelope.color }}>
          {formatCurrency(envelope.balance, prefs.locale, prefs.currency)}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            Budget: <span className={`font-medium ${envelope.monthlyBudget === 0 ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
              {envelope.monthlyBudget === 0 ? 'Not Set' : formatCurrency(envelope.monthlyBudget, prefs.locale, prefs.currency)}
            </span>
          </div>
          
          {/* Carryover badge - moved here to avoid overlap */}
          {envelope.carryOver && (
            <motion.div 
              className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-300/60 dark:border-cyan-500/40 font-medium flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <span>↻</span> Rolls Over
            </motion.div>
          )}
        </div>

        {/* Progress bar with glow or message when budget is 0 */}
        <div className="mt-4">
          {envelope.monthlyBudget === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 rounded-lg border border-amber-300/40 dark:border-amber-500/20"
            >
              📝 Click edit to set your budget
            </motion.div>
          ) : (
            <div className="h-2.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800/50 overflow-hidden border border-neutral-300/60 dark:border-neutral-700/50">
              <motion.div
                className="h-full relative"
                style={{
                  background: `linear-gradient(90deg, ${envelope.color}, ${envelope.color}dd)`,
                  boxShadow: `0 0 10px ${envelope.color}80`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${envelope.color}40, transparent)`,
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}