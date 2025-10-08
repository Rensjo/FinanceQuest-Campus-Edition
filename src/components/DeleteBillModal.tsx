/**
 * Delete Bill Confirmation Modal
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { RecurringRule } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bill: RecurringRule | null;
}

export default function DeleteBillModal({ isOpen, onClose, onConfirm, bill }: Props) {
  if (!bill) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
                borderColor: '#ef444440',
                boxShadow: '0 0 60px #ef444430, 0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, #ef444440, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10 p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-center mb-2">Delete Bill?</h3>
              <div className="text-neutral-400 text-center mb-6 space-y-3">
                <p>
                  Are you sure you want to delete <span className="font-semibold text-neutral-200">"{bill.label}"</span>? 
                  This action cannot be undone.
                </p>
                {bill.isDefault && (
                  <p className="text-xs px-3 py-2 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-200">
                    This is a seeded default bill. Deleting it won't break anything, but it will no longer appear automatically. You can re-add it manually later.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
