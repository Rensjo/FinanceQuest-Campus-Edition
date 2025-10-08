import { PieChartComponent } from './PieChartComponent';
import { motion } from 'framer-motion';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';

// This component renders only the Spending Breakdown Pie Chart from MonthlyOverview
export default function MonthlyOverviewBreakdownOnly() {
  const { envelopes, prefs } = useBudget(s => ({
    envelopes: s.envelopes,
    prefs: s.prefs,
  }));

  // Breakdown by category (only spent amounts)
  const breakdownData = envelopes
    .map(e => ({
      name: e.name,
      value: e.monthlyBudget - e.balance,
      color: e.color,
    }))
    .filter(d => d.value > 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-xs text-neutral-400">
            {formatCurrency(payload[0].value, prefs.locale, prefs.currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-4">🥧 Spending Breakdown</h3>
      {breakdownData.length > 0 ? (
        <div className="flex-1 flex flex-col justify-center">
          <div style={{ width: '100%', height: 200 }}>
            <PieChartComponent breakdownData={breakdownData} CustomTooltip={CustomTooltip} />
          </div>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-neutral-500 text-sm">
          No spending yet this month
        </div>
      )}
      {/* Legend */}
      <div className="mt-4 space-y-2">
        {breakdownData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral-300">{item.name}</span>
            </div>
            <span className="font-medium">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
