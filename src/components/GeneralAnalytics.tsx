/**
 * General Analytics Component - Overview of financial health and patterns
 * Optimized with React.memo and useMemo for better performance
 */

import { motion } from 'framer-motion';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { TrendingUpIcon, TrendingDownIcon, AlertCircleIcon, CheckCircleIcon, PieChartIcon, WalletIcon, ArrowDownIcon, ArrowUpIcon, BarChart3Icon } from 'lucide-react';
import { useMemo, memo } from 'react';

function GeneralAnalytics() {
  const { transactions, prefs, monthlyBudgets, recurring, envelopes } = useBudget(s => ({
    transactions: s.transactions,
    prefs: s.prefs,
    monthlyBudgets: s.monthlyBudgets,
    recurring: s.recurring,
    envelopes: s.envelopes,
  }));

  // Memoize expensive calculations
  const analytics = useMemo(() => {
    // Calculate expected monthly income from budget configs
    const expectedMonthlyIncome = monthlyBudgets
      .filter(b => b.enabled)
      .reduce((sum, b) => {
        const multiplier = b.frequency === 'weekly' ? 4 : b.frequency === 'biweekly' ? 2 : 1;
        return sum + (b.amount * multiplier);
      }, 0);

    // Calculate actual income transactions
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

    return {
      expectedMonthlyIncome,
      actualIncomeTransactions,
      totalIncome,
      totalExpenses,
      netFlow,
      isPositive,
      expectedMonthlyBills
    };
  }, [transactions, monthlyBudgets, recurring]);

  const { totalIncome, totalExpenses, netFlow, isPositive, expectedMonthlyBills } = analytics;

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
      className="card relative overflow-hidden backdrop-blur-sm bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-700/20 shadow-md dark:shadow-2xl"
    >
      {/* Enhanced neon accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 dark:opacity-70" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-300 dark:border-purple-500/30">
            <BarChart3Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              General Analytics
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Financial health and spending patterns</p>
          </div>
        </div>
      </div>

      {/* Quick Financial Health Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden p-4 rounded-xl border backdrop-blur-sm mb-4 ${
          isPositive 
            ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 border-emerald-300 dark:border-emerald-500/30'
            : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-500/10 dark:to-red-500/5 border-red-300 dark:border-red-500/30'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg border ${
            isPositive 
              ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/30' 
              : 'bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-500/30'
          }`}>
            {isPositive ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-semibold mb-1 ${isPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
              Financial Health Check
            </div>
            <p className="text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed">
              {getInsightMessage()}
            </p>
            <div className="flex items-center gap-4 mt-3">
              {savingsRate > 0 && (
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  Savings Rate: <span className={`font-bold ${isPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                    {savingsRate.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Net: <span className={`font-bold ${isPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(netFlow, prefs.locale, prefs.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Monthly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden p-5 rounded-xl border border-purple-300 dark:border-purple-500/30 backdrop-blur-sm bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-500/10 dark:to-purple-500/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30">
              <WalletIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-700 dark:text-purple-300">Monthly Summary</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Current month overview</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-neutral-800 dark:text-neutral-300">Income</span>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalIncome, prefs.locale, prefs.currency)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
              <div className="flex items-center gap-2">
                <TrendingDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-neutral-800 dark:text-neutral-300">Expenses</span>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses, prefs.locale, prefs.currency)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-300 dark:border-purple-500/30">
              <div className="flex items-center gap-2">
                <span className="text-base">{isPositive ? '💰' : '⚠️'}</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Net Balance</span>
              </div>
              <span className={`text-base font-black ${isPositive ? 'text-cyan-700 dark:text-cyan-400' : 'text-orange-700 dark:text-orange-400'}`}>
                {isPositive ? '+' : ''}{formatCurrency(netFlow, prefs.locale, prefs.currency)}
              </span>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-300 dark:border-neutral-700/50">
              <div className="flex justify-between mb-1">
                <span>Bills Due</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">{formatCurrency(expectedMonthlyBills, prefs.locale, prefs.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transactions</span>
                <span className="font-semibold text-purple-700 dark:text-purple-400">{transactions.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden p-5 rounded-xl border border-cyan-300 dark:border-cyan-500/30 backdrop-blur-sm bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-500/10 dark:to-cyan-500/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30">
              <PieChartIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cyan-700 dark:text-cyan-300">Budget Performance</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Envelope health check</p>
            </div>
          </div>

          <div className="space-y-3">
            {(() => {
              const envelopesWithSpending = envelopes.map(env => {
                const spent = transactions
                  .filter(t => t.type === 'expense' && t.envelopeId === env.id)
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                return { ...env, spent };
              });

              const overBudget = envelopesWithSpending.filter(e => e.spent > e.monthlyBudget).length;
              const onTrack = envelopesWithSpending.filter(e => e.spent <= e.monthlyBudget && e.spent > 0).length;
              const unused = envelopesWithSpending.filter(e => e.spent === 0).length;

              const totalBudgeted = envelopes.reduce((sum, e) => sum + e.monthlyBudget, 0);
              const totalSpent = envelopesWithSpending.reduce((sum, e) => sum + e.spent, 0);
              const budgetUsage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

              return (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                      <span className="text-sm text-neutral-800 dark:text-neutral-300">Over Budget</span>
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{overBudget}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400"></div>
                      <span className="text-sm text-neutral-800 dark:text-neutral-300">On Track</span>
                    </div>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{onTrack}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-500 dark:bg-neutral-400"></div>
                      <span className="text-sm text-neutral-800 dark:text-neutral-300">Unused</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{unused}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-300 dark:border-neutral-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Total Budget Usage</span>
                      <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">{budgetUsage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(budgetUsage, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{
                          background: budgetUsage > 100
                            ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                            : 'linear-gradient(90deg, #06b6d4, #0891b2)',
                          boxShadow: budgetUsage > 100
                            ? '0 0 10px rgba(220, 38, 38, 0.5)'
                            : '0 0 10px rgba(6, 182, 212, 0.5)',
                        }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </motion.div>

        {/* Transaction Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden p-5 rounded-xl border border-orange-300 dark:border-orange-500/30 backdrop-blur-sm bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-500/10 dark:to-orange-500/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20 border border-orange-300 dark:border-orange-500/30">
              <BarChart3Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-orange-700 dark:text-orange-300">Transaction Activity</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Recent spending patterns</p>
            </div>
          </div>

          <div className="space-y-3">
            {(() => {
              const incomeTransactions = transactions.filter(t => t.type === 'income').length;
              const expenseTransactions = transactions.filter(t => t.type === 'expense').length;
              const avgExpenseAmount = expenseTransactions > 0 
                ? totalExpenses / expenseTransactions 
                : 0;

              // Get last 7 days transactions
              const now = new Date();
              const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              const recentTransactions = transactions.filter(t => new Date(t.date) >= last7Days);
              const recentExpenses = recentTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

              return (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm text-neutral-800 dark:text-neutral-300">Income Txns</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{incomeTransactions}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                      <TrendingDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-neutral-800 dark:text-neutral-300">Expense Txns</span>
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{expenseTransactions}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 border border-orange-300 dark:border-orange-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📊</span>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Avg. Expense</span>
                    </div>
                    <span className="text-sm font-black text-orange-700 dark:text-orange-400">
                      {formatCurrency(avgExpenseAmount, prefs.locale, prefs.currency)}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-300 dark:border-neutral-700/50">
                    <div className="flex justify-between mb-1">
                      <span>Last 7 Days Spent</span>
                      <span className="font-semibold text-orange-700 dark:text-orange-400">{formatCurrency(recentExpenses, prefs.locale, prefs.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Avg.</span>
                      <span className="font-semibold text-orange-700 dark:text-orange-400">{formatCurrency(recentExpenses / 7, prefs.locale, prefs.currency)}</span>
                    </div>
                  </div>
                </>
              );
            })()}
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
        <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-2">
          <span>Overall Flow Balance</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-300">
            {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(0) : 0}% spent
          </span>
        </div>
        <div className="relative h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">
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

// Export memoized component to prevent unnecessary re-renders
export default memo(GeneralAnalytics);
