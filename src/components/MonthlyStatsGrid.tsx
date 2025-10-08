import { motion } from 'framer-motion';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';

export default function MonthlyStatsGrid() {
  const { envelopes, getTotalMonthlyBudget } = useBudget(s => ({
    envelopes: s.envelopes,
    getTotalMonthlyBudget: s.getTotalMonthlyBudget,
  }));

  // Calculate monthly totals using configured budget
  const totalMonthlyBudget = getTotalMonthlyBudget();
  const monthlyBudget = totalMonthlyBudget > 0 ? totalMonthlyBudget : envelopes.reduce((sum, e) => sum + e.monthlyBudget, 0);
  const totalSpent = envelopes.reduce((sum, e) => sum + (e.monthlyBudget - e.balance), 0);
  const leftToSpend = monthlyBudget - totalSpent;
  const spent = totalSpent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-3 gap-4"
    >
      <div className="card bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
        <div className="text-xs text-cyan-400 mb-1 uppercase tracking-wider">Income</div>
        <div className="text-2xl font-bold text-cyan-300">
          {formatCurrency(monthlyBudget)}
        </div>
      </div>

      <div className="card bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30">
        <div className="text-xs text-rose-400 mb-1 uppercase tracking-wider">Expenses</div>
        <div className="text-2xl font-bold text-rose-300">
          {formatCurrency(spent)}
        </div>
      </div>

      <div className="card bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
        <div className="text-xs text-emerald-400 mb-1 uppercase tracking-wider">Balance</div>
        <div className="text-2xl font-bold text-emerald-300">
          {formatCurrency(leftToSpend)}
        </div>
      </div>
    </motion.div>
  );
}
