/**
 * Bills Section - Track recurring bills with due dates
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useBudget } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { daysUntil, formatRelative } from '../utils/date';
import { AlertCircleIcon, CheckCircleIcon, ClockIcon, Edit2, Trash2, CheckCheck, Plus } from 'lucide-react';
import BillModal from './BillModal';
import DeleteBillModal from './DeleteBillModal';
import type { RecurringRule } from '../types';

export default function BillsSection() {
  const { recurring, prefs, deleteRecurring, markBillPaid, restoreDefaultBills, trackSectionView } = useBudget(s => ({
    recurring: s.recurring,
    prefs: s.prefs,
    deleteRecurring: s.deleteRecurring,
    markBillPaid: s.markBillPaid,
    restoreDefaultBills: s.restoreDefaultBills,
    trackSectionView: s.trackSectionView,
  }));

  // Track quest completion when bills section is viewed
  useEffect(() => {
    trackSectionView('bills');
  }, [trackSectionView]);

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<RecurringRule | undefined>(undefined);
  const [deletingBill, setDeletingBill] = useState<RecurringRule | null>(null);

  const bills = recurring.filter(r => r.type === 'bill');

  // Sort by due date
  const sortedBills = [...bills].sort((a, b) => {
    return daysUntil(a.nextRun) - daysUntil(b.nextRun);
  });

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const upcomingBills = bills.filter(b => daysUntil(b.nextRun) <= 7 && daysUntil(b.nextRun) >= 0);
  const overdueBills = bills.filter(b => daysUntil(b.nextRun) < 0);

  const getBillStatus = (days: number) => {
    if (days < 0) return 'overdue';
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'upcoming';
    return 'scheduled';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'urgent': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'upcoming': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      default: return 'text-neutral-400 bg-neutral-800/50 border-neutral-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertCircleIcon className="w-4 h-4" />;
      case 'urgent': return <ClockIcon className="w-4 h-4" />;
      case 'upcoming': return <ClockIcon className="w-4 h-4" />;
      default: return <CheckCircleIcon className="w-4 h-4" />;
    }
  };

  const handleAddBill = () => {
    setEditingBill(undefined);
    setIsBillModalOpen(true);
  };

  const handleEditBill = (bill: RecurringRule) => {
    setEditingBill(bill);
    setIsBillModalOpen(true);
  };

  const handleDeleteBill = (bill: RecurringRule) => {
    setDeletingBill(bill);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingBill) {
      deleteRecurring(deletingBill.id);
      setDeletingBill(null);
    }
  };

  const handleMarkPaid = (bill: RecurringRule) => {
    markBillPaid(bill.id);
  };

  const handleRestoreDefaults = () => {
    restoreDefaultBills();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card relative overflow-hidden backdrop-blur-sm"
      style={{
        maxHeight: '1200px',
      }}
    >
      {/* Enhanced neon accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70 dark:opacity-70 light:opacity-40" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/20 dark:to-pink-500/20 light:from-purple-200 light:to-pink-200 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-300/50">
            <span className="text-xl">🧾</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 light:from-purple-600 light:via-pink-600 light:to-purple-600 bg-clip-text text-transparent">
              Bills & Payments
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">Track recurring expenses • Click edit to set amounts</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddBill}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.4), 0 8px 16px rgba(0,0,0,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Bill</span>
        </motion.button>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-4 rounded-xl border backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
            borderColor: 'rgba(147, 51, 234, 0.3)',
            boxShadow: '0 8px 32px rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <span className="text-base">💰</span>
              </div>
              <div className="text-xs text-purple-300 font-semibold uppercase tracking-wide">Monthly Total</div>
            </div>
          </div>
          <div className="text-3xl font-black text-purple-300 mb-2 leading-none">
            {formatCurrency(totalBills, prefs.locale, prefs.currency)}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-xs text-neutral-400">
              <span className="text-purple-300 font-bold text-sm">{bills.length}</span> {bills.length === 1 ? 'bill' : 'bills'} tracked
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden p-4 rounded-xl border backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <span className="text-base">📅</span>
              </div>
              <div className="text-xs text-cyan-300 font-semibold uppercase tracking-wide">Due This Week</div>
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-300 mb-2 leading-none">
            {upcomingBills.length}
          </div>
          <div className="text-xs text-neutral-400">
            Total: <span className="text-cyan-300 font-bold text-sm">{formatCurrency(upcomingBills.reduce((sum, b) => sum + b.amount, 0))}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden p-4 rounded-xl border backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -3 }}
          style={{
            background: overdueBills.length > 0 
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
            borderColor: overdueBills.length > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
            boxShadow: overdueBills.length > 0 
              ? '0 8px 32px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg border ${overdueBills.length > 0 ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                <span className="text-base">{overdueBills.length > 0 ? '⚠️' : '✅'}</span>
              </div>
              <div className={`text-xs font-semibold uppercase tracking-wide ${overdueBills.length > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                {overdueBills.length > 0 ? 'Overdue' : 'Status'}
              </div>
            </div>
          </div>
          <div className={`text-3xl font-black mb-2 leading-none ${overdueBills.length > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
            {overdueBills.length}
          </div>
          <div className="text-xs text-neutral-400">
            {overdueBills.length > 0 ? (
              <span className="text-red-300 font-semibold">⚠️ Needs attention</span>
            ) : (
              <span className="text-emerald-300 font-semibold">✓ All caught up</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Bills List with Scrolling */}
      {sortedBills.length > 0 ? (
        <div className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 pr-2">
          <div className="space-y-3 pb-3">
            {sortedBills.map((bill, index) => {
              const days = daysUntil(bill.nextRun);
              const status = getBillStatus(days);
              const statusColor = getStatusColor(status);

              return (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`group p-2.5 rounded-xl border transition-all relative backdrop-blur-sm ${statusColor}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.6) 0%, rgba(38, 38, 38, 0.4) 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    marginTop: '6px',
                    marginRight: '4px',
                  }}
                >
                  {/* Enhanced hover shimmer */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                    }}
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Floating Edit & Delete Buttons - Top Right Corner (Circular, overflowing) */}
                  <div className="absolute -top-1.5 -right-1.5 flex gap-1.5 opacity-0 group-hover:opacity-80 transition-all duration-200 z-30 pointer-events-auto">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBill(bill);
                      }}
                      className="p-1.5 rounded-full border-2 border-white transition-all shadow-lg backdrop-blur-sm"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                        boxShadow: '0 2px 6px rgba(6, 182, 212, 0.6)',
                      }}
                      whileHover={{ scale: 1.2, opacity: 1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3 text-white" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBill(bill);
                      }}
                      className="p-1.5 rounded-full border-2 border-white transition-all shadow-lg backdrop-blur-sm"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.6)',
                      }}
                      whileHover={{ scale: 1.2, opacity: 1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </motion.button>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    {/* Status Icon */}
                    <div className={`p-1.5 rounded-lg ${statusColor} flex-shrink-0 shadow-sm`}>
                      {getStatusIcon(status)}
                    </div>

                    {/* Bill Name & Badge */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-200 text-sm truncate">{bill.label}</div>
                      {bill.isDefault && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-semibold bg-indigo-200 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-200 border border-indigo-400 dark:border-indigo-400/30 shadow-sm uppercase tracking-wide flex-shrink-0">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="flex-shrink-0 text-right mr-1">
                      {bill.amount === 0 ? (
                        <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <span>Not Set</span>
                        </div>
                      ) : (
                        <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(bill.amount, prefs.locale, prefs.currency)}
                        </div>
                      )}
                    </div>

                    {/* Mark as Paid Button - Always Visible */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkPaid(bill);
                      }}
                      className="flex-shrink-0 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-500/60 transition-all shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Mark as Paid"
                    >
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-6 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700/50 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800/20 dark:to-neutral-900/40 backdrop-blur-sm"
        >
          <div className="text-center mb-4">
            <motion.div 
              className="text-3xl mb-2"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              🧾
            </motion.div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-200 mb-1">Set Up Your Bills</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Click on any bill below to add it to your tracker. You'll set the amount, due date, and category.
            </p>
          </div>

          {/* Simplified Default Bills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto">
            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '⚡ Electricity Bill',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'buffer',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-purple-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">⚡</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Electricity Bill</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '💧 Water Bill',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'buffer',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-cyan-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">💧</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Water Bill</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '📡 Internet Bill',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'buffer',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-blue-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">📡</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Internet Bill</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '🏠 Rent/Boarding',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'buffer',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-green-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">🏠</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Rent/Boarding</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '📱 Mobile Plan',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'buffer',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-pink-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">📱</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Mobile Plan</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '🎬 Netflix',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'fun',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-red-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">🎬</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Netflix</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                setEditingBill({
                  id: '',
                  label: '🎵 Spotify',
                  amount: 0,
                  interval: 'monthly',
                  nextRun: new Date().toISOString(),
                  envelopeId: 'fun',
                  accountId: 'cash',
                  type: 'bill',
                  isDefault: true
                });
                setIsBillModalOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/50 border border-neutral-300 dark:border-neutral-600/40 hover:border-emerald-500/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">🎵</span>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-200 text-xs">Spotify</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Tap to configure</div>
                </div>
              </div>
            </motion.button>

            {/* Custom Bill Option */}
            <motion.button
              onClick={handleAddBill}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-dashed border-purple-500/40 hover:border-purple-400/60 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
                <div>
                  <div className="font-medium text-purple-300 text-xs">Custom Bill</div>
                  <div className="text-[10px] text-purple-400/70">Create your own</div>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setEditingBill(undefined);
        }}
        bill={editingBill}
      />

      <DeleteBillModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBill(null);
        }}
        onConfirm={confirmDelete}
        bill={deletingBill}
      />

      {/* Enhanced Quick Tips */}
      {bills.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-4 rounded-xl border backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
            borderColor: 'rgba(147, 51, 234, 0.2)',
            boxShadow: '0 4px 20px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <span className="text-sm">💡</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-300">Bill Management Tips</div>
              <div className="text-[10px] text-purple-400/70">Smart strategies for staying on top of payments</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-800/30 border border-neutral-700/50">
              <span className="text-purple-400 mt-0.5 text-xs">🔄</span>
              <div className="text-[10px] text-neutral-300">
                <div className="font-medium mb-0.5">Automate Payments</div>
                <div className="text-neutral-400">Set up automatic payments to avoid late fees and build credit</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-800/30 border border-neutral-700/50">
              <span className="text-purple-400 mt-0.5 text-xs">🔍</span>
              <div className="text-[10px] text-neutral-300">
                <div className="font-medium mb-0.5">Review Monthly</div>
                <div className="text-neutral-400">Check bills regularly to spot unusual charges or rate changes</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-800/30 border border-neutral-700/50">
              <span className="text-purple-400 mt-0.5 text-xs">🛡️</span>
              <div className="text-[10px] text-neutral-300">
                <div className="font-medium mb-0.5">Buffer Fund</div>
                <div className="text-neutral-400">Keep at least one month of bills in your Buffer envelope</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
