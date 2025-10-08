import { useBudget } from '../store/budget';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Zap, CheckCircle2 } from 'lucide-react';
import type { Quest } from '../types';

interface AchievementQuestsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestCard = ({ quest, index }: { quest: Quest; index: number }) => {
  const completeQuest = useBudget(s => s.completeQuest);
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
  
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
        return 'from-emerald-500 to-teal-500';
      case 'bills':
        return 'from-blue-500 to-cyan-500';
      case 'goals':
        return 'from-purple-500 to-pink-500';
      case 'streak':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-brand-500 to-cyan-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div
        className={`
          relative p-4 rounded-xl border-2 transition-all duration-300
          ${quest.done 
            ? 'bg-neutral-800/40 border-emerald-500/50' 
            : 'bg-neutral-800/60 border-neutral-700/50 hover:border-brand-500/50'
          }
        `}
        style={{
          boxShadow: quest.done 
            ? '0 4px 20px rgba(16, 185, 129, 0.2)' 
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Category Icon */}
            <div className="text-2xl">{getCategoryIcon()}</div>
            
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm mb-1">
                {quest.title}
              </h4>
              <p className="text-xs text-neutral-400">
                {quest.description}
              </p>
            </div>
          </div>

          {/* Completion Status */}
          {quest.done && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex-shrink-0"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-neutral-400">Progress</span>
            <span className="font-semibold text-white">
              {quest.progress} / {quest.target}
            </span>
          </div>
          
          <div className="relative h-2 bg-neutral-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`h-full bg-gradient-to-r ${getCategoryColor()}`}
              style={{
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
              }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 text-xs">
          {quest.xp > 0 && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">
                +{quest.xp} XP
              </span>
            </div>
          )}
          {quest.coinReward > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">🪙</span>
              <span className="font-semibold text-amber-400">
                +{quest.coinReward}
              </span>
            </div>
          )}
        </div>

        {/* Complete Button */}
        {!quest.done && quest.progress >= quest.target && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => completeQuest(quest.id)}
            className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm"
            style={{
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            }}
          >
            Claim Reward
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default function AchievementQuestsPanel({ isOpen, onClose }: AchievementQuestsPanelProps) {
  const quests = useBudget(s => s.game.quests);
  
  // Filter only achievement quests
  const achievementQuests = quests.filter(q => q.type === 'achievement');
  
  const activeQuests = achievementQuests.filter(q => !q.done);
  const completedQuests = achievementQuests.filter(q => q.done);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border-2 shadow-2xl overflow-hidden pointer-events-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.98), rgba(38, 38, 38, 0.98))',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
              }}
            >
              {/* Header with shimmer effect */}
              <div 
                className="relative px-6 py-5 border-b-2 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.1))',
                  borderColor: 'rgba(168, 85, 247, 0.2)',
                }}
              >
                {/* Shimmer animation */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">
                        Achievement Quests
                      </h2>
                      <p className="text-sm text-neutral-400">
                        Permanent challenges for long-term progression
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700"
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="relative mt-4 flex gap-4">
                  <div className="px-3 py-2 rounded-lg bg-neutral-900/50 border border-purple-500/30">
                    <span className="text-xs text-neutral-400">Active: </span>
                    <span className="font-bold text-white">{activeQuests.length}</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-neutral-900/50 border border-emerald-500/30">
                    <span className="text-xs text-neutral-400">Completed: </span>
                    <span className="font-bold text-emerald-400">{completedQuests.length}</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-neutral-900/50 border border-brand-500/30">
                    <span className="text-xs text-neutral-400">Progress: </span>
                    <span className="font-bold text-brand-400">
                      {achievementQuests.length > 0 
                        ? Math.round((completedQuests.length / achievementQuests.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
                {achievementQuests.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400 text-lg">No achievement quests available</p>
                    <p className="text-neutral-500 text-sm mt-2">Check back later for new challenges!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Active Quests */}
                    {activeQuests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                          Active Challenges
                        </h3>
                        <div className="space-y-3">
                          {activeQuests.map((quest, i) => (
                            <QuestCard key={quest.id} quest={quest} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed Quests */}
                    {completedQuests.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">
                          Completed Achievements
                        </h3>
                        <div className="space-y-3">
                          {completedQuests.map((quest, i) => (
                            <QuestCard key={quest.id} quest={quest} index={i} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
