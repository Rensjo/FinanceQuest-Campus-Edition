import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Envelope } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  envelope: Envelope | null;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, envelope }: DeleteConfirmModalProps) {
  if (!isOpen || !envelope) return null;

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
          className="relative w-full max-w-md rounded-2xl border border-rose-500/40 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1c0f14 0%, #2d1319 100%)',
            boxShadow: '0 0 60px #f43f5e30, 0 20px 40px rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated danger background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 0%, #f43f5e40, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Danger icon */}
          <div className="relative z-10 flex justify-center pt-8">
            <motion.div
              className="size-20 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px #f43f5e30',
                  '0 0 40px #f43f5e50',
                  '0 0 20px #f43f5e30',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="size-10 text-rose-400" />
            </motion.div>
          </div>

          {/* Header */}
          <div className="relative z-10 text-center px-6 pt-6">
            <h2 className="text-2xl font-bold text-rose-400">Delete Category?</h2>
            <p className="text-neutral-400 mt-2">This action cannot be undone</p>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 space-y-4">
            {/* Category preview */}
            <motion.div
              className="p-4 rounded-xl border border-neutral-700 bg-neutral-900/50"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="size-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${envelope.color}20`,
                    border: `2px solid ${envelope.color}40`,
                  }}
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <div className="size-4 rounded-full" style={{ background: envelope.color }} />
                </motion.div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{envelope.name}</div>
                  <div className="text-sm text-neutral-400">
                    Budget: ₱{envelope.monthlyBudget.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Warning message */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <p className="text-sm text-neutral-300">
                ⚠️ All transactions associated with <span className="font-semibold text-white">"{envelope.name}"</span> will remain in your history, but this category will be permanently deleted.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #dc2626)',
                  boxShadow: '0 0 30px #f43f5e40, 0 10px 20px rgba(0,0,0,0.3)',
                }}
              >
                🗑️ Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
