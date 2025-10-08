/**
 * Monthly Budget Overview Component
 * Shows: Left to Spend, Budget vs Actual, Breakdown Pie Chart
 * Optimized with React.memo and useMemo for better performance
 */

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { isThisMonth } from '../utils/date';
import QuickAdd from './QuickAdd';
import { useMemo, memo } from 'react';

interface MonthlyOverviewProps {
  selectedDate?: Date;
}

function MonthlyOverview({ selectedDate = new Date() }: MonthlyOverviewProps) {
  const { envelopes, transactions, prefs, getTotalMonthlyBudget } = useBudget(s => ({
    envelopes: s.envelopes,
    transactions: s.transactions,
    prefs: s.prefs,
    getTotalMonthlyBudget: s.getTotalMonthlyBudget,
  }));

  // Memoize expensive calculations to prevent recalculation on every render
  const { monthlyBudget, selectedMonthExpenses, selectedMonthIncome } = useMemo(() => {
    const totalMonthlyBudget = getTotalMonthlyBudget();
    const budget = totalMonthlyBudget > 0 ? totalMonthlyBudget : envelopes.reduce((sum, e) => sum + e.monthlyBudget, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { monthlyBudget: budget, selectedMonthExpenses: expenses, selectedMonthIncome: income };
  }, [getTotalMonthlyBudget, envelopes, transactions]);
  
  const spent = selectedMonthExpenses;
  const totalAvailable = monthlyBudget + selectedMonthIncome;
  const leftToSpend = totalAvailable - spent;
  const spentPercentage = totalAvailable > 0 ? Math.round((spent / totalAvailable) * 100) : 0;

  // Memoize budget vs actual data calculation
  const budgetVsActual = useMemo(() => {
    return envelopes.map(e => {
      const envelopeExpenses = transactions
        .filter(t => t.type === 'expense' && t.envelopeId === e.id)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        name: e.name,
        budget: e.monthlyBudget,
        actual: envelopeExpenses,
        color: e.color,
      };
    });
  }, [envelopes, transactions]);

  // Memoize breakdown data calculation
  const breakdownData = useMemo(() => {
    return envelopes
      .map(e => {
        const envelopeExpenses = transactions
          .filter(t => t.type === 'expense' && t.envelopeId === e.id)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        return {
          name: e.name,
          value: envelopeExpenses,
          color: e.color,
        };
      })
      .filter(d => d.value > 0);
  }, [envelopes, transactions]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{payload[0].payload.name}</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {formatCurrency(payload[0].value, prefs.locale, prefs.currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6" style={{ minHeight: '280px' }}>
      {/* LEFT TO SPEND - Hero Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-brand-500/20 dark:to-emerald-500/20 border-emerald-300 dark:border-brand-500/30 relative overflow-hidden"
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              💰 Left to Spend
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-200 dark:bg-brand-500/30 text-emerald-700 dark:text-brand-300">
              {new Date().toLocaleString('default', { month: 'long' })}
            </span>
          </div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className={`text-5xl font-bold mb-2 ${
              leftToSpend >= monthlyBudget * 0.3 ? 'text-emerald-600 dark:text-emerald-400' :
              leftToSpend >= monthlyBudget * 0.1 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(leftToSpend, prefs.locale, prefs.currency)}
          </motion.div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div>
              <span className="text-neutral-600 dark:text-neutral-500">Budget: </span>
              <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{formatCurrency(monthlyBudget)}</span>
            </div>
            {selectedMonthIncome > 0 && (
              <>
                <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
                <div>
                  <span className="text-neutral-600 dark:text-neutral-500">+Funds: </span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{formatCurrency(selectedMonthIncome)}</span>
                </div>
              </>
            )}
            <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-500">Spent: </span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{formatCurrency(spent)}</span>
            </div>
          </div>

          {/* Progress bar showing spending */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
              <span>{spentPercentage}% spent</span>
              <span>{100 - spentPercentage}% remaining</span>
            </div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: spentPercentage > 90 ? 'linear-gradient(90deg, #f87171, #ef4444)' :
                             spentPercentage > 70 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' :
                             'linear-gradient(90deg, #10b981, #06b6d4)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${spentPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Progress ring */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-neutral-200 dark:text-neutral-800"
                  />
                  <motion.circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-brand-500"
                    initial={{ strokeDasharray: '0 100' }}
                    animate={{ strokeDasharray: `${100 - spentPercentage} 100` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {100 - spentPercentage}%
                </div>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Remaining
              </div>
            </div>

            <div className="text-right text-xs text-neutral-600 dark:text-neutral-500">
              {spentPercentage}% spent
            </div>
          </div>
        </div>
      </motion.div>

      {/* BUDGET VS ACTUAL - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">📊 Budget vs Actual</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-brand-500/30 border border-brand-500" />
              <span className="text-neutral-600 dark:text-neutral-400">Budget</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" />
              <span className="text-neutral-600 dark:text-neutral-400">Actual</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={budgetVsActual}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: prefs.theme === 'light' ? '#475569' : '#a3a3a3' }}
              stroke={prefs.theme === 'light' ? '#d1d5db' : '#525252'}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: prefs.theme === 'light' ? '#475569' : '#a3a3a3' }}
              stroke={prefs.theme === 'light' ? '#d1d5db' : '#525252'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="budget" fill="#10b981" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="#f43f5e" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* BREAKDOWN PIE CHART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card flex flex-col"
      >
        <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">🥧 Spending Breakdown</h3>
        
        {breakdownData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend - Dynamic height based on content */}
            <div className="mt-3 space-y-1.5">
              {breakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-neutral-800 dark:text-neutral-300">{item.name}</span>
                  </div>
                  <span className="font-medium text-xs text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12 text-neutral-600 dark:text-neutral-500 text-sm">
            <div className="text-center">
              <div className="text-4xl mb-2 opacity-30">📊</div>
              <p>No spending yet this month</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* STATS GRID & QUICK ADD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 flex flex-col gap-4"
        style={{ overflow: 'visible' }}
      >
        {/* Income, Expenses, Balance Stats */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="card bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-500/10 dark:to-cyan-500/5 border-cyan-300 dark:border-cyan-500/30 p-4 h-40">
            <div className="text-xs text-cyan-700 dark:text-cyan-400 mb-1.5 uppercase tracking-wider">Income</div>
            <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-300">
              {formatCurrency(monthlyBudget)}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-500/10 dark:to-rose-500/5 border-rose-300 dark:border-rose-500/30 p-4 h-40">
            <div className="text-xs text-rose-700 dark:text-rose-400 mb-1.5 uppercase tracking-wider">Expenses</div>
            <div className="text-2xl font-bold text-rose-800 dark:text-rose-300">
              {formatCurrency(spent)}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/10 dark:to-emerald-500/5 border-emerald-300 dark:border-emerald-500/30 p-4 h-40">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1.5 uppercase tracking-wider">Balance</div>
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
              {formatCurrency(leftToSpend)}
            </div>
          </div>
        </div>

        {/* Quick Add Transaction */}
        <div className="card relative flex flex-col overflow-visible" style={{ position: 'relative', zIndex: 10 }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 dark:opacity-50" />
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span>⚡</span> 
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">Quick Add Transaction</span>
          </h2>
          <div className="overflow-x-clip">
            <QuickAdd />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(MonthlyOverview);
