/**
 * Status Panel - Detailed adventurer stats and information
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Flame, Trophy, Target, TrendingUp, Zap, Award, Calendar } from 'lucide-react';
import { useBudget } from '../store/budget';

interface StatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusPanel({ isOpen, onClose }: StatusPanelProps) {
  const { game, transactions, goals } = useBudget(s => ({
    game: s.game,
    transactions: s.transactions,
    goals: s.goals
  }));

  // Calculate XP percentage for current level
  const xpNeeded = Math.round(60 * Math.pow(game.level + 1, 1.35));
  const xpForCurrentLevel = Math.round(60 * Math.pow(game.level, 1.35));
  const xpIntoLevel = game.xp - xpForCurrentLevel;
  const xpForNextLevel = xpNeeded - xpForCurrentLevel;
  const xpPct = Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));

  // Calculate stats
  const totalExpenses = transactions.filter(t => t.type === 'expense').length;
  const totalIncome = transactions.filter(t => t.type === 'income').length;
  const completedQuests = game.quests.filter(q => q.done).length;
  const totalQuests = game.quests.length;
  const completedGoals = goals.filter(g => g.saved >= g.targetAmount).length;
  const unlockedBadges = game.badges.filter(b => b.unlockedAt).length;
  const totalBadges = game.badges.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - positioned below header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed right-0 left-0 bg-black/60 backdrop-blur-sm z-40"
            style={{
              top: '30px',
              height: 'calc(100vh - 30px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 w-full sm:w-[480px] z-50 overflow-y-auto"
            style={{
              top: '0px',
              height: '100vh',
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(23, 23, 23, 0.98) 100%)',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-neutral-800 px-6 pt-4 pb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95) 0%, rgba(38, 38, 38, 0.95) 100%)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Star className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Adventurer Status
                    </h2>
                    <p className="text-xs text-neutral-400">Your journey stats</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </motion.button>
              </div>

              {/* Level Display */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2))',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                  }}
                >
                  <Star className="h-6 w-6 text-cyan-400" />
                  <div>
                    <div className="text-xs text-neutral-400 font-bold">Level</div>
                    <div className="text-2xl font-black text-cyan-400">{game.level}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-bold">{xpIntoLevel} / {xpForNextLevel} XP</span>
                    <span className="text-cyan-400 font-bold">{xpPct}%</span>
                  </div>
                  <div className="relative w-full h-3 bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-700/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Core Stats Grid */}
              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Core Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-xl border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))',
                      borderColor: 'rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-semibold">Total XP</span>
                    </div>
                    <div className="text-2xl font-black text-yellow-300">{game.totalXpEarned.toLocaleString()}</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-xl border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))',
                      borderColor: 'rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">💰</span>
                      <span className="text-xs text-yellow-400 font-semibold">Coins</span>
                    </div>
                    <div className="text-2xl font-black text-yellow-300">{game.coins.toLocaleString()}</div>
                    <div className="text-[10px] text-yellow-400/70 mt-1">
                      {game.totalCoinsEarned.toLocaleString()} earned total
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-xl border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-orange-400 font-semibold">Streak</span>
                    </div>
                    <div className="text-2xl font-black text-orange-300">{game.streak} days</div>
                    <div className="text-[10px] text-orange-400/70 mt-1">
                      Record: {game.streakRecord} days
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-xl border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.05))',
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-400 font-semibold">Quests</span>
                    </div>
                    <div className="text-2xl font-black text-purple-300">{game.questsCompleted}</div>
                    <div className="text-[10px] text-purple-400/70 mt-1">
                      {completedQuests}/{totalQuests} active done
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Activity Stats */}
              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Activity Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-sm text-neutral-300">Expenses Tracked</span>
                    </div>
                    <span className="text-lg font-bold text-red-400">{totalExpenses}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-sm text-neutral-300">Income Recorded</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-400">{totalIncome}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                        <Target className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-sm text-neutral-300">Goals Completed</span>
                    </div>
                    <span className="text-lg font-bold text-cyan-400">{completedGoals}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                        <Award className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-sm text-neutral-300">Badges Unlocked</span>
                    </div>
                    <span className="text-lg font-bold text-purple-400">{unlockedBadges}/{totalBadges}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Account Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-300">Last Active</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-400">
                      {new Date(game.lastActive).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-neutral-300">Next Level</span>
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">
                      Level {game.level + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl border"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
                  borderColor: 'rgba(168, 85, 247, 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="text-sm font-bold text-purple-300 mb-1">Keep Going!</h4>
                    <p className="text-xs text-neutral-400">
                      {game.streak >= 7 
                        ? "Amazing streak! You're crushing it! 🔥"
                        : game.level >= 5
                        ? "Great progress! Keep building those financial habits! 💪"
                        : "You're on the right path to financial mastery! 🌟"
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
