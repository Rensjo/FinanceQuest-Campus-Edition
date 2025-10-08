import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, DollarSign, Wallet, Briefcase, TrendingUp, PiggyBank } from 'lucide-react';
import { useBudget } from '../store/budget';
import type { IncomeSource, MonthlyBudgetConfig } from '../types';

interface Props {
  onAddNew: () => void;
  onEdit: (budget: MonthlyBudgetConfig) => void;
  onDelete: (id: string) => void;
}

const sourceIcons: Record<IncomeSource, JSX.Element> = {
  allowance: <Wallet className="size-4" />,
  income: <Briefcase className="size-4" />,
  'passive-income': <TrendingUp className="size-4" />,
  pension: <PiggyBank className="size-4" />,
  other: <DollarSign className="size-4" />,
};

const sourceColors: Record<IncomeSource, string> = {
  allowance: '#10b981',
  income: '#06b6d4',
  'passive-income': '#a855f7',
  pension: '#f59e0b',
  other: '#64748b',
};

const frequencyLabels = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
};

export default function BudgetSourceCard({ onAddNew, onEdit, onDelete }: Props) {
  const monthlyBudgets = useBudget((s) => s.monthlyBudgets);
  const getTotalMonthlyBudget = useBudget((s) => s.getTotalMonthlyBudget);

  const totalMonthly = getTotalMonthlyBudget();

  return (
    <div className="flex flex-col h-full">
      {/* Total Monthly Budget Display - STATIC */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-6 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          border: '2px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
          }}
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-neutral-400 font-semibold uppercase tracking-wider">
              Total Monthly Budget
            </div>
            <motion.button
              onClick={onAddNew}
              className="p-2 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="size-4 text-cyan-400" />
            </motion.button>
          </div>
          
          <motion.div
            className="text-4xl font-black"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ₱{totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>
          <div className="text-sm text-emerald-400 font-semibold mt-1">
            {monthlyBudgets.filter(b => b.enabled).length} active source{monthlyBudgets.filter(b => b.enabled).length !== 1 ? 's' : ''}
          </div>
        </div>
      </motion.div>

      {/* Budget Sources List - SCROLLABLE */}
      {monthlyBudgets.length > 0 && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-neutral-600 mt-4 pr-2">
          <div className="space-y-3">
          {monthlyBudgets.map((budget, index) => {
            const monthlyAmount = 
              budget.frequency === 'weekly' ? budget.amount * 4.33 :
              budget.frequency === 'biweekly' ? budget.amount * 2.17 :
              budget.amount;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl p-4"
                style={{
                  background: budget.enabled
                    ? `linear-gradient(135deg, ${sourceColors[budget.source]}15, ${sourceColors[budget.source]}08)`
                    : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${budget.enabled ? `${sourceColors[budget.source]}40` : 'rgba(100, 116, 139, 0.3)'}`,
                  opacity: budget.enabled ? 1 : 0.6,
                }}
              >
                {/* Hover shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  }}
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Icon */}
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        background: `${sourceColors[budget.source]}20`,
                        color: sourceColors[budget.source],
                      }}
                    >
                      {sourceIcons[budget.source]}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-bold text-neutral-200 text-sm">
                        {budget.label}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span style={{ color: sourceColors[budget.source] }}>
                          ₱{budget.amount.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{frequencyLabels[budget.frequency]}</span>
                        {budget.frequency !== 'monthly' && (
                          <>
                            <span>→</span>
                            <span className="font-semibold" style={{ color: sourceColors[budget.source] }}>
                              ₱{monthlyAmount.toFixed(0)}/mo
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => onEdit(budget)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-cyan-500/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 className="size-4 text-cyan-400" />
                      </motion.button>
                      <motion.button
                        onClick={() => onDelete(budget.id)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-500/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="size-4 text-rose-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      )}

      {monthlyBudgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-neutral-700"
        >
          <DollarSign className="size-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 mb-4">No budget sources configured</p>
          <motion.button
            onClick={onAddNew}
            className="px-6 py-2 rounded-lg font-semibold"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: 'white',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Your First Budget Source
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
