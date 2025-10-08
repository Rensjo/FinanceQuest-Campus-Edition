import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationPopup, { NotificationData } from './components/NotificationPopup';
import TransactionNotification from './components/TransactionNotification';
import { useBudget } from './store/budget';
import { useSoundEffects } from './hooks/useSoundEffects';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { useMemoryManagement } from './hooks/useMemoryManagement';
import { useThrottle } from './hooks/useOptimization';

// Lazy load heavy components for better initial load performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const QuestsPanel = lazy(() => import('./components/QuestsPanel'));
const AchievementQuestsPanel = lazy(() => import('./components/AchievementQuestsPanel'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

export default function App(){
const [isQuestsOpen, setIsQuestsOpen] = useState(false);
const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
const [notification, setNotification] = useState<NotificationData | null>(null);
const [transactionNotification, setTransactionNotification] = useState<{
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  merchant?: string;
  note?: string;
  envelopeName?: string;
} | null>(null);

// Performance monitoring
usePerformanceMonitor('App');

// Memory management
const { safeSetTimeout, registerCleanup } = useMemoryManagement('App');

// Initialize sound system
const { playSound } = useSoundEffects();

// Optimize store selectors - only re-render when these specific values change
const quests = useBudget(s => s.game.quests);
const game = useBudget(s => s.game);
const transactions = useBudget(s => s.transactions);
const envelopes = useBudget(s => s.envelopes);
const theme = useBudget(s => s.prefs.theme);

// Determine the active theme
const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('dark');
useEffect(() => {
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setActiveTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handler = (e: MediaQueryListEvent) => setActiveTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else {
    setActiveTheme(theme);
  }
}, [theme]);

// Apply theme class to document
useEffect(() => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(activeTheme);
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(activeTheme);
}, [activeTheme]);

// Add hover sound to interactive elements with optimized throttling
const handleHoverSound = useThrottle((e: Event) => {
  const target = e.target as HTMLElement;
  
  // Check if element is a button or has button/interactive role
  const isButton = target.tagName === 'BUTTON' || target.closest?.('button');
  const isInteractive = target.closest?.('[role="button"]') || target.classList?.contains?.('cursor-pointer');
  
  if (isButton || isInteractive) {
    playSound('hover');
  }
}, 500);

useEffect(() => {
  // Use mouseover since it bubbles, unlike mouseenter
  document.addEventListener('mouseover', handleHoverSound, true);
  
  return () => {
    document.removeEventListener('mouseover', handleHoverSound, true);
  };
}, [handleHoverSound]);

// Add click sound to all buttons and interactive elements
useEffect(() => {
  const handleClick = (e: Event) => {
    const target = e.target as HTMLElement;
    
    // Check if element is a button or has button/interactive role
    const isButton = target.tagName === 'BUTTON' || target.closest?.('button');
    const isInteractive = target.closest?.('[role="button"]') || target.classList?.contains?.('cursor-pointer');
    
    if (isButton || isInteractive) {
      playSound('button-click');
    }
  };

  // Use click event with capture phase to catch all clicks
  document.addEventListener('click', handleClick, true);
  
  return () => {
    document.removeEventListener('click', handleClick, true);
  };
}, [playSound]);

// Memoize computed values to prevent unnecessary recalculations
const hasIncompleteDailyTasks = useMemo(
  () => quests.filter(q => q.type === 'daily').some(q => !q.done),
  [quests]
);

const hasIncompleteAchievements = useMemo(
  () => quests.filter(q => q.type === 'achievement').some(q => !q.done),
  [quests]
);

// Check if new daily quests are available
const [hasNewQuests, setHasNewQuests] = useState(false);
useEffect(() => {
  const lastChecked = localStorage.getItem('lastQuestCheck');
  const today = new Date().toDateString();
  
  if (lastChecked !== today) {
    setHasNewQuests(true);
    localStorage.setItem('lastQuestCheck', today);
  }
}, []);

// Monitor for level ups, badges, and streaks
const [prevLevel, setPrevLevel] = useState(game.level);
const [prevBadgeCount, setPrevBadgeCount] = useState(game.badges?.filter(b => b.unlockedAt).length || 0);
const [prevStreak, setPrevStreak] = useState(game.streak);

useEffect(() => {
  // Check for level up
  if (game.level > prevLevel) {
    playSound('level-up'); // Play level up sound
    setNotification({
      type: 'levelUp',
      title: 'LEVEL UP!',
      description: 'You\'ve reached a new level!',
      level: game.level,
      xp: 0,
    });
    setPrevLevel(game.level);
  }

  // Check for new badges
  const currentBadgeCount = game.badges?.filter(b => b.unlockedAt).length || 0;
  if (currentBadgeCount > prevBadgeCount) {
    const newBadge = game.badges?.find(b => b.unlockedAt && !prevBadgeCount)?.name;
    playSound('badge-earned'); // Play badge sound
    setNotification({
      type: 'badge',
      title: 'NEW BADGE UNLOCKED!',
      description: 'You\'ve earned a new badge!',
      badgeName: newBadge || 'New Badge',
    });
    setPrevBadgeCount(currentBadgeCount);
  }

  // Check for streak maintenance
  if (game.streak > prevStreak && game.streak > 0) {
    playSound('quest-complete'); // Play quest complete sound for streak
    setNotification({
      type: 'streak',
      title: 'STREAK MAINTAINED!',
      description: 'Keep up the great work!',
      streakDays: game.streak,
    });
    setPrevStreak(game.streak);
  }
}, [game.level, game.badges, game.streak, prevLevel, prevBadgeCount, prevStreak, playSound]);

// Monitor for quest completions
useEffect(() => {
  const completedQuests = quests.filter(q => q.done);
  
  // Get the list of already notified quest IDs from localStorage
  const notifiedQuestsJson = localStorage.getItem('notifiedQuests');
  const notifiedQuests: Set<string> = notifiedQuestsJson 
    ? new Set(JSON.parse(notifiedQuestsJson))
    : new Set();
  
  // Track if we need to update localStorage
  let hasNewNotifications = false;
  
  completedQuests.forEach(quest => {
    // Only show notification if this quest hasn't been notified before
    if (!notifiedQuests.has(quest.id)) {
      playSound('quest-complete'); // Play quest complete sound
      if (quest.type === 'achievement') {
        setNotification({
          type: 'achievement',
          title: 'ACHIEVEMENT UNLOCKED!',
          description: quest.title,
          xp: quest.xp,
          coins: quest.coinReward,
        });
      } else {
        setNotification({
          type: 'quest',
          title: 'QUEST COMPLETED!',
          description: quest.title,
          xp: quest.xp,
          coins: quest.coinReward,
        });
      }
      
      // Add to the set of notified quests
      notifiedQuests.add(quest.id);
      hasNewNotifications = true;
    }
  });
  
  // Update localStorage if there were new notifications
  if (hasNewNotifications) {
    localStorage.setItem('notifiedQuests', JSON.stringify(Array.from(notifiedQuests)));
  }
}, [quests]);

// Monitor for new transactions
const [prevTransactionCount, setPrevTransactionCount] = useState(transactions.length);
useEffect(() => {
  if (transactions.length > prevTransactionCount) {
    // New transaction added (newest transaction is at index 0)
    const latestTransaction = transactions[0];
    const envelope = envelopes.find(e => e.id === latestTransaction.envelopeId);
    
    playSound('coins'); // Play coins sound for transaction
    
    setTransactionNotification({
      type: latestTransaction.type,
      amount: latestTransaction.amount,
      merchant: latestTransaction.merchant,
      note: latestTransaction.note,
      envelopeName: envelope?.name,
    });
    
    setPrevTransactionCount(transactions.length);
  }
}, [transactions, prevTransactionCount, envelopes, playSound]);

// Clear new quest indicator when panel is opened
const handleOpenQuests = () => {
  setIsQuestsOpen(true);
  setHasNewQuests(false);
};

// Open achievement quests panel
const handleOpenAchievements = () => {
  setIsAchievementsOpen(true);
};

return (
<div className={`min-h-screen ${activeTheme}`}>
<motion.header 
  className={`sticky top-0 z-50 backdrop-blur-xl border-b-2 ${
    activeTheme === 'light' 
      ? 'bg-gradient-to-r from-cyan-50/90 via-blue-50/90 to-purple-50/90 border-cyan-300/50' 
      : ''
  }`}
  style={activeTheme === 'dark' ? {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.05), rgba(168, 85, 247, 0.05))',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    boxShadow: '0 4px 30px rgba(6, 182, 212, 0.15)',
  } : {
    boxShadow: '0 4px 30px rgba(6, 182, 212, 0.1)',
  }}
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
>
  <div className="relative mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
    {/* Logo & Title */}
    <div className="flex items-center gap-3">
      {/* Simplified Logo */}
      <div className="relative">
        {/* Logo Container */}
        <div 
          className="relative size-10 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #10b981, #06b6d4, #a855f7)',
            border: '2px solid rgba(6, 182, 212, 0.5)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Logo Image */}
          <img 
            src="/icons/icon.png"
            alt="F$"
            className="w-6 h-6 object-contain"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
            }}
          />

          {/* Corner Accent Dots */}
          <div className="absolute top-1 right-1 size-1 rounded-full bg-cyan-400" />
          <div className="absolute bottom-1 left-1 size-1 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Title with Gradient */}
      <div>
        <h1 
          className="text-xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #10b981, #06b6d4, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          FinanceQuest
          <span 
            className="ml-2 text-base font-normal"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            — Campus Edition
          </span>
        </h1>
      </div>
    </div>

    {/* Feature Badges */}
    <div className="flex items-center gap-2">
      {/* Offline Badge */}
      <div
        className="px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400"
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
        }}
      >
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Offline
        </span>
      </div>

      {/* Separator */}
      <div className="size-1 rounded-full bg-neutral-700" />

      {/* Private Badge */}
      <div
        className="px-3 py-1.5 rounded-full text-xs font-bold text-cyan-400"
        style={{
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
        }}
      >
        <span className="flex items-center gap-1.5">
          🔒
          Private
        </span>
      </div>

      {/* Separator */}
      <div className="size-1 rounded-full bg-neutral-700" />

      {/* Gamified Badge */}
      <div
        className="px-3 py-1.5 rounded-full text-xs font-bold text-purple-400"
        style={{
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)',
        }}
      >
        <span className="flex items-center gap-1.5">
          🎮
          Gamified
        </span>
      </div>
    </div>
  </div>
</motion.header>

{/* Floating Quest Button */}
<div className="fixed top-20 right-6 z-40 group">
  <motion.button
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
    whileHover={{ scale: 1.15, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={handleOpenQuests}
    className="relative cursor-pointer"
  >
    <img 
      src="/icons/daily-quest-icon.png"
      alt="Quests"
      className="w-16 h-16 object-contain"
      style={{
        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))',
      }}
    />
  </motion.button>

  {/* Notification Badge */}
  <AnimatePresence>
    {(hasIncompleteDailyTasks || hasNewQuests) && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1 z-20 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="relative"
        >
          {/* Outer glow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.8), transparent 70%)',
              filter: 'blur(4px)',
              transform: 'scale(1.5)',
            }}
          />
          
          {/* Badge */}
          <div
            className="relative w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: '1.5px solid white',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.6)',
            }}
          >
            !
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Tooltip on hover */}
  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
    <div className="px-3 py-2 rounded-lg bg-neutral-900 border border-brand-500/30 shadow-xl">
      <p className="text-sm font-semibold text-white">Daily Quests</p>
      {hasIncompleteDailyTasks && (
        <p className="text-xs text-neutral-400">Tasks available!</p>
      )}
    </div>
    {/* Arrow */}
    <div 
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0"
      style={{
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: '6px solid rgba(23, 23, 23, 0.95)',
      }}
    />
  </div>
</div>

{/* Achievement Quest Button - Below Daily Quests */}
<div className="fixed top-[156px] right-6 z-40 group">
  <motion.button
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', duration: 0.6, delay: 0.4 }}
    whileHover={{ scale: 1.15, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={handleOpenAchievements}
    className="relative cursor-pointer"
  >
    <img 
      src="/icons/achievement-quest-icon.png"
      alt="Achievements"
      className="w-16 h-16 object-contain"
      style={{
        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))',
      }}
    />
  </motion.button>

  {/* Notification Badge for Achievements */}
  <AnimatePresence>
    {hasIncompleteAchievements && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1 z-20 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="relative"
        >
          {/* Outer glow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.8), transparent 70%)',
              filter: 'blur(4px)',
              transform: 'scale(1.5)',
            }}
          />
          
          {/* Badge */}
          <div
            className="relative w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #9333ea)',
              border: '1.5px solid white',
              boxShadow: '0 2px 6px rgba(168, 85, 247, 0.6)',
            }}
          >
            !
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Tooltip on hover */}
  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
    <div className="px-3 py-2 rounded-lg bg-neutral-900 border border-purple-500/30 shadow-xl">
      <p className="text-sm font-semibold text-white">Achievement Quests</p>
      {hasIncompleteAchievements && (
        <p className="text-xs text-neutral-400">Challenges available!</p>
      )}
    </div>
    {/* Arrow */}
    <div 
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0"
      style={{
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: '6px solid rgba(23, 23, 23, 0.95)',
      }}
    />
  </div>
</div>

{/* Quests Panels - Lazy loaded */}
<Suspense fallback={null}>
  <QuestsPanel isOpen={isQuestsOpen} onClose={() => setIsQuestsOpen(false)} />
  <AchievementQuestsPanel isOpen={isAchievementsOpen} onClose={() => setIsAchievementsOpen(false)} />
</Suspense>

{/* Notification Popup */}
<NotificationPopup 
  notification={notification} 
  onClose={() => setNotification(null)} 
/>

{/* Transaction Notification */}
<TransactionNotification 
  transaction={transactionNotification} 
  onClose={() => setTransactionNotification(null)} 
/>

<main className="mx-auto max-w-6xl px-4 pt-4 pb-6">
  <Suspense fallback={<LoadingFallback />}>
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}>
      <Dashboard />
    </motion.div>
  </Suspense>
</main>
</div>
);
}