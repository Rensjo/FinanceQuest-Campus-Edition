import { motion } from 'framer-motion';
import { Star, Flame, User, Trophy, Settings, ShoppingBag } from 'lucide-react';
import { useBudget } from '../store/budget';

interface AdventurerStatusProps {
  compact?: boolean;
  onStatusClick?: () => void;
  onBadgesClick?: () => void;
  onSettingsClick?: () => void;
  onShopClick?: () => void;
  className?: string;
}

export function AdventurerStatus({ 
  compact = false, 
  onStatusClick,
  onBadgesClick,
  onSettingsClick,
  onShopClick,
  className = "" 
}: AdventurerStatusProps) {
  const { game } = useBudget(s => ({ game: s.game }));

  // Calculate XP percentage for current level
  const xpNeeded = Math.round(60 * Math.pow(game.level + 1, 1.35));
  const xpForCurrentLevel = Math.round(60 * Math.pow(game.level, 1.35));
  const xpIntoLevel = game.xp - xpForCurrentLevel;
  const xpForNextLevel = xpNeeded - xpForCurrentLevel;
  const xpPct = Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl backdrop-blur-sm bg-gradient-to-br from-white to-slate-50 dark:from-neutral-900/60 dark:to-neutral-800/40 border border-neutral-200 dark:border-neutral-700/30 shadow-lg dark:shadow-black/20 ${className}`}
    >
      <div className="p-4 flex items-center gap-4">
        {/* Left Section: Level Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-500/20 dark:to-purple-500/20 border border-cyan-300 dark:border-cyan-500/30">
          <Star className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <div className="text-[9px] text-neutral-600 dark:text-neutral-500 uppercase tracking-wider font-bold">Level</div>
            <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 leading-none">{game.level}</div>
          </div>
        </div>

        {/* Center Section: XP Progress */}
        <div className="flex-1 min-w-0">
          {/* XP Value */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs text-neutral-600 dark:text-neutral-500 uppercase tracking-wider font-bold">Exp</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{game.xp.toLocaleString()}</div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2.5 bg-neutral-200 dark:bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700/50 mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                boxShadow: xpPct >= 80 ? '0 0 8px rgba(16, 185, 129, 0.6)' : '0 0 4px rgba(16, 185, 129, 0.4)',
              }}
            />
            
            {/* Shine effect */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: xpPct >= 80 ? 2 : 4 }}
              className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
            
            {/* Level up indicator */}
            {xpPct >= 90 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-0.5 -right-0.5 text-xs"
              >
                ⚡
              </motion.div>
            )}
          </div>

          {/* Progress Stats */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{xpIntoLevel} / {xpForNextLevel} XP</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{xpPct}%</span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />

        {/* Right Section: Streak & Actions */}
        <div className="flex flex-col gap-2">
          {/* Streak Display */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            game.streak > 0 
              ? 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-300 dark:border-orange-500/30'
              : 'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700/20 dark:to-neutral-800/20 border border-neutral-300 dark:border-neutral-600/30'
          }`}>
            <Flame className={`h-4 w-4 ${game.streak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-500 dark:text-neutral-600'}`} />
            <span className={`text-xs font-bold ${game.streak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-600 dark:text-neutral-500'}`}>
              {game.streak > 0 ? `${game.streak}d` : 'No Streak'}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-1.5">
            <motion.button
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(139, 92, 246, 0.25))',
                border: '1px solid rgba(168, 85, 247, 0.4)',
              }}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStatusClick}
              title="Status"
            >
              <User className="h-4 w-4 text-purple-400" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.25))',
                border: '1px solid rgba(251, 191, 36, 0.4)',
              }}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBadgesClick}
              title="Badges"
            >
              <Trophy className="h-4 w-4 text-yellow-400" />
            </motion.button>

            <motion.button
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShopClick}
              title="Shop"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(64, 64, 64, 0.4), rgba(82, 82, 82, 0.4))',
                border: '1px solid rgba(115, 115, 115, 0.4)',
              }}
              whileHover={{ scale: 1.1, y: -1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettingsClick}
              title="Settings"
            >
              <Settings className="h-4 w-4 text-neutral-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Alternative: Compact Inline Version (for header)
export function AdventurerStatusCompact({ 
  onStatusClick,
  className = "" 
}: Omit<AdventurerStatusProps, 'compact' | 'onBadgesClick'>) {
  const { game } = useBudget(s => ({ game: s.game }));

  const xpNeeded = Math.round(60 * Math.pow(game.level + 1, 1.35));
  const xpForCurrentLevel = Math.round(60 * Math.pow(game.level, 1.35));
  const xpIntoLevel = game.xp - xpForCurrentLevel;
  const xpForNextLevel = xpNeeded - xpForCurrentLevel;
  const xpPct = Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));

  return (
    <motion.div 
      className={`inline-flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm cursor-pointer transition-all ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))',
        border: '1px solid rgba(168, 85, 247, 0.3)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStatusClick}
    >
      {/* Level Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2))',
          border: '1px solid rgba(6, 182, 212, 0.4)',
        }}
      >
        <Star className="h-3.5 w-3.5 text-yellow-400" />
        <span className="text-sm font-bold text-cyan-400">Lvl {game.level}</span>
      </div>

      {/* Mini Progress Bar */}
      <div className="flex-1 min-w-[100px]">
        <div className="relative w-full h-2 bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ 
              background: 'linear-gradient(90deg, #10b981, #06b6d4)'
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-emerald-400 font-semibold">
            {xpIntoLevel} / {xpForNextLevel} XP
          </span>
          <span className="text-xs flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-400" />
            <span className="text-orange-400 font-semibold">{game.streak}d</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
