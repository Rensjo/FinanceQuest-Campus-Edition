import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { BudgetState, Transaction, Gamification, Goal, Envelope, RecurringRule, MonthlyBudgetConfig } from '../types';
import { daysUntil } from '../utils/date';
import { 
  generateDailyQuests, 
  ACHIEVEMENT_QUESTS,
  shouldRefreshDailyQuests,
  BADGE_DEFINITIONS,
  getLevelFromXP
} from '../utils/gamification';

// Reusable list of default seeded bills so we can restore them if a user already had persisted data
const DEFAULT_BILLS: RecurringRule[] = [
  { 
    id: 'bill-electricity', 
    label: '⚡ Electricity Bill', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(15)).toISOString(), 
    envelopeId: 'buffer', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
  { 
    id: 'bill-water', 
    label: '💧 Water Bill', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(18)).toISOString(), 
    envelopeId: 'buffer', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
  { 
    id: 'bill-internet', 
    label: '🌐 Internet Bill', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(5)).toISOString(), 
    envelopeId: 'buffer', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
  { 
    id: 'bill-rent', 
    label: '🏠 Rent/Boarding', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(1)).toISOString(), 
    envelopeId: 'buffer', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
  { 
    id: 'bill-phone', 
    label: '📱 Mobile Plan', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(10)).toISOString(), 
    envelopeId: 'buffer', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
  { 
    id: 'bill-netflix', 
    label: '🎬 Netflix', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(20)).toISOString(), 
    envelopeId: 'fun', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
  { 
    id: 'bill-spotify', 
    label: '🎵 Spotify', 
    amount: 0, 
    interval: 'monthly', 
    nextRun: new Date(new Date().setDate(12)).toISOString(), 
    envelopeId: 'fun', 
    accountId: 'cash', 
    type: 'bill',
    isDefault: true 
  },
];


const awardXP = (g: Gamification, xp: number): Gamification => {
  const total = Math.min(g.xp + xp, 999_999);
  const need = (lvl: number) => Math.round(60 * Math.pow(lvl, 1.35));
  let level = g.level;
  while (total >= need(level + 1)) level++;
  return { ...g, xp: total, level, coins: g.coins + Math.floor(xp / 10) };
};

/**
 * Safe-to-Spend (STS) Formula:
 * STS = total_unallocated + carryover_balances - upcoming_bills(7d)
 */
const calculateSafeToSpend = (state: BudgetState): number => {
  // Sum of all envelope balances that allow carryover
  const carryoverSum = state.envelopes
    .filter(e => e.carryOver)
    .reduce((sum, e) => sum + e.balance, 0);
  
  // Calculate upcoming bills within 7 days
  const today = new Date();
  const upcomingBills = state.recurring
    .filter(r => r.type === 'bill' && daysUntil(r.nextRun) <= 7 && daysUntil(r.nextRun) >= 0)
    .reduce((sum, r) => sum + r.amount, 0);
  
  return carryoverSum - upcomingBills;
};


const seed = (): BudgetState => ({
prefs: { currency: 'PHP', locale: 'en-PH', theme: 'system', firstRunCompleted: true },
accounts: [ { id: 'cash', name: 'Cash', balance: 0 } ],
envelopes: [
{ id: 'food', name: 'Food', color: '#22c55e', monthlyBudget: 0, carryOver: true, balance: 0 },
{ id: 'transport', name: 'Transport', color: '#06b6d4', monthlyBudget: 0, carryOver: true, balance: 0 },
{ id: 'school', name: 'School', color: '#a78bfa', monthlyBudget: 0, carryOver: true, balance: 0 },
{ id: 'fun', name: 'Fun', color: '#f97316', monthlyBudget: 0, carryOver: false, balance: 0 },
{ id: 'savings', name: 'Savings', color: '#10b981', monthlyBudget: 0, carryOver: true, balance: 0 },
{ id: 'buffer', name: 'Buffer', color: '#64748b', monthlyBudget: 0, carryOver: true, balance: 0 },
],
goals: [ 
  { 
    id: 'emergency-fund', 
    name: 'Emergency Fund', 
    targetAmount: 10000, 
    saved: 0,
    linkedEnvelopeId: 'savings'
  },
  { 
    id: 'laptop', 
    name: 'New Laptop', 
    targetAmount: 30000, 
    saved: 0,
    targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 months from now
  },
  { 
    id: 'vacation', 
    name: 'Dream Vacation', 
    targetAmount: 15000, 
    saved: 0,
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
  }
],
transactions: [],
recurring: [ ...DEFAULT_BILLS ],
game: { 
  xp: 0, 
  level: 1, 
  streak: 0, 
  lastActive: new Date().toISOString(), 
  coins: 0, 
  achievements: [], 
  quests: [...generateDailyQuests(), ...ACHIEVEMENT_QUESTS],
  badges: BADGE_DEFINITIONS.map(b => ({ ...b, progress: 0 })),
  totalXpEarned: 0,
  totalCoinsEarned: 0,
  questsCompleted: 0,
  streakRecord: 0,
  lifetimeExpenses: 0,
  lifetimeBillPayments: 0,
  lifetimeGoalsCompleted: 0,
  dailySectionViews: {}
},
monthlyBudgets: [
  { id: 'budget-1', amount: 5000, source: 'allowance', frequency: 'weekly', label: 'Weekly Allowance', enabled: true }
],
currentMonth: new Date().toISOString().slice(0, 7), // "YYYY-MM"
monthlyHistory: []
});


interface BudgetActions {
  addTransaction: (t: Omit<Transaction, 'id'|'date'> & { date?: string; id?: string }) => void;
  allocateEnvelope: (id: string, delta: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'saved'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;
  addEnvelope: (envelope: Omit<Envelope, 'id' | 'balance'>) => void;
  updateEnvelope: (id: string, updates: Partial<Envelope>) => void;
  deleteEnvelope: (id: string) => void;
  addRecurring: (recurring: Omit<RecurringRule, 'id'>) => void;
  updateRecurring: (id: string, updates: Partial<RecurringRule>) => void;
  deleteRecurring: (id: string) => void;
  markBillPaid: (id: string) => void;
  addMonthlyBudget: (budget: Omit<MonthlyBudgetConfig, 'id'>) => void;
  updateMonthlyBudget: (id: string, updates: Partial<MonthlyBudgetConfig>) => void;
  deleteMonthlyBudget: (id: string) => void;
  getTotalMonthlyBudget: () => number;
  completeQuest: (questId: string) => void;
  refreshDailyQuests: () => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  updateAchievementQuests: () => void;
  checkAndAwardBadges: () => void;
  checkStreak: () => void;
  importTransactions: (txns: Transaction[]) => void;
  getSafeToSpend: () => number;
  resetData: () => void;
  restoreDefaultBills: () => void;
  initializeDefaultGoals: () => void;
  resetGoalsSavedAmounts: () => void;
  switchToMonth: (monthKey: string) => void; // Switch to a specific month (YYYY-MM)
  ensureAllAchievementQuests: () => void; // Ensure all achievement quests are present
  trackSectionView: (section: 'bills' | 'envelopes' | 'insights' | 'goals') => void; // Track section views for quests
  updateSoundSettings: (settings: Partial<BudgetState['prefs']['soundSettings']>) => void; // Update sound settings
}

export const useBudget = create(persist<BudgetState & BudgetActions>(
  (set, get) => ({
    ...seed(),

    addTransaction: (t) => set((s) => {
      const id = t.id ?? nanoid();
      const date = t.date ?? new Date().toISOString();
      const txn: Transaction = { ...t, id, date } as Transaction;

      // Update envelope balance based on transaction type
      const envelopes = s.envelopes.map(e => {
        if (e.id === txn.envelopeId) {
          if (txn.type === 'expense') {
            // Deduct from envelope for expenses
            return { ...e, balance: Math.max(0, e.balance - Math.abs(txn.amount)) };
          } else if (txn.type === 'income') {
            // Add to envelope for income
            return { ...e, balance: e.balance + Math.abs(txn.amount) };
          }
        }
        return e;
      });

      let game = awardXP(s.game, txn.type === 'expense' ? 5 : 15);
      
      // Increment lifetime counters for badges
      if (txn.type === 'expense') {
        game = { ...game, lifetimeExpenses: game.lifetimeExpenses + 1 };
      }
      if (txn.note?.includes('Bill payment')) {
        game = { ...game, lifetimeBillPayments: game.lifetimeBillPayments + 1 };
      }
      
      // Update quest progress for spending-related quests
      if (txn.type === 'expense') {
        const todayExpenses = s.transactions.filter(t => 
          t.type === 'expense' && 
          new Date(t.date).toDateString() === new Date().toDateString()
        ).length + 1; // +1 for current transaction
        
        // Track quest completions for XP/coin rewards
        let bonusXP = 0;
        let bonusCoins = 0;
        let questsCompleted = 0;
        
        const updatedQuests = game.quests.map(q => {
          // Update "Track Your Spending" quest (1 expense)
          if (q.category === 'spending' && q.target === 1 && !q.done) {
            const shouldComplete = todayExpenses >= 1;
            if (shouldComplete) {
              bonusXP += q.xp;
              bonusCoins += q.coinReward;
              questsCompleted++;
            }
            return { ...q, progress: todayExpenses, done: shouldComplete };
          }
          // Update "Diligent Tracker" quest (3 expenses)
          if (q.category === 'spending' && q.target === 3 && !q.done) {
            const shouldComplete = todayExpenses >= 3;
            if (shouldComplete) {
              bonusXP += q.xp;
              bonusCoins += q.coinReward;
              questsCompleted++;
            }
            return { ...q, progress: todayExpenses, done: shouldComplete };
          }
          return q;
        });
        
        // Apply bonus rewards if any quests were completed
        if (bonusXP > 0) {
          game = awardXP(game, bonusXP);
        }
        
        game = {
          ...game,
          quests: updatedQuests,
          coins: game.coins + bonusCoins,
          questsCompleted: game.questsCompleted + questsCompleted,
          totalCoinsEarned: game.totalCoinsEarned + bonusCoins
        };
      }

      const newState = { ...s, transactions: [txn, ...s.transactions], envelopes, game };
      
      // Update achievement quests after transaction
      setTimeout(() => get().updateAchievementQuests(), 0);
      
      return newState;
    }),

    allocateEnvelope: (id, delta) => set((s) => ({
      envelopes: s.envelopes.map(e => e.id === id ? { ...e, balance: Math.max(0, e.balance + delta) } : e)
    })),

    addGoal: (goal) => set((s) => ({
      goals: [...s.goals, { ...goal, id: nanoid(), saved: 0 }]
    })),

    updateGoal: (id, updates) => set((s) => ({
      goals: s.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    })),

    deleteGoal: (id) => set((s) => ({
      goals: s.goals.filter(g => g.id !== id)
    })),

    addToGoal: (id, amount) => set((s) => {
      const goal = s.goals.find(g => g.id === id);
      if (!goal) return s;

      const wasNotCompleted = goal.saved < goal.targetAmount;
      const updatedGoals = s.goals.map(g => g.id === id ? { ...g, saved: g.saved + amount } : g);
      const nowCompleted = (goal.saved + amount) >= goal.targetAmount;
      
      // Create a transaction for the goal contribution (shown as income/green in history)
      const transaction: Transaction = {
        id: nanoid(),
        date: new Date().toISOString(),
        amount: amount,
        type: 'income', // Show as green income in transaction history
        envelopeId: 'savings', // Link to savings envelope
        accountId: 'cash',
        merchant: `💰 ${goal.name}`,
        note: `Goal contribution: ${goal.name}`,
      };

      // Deduct from savings envelope balance
      const updatedEnvelopes = s.envelopes.map(e => 
        e.id === 'savings' 
          ? { ...e, balance: Math.max(0, e.balance - amount) }
          : e
      );

      let game = awardXP(s.game, 10);
      
      // Check if goal just got completed - increment lifetime counter
      if (wasNotCompleted && nowCompleted) {
        game = { ...game, lifetimeGoalsCompleted: game.lifetimeGoalsCompleted + 1 };
      }
      
      // Track quest completions for XP/coin rewards
      let bonusXP = 0;
      let bonusCoins = 0;
      let questsCompleted = 0;
      
      // Update quest progress for goal-related quests
      const updatedQuests = game.quests.map(q => {
        // Update "Goal Progress" quest
        if (q.category === 'goals' && q.title.includes('Goal Progress') && !q.done) {
          const newProgress = q.progress + 1;
          const shouldComplete = newProgress >= q.target;
          if (shouldComplete) {
            bonusXP += q.xp;
            bonusCoins += q.coinReward;
            questsCompleted++;
          }
          return { ...q, progress: newProgress, done: shouldComplete };
        }
        return q;
      });
      
      // Apply bonus rewards if any quests were completed
      if (bonusXP > 0) {
        game = awardXP(game, bonusXP);
      }
      
      game = {
        ...game,
        quests: updatedQuests,
        coins: game.coins + bonusCoins,
        questsCompleted: game.questsCompleted + questsCompleted,
        totalCoinsEarned: game.totalCoinsEarned + bonusCoins
      };
      
      const newState = { 
        ...s, 
        goals: updatedGoals, 
        transactions: [transaction, ...s.transactions],
        envelopes: updatedEnvelopes,
        game 
      };
      
      // Update achievement quests after goal contribution
      setTimeout(() => get().updateAchievementQuests(), 0);
      
      return newState;
    }),

    addEnvelope: (envelope) => set((s) => ({
      envelopes: [...s.envelopes, { ...envelope, id: nanoid(), balance: envelope.monthlyBudget }]
    })),

    updateEnvelope: (id, updates) => set((s) => ({
      envelopes: s.envelopes.map(e => {
        if (e.id !== id) return e;
        
        const updated = { ...e, ...updates };
        
        // If monthlyBudget is being updated and the old budget was 0, set balance to the new budget
        if (updates.monthlyBudget !== undefined && e.monthlyBudget === 0) {
          updated.balance = updates.monthlyBudget;
        }
        
        return updated;
      })
    })),

    deleteEnvelope: (id) => set((s) => ({
      envelopes: s.envelopes.filter(e => e.id !== id)
    })),

    addRecurring: (recurring) => set((s) => ({
      recurring: [...s.recurring, { ...recurring, id: nanoid() }]
    })),

    updateRecurring: (id, updates) => set((s) => ({
      recurring: s.recurring.map(r => r.id === id ? { ...r, ...updates } : r)
    })),

    deleteRecurring: (id) => set((s) => ({
      recurring: s.recurring.filter(r => r.id !== id)
    })),

    markBillPaid: (id) => set((s) => {
      const bill = s.recurring.find(r => r.id === id);
      if (!bill) return s;

      // Calculate next run date based on interval
      const nextRun = new Date(bill.nextRun);
      switch (bill.interval) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'biweekly':
          nextRun.setDate(nextRun.getDate() + 14);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }

      // Create transaction for the payment
      const transaction: Transaction = {
        id: nanoid(),
        date: new Date().toISOString(),
        amount: bill.amount,
        type: 'expense',
        envelopeId: bill.envelopeId,
        accountId: bill.accountId,
        merchant: bill.label,
        note: 'Bill payment (auto-logged)',
      };

      // Update envelope balance
      const envelopes = s.envelopes.map(e => 
        e.id === bill.envelopeId 
          ? { ...e, balance: Math.max(0, e.balance - bill.amount) }
          : e
      );

      let game = awardXP(s.game, 10); // Award XP for paying bills on time
      
      // Update quest progress for bill-related quests
      const todayBillsPaid = s.transactions.filter(t => 
        t.note?.includes('Bill payment') && 
        new Date(t.date).toDateString() === new Date().toDateString()
      ).length + 1; // +1 for current payment
      
      // Track quest completions for XP/coin rewards
      let bonusXP = 0;
      let bonusCoins = 0;
      let questsCompleted = 0;
      
      const updatedQuests = game.quests.map(q => {
        // Update "Bill Payer" quest
        if (q.category === 'bills' && q.title.includes('Bill Payer') && !q.done) {
          const shouldComplete = todayBillsPaid >= q.target;
          if (shouldComplete) {
            bonusXP += q.xp;
            bonusCoins += q.coinReward;
            questsCompleted++;
          }
          return { ...q, progress: todayBillsPaid, done: shouldComplete };
        }
        return q;
      });
      
      // Apply bonus rewards if any quests were completed
      if (bonusXP > 0) {
        game = awardXP(game, bonusXP);
      }
      
      game = {
        ...game,
        quests: updatedQuests,
        coins: game.coins + bonusCoins,
        questsCompleted: game.questsCompleted + questsCompleted,
        totalCoinsEarned: game.totalCoinsEarned + bonusCoins
      };

      const newState = {
        ...s,
        recurring: s.recurring.map(r => 
          r.id === id ? { ...r, nextRun: nextRun.toISOString() } : r
        ),
        transactions: [transaction, ...s.transactions],
        envelopes,
        game
      };
      
      // Update achievement quests after bill payment
      setTimeout(() => get().updateAchievementQuests(), 0);
      
      return newState;
    }),

    addMonthlyBudget: (budget) => set((s) => ({
      monthlyBudgets: [...s.monthlyBudgets, { ...budget, id: nanoid() }]
    })),

    updateMonthlyBudget: (id, updates) => set((s) => ({
      monthlyBudgets: s.monthlyBudgets.map(b => b.id === id ? { ...b, ...updates } : b)
    })),

    deleteMonthlyBudget: (id) => set((s) => ({
      monthlyBudgets: s.monthlyBudgets.filter(b => b.id !== id)
    })),

    getTotalMonthlyBudget: () => {
      const state = get();
      return state.monthlyBudgets
        .filter(b => b.enabled)
        .reduce((total, budget) => {
          // Convert to monthly equivalent
          let monthlyAmount = budget.amount;
          if (budget.frequency === 'weekly') {
            monthlyAmount = budget.amount * 4.33; // Average weeks per month
          } else if (budget.frequency === 'biweekly') {
            monthlyAmount = budget.amount * 2.17; // Average biweekly periods per month
          }
          return total + monthlyAmount;
        }, 0);
    },

    completeQuest: (questId) => set((s) => {
      const quest = s.game.quests.find(q => q.id === questId);
      if (!quest || quest.done) return s;
      
      const updatedGame = awardXP(s.game, quest.xp);
      
      return {
        ...s,
        game: {
          ...updatedGame,
          coins: updatedGame.coins + quest.coinReward,
          quests: s.game.quests.map(q => q.id === questId ? { ...q, done: true } : q),
          questsCompleted: s.game.questsCompleted + 1,
          totalXpEarned: s.game.totalXpEarned + quest.xp,
          totalCoinsEarned: s.game.totalCoinsEarned + quest.coinReward
        }
      };
    }),

    refreshDailyQuests: () => set((s) => {
      if (!shouldRefreshDailyQuests(s.game.quests)) return s;
      
      // Remove expired daily quests
      const nonDailyQuests = s.game.quests.filter(q => q.type !== 'daily');
      
      // Generate new daily quests
      const newDailyQuests = generateDailyQuests();
      
      return {
        ...s,
        game: {
          ...s.game,
          quests: [...nonDailyQuests, ...newDailyQuests]
        }
      };
    }),

    updateQuestProgress: (questId, progress) => set((s) => {
      // Find quest by exact ID or by base ID (for daily quests with date suffix)
      const quest = s.game.quests.find(q => q.id === questId || q.id.startsWith(questId + '-'));
      if (!quest || quest.done) return s;
      
      // Add to existing progress instead of replacing it
      const updatedProgress = Math.min(quest.progress + progress, quest.target);
      const shouldComplete = updatedProgress >= quest.target;
      
      let game = { ...s.game };
      
      // Update quest progress using the actual quest ID found
      game.quests = game.quests.map(q => 
        q.id === quest.id ? { ...q, progress: updatedProgress, done: shouldComplete } : q
      );
      
      // Auto-complete quest if target reached
      if (shouldComplete) {
        const updatedGame = awardXP(game, quest.xp);
        game = {
          ...updatedGame,
          quests: game.quests, // Keep the updated quests
          coins: updatedGame.coins + quest.coinReward,
          questsCompleted: game.questsCompleted + 1,
          totalXpEarned: game.totalXpEarned + quest.xp,
          totalCoinsEarned: game.totalCoinsEarned + quest.coinReward
        };
      }
      
      return { ...s, game };
    }),

    updateAchievementQuests: () => set((s) => {
      let game = { ...s.game };
      const level = getLevelFromXP(game.xp);
      
      // Update all achievement quests based on current stats
      game.quests = game.quests.map(quest => {
        if (quest.type !== 'achievement' || quest.done) return quest;
        
        let newProgress = quest.progress;
        
        // Update progress based on quest ID
        if (quest.id === 'achievement-first-expense') {
          newProgress = Math.min(game.lifetimeExpenses, quest.target);
        } else if (quest.id === 'achievement-10-expenses') {
          newProgress = Math.min(game.lifetimeExpenses, quest.target);
        } else if (quest.id === 'achievement-50-expenses') {
          newProgress = Math.min(game.lifetimeExpenses, quest.target);
        } else if (quest.id === 'achievement-100-expenses') {
          newProgress = Math.min(game.lifetimeExpenses, quest.target);
        } else if (quest.id === 'achievement-streak-7') {
          newProgress = Math.min(game.streak, quest.target);
        } else if (quest.id === 'achievement-streak-30') {
          newProgress = Math.min(game.streak, quest.target);
        } else if (quest.id === 'achievement-streak-60') {
          newProgress = Math.min(game.streak, quest.target);
        } else if (quest.id === 'achievement-goal-complete') {
          newProgress = Math.min(game.lifetimeGoalsCompleted, quest.target);
        } else if (quest.id === 'achievement-5-goals') {
          newProgress = Math.min(game.lifetimeGoalsCompleted, quest.target);
        } else if (quest.id === 'achievement-10-bills') {
          newProgress = Math.min(game.lifetimeBillPayments, quest.target);
        } else if (quest.id === 'achievement-50-bills') {
          newProgress = Math.min(game.lifetimeBillPayments, quest.target);
        } else if (quest.id === 'achievement-level-5') {
          newProgress = Math.min(level, quest.target);
        } else if (quest.id === 'achievement-level-10') {
          newProgress = Math.min(level, quest.target);
        } else if (quest.id === 'achievement-level-20') {
          newProgress = Math.min(level, quest.target);
        } else if (quest.id === 'achievement-1000-coins') {
          newProgress = Math.min(game.totalCoinsEarned, quest.target);
        }
        
        // Check if quest should be completed
        const shouldComplete = newProgress >= quest.target && !quest.done;
        
        if (shouldComplete) {
          // Award XP and coins
          const updatedGame = awardXP(game, quest.xp);
          game = {
            ...updatedGame,
            coins: updatedGame.coins + quest.coinReward,
            questsCompleted: game.questsCompleted + 1,
            totalXpEarned: game.totalXpEarned + quest.xp,
            totalCoinsEarned: game.totalCoinsEarned + quest.coinReward
          };
        }
        
        return { ...quest, progress: newProgress, done: shouldComplete };
      });
      
      return { ...s, game };
    }),

    checkAndAwardBadges: () => set((s) => {
      let updatedBadges = [...s.game.badges];
      let coinsAwarded = 0;
      
      // Check each badge for completion
      updatedBadges = updatedBadges.map(badge => {
        if (badge.unlockedAt) return badge; // Already unlocked
        
        let currentProgress = badge.progress;
        
        // Calculate progress based on badge category using LIFETIME counters
        if (badge.id.includes('expense')) {
          currentProgress = s.game.lifetimeExpenses; // Use lifetime counter, not current month
        } else if (badge.id.includes('streak')) {
          currentProgress = badge.id.includes('master') ? s.game.streakRecord : s.game.streak;
        } else if (badge.id.includes('goal')) {
          currentProgress = s.game.lifetimeGoalsCompleted; // Use lifetime counter
        } else if (badge.id.includes('saver')) {
          currentProgress = s.goals.reduce((sum, g) => sum + g.saved, 0); // Total saved is persistent
        } else if (badge.id.includes('bill')) {
          currentProgress = s.game.lifetimeBillPayments; // Use lifetime counter
        }
        
        // Check if badge should be unlocked
        if (currentProgress >= badge.requirement && !badge.unlockedAt) {
          coinsAwarded += 50; // Award coins for unlocking badge
          return {
            ...badge,
            progress: currentProgress,
            unlockedAt: new Date().toISOString()
          };
        }
        
        return { ...badge, progress: currentProgress };
      });
      
      return {
        ...s,
        game: {
          ...s.game,
          badges: updatedBadges,
          coins: s.game.coins + coinsAwarded,
          totalCoinsEarned: s.game.totalCoinsEarned + coinsAwarded
        }
      };
    }),

    checkStreak: () => set((s) => {
      const now = new Date();
      const last = new Date(s.game.lastActive);
      
      // Reset time to midnight for comparison
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      
      const daysDiff = Math.floor((todayMidnight.getTime() - lastMidnight.getTime()) / (1000 * 60 * 60 * 24));
      
      let newStreak = s.game.streak;
      let isNewDay = false;
      
      if (daysDiff === 0) {
        // Same day, no change
        return s;
      } else if (daysDiff === 1) {
        // Consecutive day, increase streak
        newStreak = s.game.streak + 1;
        isNewDay = true;
      } else if (daysDiff > 1) {
        // Missed a day, reset streak
        newStreak = 1;
        isNewDay = true;
      }
      
      return {
        ...s,
        game: {
          ...s.game,
          streak: newStreak,
          lastActive: now.toISOString(),
          streakRecord: Math.max(s.game.streakRecord, newStreak)
        }
      };
    }),

    importTransactions: (txns) => set((s) => ({
      transactions: [...txns, ...s.transactions],
      game: awardXP(s.game, 50) // Bonus for importing
    })),

    getSafeToSpend: () => calculateSafeToSpend(get()),

    resetData: () => set((s) => {
      // Reset current month - preserve specific data
      const currentMonthKey = new Date().toISOString().slice(0, 7);
      return {
        ...s,
        // Clear all transactions for current month
        transactions: [],
        // Reset envelope balances to their monthly budget amounts
        envelopes: s.envelopes.map(e => ({
          ...e,
          balance: e.monthlyBudget // Start fresh with monthly budget
        })),
        // Keep goals but preserve saved amounts and target dates
        goals: s.goals, // Goals carry over completely
        // Keep bills/recurring payments - only amounts and schedule
        recurring: s.recurring, // Bills carry over completely
        // Keep monthly budget configuration
        monthlyBudgets: s.monthlyBudgets, // Budget sources carry over
        // Reset accounts to 0
        accounts: s.accounts.map(a => ({ ...a, balance: 0 })),
        // Reset daily quests but keep achievements
        game: {
          ...s.game,
          quests: [...generateDailyQuests(), ...ACHIEVEMENT_QUESTS.filter(q => !q.done)] // Keep incomplete achievements
        },
        // Set to current month
        currentMonth: currentMonthKey,
        // Clear all historical data (optional - could keep if desired)
        monthlyHistory: []
        // prefs stay the same
      };
    }),
    
    restoreDefaultBills: () => set((s) => {
      const existingIds = new Set(s.recurring.map(r => r.id));
      const toAdd = DEFAULT_BILLS.filter(b => !existingIds.has(b.id));
      if (toAdd.length === 0) return s; // nothing new
      return { ...s, recurring: [...s.recurring, ...toAdd] };
    }),
    
    // Initialize default goals if they don't exist
    initializeDefaultGoals: () => set((s) => {
      const existingGoalIds = new Set(s.goals.map(g => g.id));
      const defaultGoals = [
        { 
          id: 'emergency-fund', 
          name: 'Emergency Fund', 
          targetAmount: 10000, 
          saved: 0,
          linkedEnvelopeId: 'savings'
        },
        { 
          id: 'vacation', 
          name: 'Dream Vacation', 
          targetAmount: 15000, 
          saved: 0,
          targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ];
      
      const toAdd = defaultGoals.filter(g => !existingGoalIds.has(g.id));
      if (toAdd.length === 0) return s;
      return { ...s, goals: [...s.goals, ...toAdd] };
    }),
    
    // Reset all goals' saved amounts to 0 (one-time fix for existing data)
    resetGoalsSavedAmounts: () => set((s) => ({
      ...s,
      goals: s.goals.map(g => ({ ...g, saved: 0 }))
    })),

    // Ensure all achievement quests are present (migration for existing users)
    ensureAllAchievementQuests: () => set((s) => {
      const existingQuestIds = new Set(s.game.quests.map(q => q.id));
      const missingQuests = ACHIEVEMENT_QUESTS.filter(q => !existingQuestIds.has(q.id));
      
      if (missingQuests.length === 0) return s;
      
      console.log(`Adding ${missingQuests.length} missing achievement quests:`, missingQuests.map(q => q.title));
      
      return {
        ...s,
        game: {
          ...s.game,
          quests: [...s.game.quests, ...missingQuests]
        }
      };
    }),

    // Track section views for daily quest progression
    trackSectionView: (section) => set((s) => {
      // Initialize dailySectionViews if it doesn't exist (for existing users)
      if (!s.game.dailySectionViews) {
        s.game.dailySectionViews = {};
      }
      
      const today = new Date().toDateString();
      const lastView = s.game.dailySectionViews?.[section];
      
      // Only update if not viewed today
      if (lastView && new Date(lastView).toDateString() === today) {
        return s; // Already viewed today, no update needed
      }
      
      const updatedGame = { 
        ...s.game, 
        dailySectionViews: {
          ...(s.game.dailySectionViews || {}),
          [section]: new Date().toISOString()
        }
      };
      
      // Update relevant daily quests
      let bonusXP = 0;
      let bonusCoins = 0;
      let questsCompleted = 0;
      
      updatedGame.quests = updatedGame.quests.map(q => {
        // Bill Awareness quest - only completes when bills section is clicked
        if (section === 'bills' && q.id.includes('daily-check-bills') && !q.done) {
          const shouldComplete = true;
          if (shouldComplete) {
            bonusXP += q.xp;
            bonusCoins += q.coinReward;
            questsCompleted++;
          }
          return { ...q, progress: 1, done: shouldComplete };
        }
        // Budget Review quest - completes when envelopes section is viewed
        if (section === 'envelopes' && q.id.includes('daily-review-envelopes') && !q.done) {
          const shouldComplete = true;
          if (shouldComplete) {
            bonusXP += q.xp;
            bonusCoins += q.coinReward;
            questsCompleted++;
          }
          return { ...q, progress: 1, done: shouldComplete };
        }
        // Financial Insights quest - completes when insights section is viewed
        if (section === 'insights' && q.id.includes('daily-check-insights') && !q.done) {
          const shouldComplete = true;
          if (shouldComplete) {
            bonusXP += q.xp;
            bonusCoins += q.coinReward;
            questsCompleted++;
          }
          return { ...q, progress: 1, done: shouldComplete };
        }
        return q;
      });
      
      // Apply bonus rewards if any quests were completed
      if (bonusXP > 0) {
        const gameWithXP = awardXP(updatedGame, bonusXP);
        return {
          ...s,
          game: {
            ...gameWithXP,
            coins: gameWithXP.coins + bonusCoins,
            questsCompleted: gameWithXP.questsCompleted + questsCompleted,
            totalCoinsEarned: gameWithXP.totalCoinsEarned + bonusCoins
          }
        };
      }
      
      return { ...s, game: updatedGame };
    }),
    
    // Switch to a different month (archives current month and loads/creates target month)
    switchToMonth: (monthKey: string) => set((s) => {
      // If already on this month, do nothing
      if (s.currentMonth === monthKey) return s;
      
      // Archive current month's data before switching
      const currentMonthData: import('../types').MonthlyData = {
        monthKey: s.currentMonth,
        transactions: s.transactions,
        envelopeBalances: s.envelopes.reduce((acc, e) => {
          acc[e.id] = e.balance;
          return acc;
        }, {} as Record<string, number>)
      };
      
      // Remove old entry for current month if it exists, then add updated version
      const updatedHistory = [
        ...s.monthlyHistory.filter(m => m.monthKey !== s.currentMonth),
        currentMonthData
      ];
      
      // Try to load data for the target month from history
      const targetMonthData = updatedHistory.find(m => m.monthKey === monthKey);
      
      if (targetMonthData) {
        // Restore data from history - ONLY transactions from that specific month
        return {
          ...s,
          currentMonth: monthKey,
          transactions: targetMonthData.transactions,
          envelopes: s.envelopes.map(e => ({
            ...e,
            balance: targetMonthData.envelopeBalances[e.id] ?? e.monthlyBudget
          })),
          monthlyHistory: updatedHistory
          // Keep game state (quests, achievements, etc.) - they are global, not month-specific
        };
      } else {
        // Create fresh data for new month - start with empty transactions
        return {
          ...s,
          currentMonth: monthKey,
          transactions: [], // Empty array - no historical data to show
          envelopes: s.envelopes.map(e => ({
            ...e,
            balance: e.monthlyBudget // Start with monthly budget
          })),
          accounts: s.accounts.map(a => ({ ...a, balance: 0 })),
          monthlyHistory: updatedHistory
          // Keep game state (quests, achievements, etc.) - they are global, not month-specific
        };
      }
    }),

    // Update sound settings
    updateSoundSettings: (settings) => set((s) => {
      // Ensure soundSettings exists with defaults
      const currentSoundSettings = s.prefs.soundSettings || {
        masterVolume: 0.7,
        sfxEnabled: true,
        musicEnabled: false,
        sfxVolume: 0.8,
        musicVolume: 0.5
      };
      
      return {
        ...s,
        prefs: {
          ...s.prefs,
          soundSettings: {
            ...currentSoundSettings,
            ...settings
          }
        }
      };
    })
  }),
  { 
    name: 'financequest',
    version: 1,
    migrate: (persistedState: any, version: number) => {
      // Migration for sound settings (version 0 -> 1)
      if (version === 0 || !persistedState.prefs?.soundSettings) {
        return {
          ...persistedState,
          prefs: {
            ...persistedState.prefs,
            soundSettings: {
              masterVolume: 0.7,
              sfxEnabled: true,
              musicEnabled: false,
              sfxVolume: 0.8,
              musicVolume: 0.5
            }
          }
        };
      }
      return persistedState;
    }
  }
));