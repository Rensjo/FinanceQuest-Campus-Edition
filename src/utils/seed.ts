/**
 * Seed data templates for FinanceQuest
 */

import { nanoid } from 'nanoid';
import type { BudgetState, Envelope, Account, Quest, Achievement } from '../types';

export type PersonaType = 'student' | 'youngpro';

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'cash', name: 'Cash', balance: 0 },
  { id: 'bank', name: 'Bank Account', balance: 0 },
];

const STUDENT_ENVELOPES: Omit<Envelope, 'id'>[] = [
  { name: 'Food', color: '#22c55e', monthlyBudget: 2500, carryOver: true, balance: 2500 },
  { name: 'Transport', color: '#06b6d4', monthlyBudget: 1000, carryOver: true, balance: 1000 },
  { name: 'School', color: '#a78bfa', monthlyBudget: 2000, carryOver: true, balance: 2000 },
  { name: 'Fun', color: '#f97316', monthlyBudget: 1000, carryOver: false, balance: 1000 },
  { name: 'Savings', color: '#10b981', monthlyBudget: 1500, carryOver: true, balance: 1500 },
  { name: 'Buffer', color: '#64748b', monthlyBudget: 1000, carryOver: true, balance: 1000 },
];

const YOUNGPRO_ENVELOPES: Omit<Envelope, 'id'>[] = [
  { name: 'Rent', color: '#ef4444', monthlyBudget: 10000, carryOver: true, balance: 10000 },
  { name: 'Utilities', color: '#f59e0b', monthlyBudget: 2500, carryOver: true, balance: 2500 },
  { name: 'Groceries', color: '#22c55e', monthlyBudget: 4500, carryOver: true, balance: 4500 },
  { name: 'Transport', color: '#06b6d4', monthlyBudget: 2000, carryOver: true, balance: 2000 },
  { name: 'Fun', color: '#f97316', monthlyBudget: 3000, carryOver: false, balance: 3000 },
  { name: 'Savings', color: '#10b981', monthlyBudget: 7000, carryOver: true, balance: 7000 },
  { name: 'Buffer', color: '#64748b', monthlyBudget: 2500, carryOver: true, balance: 2500 },
];

const STARTER_QUESTS: Quest[] = [
  { id: 'q1', title: 'Set 5 envelopes', done: false, xp: 50 },
  { id: 'q2', title: 'Create your first goal', done: false, xp: 30 },
  { id: 'q3', title: 'Log 3 expenses today', done: false, xp: 40 },
  { id: 'q4', title: 'Finish your first weekly review', done: false, xp: 60 },
  { id: 'q5', title: 'Stay under budget for 7 days', done: false, xp: 100 },
];

const ACHIEVEMENTS_CATALOG: Omit<Achievement, 'achievedAt'>[] = [
  { id: 'ach_first_10', title: 'First 10 Transactions' },
  { id: 'ach_1k_saved', title: 'Saved ₱1,000' },
  { id: 'ach_30_streak', title: '30-Day Streak' },
  { id: 'ach_90_streak', title: '90-Day Streak' },
  { id: 'ach_3mo_budget', title: '3 Months Under Budget' },
  { id: 'ach_csv_master', title: 'CSV Master' },
  { id: 'ach_debt_1', title: 'Debt Slayer I' },
];

export function seedStudent(): BudgetState {
  return {
    prefs: {
      currency: 'PHP',
      locale: 'en-PH',
      theme: 'system',
      firstRunCompleted: true,
      soundSettings: {
        masterVolume: 0.7,
        sfxEnabled: true,
        musicEnabled: false,
        sfxVolume: 0.8,
        musicVolume: 0.5
      }
    },
    accounts: DEFAULT_ACCOUNTS,
    envelopes: STUDENT_ENVELOPES.map(e => ({ ...e, id: nanoid() })),
    goals: [
      {
        id: nanoid(),
        name: 'Laptop Fund',
        targetAmount: 30000,
        saved: 0,
        targetDate: undefined,
      },
    ],
    transactions: [],
    recurring: [],
    game: {
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: new Date().toISOString(),
      coins: 0,
      achievements: ACHIEVEMENTS_CATALOG.map(a => ({ ...a, achievedAt: undefined })),
      quests: [...STARTER_QUESTS],
    },
  };
}

export function seedYoungPro(): BudgetState {
  return {
    prefs: {
      currency: 'PHP',
      locale: 'en-PH',
      theme: 'system',
      firstRunCompleted: true,
      soundSettings: {
        masterVolume: 0.7,
        sfxEnabled: true,
        musicEnabled: false,
        sfxVolume: 0.8,
        musicVolume: 0.5
      }
    },
    accounts: DEFAULT_ACCOUNTS,
    envelopes: YOUNGPRO_ENVELOPES.map(e => ({ ...e, id: nanoid() })),
    goals: [
      {
        id: nanoid(),
        name: 'Emergency Fund',
        targetAmount: 50000,
        saved: 0,
        targetDate: undefined,
      },
      {
        id: nanoid(),
        name: 'Vacation Fund',
        targetAmount: 20000,
        saved: 0,
        targetDate: undefined,
      },
    ],
    transactions: [],
    recurring: [],
    game: {
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: new Date().toISOString(),
      coins: 0,
      achievements: ACHIEVEMENTS_CATALOG.map(a => ({ ...a, achievedAt: undefined })),
      quests: [...STARTER_QUESTS],
    },
  };
}

export function seedByPersona(persona: PersonaType): BudgetState {
  return persona === 'student' ? seedStudent() : seedYoungPro();
}
