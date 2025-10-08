import { nanoid } from 'nanoid';
import type { Quest, Badge, Achievement, QuestType, QuestCategory } from '../types';

// XP Constants
export const XP_PER_LEVEL = 100;
export const LEVEL_MULTIPLIER = 1.35;

// Calculate XP needed for a level
export const getXPForLevel = (level: number): number => {
  return Math.round(60 * Math.pow(level, LEVEL_MULTIPLIER));
};

// Calculate level from total XP
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  while (xp >= getXPForLevel(level + 1)) {
    level++;
  }
  return level;
};

// Daily Quest Templates (Expanded Pool)
const DAILY_QUEST_TEMPLATES = [
  {
    id: 'daily-log-expense',
    title: 'Track Your Spending',
    description: 'Log at least 1 expense today',
    category: 'spending' as QuestCategory,
    xp: 10,
    coinReward: 5,
    target: 1,
  },
  {
    id: 'daily-log-3-expenses',
    title: 'Diligent Tracker',
    description: 'Log 3 or more expenses today',
    category: 'spending' as QuestCategory,
    xp: 20,
    coinReward: 10,
    target: 3,
  },
  {
    id: 'daily-log-5-expenses',
    title: 'Super Tracker',
    description: 'Log 5 or more expenses today',
    category: 'spending' as QuestCategory,
    xp: 30,
    coinReward: 15,
    target: 5,
  },
  {
    id: 'daily-check-bills',
    title: 'Bill Awareness',
    description: 'Check your bills section',
    category: 'bills' as QuestCategory,
    xp: 5,
    coinReward: 3,
    target: 1,
  },
  {
    id: 'daily-update-goal',
    title: 'Goal Progress',
    description: 'Add money to any savings goal',
    category: 'goals' as QuestCategory,
    xp: 15,
    coinReward: 8,
    target: 1,
  },
  {
    id: 'daily-stay-budget',
    title: 'Budget Conscious',
    description: 'Keep spending within budget for the day',
    category: 'spending' as QuestCategory,
    xp: 25,
    coinReward: 15,
    target: 1,
  },
  {
    id: 'daily-pay-bill',
    title: 'Bill Payer',
    description: 'Mark a bill as paid',
    category: 'bills' as QuestCategory,
    xp: 20,
    coinReward: 12,
    target: 1,
  },
  {
    id: 'daily-review-envelopes',
    title: 'Budget Review',
    description: 'Review your budget envelopes',
    category: 'spending' as QuestCategory,
    xp: 8,
    coinReward: 4,
    target: 1,
  },
  {
    id: 'daily-add-income',
    title: 'Income Logger',
    description: 'Log an income transaction',
    category: 'saving' as QuestCategory,
    xp: 12,
    coinReward: 6,
    target: 1,
  },
  {
    id: 'daily-check-insights',
    title: 'Financial Insights',
    description: 'View your financial insights',
    category: 'spending' as QuestCategory,
    xp: 10,
    coinReward: 5,
    target: 1,
  },
  {
    id: 'daily-update-budget',
    title: 'Budget Planner',
    description: 'Update your monthly budget',
    category: 'spending' as QuestCategory,
    xp: 15,
    coinReward: 8,
    target: 1,
  },
  {
    id: 'daily-check-safe-to-spend',
    title: 'Spending Check',
    description: 'Check your safe-to-spend amount',
    category: 'spending' as QuestCategory,
    xp: 8,
    coinReward: 4,
    target: 1,
  },
  {
    id: 'daily-2-goals-contribute',
    title: 'Multi-Goal Saver',
    description: 'Contribute to 2 different goals',
    category: 'goals' as QuestCategory,
    xp: 25,
    coinReward: 12,
    target: 2,
  },
  {
    id: 'daily-categorize-expense',
    title: 'Smart Categorization',
    description: 'Log an expense with proper category',
    category: 'spending' as QuestCategory,
    xp: 12,
    coinReward: 6,
    target: 1,
  },
  {
    id: 'daily-pay-2-bills',
    title: 'Bill Crusher',
    description: 'Pay 2 bills in one day',
    category: 'bills' as QuestCategory,
    xp: 30,
    coinReward: 15,
    target: 2,
  },
  {
    id: 'daily-save-50',
    title: 'Thrifty Day',
    description: 'Keep daily spending under 50 coins worth',
    category: 'saving' as QuestCategory,
    xp: 20,
    coinReward: 10,
    target: 1,
  },
];

// Generate daily quests (refresh every day)
export const generateDailyQuests = (): Quest[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Select 3-4 random daily quests
  const numQuests = 3 + Math.floor(Math.random() * 2);
  const shuffled = [...DAILY_QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numQuests);

  return selected.map(template => ({
    ...template,
    id: `${template.id}-${today.toISOString().split('T')[0]}`,
    type: 'daily' as QuestType,
    done: false,
    progress: 0,
    expiresAt: tomorrow.toISOString(),
  }));
};

// Achievement-based quests (permanent until completed)
export const ACHIEVEMENT_QUESTS: Quest[] = [
  {
    id: 'achievement-first-expense',
    title: 'First Steps',
    description: 'Log your first expense',
    category: 'spending' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 50,
    coinReward: 25,
    target: 1,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-10-expenses',
    title: 'Tracking Habit',
    description: 'Log 10 total expenses',
    category: 'spending' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 100,
    coinReward: 50,
    target: 10,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 150,
    coinReward: 75,
    target: 7,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    category: 'streak' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 500,
    coinReward: 250,
    target: 30,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-goal-complete',
    title: 'Goal Achieved',
    description: 'Complete your first savings goal',
    category: 'goals' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 200,
    coinReward: 100,
    target: 1,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-level-5',
    title: 'Rising Star',
    description: 'Reach Level 5',
    category: 'streak' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 100,
    coinReward: 50,
    target: 5,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-level-10',
    title: 'Finance Pro',
    description: 'Reach Level 10',
    category: 'streak' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 250,
    coinReward: 125,
    target: 10,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-50-expenses',
    title: 'Expense Master',
    description: 'Log 50 total expenses',
    category: 'spending' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 300,
    coinReward: 150,
    target: 50,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-100-expenses',
    title: 'Ultimate Tracker',
    description: 'Log 100 total expenses',
    category: 'spending' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 500,
    coinReward: 250,
    target: 100,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-5-goals',
    title: 'Goal Crusher',
    description: 'Complete 5 savings goals',
    category: 'goals' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 400,
    coinReward: 200,
    target: 5,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-10-bills',
    title: 'Bill Master',
    description: 'Pay 10 bills',
    category: 'bills' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 300,
    coinReward: 150,
    target: 10,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-level-20',
    title: 'Financial Expert',
    description: 'Reach Level 20',
    category: 'streak' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 600,
    coinReward: 300,
    target: 20,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-streak-60',
    title: 'Two Month Legend',
    description: 'Maintain a 60-day streak',
    category: 'streak' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 800,
    coinReward: 400,
    target: 60,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-1000-coins',
    title: 'Coin Collector',
    description: 'Earn 1000 total coins',
    category: 'saving' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 350,
    coinReward: 150,
    target: 1000,
    done: false,
    progress: 0,
  },
  {
    id: 'achievement-50-bills',
    title: 'Bill Champion',
    description: 'Pay 50 bills',
    category: 'bills' as QuestCategory,
    type: 'achievement' as QuestType,
    xp: 700,
    coinReward: 350,
    target: 50,
    done: false,
    progress: 0,
  },
];

// Badge definitions
export const BADGE_DEFINITIONS: Omit<Badge, 'progress' | 'unlockedAt'>[] = [
  {
    id: 'badge-expense-bronze',
    name: 'Expense Tracker',
    description: 'Log 10 expenses',
    icon: '📝',
    tier: 'bronze',
    requirement: 10,
  },
  {
    id: 'badge-expense-silver',
    name: 'Diligent Logger',
    description: 'Log 50 expenses',
    icon: '📊',
    tier: 'silver',
    requirement: 50,
  },
  {
    id: 'badge-expense-gold',
    name: 'Master Tracker',
    description: 'Log 100 expenses',
    icon: '📈',
    tier: 'gold',
    requirement: 100,
  },
  {
    id: 'badge-streak-bronze',
    name: 'Consistent',
    description: '7-day streak',
    icon: '🔥',
    tier: 'bronze',
    requirement: 7,
  },
  {
    id: 'badge-streak-silver',
    name: 'Dedicated',
    description: '30-day streak',
    icon: '⭐',
    tier: 'silver',
    requirement: 30,
  },
  {
    id: 'badge-streak-gold',
    name: 'Unstoppable',
    description: '100-day streak',
    icon: '💎',
    tier: 'gold',
    requirement: 100,
  },
  {
    id: 'badge-streak-platinum',
    name: 'Legendary',
    description: '365-day streak',
    icon: '👑',
    tier: 'platinum',
    requirement: 365,
  },
  {
    id: 'badge-goals-bronze',
    name: 'Goal Setter',
    description: 'Complete 1 goal',
    icon: '🎯',
    tier: 'bronze',
    requirement: 1,
  },
  {
    id: 'badge-goals-silver',
    name: 'Goal Achiever',
    description: 'Complete 5 goals',
    icon: '🏆',
    tier: 'silver',
    requirement: 5,
  },
  {
    id: 'badge-goals-gold',
    name: 'Dream Chaser',
    description: 'Complete 10 goals',
    icon: '🌟',
    tier: 'gold',
    requirement: 10,
  },
  {
    id: 'badge-saver-bronze',
    name: 'Saver',
    description: 'Save ₱1,000',
    icon: '💰',
    tier: 'bronze',
    requirement: 1000,
  },
  {
    id: 'badge-saver-silver',
    name: 'Smart Saver',
    description: 'Save ₱5,000',
    icon: '💵',
    tier: 'silver',
    requirement: 5000,
  },
  {
    id: 'badge-saver-gold',
    name: 'Wealth Builder',
    description: 'Save ₱10,000',
    icon: '💎',
    tier: 'gold',
    requirement: 10000,
  },
  {
    id: 'badge-bills-bronze',
    name: 'Bill Payer',
    description: 'Pay 5 bills on time',
    icon: '📄',
    tier: 'bronze',
    requirement: 5,
  },
  {
    id: 'badge-bills-silver',
    name: 'Responsible',
    description: 'Pay 20 bills on time',
    icon: '✅',
    tier: 'silver',
    requirement: 20,
  },
  {
    id: 'badge-bills-gold',
    name: 'Never Late',
    description: 'Pay 50 bills on time',
    icon: '⚡',
    tier: 'gold',
    requirement: 50,
  },
];

// Initialize badges for a new user
export const initializeBadges = (): Badge[] => {
  return BADGE_DEFINITIONS.map(def => ({
    ...def,
    progress: 0,
    unlockedAt: undefined,
  }));
};

// Check if a quest should be completed based on progress
export const checkQuestCompletion = (quest: Quest): boolean => {
  return quest.progress >= quest.target && !quest.done;
};

// Update badge progress
export const updateBadgeProgress = (
  badges: Badge[],
  badgeId: string,
  progress: number
): Badge[] => {
  return badges.map(badge => {
    if (badge.id === badgeId) {
      const newProgress = Math.min(progress, badge.requirement);
      const shouldUnlock = newProgress >= badge.requirement && !badge.unlockedAt;
      
      return {
        ...badge,
        progress: newProgress,
        unlockedAt: shouldUnlock ? new Date().toISOString() : badge.unlockedAt,
      };
    }
    return badge;
  });
};

// Get all unlocked badges
export const getUnlockedBadges = (badges: Badge[]): Badge[] => {
  return badges.filter(badge => badge.unlockedAt);
};

// Get badge progress percentage
export const getBadgeProgress = (badge: Badge): number => {
  return Math.min((badge.progress / badge.requirement) * 100, 100);
};

// Award XP and calculate new level
export const awardXP = (currentXP: number, currentLevel: number, xpToAdd: number) => {
  const newXP = Math.min(currentXP + xpToAdd, 999_999);
  let level = currentLevel;
  
  while (newXP >= getXPForLevel(level + 1)) {
    level++;
  }
  
  return { xp: newXP, level, coinsEarned: Math.floor(xpToAdd / 10) };
};

// Check and update streak
export const updateStreak = (lastActive: string): { streak: number; isNewDay: boolean } => {
  const now = new Date();
  const last = new Date(lastActive);
  
  // Reset time to midnight for comparison
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  
  const daysDiff = Math.floor((todayMidnight.getTime() - lastMidnight.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day, no change
    return { streak: 0, isNewDay: false };
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    return { streak: 1, isNewDay: true };
  } else {
    // Streak broken, reset to 1
    return { streak: -999, isNewDay: true }; // Signal to reset
  }
};

// Check if daily quests need refresh
export const shouldRefreshDailyQuests = (quests: Quest[]): boolean => {
  const now = new Date();
  const dailyQuests = quests.filter(q => q.type === 'daily');
  
  if (dailyQuests.length === 0) return true;
  
  // Check if any daily quest has expired
  const hasExpired = dailyQuests.some(q => {
    if (!q.expiresAt) return false;
    return new Date(q.expiresAt) <= now;
  });
  
  return hasExpired;
};

// Get quest reward message
export const getQuestRewardMessage = (quest: Quest): string => {
  return `+${quest.xp} XP, +${quest.coinReward} coins`;
};

// Get level up message
export const getLevelUpMessage = (newLevel: number): string => {
  const messages = [
    `Level ${newLevel}! You're getting better at managing your finances! 🎉`,
    `Congratulations! You've reached Level ${newLevel}! 🌟`,
    `Level ${newLevel} achieved! Your financial skills are growing! 💪`,
    `You're now Level ${newLevel}! Keep up the great work! 🚀`,
    `Level ${newLevel} unlocked! You're becoming a finance master! ✨`,
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};
