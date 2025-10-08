/**
 * Expense Tracker - Detailed transaction history with filtering
 * Optimized with React.memo and useMemo for better performance
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, memo } from 'react';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { SearchIcon, FilterIcon, Calendar, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { StyledDropdown } from './StyledDropdown';

function ExpenseTracker() {
  const { transactions, envelopes, prefs } = useBudget(s => ({
    transactions: s.transactions,
    envelopes: s.envelopes,
    prefs: s.prefs,
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Memoize filtered and sorted transactions to avoid recalculation on every render
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesCategory = filterCategory === 'all' || t.envelopeId === filterCategory;
        return matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return b.amount - a.amount;
      });
  }, [transactions, filterCategory, sortBy]);

  const getEnvelopeName = (id?: string) => {
    return envelopes.find(e => e.id === id)?.name || 'Unknown';
  };

  const getEnvelopeColor = (id?: string) => {
    return envelopes.find(e => e.id === id)?.color || '#64748b';
  };

  return (
    <div className="card relative overflow-hidden flex flex-col h-full">
      {/* Neon accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 dark:opacity-50 light:opacity-30" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>📝</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 light:from-purple-600 light:to-pink-600 bg-clip-text text-transparent">Expense Tracker</span>
        </h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Category Filter */}
        <StyledDropdown
          value={filterCategory}
          onChange={setFilterCategory}
          options={[
            { value: 'all', label: 'All Categories', icon: <FilterIcon className="w-4 h-4" /> },
            ...envelopes.map(e => ({
              value: e.id,
              label: e.name,
              icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
            }))
          ]}
          placeholder="Filter by category"
        />

        {/* Sort */}
        <StyledDropdown
          value={sortBy}
          onChange={(val) => setSortBy(val as 'date' | 'amount')}
          options={[
            { value: 'date', label: 'Recent First', icon: <Calendar className="w-4 h-4" /> },
            { value: 'amount', label: 'By Amount', icon: <TrendingDown className="w-4 h-4" /> }
          ]}
          placeholder="Sort by"
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-300/40 dark:border-purple-500/20">
        <div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Total</div>
          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
            {filteredTransactions.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Income</div>
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(
              filteredTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0),
              prefs.locale,
              prefs.currency
            )}
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Expenses</div>
          <div className="text-lg font-bold text-rose-700 dark:text-rose-300">
            {formatCurrency(
              filteredTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0),
              prefs.locale,
              prefs.currency
            )}
          </div>
        </div>
      </div>

      {/* Transaction History - Scrollable */}
      <div className="flex-1 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700/50 bg-neutral-50 dark:bg-neutral-900/30 min-h-0">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 dark:hover:scrollbar-thumb-neutral-600">
          {filteredTransactions.length > 0 ? (
            <div className="space-y-1 p-2">
              <AnimatePresence>
                {filteredTransactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.01 }}
                    className="p-3 rounded-lg bg-white dark:bg-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border border-neutral-200 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Category & Date */}
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: getEnvelopeColor(txn.envelopeId) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200 truncate">
                            {txn.type === 'income' ? (
                              <span>
                                {txn.merchant || '💰 Additional Funds'}
                              </span>
                            ) : (
                              getEnvelopeName(txn.envelopeId)
                            )}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-500">
                            {format(new Date(txn.date), 'MMM dd, h:mm a')}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount */}
                      <div className={`text-sm font-bold flex-shrink-0 ${
                        txn.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}
                        {formatCurrency(txn.amount, prefs.locale, prefs.currency)}
                      </div>
                    </div>

                    {/* Details */}
                    {txn.type === 'income' ? (
                      <div className="mt-1 pl-5 text-xs text-emerald-600/80 dark:text-emerald-400/70">
                        <span className="font-medium">
                          {getEnvelopeName(txn.envelopeId)} • Additional Income
                        </span>
                      </div>
                    ) : (
                      (txn.merchant || txn.note) && (
                        <div className="mt-1 pl-5 text-xs text-neutral-600 dark:text-neutral-400 truncate">
                          {txn.merchant && <span className="font-medium">{txn.merchant}</span>}
                          {txn.merchant && txn.note && <span> • </span>}
                          {txn.note && <span>{txn.note}</span>}
                        </div>
                      )
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📝
              </motion.div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {filterCategory !== 'all'
                  ? 'No transactions in this category'
                  : 'No transactions yet. Start logging!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(ExpenseTracker);
