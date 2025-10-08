import { useBudget } from '../store/budget';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Lock, Sparkles, Crown, Star, Trophy, Zap } from 'lucide-react';
import type { Badge } from '../types';

interface BadgesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getTierInfo = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return {
        color: 'from-amber-700 via-amber-600 to-amber-700',
        glow: 'rgba(217, 119, 6, 0.3)',
        borderColor: 'border-amber-600/40',
        bgGradient: 'from-amber-900/20 via-amber-800/10 to-amber-900/20',
        icon: <Star className="w-4 h-4" />,
        label: 'Bronze',
        textColor: 'text-amber-500'
      };
    case 'silver':
      return {
        color: 'from-gray-400 via-gray-300 to-gray-400',
        glow: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'border-gray-400/40',
        bgGradient: 'from-gray-700/20 via-gray-600/10 to-gray-700/20',
        icon: <Sparkles className="w-4 h-4" />,
        label: 'Silver',
        textColor: 'text-gray-300'
      };
    case 'gold':
      return {
        color: 'from-yellow-500 via-yellow-400 to-yellow-500',
        glow: 'rgba(234, 179, 8, 0.4)',
        borderColor: 'border-yellow-500/40',
        bgGradient: 'from-yellow-600/20 via-yellow-500/10 to-yellow-600/20',
        icon: <Trophy className="w-4 h-4" />,
        label: 'Gold',
        textColor: 'text-yellow-400'
      };
    case 'platinum':
      return {
        color: 'from-cyan-400 via-blue-400 to-purple-400',
        glow: 'rgba(34, 211, 238, 0.4)',
        borderColor: 'border-cyan-400/40',
        bgGradient: 'from-cyan-900/20 via-purple-900/10 to-cyan-900/20',
        icon: <Crown className="w-4 h-4" />,
        label: 'Platinum',
        textColor: 'text-cyan-400'
      };
    default:
      return {
        color: 'from-neutral-600 to-neutral-700',
        glow: 'rgba(115, 115, 115, 0.3)',
        borderColor: 'border-neutral-600/40',
        bgGradient: 'from-neutral-800/20 to-neutral-900/20',
        icon: <Award className="w-4 h-4" />,
        label: 'Common',
        textColor: 'text-neutral-400'
      };
  }
};

const BadgeCard = ({ badge, index }: { badge: Badge; index: number }) => {
  const tierInfo = getTierInfo(badge.tier);
  const isUnlocked = !!badge.unlockedAt;
  const progressPercent = Math.min((badge.progress / badge.requirement) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={isUnlocked ? { scale: 1.05, y: -4 } : {}}
      className={`group relative p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isUnlocked ? tierInfo.borderColor : 'border-neutral-700/50'
      }`}
      style={{
        background: isUnlocked 
          ? `linear-gradient(135deg, ${tierInfo.bgGradient}), linear-gradient(to bottom, rgba(23, 23, 23, 0.95), rgba(38, 38, 38, 0.9))`
          : 'linear-gradient(to bottom, rgba(23, 23, 23, 0.8), rgba(38, 38, 38, 0.7))',
      }}
    >
      {/* Animated glow effect for unlocked badges */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${tierInfo.glow}, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* Shimmer effect on hover for unlocked badges */}
      {isUnlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${tierInfo.glow}, transparent)`,
            }}
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Tier Badge */}
        <div className={`absolute -top-3 -right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg ${
          isUnlocked ? `bg-gradient-to-r ${tierInfo.color}` : 'bg-neutral-800'
        } border ${isUnlocked ? tierInfo.borderColor : 'border-neutral-700'} shadow-lg`}>
          {tierInfo.icon}
          <span className="text-xs font-bold text-white">{tierInfo.label}</span>
        </div>

        {/* Lock Overlay for locked badges */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm z-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-8 h-8 text-neutral-500" />
            </motion.div>
          </div>
        )}

        {/* Badge Icon */}
        <div className="flex justify-center mb-3">
          <motion.div
            className={`text-6xl ${!isUnlocked && 'opacity-30 grayscale'}`}
            animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {badge.icon}
          </motion.div>
        </div>

        {/* Badge Info */}
        <h3 className={`font-bold text-center mb-1 ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
          {badge.name}
        </h3>
        <p className={`text-xs text-center mb-3 ${isUnlocked ? 'text-neutral-400' : 'text-neutral-600'} line-clamp-2`}>
          {badge.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className={isUnlocked ? tierInfo.textColor : 'text-neutral-600'}>
              Progress
            </span>
            <span className={`font-bold ${isUnlocked ? 'text-white' : 'text-neutral-600'}`}>
              {badge.progress} / {badge.requirement}
            </span>
          </div>
          
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: index * 0.03 }}
              className={`h-full ${
                isUnlocked 
                  ? `bg-gradient-to-r ${tierInfo.color}` 
                  : 'bg-gradient-to-r from-neutral-700 to-neutral-600'
              } relative`}
            >
              {isUnlocked && progressPercent === 100 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Unlocked Date */}
        {isUnlocked && badge.unlockedAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 pt-3 border-t border-neutral-700/50"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
              <Zap className="w-3 h-3" />
              <span>Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function BadgesPanel({ isOpen, onClose }: BadgesPanelProps) {
  const badges = useBudget(s => s.game.badges);

  // Organize badges by tier
  const badgesByTier = {
    platinum: badges.filter(b => b.tier === 'platinum'),
    gold: badges.filter(b => b.tier === 'gold'),
    silver: badges.filter(b => b.tier === 'silver'),
    bronze: badges.filter(b => b.tier === 'bronze'),
  };

  // Calculate stats
  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;
  const completionPercent = Math.round((unlockedBadges / totalBadges) * 100);

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
              className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-purple-500/30 p-6">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500">
                          Badge Collection
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">Unlock achievements and show your progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Stats Card */}
                      <div className="px-5 py-3 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{unlockedBadges}</div>
                            <div className="text-xs text-neutral-500">Unlocked</div>
                          </div>
                          <div className="h-10 w-px bg-purple-500/30" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-pink-400">{totalBadges}</div>
                            <div className="text-xs text-neutral-500">Total</div>
                          </div>
                          <div className="h-10 w-px bg-purple-500/30" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-400">{completionPercent}%</div>
                            <div className="text-xs text-neutral-500">Complete</div>
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
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 relative"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>
                    <div className="absolute -top-1 left-0 right-0 flex justify-between px-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs font-bold text-purple-400"
                      >
                        ✨
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="text-xs font-bold text-pink-400"
                      >
                        🏆
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content - Badges by Tier */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)] scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                  {/* Platinum Tier */}
                  {badgesByTier.platinum.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Crown className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-400">Platinum Tier</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {badgesByTier.platinum.map((badge, index) => (
                          <BadgeCard key={badge.id} badge={badge} index={index} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gold Tier */}
                  {badgesByTier.gold.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-xl font-bold text-yellow-400">Gold Tier</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {badgesByTier.gold.map((badge, index) => (
                          <BadgeCard key={badge.id} badge={badge} index={index} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Silver Tier */}
                  {badgesByTier.silver.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-300">Silver Tier</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300/50 to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {badgesByTier.silver.map((badge, index) => (
                          <BadgeCard key={badge.id} badge={badge} index={index} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bronze Tier */}
                  {badgesByTier.bronze.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Star className="w-5 h-5 text-amber-500" />
                        <h3 className="text-xl font-bold text-amber-500">Bronze Tier</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {badgesByTier.bronze.map((badge, index) => (
                          <BadgeCard key={badge.id} badge={badge} index={index} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {totalBadges === 0 && (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        🏆
                      </motion.div>
                      <h3 className="text-xl font-semibold text-neutral-300 mb-2">No Badges Yet</h3>
                      <p className="text-neutral-500">Start completing quests to unlock badges!</p>
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