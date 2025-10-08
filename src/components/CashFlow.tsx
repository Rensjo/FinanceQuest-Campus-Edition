/**
 * General Analytics Component - Overview of financial health and patterns
 */

import { motion } from 'framer-motion';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { TrendingUpIcon, TrendingDownIcon, AlertCircleIcon, CheckCircleIcon, PieChartIcon, WalletIcon, ArrowDownIcon, ArrowUpIcon, BarChart3Icon } from 'lucide-react';

export default function GeneralAnalytics() {
  const { transactions, prefs, monthlyBudgets, recurring, envelopes } = useBudget(s => ({
    transactions: s.transactions,
    prefs: s.prefs,
    monthlyBudgets: s.monthlyBudgets,
    recurring: s.recurring,
    envelopes: s.envelopes,
  }));

  // Note: transactions array now only contains data for the currently selected month
  // No need to filter by date anymore
  
  // Calculate expected monthly income from budget configs (this is the budgeted income)
  const expectedMonthlyIncome = monthlyBudgets
    .filter(b => b.enabled)
    .reduce((sum, b) => {
      const multiplier = b.frequency === 'weekly' ? 4 : b.frequency === 'biweekly' ? 2 : 1;
      return sum + (b.amount * multiplier);
    }, 0);

  // Use expected monthly income as the primary income source
  // Add actual income transactions on top of it
  const actualIncomeTransactions = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total income is the budgeted income plus any additional income transactions
  const totalIncome = expectedMonthlyIncome + actualIncomeTransactions;

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netFlow = totalIncome - totalExpenses;
  const isPositive = netFlow >= 0;

  // Calculate expected monthly expenses (bills)
  const expectedMonthlyBills = recurring
    .filter(r => r.type === 'bill')
    .reduce((sum, r) => sum + r.amount, 0);

  const savingsRate = totalIncome > 0 ? ((netFlow / totalIncome) * 100) : 0;

  // Quick insight message
  const getInsightMessage = () => {
    if (netFlow > 0) {
      if (savingsRate >= 20) {
        return "Excellent! You're saving over 20% of your income.";
      } else if (savingsRate >= 10) {
        return "Good job! You're maintaining positive cash flow.";
      } else {
        return "You're in the green, but consider increasing savings.";
      }
    } else if (netFlow === 0) {
      return "Breaking even. Try to build a buffer for emergencies.";
    } else {
      return "⚠️ Spending exceeds income. Review your expenses.";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card relative overflow-hidden backdrop-blur-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.9) 0%, rgba(38, 38, 38, 0.8) 100%)',
        border: '1px solid rgba(115, 115, 115, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Enhanced neon accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <BarChart3Icon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              General Analytics
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">Financial health and spending patterns</p>
          </div>
        </div>
      </div>

      {/* Quick Financial Health Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-4 rounded-xl border backdrop-blur-sm mb-4"
        style={{
          background: isPositive 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
          borderColor: isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          boxShadow: isPositive 
            ? '0 8px 32px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg border ${isPositive ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
            {isPositive ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircleIcon className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-semibold mb-1 ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
              Financial Health Check
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {getInsightMessage()}
            </p>
            <div className="flex items-center gap-4 mt-3">
              {savingsRate > 0 && (
                <div className="text-xs text-neutral-400">
                  Savings Rate: <span className={`font-bold ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                    {savingsRate.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="text-xs text-neutral-400">
                Net: <span className={`font-bold ${isPositive ? 'text-emerald-300' : 'text-orange-300'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(netFlow, prefs.locale, prefs.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Allocation & Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Income Sources Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden p-5 rounded-xl border backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(30, 30, 30, 0.6) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <ArrowDownIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-300">Income Sources</h3>
              <p className="text-xs text-neutral-400">Monthly budget breakdown</p>
            </div>
          </div>

          <div className="space-y-3">
            {monthlyBudgets.filter(b => b.enabled).length > 0 ? (
              <>
                {monthlyBudgets.filter(b => b.enabled).map((budget, index) => {
                  const monthlyAmount = budget.frequency === 'weekly' ? budget.amount * 4 : budget.frequency === 'biweekly' ? budget.amount * 2 : budget.amount;
                  const percentage = totalIncome > 0 ? (monthlyAmount / totalIncome) * 100 : 0;
                  
                  const sourceEmoji = budget.source === 'allowance' ? '👨‍👩‍👧' : budget.source === 'income' ? '💼' : budget.source === 'passive-income' ? '📈' : budget.source === 'pension' ? '🏦' : '💰';
                  const sourceLabel = budget.label || budget.source.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                  
                  return (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{sourceEmoji}</span>
                          <span className="text-sm font-medium text-neutral-200">{sourceLabel}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">
                          {formatCurrency(monthlyAmount, prefs.locale, prefs.currency)}
                        </span>
                      </div>
                      <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
                        />
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        {percentage.toFixed(1)}% of total • {budget.frequency}
                      </div>
                    </motion.div>
                  );
                })}
                
                {actualIncomeTransactions > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + monthlyBudgets.filter(b => b.enabled).length * 0.1 }}
                    className="relative pt-2 border-t border-neutral-700/50"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💸</span>
                        <span className="text-sm font-medium text-neutral-200">Additional Income</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">
                        {formatCurrency(actualIncomeTransactions, prefs.locale, prefs.currency)}
                      </span>
                    </div>
                    <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${totalIncome > 0 ? (actualIncomeTransactions / totalIncome) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + monthlyBudgets.filter(b => b.enabled).length * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500"
                        style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
                      />
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                      Extra earnings this month
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-neutral-400 text-sm">
                No budget sources configured
              </div>
            )}
          </div>
        </motion.div>

        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden p-5 rounded-xl border backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(30, 30, 30, 0.6) 100%)',
            borderColor: 'rgba(220, 38, 38, 0.25)',
            boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
              <ArrowUpIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-300">Spending by Category</h3>
              <p className="text-xs text-neutral-400">Envelope allocations</p>
            </div>
          </div>

          <div className="space-y-3">
            {envelopes.length > 0 ? (
              <>
                {envelopes
                  .filter(env => {
                    const spent = transactions
                      .filter(t => t.type === 'expense' && t.envelopeId === env.id)
                      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    return spent > 0 || env.monthlyBudget > 0;
                  })
                  .sort((a, b) => {
                    const spentA = transactions
                      .filter(t => t.type === 'expense' && t.envelopeId === a.id)
                      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    const spentB = transactions
                      .filter(t => t.type === 'expense' && t.envelopeId === b.id)
                      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    return spentB - spentA;
                  })
                  .slice(0, 5)
                  .map((envelope, index) => {
                    const spent = transactions
                      .filter(t => t.type === 'expense' && t.envelopeId === envelope.id)
                      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    const budgeted = envelope.monthlyBudget;
                    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
                    const isOverBudget = spent > budgeted;

                    return (
                      <motion.div
                        key={envelope.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="relative"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full border border-white/20" 
                              style={{ backgroundColor: envelope.color }}
                            />
                            <span className="text-sm font-medium text-neutral-200">{envelope.name}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-neutral-300'}`}>
                              {formatCurrency(spent, prefs.locale, prefs.currency)}
                            </span>
                            <span className="text-xs text-neutral-500"> / {formatCurrency(budgeted, prefs.locale, prefs.currency)}</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ 
                              background: isOverBudget 
                                ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                                : 'linear-gradient(90deg, #06b6d4, #0891b2)',
                              boxShadow: isOverBudget 
                                ? '0 0 10px rgba(220, 38, 38, 0.5)'
                                : '0 0 10px rgba(6, 182, 212, 0.5)'
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1">
                          {percentage.toFixed(1)}% used {isOverBudget && '• Over budget!'}
                        </div>
                      </motion.div>
                    );
                  })}
              </>
            ) : (
              <div className="text-center py-4 text-neutral-400 text-sm">
                No spending data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4"
      >
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span>Overall Flow Balance</span>
          <span className="font-semibold">
            {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(0) : 0}% spent
          </span>
        </div>
        <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: totalIncome > 0 
                ? `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` 
                : '0%' 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: totalExpenses > totalIncome
                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                : 'linear-gradient(90deg, #06b6d4, #0891b2)',
              boxShadow: totalExpenses > totalIncome
                ? '0 0 10px rgba(239, 68, 68, 0.5)'
                : '0 0 10px rgba(6, 182, 212, 0.5)',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
