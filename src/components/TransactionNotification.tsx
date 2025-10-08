import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/currency';

interface TransactionNotificationProps {
  transaction: {
    type: 'expense' | 'income' | 'transfer';
    amount: number;
    merchant?: string;
    note?: string;
    envelopeName?: string;
  } | null;
  onClose: () => void;
}

export default function TransactionNotification({ transaction, onClose }: TransactionNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (transaction) {
      setIsVisible(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [transaction, onClose]);

  if (!transaction) return null;

  const isExpense = transaction.type === 'expense';
  const isIncome = transaction.type === 'income';

  const config = isExpense 
    ? {
        icon: <TrendingDown className="w-5 h-5" />,
        bgGradient: 'from-red-500/20 to-orange-500/20',
        borderColor: 'border-red-500/40',
        textColor: 'text-red-400',
        iconBg: 'bg-red-500/20',
        glowColor: 'rgba(239, 68, 68, 0.3)',
        title: 'Expense Logged',
        emoji: '💸'
      }
    : isIncome
    ? {
        icon: <TrendingUp className="w-5 h-5" />,
        bgGradient: 'from-emerald-500/20 to-green-500/20',
        borderColor: 'border-emerald-500/40',
        textColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/20',
        glowColor: 'rgba(16, 185, 129, 0.3)',
        title: 'Income Added',
        emoji: '💰'
      }
    : {
        icon: <CheckCircle2 className="w-5 h-5" />,
        bgGradient: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'border-blue-500/40',
        textColor: 'text-blue-400',
        iconBg: 'bg-blue-500/20',
        glowColor: 'rgba(59, 130, 246, 0.3)',
        title: 'Transfer Complete',
        emoji: '🔄'
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-6 left-6 z-[200] max-w-sm"
        >
          <div
            className={`relative rounded-xl border-2 p-4 backdrop-blur-xl shadow-2xl ${config.borderColor}`}
            style={{
              background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95), rgba(38, 38, 38, 0.95))',
              boxShadow: `0 10px 40px ${config.glowColor}, 0 0 20px ${config.glowColor}`,
            }}
          >
            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${config.glowColor}, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className={`p-2 rounded-lg ${config.iconBg} ${config.textColor}`}
                >
                  {config.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{config.emoji}</span>
                      {config.title}
                    </h4>
                    <button
                      onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                      }}
                      className="p-1 rounded hover:bg-neutral-700/50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                  </div>

                  {/* Amount */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-xl font-black ${config.textColor} mb-1`}
                  >
                    {isExpense ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                  </motion.p>

                  {/* Details */}
                  <div className="space-y-0.5">
                    {transaction.merchant && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="text-xs text-neutral-300 font-medium truncate"
                      >
                        {transaction.merchant}
                      </motion.p>
                    )}
                    {transaction.envelopeName && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-neutral-400 truncate"
                      >
                        📁 {transaction.envelopeName}
                      </motion.p>
                    )}
                    {transaction.note && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-xs text-neutral-400 truncate"
                      >
                        {transaction.note}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar for auto-dismiss */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
                style={{
                  background: `linear-gradient(90deg, ${config.glowColor}, transparent)`,
                }}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
