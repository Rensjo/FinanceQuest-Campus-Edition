import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, TrendingUp, PiggyBank, Briefcase, Wallet } from 'lucide-react';
import type { MonthlyBudgetConfig, IncomeSource, IncomeFrequency } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<MonthlyBudgetConfig, 'id'>) => void;
  editingBudget?: MonthlyBudgetConfig | null;
}

const sourceIcons: Record<IncomeSource, JSX.Element> = {
  allowance: <Wallet className="size-5" />,
  income: <Briefcase className="size-5" />,
  'passive-income': <TrendingUp className="size-5" />,
  pension: <PiggyBank className="size-5" />,
  other: <DollarSign className="size-5" />,
};

const sourceLabels: Record<IncomeSource, string> = {
  allowance: 'Allowance',
  income: 'Income/Salary',
  'passive-income': 'Passive Income',
  pension: 'Pension',
  other: 'Other',
};

const sourceColors: Record<IncomeSource, string> = {
  allowance: '#10b981',
  income: '#06b6d4',
  'passive-income': '#a855f7',
  pension: '#f59e0b',
  other: '#64748b',
};

export default function BudgetConfigModal({ isOpen, onClose, onSave, editingBudget }: Props) {
  const [amount, setAmount] = useState(editingBudget?.amount.toString() || '');
  const [source, setSource] = useState<IncomeSource>(editingBudget?.source || 'allowance');
  const [frequency, setFrequency] = useState<IncomeFrequency>(editingBudget?.frequency || 'monthly');
  const [label, setLabel] = useState(editingBudget?.label || '');
  const [enabled, setEnabled] = useState(editingBudget?.enabled ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    onSave({
      amount: amountNum,
      source,
      frequency,
      label: label || sourceLabels[source],
      enabled,
    });

    // Reset form
    setAmount('');
    setSource('allowance');
    setFrequency('monthly');
    setLabel('');
    setEnabled(true);
  };

  // Calculate monthly equivalent
  const getMonthlyEquivalent = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    
    if (frequency === 'weekly') return amountNum * 4.33;
    if (frequency === 'biweekly') return amountNum * 2.17;
    return amountNum;
  };

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.3)',
              }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(6, 182, 212, 0.2) 50%, transparent 70%)',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />

              <div className="relative bg-neutral-900/95 backdrop-blur-xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="p-2 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                      }}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(6, 182, 212, 0.3)',
                          '0 0 30px rgba(6, 182, 212, 0.5)',
                          '0 0 20px rgba(6, 182, 212, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <DollarSign className="size-5 text-cyan-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-cyan-400">
                        {editingBudget ? 'Edit' : 'Add'} Budget Source
                      </h2>
                      <p className="text-xs text-neutral-400">Configure your monthly income</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <X className="size-5 text-neutral-400" />
                  </motion.button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
                  {/* Income Source Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      Income Source
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(sourceLabels) as IncomeSource[]).map((src) => (
                        <motion.button
                          key={src}
                          type="button"
                          onClick={() => setSource(src)}
                          className="relative p-3 rounded-xl text-left transition-all"
                          style={{
                            background:
                              source === src
                                ? `linear-gradient(135deg, ${sourceColors[src]}20, ${sourceColors[src]}10)`
                                : 'rgba(0, 0, 0, 0.3)',
                            border: `2px solid ${source === src ? sourceColors[src] : 'transparent'}`,
                            boxShadow: source === src ? `0 0 20px ${sourceColors[src]}40` : 'none',
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-1.5 mb-1" style={{ color: sourceColors[src] }}>
                            {sourceIcons[src]}
                          </div>
                          <div className="text-xs font-bold text-neutral-200">{sourceLabels[src]}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      Amount (₱)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-800/50 border-2 border-cyan-500/30 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors text-base font-semibold"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['weekly', 'biweekly', 'monthly'] as IncomeFrequency[]).map((freq) => (
                        <motion.button
                          key={freq}
                          type="button"
                          onClick={() => setFrequency(freq)}
                          className="p-2.5 rounded-xl text-center font-bold transition-all capitalize text-sm"
                          style={{
                            background:
                              frequency === freq
                                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2))'
                                : 'rgba(0, 0, 0, 0.3)',
                            border: `2px solid ${frequency === freq ? '#06b6d4' : 'transparent'}`,
                            color: frequency === freq ? '#06b6d4' : '#94a3b8',
                            boxShadow: frequency === freq ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {freq}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Label */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      Custom Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder={`e.g., ${sourceLabels[source]}`}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-800/50 border-2 border-cyan-500/30 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                    />
                  </div>

                  {/* Monthly Equivalent Display */}
                  {frequency !== 'monthly' && amount && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(6, 182, 212, 0.1))',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">Monthly Equivalent:</span>
                        <span className="text-base font-black text-purple-400">
                          ₱{getMonthlyEquivalent().toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Enable Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/30">
                    <div>
                      <div className="text-sm font-semibold text-neutral-200">Enable this budget source</div>
                      <div className="text-xs text-neutral-400">Include in total monthly budget calculation</div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setEnabled(!enabled)}
                      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{
                        background: enabled
                          ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                          : 'rgba(100, 116, 139, 0.3)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ left: enabled ? '26px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                      }}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingBudget ? 'Update' : 'Add'} Budget
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
