import { useBudget } from '../store/budget';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Trophy, Calendar, Zap, CheckCircle2, Clock } from 'lucide-react';
import type { Quest } from '../types';

interface QuestsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestCard = ({ quest, index }: { quest: Quest; index: number }) => {
  const completeQuest = useBudget(s => s.completeQuest);
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
  
  const isDaily = quest.type === 'daily';
  const isExpired = quest.expiresAt && new Date(quest.expiresAt) < new Date();
  
  // Get time remaining for daily quests
  const getTimeRemaining = () => {
    if (!quest.expiresAt) return null;
    const now = new Date();
    const expires = new Date(quest.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getCategoryIcon = () => {
    switch (quest.category) {
      case 'spending':
        return '💸';
      case 'saving':
        return '💰';
      case 'bills':
        return '📄';
      case 'goals':
        return '🎯';
      case 'streak':
        return '🔥';
      default:
        return '⭐';
    }
  };

  const getCategoryColor = () => {
    switch (quest.category) {
      case 'spending':
        return 'from-orange-500 to-red-500';
      case 'saving':
        return 'from-green-500 to-emerald-500';
      case 'bills':
        return 'from-blue-500 to-cyan-500';
      case 'goals':
        return 'from-purple-500 to-pink-500';
      case 'streak':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
        quest.done 
          ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30' 
          : isExpired
          ? 'bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 border-neutral-700/30 opacity-50'
          : 'bg-gradient-to-br from-neutral-800 to-neutral-800/50 border-neutral-700 hover:border-brand-500/50'
      }`}
    >
      {/* Completed checkmark overlay */}
      {quest.done && (
        <div className="absolute -top-2 -right-2 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="p-1.5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      )}

      {/* Quest Type Badge */}
      <div className="absolute -top-2 -left-2">
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${
          isDaily ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
        } shadow-lg flex items-center gap-1`}>
          {isDaily ? <Calendar className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
          {isDaily ? 'Daily' : 'Achievement'}
        </div>
      </div>

      {/* Shimmer effect for active quests */}
      {!quest.done && !isExpired && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      <div className="relative">
        {/* Quest Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="text-3xl">{getCategoryIcon()}</div>
          <div className="flex-1">
            <h3 className={`font-bold mb-1 ${quest.done ? 'text-green-400' : 'text-white'}`}>
              {quest.title}
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-2">{quest.description}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Progress</span>
            <span className={`font-bold ${quest.done ? 'text-green-400' : 'text-white'}`}>
              {quest.progress} / {quest.target}
            </span>
          </div>
          
          <div className="h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-700/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={`h-full bg-gradient-to-r ${getCategoryColor()} relative`}
            >
              {progressPercent === 100 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Rewards & Timer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
          <div className="flex items-center gap-3">
            {/* XP Reward */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-500/20 border border-brand-500/30">
              <Zap className="w-3 h-3 text-brand-400" />
              <span className="text-xs font-bold text-brand-400">+{quest.xp} XP</span>
            </div>
            
            {/* Coin Reward */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <span className="text-xs">💰</span>
              <span className="text-xs font-bold text-yellow-400">+{quest.coinReward}</span>
            </div>
          </div>

          {/* Timer for daily quests */}
          {isDaily && !quest.done && (
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock className="w-3 h-3" />
              <span>{getTimeRemaining()}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function QuestsPanel({ isOpen, onClose }: QuestsPanelProps) {
  const quests = useBudget(s => s.game.quests);

  // Filter only daily quests
  const dailyQuests = quests.filter(q => q.type === 'daily');

  // Calculate stats for daily quests only
  const totalQuests = dailyQuests.length;
  const completedQuests = dailyQuests.filter(q => q.done).length;
  const activeQuests = dailyQuests.filter(q => !q.done).length;
  const completionPercent = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Floating Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="w-full max-w-5xl max-h-[90vh] overflow-hidden"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl border-2 border-brand-500/30 shadow-2xl shadow-brand-500/20">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-brand-500/20 via-cyan-500/20 to-brand-500/20 border-b border-brand-500/30 p-6">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/10 to-transparent animate-shimmer" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 shadow-lg shadow-brand-500/30">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-cyan-400 to-brand-500">
                          Daily Quests
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">Complete today's challenges to earn XP and coins</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Stats Card */}
                      <div className="px-5 py-3 rounded-xl bg-gradient-to-br from-brand-900/30 to-cyan-900/30 border border-brand-500/30">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-brand-400">{activeQuests}</div>
                            <div className="text-xs text-neutral-500">Active</div>
                          </div>
                          <div className="h-10 w-px bg-brand-500/30" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{completedQuests}</div>
                            <div className="text-xs text-neutral-500">Done</div>
                          </div>
                          <div className="h-10 w-px bg-brand-500/30" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-400">{completionPercent}%</div>
                            <div className="text-xs text-neutral-500">Rate</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Close Button */}
                      <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 hover:border-neutral-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 relative">
                    <div className="h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercent}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-brand-500 via-cyan-500 to-brand-500 relative"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content - Daily Quests Only */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
                  {dailyQuests.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-400">Today's Challenges</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
                        <span className="text-xs text-neutral-500">Resets daily at midnight</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dailyQuests.map((quest, index) => (
                          <QuestCard key={quest.id} quest={quest} index={index} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        🎯
                      </motion.div>
                      <h3 className="text-xl font-semibold text-neutral-300 mb-2">No Daily Quests</h3>
                      <p className="text-neutral-500">Check back tomorrow for new challenges!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
