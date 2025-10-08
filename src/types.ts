export type Currency = 'PHP'|'USD'|'EUR';
export type Interval = 'daily'|'weekly'|'biweekly'|'monthly';
export type IncomeSource = 'allowance'|'income'|'passive-income'|'pension'|'other';
export type IncomeFrequency = 'weekly'|'biweekly'|'monthly';


export interface UserPrefs {
currency: Currency;
locale: string; // e.g., 'en-PH'
theme: 'light'|'dark'|'system';
firstRunCompleted: boolean;
// Sound settings
soundSettings: {
  masterVolume: number; // 0-1
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number; // 0-1
  musicVolume: number; // 0-1
};
}

export interface MonthlyBudgetConfig {
  id: string;
  amount: number;
  source: IncomeSource;
  frequency: IncomeFrequency;
  label?: string;
  enabled: boolean;
}

export interface Account { id: string; name: string; balance: number; }
export interface Envelope { id: string; name: string; color: string; monthlyBudget: number; carryOver: boolean; balance: number; }
export interface Goal { id: string; name: string; targetAmount: number; targetDate?: string; saved: number; linkedEnvelopeId?: string; }
export interface Transaction { id: string; date: string; amount: number; type: 'expense'|'income'|'transfer'; envelopeId?: string; accountId: string; merchant?: string; note?: string; tags?: string[]; }
export interface RecurringRule { id: string; label: string; amount: number; interval: Interval; nextRun: string; envelopeId?: string; accountId: string; type: 'bill'|'income'; isDefault?: boolean; }
export type QuestType = 'daily' | 'weekly' | 'achievement';
export type QuestCategory = 'spending' | 'saving' | 'bills' | 'goals' | 'streak';

export interface Quest { 
  id: string; 
  title: string; 
  description: string;
  type: QuestType;
  category: QuestCategory;
  done: boolean; 
  xp: number;
  coinReward: number;
  progress: number;
  target: number;
  expiresAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  progress: number;
  requirement: number;
}

export interface Achievement { 
  id: string; 
  title: string; 
  description: string;
  achievedAt?: string;
  xp: number;
  coins: number;
}

export interface Gamification { 
  xp: number; 
  level: number; 
  streak: number; 
  lastActive: string; 
  coins: number; 
  achievements: Achievement[]; 
  quests: Quest[];
  badges: Badge[];
  totalXpEarned: number;
  totalCoinsEarned: number;
  questsCompleted: number;
  streakRecord: number;
  // Lifetime counters for badge progress (persist across months)
  lifetimeExpenses: number;
  lifetimeBillPayments: number;
  lifetimeGoalsCompleted: number;
  // Daily section view tracking (resets daily)
  dailySectionViews: {
    bills?: string; // ISO date string of last view
    envelopes?: string;
    insights?: string;
    goals?: string;
  };
}
export interface MonthlyData {
  monthKey: string; // Format: "YYYY-MM"
  transactions: Transaction[];
  envelopeBalances: Record<string, number>; // envelope id -> balance
}

export interface BudgetState { 
  prefs: UserPrefs; 
  accounts: Account[]; 
  envelopes: Envelope[]; 
  goals: Goal[]; 
  transactions: Transaction[]; 
  recurring: RecurringRule[]; 
  game: Gamification; 
  monthlyBudgets: MonthlyBudgetConfig[];
  currentMonth: string; // Format: "YYYY-MM"
  monthlyHistory: MonthlyData[]; // Historical data for past months
}