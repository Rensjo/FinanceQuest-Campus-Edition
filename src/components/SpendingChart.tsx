/**
 * Spending Chart - Line/Area chart showing spending over time
 */

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';

export default function SpendingChart() {
  const { transactions, prefs } = useBudget(s => ({
    transactions: s.transactions,
    prefs: s.prefs,
  }));

  // Generate daily spending data for current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dailyData = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactions.filter(t => 
      t.type === 'expense' && format(new Date(t.date), 'yyyy-MM-dd') === dayStr
    );
    
    const spent = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date: format(day, 'MMM dd'),
      spent,
      count: dayTransactions.length,
    };
  });

  // Calculate cumulative spending
  let cumulative = 0;
  const cumulativeData = dailyData.map(d => {
    cumulative += d.spent;
    return {
      ...d,
      cumulative,
    };
  });

  const totalSpent = cumulative;
  const avgDaily = totalSpent / dailyData.length;
  const highestDay = Math.max(...dailyData.map(d => d.spent));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{payload[0].payload.date}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Daily: {formatCurrency(payload[0].payload.spent, prefs.locale, prefs.currency)}
          </p>
          <p className="text-xs text-cyan-600 dark:text-cyan-400">
            Total: {formatCurrency(payload[0].payload.cumulative, prefs.locale, prefs.currency)}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-500">
            {payload[0].payload.count} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          📈 Spending Chart
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/50 dark:bg-emerald-500/30" />
            <span className="text-neutral-600 dark:text-neutral-400">Daily</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-cyan-500/50 dark:bg-cyan-500/30" />
            <span className="text-neutral-600 dark:text-neutral-400">Cumulative</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-500/10 dark:to-rose-500/5 border border-rose-300/50 dark:border-rose-500/30"
        >
          <div className="text-xs text-rose-600 dark:text-rose-400 mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            {formatCurrency(totalSpent, prefs.locale, prefs.currency)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/10 dark:to-amber-500/5 border border-amber-300/50 dark:border-amber-500/30"
        >
          <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Avg per Day</div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {formatCurrency(avgDaily, prefs.locale, prefs.currency)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-500/10 dark:to-purple-500/5 border border-purple-300/50 dark:border-purple-500/30"
        >
          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Highest Day</div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {formatCurrency(highestDay, prefs.locale, prefs.currency)}
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900/30 p-4 border border-neutral-200 dark:border-neutral-800">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cumulativeData}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-300 dark:stroke-neutral-700" />
            <XAxis 
              dataKey="date" 
              className="fill-neutral-600 dark:fill-neutral-400"
              tick={{ fontSize: 10 }}
              interval={Math.floor(dailyData.length / 6)}
            />
            <YAxis 
              className="fill-neutral-600 dark:fill-neutral-400"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorSpent)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#colorCumulative)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
          <div className="text-sm font-medium mb-2">💡 Spending Pattern</div>
          <p className="text-xs text-neutral-400">
            {avgDaily > 0
              ? `You're spending an average of ${formatCurrency(avgDaily)} per day this month.`
              : 'No spending recorded yet this month.'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
          <div className="text-sm font-medium mb-2">🎯 Budget Pace</div>
          <p className="text-xs text-neutral-400">
            {totalSpent > 0
              ? `At this rate, you'll spend ${formatCurrency(avgDaily * 30)} this month.`
              : 'Start logging transactions to see your budget pace.'}
          </p>
        </div>
      </div>
    </div>
  );
}
