/**
 * Bill Modal - Add/Edit Bills
 */

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBudget } from '../store/budget';
import { StyledDropdown } from './StyledDropdown';
import type { RecurringRule, Interval } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bill?: RecurringRule;
}

export default function BillModal({ isOpen, onClose, bill }: Props) {
  const { envelopes, accounts, addRecurring, updateRecurring } = useBudget(s => ({
    envelopes: s.envelopes,
    accounts: s.accounts,
    addRecurring: s.addRecurring,
    updateRecurring: s.updateRecurring,
  }));

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState<Interval>('monthly');
  const [nextRun, setNextRun] = useState('');
  const [envelopeId, setEnvelopeId] = useState('');
  const [accountId, setAccountId] = useState('cash');

  useEffect(() => {
    if (bill) {
      setLabel(bill.label);
      setAmount(bill.amount.toString());
      setInterval(bill.interval);
      setNextRun(bill.nextRun.split('T')[0]); // Extract date part
      setEnvelopeId(bill.envelopeId || '');
      setAccountId(bill.accountId);
    } else {
      // Reset form
      setLabel('');
      setAmount('');
      setInterval('monthly');
      setNextRun(new Date().toISOString().split('T')[0]);
      setEnvelopeId(envelopes[0]?.id || '');
      setAccountId('cash');
    }
  }, [bill, envelopes, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const billData = {
      label,
      amount: parseFloat(amount),
      interval,
      nextRun: new Date(nextRun).toISOString(),
      envelopeId: envelopeId || undefined,
      accountId,
      type: 'bill' as const,
    };

    if (bill) {
      updateRecurring(bill.id, billData);
    } else {
      addRecurring(billData);
    }

    onClose();
  };

  const intervalOptions = [
    { value: 'daily', label: 'Daily', icon: <span>📅</span> },
    { value: 'weekly', label: 'Weekly', icon: <span>📆</span> },
    { value: 'biweekly', label: 'Bi-weekly', icon: <span>🗓️</span> },
    { value: 'monthly', label: 'Monthly', icon: <span>📋</span> },
  ];

  const envelopeOptions = [
    { value: '', label: 'No Category', icon: <span>❌</span> },
    ...envelopes.map(e => ({
      value: e.id,
      label: e.name,
      icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
    }))
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
          />
          {/* Modal */}
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border overflow-visible shadow-2xl pointer-events-auto"
              style={{
                background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
                borderColor: '#a855f740',
                boxShadow: '0 0 60px #a855f730, 0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, #a855f740, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span>🧾</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {bill ? 'Edit Bill' : 'Add Bill'}
                  </span>
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Bill Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Bill Name
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Internet Bill, Electricity"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Amount (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Interval */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Frequency
                  </label>
                  <StyledDropdown
                    value={interval}
                    onChange={(val) => setInterval(val as Interval)}
                    options={intervalOptions}
                  />
                </div>

                {/* Next Due Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={nextRun}
                    onChange={(e) => setNextRun(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Category/Envelope */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Category (Optional)
                  </label>
                  <StyledDropdown
                    value={envelopeId}
                    onChange={setEnvelopeId}
                    options={envelopeOptions}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      boxShadow: '0 0 20px #a855f740',
                    }}
                  >
                    {bill ? 'Update Bill' : 'Add Bill'}
                  </button>
                </div>
              </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    typeof document !== 'undefined' ? document.body : (globalThis as any).document?.body
  );
}
