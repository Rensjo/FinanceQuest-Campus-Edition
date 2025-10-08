import { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { useBudget } from '../store/budget';
// import { useSound } from '../hooks/useSound'; // No longer needed - global click sounds in App.tsx
import { AdventurerStatus } from './AdventurerStatus';
import MonthlyOverview from './MonthlyOverview';
import GeneralAnalytics from './GeneralAnalytics';
import BillsSection from './BillsSection';
import ExpenseTracker from './ExpenseTracker';
import SpendingChart from './SpendingChart';
import GoalCard from './GoalCard';
import EnvelopeCard from './EnvelopeCard';
import EnvelopeModal from './EnvelopeModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import GoalModal from './GoalModal';
import DeleteGoalModal from './DeleteGoalModal';
import BudgetConfigModal from './BudgetConfigModal';
import BudgetSourceCard from './BudgetSourceCard';
import QuickAdd from './QuickAdd';
import MonthlyOverviewBreakdownOnly from './MonthlyOverviewBreakdownOnly';
import MonthlyStatsGrid from './MonthlyStatsGrid';
import Shop from './Shop';
import BadgesPanel from './BadgesPanel';
import StatusPanel from './StatusPanel';
import SettingsPanel from './SettingsPanel';
import MonthNavigator from './MonthNavigator';
import { formatCurrency } from '../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';
import type { Envelope, Goal, MonthlyBudgetConfig } from '../types';


export default function Dashboard(){
  // Sound effects - now handled globally in App.tsx
  // const playClickSound = useSound('button-click');
  
  const [isEnvelopeModalOpen, setIsEnvelopeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | undefined>(undefined);
  const [deletingEnvelope, setDeletingEnvelope] = useState<Envelope | null>(null);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDeleteGoalModalOpen, setIsDeleteGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<MonthlyBudgetConfig | null>(null);
  
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Month navigation state with slide direction tracking
  // Initialize to first day of current month to avoid timezone issues
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  const { 
    envelopes, 
    transactions, 
    goals, 
    game, 
    prefs, 
    currentMonth,
    getSafeToSpend, 
    deleteEnvelope, 
    deleteGoal,
    addMonthlyBudget,
    updateMonthlyBudget,
    deleteMonthlyBudget,
    getTotalMonthlyBudget,
    checkStreak,
    refreshDailyQuests,
    checkAndAwardBadges,
    updateAchievementQuests,
    initializeDefaultGoals,
    ensureAllAchievementQuests,
    switchToMonth
  } = useBudget(s=>({
    envelopes: s.envelopes,
    transactions: s.transactions,
    goals: s.goals,
    game: s.game,
    prefs: s.prefs,
    currentMonth: s.currentMonth,
    getSafeToSpend: s.getSafeToSpend,
    deleteEnvelope: s.deleteEnvelope,
    deleteGoal: s.deleteGoal,
    addMonthlyBudget: s.addMonthlyBudget,
    updateMonthlyBudget: s.updateMonthlyBudget,
    deleteMonthlyBudget: s.deleteMonthlyBudget,
    getTotalMonthlyBudget: s.getTotalMonthlyBudget,
    checkStreak: s.checkStreak,
    refreshDailyQuests: s.refreshDailyQuests,
    checkAndAwardBadges: s.checkAndAwardBadges,
    updateAchievementQuests: s.updateAchievementQuests,
    initializeDefaultGoals: s.initializeDefaultGoals,
    ensureAllAchievementQuests: s.ensureAllAchievementQuests,
    switchToMonth: s.switchToMonth
  }));

  // Check streak, refresh quests, ensure all achievement quests, update achievements, and initialize default goals on component mount
  useEffect(() => {
    ensureAllAchievementQuests(); // Add missing achievement quests for existing users
    checkStreak();
    refreshDailyQuests();
    updateAchievementQuests();
    checkAndAwardBadges();
    initializeDefaultGoals();
  }, [ensureAllAchievementQuests, checkStreak, refreshDailyQuests, updateAchievementQuests, checkAndAwardBadges, initializeDefaultGoals]);

  // Month navigation handlers with slide direction
  const handlePreviousMonth = () => {
    setSlideDirection('left');
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    setSlideDirection('right');
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setSelectedDate(newDate);
  };

  // Handle date change from MonthNavigator (determine direction based on date comparison)
  const handleDateChange = (newDate: Date) => {
    const oldMonth = selectedDate.getMonth() + selectedDate.getFullYear() * 12;
    const newMonth = newDate.getMonth() + newDate.getFullYear() * 12;
    setSlideDirection(newMonth > oldMonth ? 'right' : 'left');
    setSelectedDate(newDate);
  };
  
  // Automatically switch months when selectedDate changes
  useEffect(() => {
    const selectedMonthKey = selectedDate.toISOString().slice(0, 7); // "YYYY-MM"
    if (selectedMonthKey !== currentMonth) {
      switchToMonth(selectedMonthKey);
    }
  }, [selectedDate, currentMonth, switchToMonth]);

  // Periodically check badge progress (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndAwardBadges();
    }, 5000);
    return () => clearInterval(interval);
  }, [checkAndAwardBadges]);

  const handleEditEnvelope = (envelope: Envelope) => {
    // playClickSound(); // Now handled globally
    setEditingEnvelope(envelope);
    setIsEnvelopeModalOpen(true);
  };

  const handleDeleteEnvelope = (envelope: Envelope) => {
    // playClickSound(); // Now handled globally
    setDeletingEnvelope(envelope);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // playClickSound(); // Now handled globally
    if (deletingEnvelope) {
      deleteEnvelope(deletingEnvelope.id);
      setDeletingEnvelope(null);
    }
  };

  const handleAddNew = () => {
    // playClickSound(); // Now handled globally
    setEditingEnvelope(undefined);
    setIsEnvelopeModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    // playClickSound(); // Now handled globally
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setDeletingGoal(goal);
    setIsDeleteGoalModalOpen(true);
  };

  const confirmDeleteGoal = () => {
    if (deletingGoal) {
      deleteGoal(deletingGoal.id);
      setDeletingGoal(null);
    }
  };

  const handleAddNewGoal = () => {
    setEditingGoal(undefined);
    setIsGoalModalOpen(true);
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsBudgetModalOpen(true);
  };

  const handleEditBudget = (budget: MonthlyBudgetConfig) => {
    setEditingBudget(budget);
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = (budgetData: Omit<MonthlyBudgetConfig, 'id'>) => {
    if (editingBudget) {
      updateMonthlyBudget(editingBudget.id, budgetData);
    } else {
      addMonthlyBudget(budgetData);
    }
    setIsBudgetModalOpen(false);
    setEditingBudget(null);
  };

  const safeToSpend = getSafeToSpend();
  const totalBalance = envelopes.reduce((sum,e)=> sum + e.balance, 0);
  const totalMonthlyBudget = getTotalMonthlyBudget();
  const totalSpent = envelopes.reduce((sum, e) => sum + (e.monthlyBudget - e.balance), 0);
  const leftToSpend = totalMonthlyBudget - totalSpent;
  
  // Left to spend status colors
  const leftToSpendStatus = leftToSpend >= totalMonthlyBudget * 0.3 ? 'text-emerald-400' : 
                            leftToSpend >= totalMonthlyBudget * 0.1 ? 'text-amber-400' : 'text-red-400';


return (
    <div className="space-y-8">
      {/* Enhanced Header - Dashboard Overview */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700/30 backdrop-blur-sm bg-white/80 dark:bg-neutral-900/60 shadow-lg dark:shadow-black/20"
      >
        {/* Ambient background gradient orbs */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%)' }}
        />
        
        {/* Subtle animated shimmer */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          }}
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="relative z-10 flex items-center justify-between gap-6 p-6">
          {/* Left: Logo & Month Navigator */}
          <div className="flex items-center gap-4">
            {/* Enhanced Logo */}
            <motion.div
              className="relative rounded-xl flex items-center justify-center backdrop-blur-sm group overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                width: '64px',
                height: '64px',
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img 
                src="/icons/financeQuest_Icon.png"
                alt="FinanceQuest Logo"
                className="w-10 h-10 object-contain"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
            </motion.div>

            {/* Month Navigator Section - matches logo height */}
            <div className="flex flex-col justify-center h-16">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold uppercase tracking-widest">
                  Dashboard Overview
                </span>
                <motion.div 
                  className="h-1 rounded-full"
                  style={{
                    width: '48px',
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              {/* Month Navigator (with integrated arrows) */}
              <MonthNavigator 
                currentDate={selectedDate} 
                onDateChange={handleDateChange}
              />
            </div>
          </div>

          {/* Right: Adventurer Status with all action buttons inside */}
          <AdventurerStatus
            compact={true}
            onStatusClick={() => { /* playClickSound(); */ setIsStatusOpen(true); }}
            onBadgesClick={() => { /* playClickSound(); */ setIsBadgesOpen(true); }}
            onShopClick={() => { /* playClickSound(); */ setIsShopOpen(true); }}
            onSettingsClick={() => { /* playClickSound(); */ setIsSettingsOpen(true); }}
          />
        </div>
      </motion.div>

      {/* Dashboard Content with Slide Animation */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentMonth}
          initial={{ 
            x: slideDirection === 'right' ? '100%' : '-100%',
            opacity: 0 
          }}
          animate={{ 
            x: 0,
            opacity: 1 
          }}
          exit={{ 
            x: slideDirection === 'right' ? '-100%' : '100%',
            opacity: 0 
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="space-y-6"
        >

        {/* Monthly Overview - Charts & Stats */}
        <section>
          <MonthlyOverview selectedDate={selectedDate} />
        </section>

      {/* Monthly Budget Configuration & Expense Tracker Row */}
      <div className="grid md:grid-cols-2 gap-6" style={{ maxHeight: '500px' }}>
        {/* Monthly Budget Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card relative overflow-hidden flex flex-col"
          style={{ maxHeight: '500px' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💰</span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Monthly Budget</span>
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            <BudgetSourceCard 
              onAddNew={handleAddBudget}
              onEdit={handleEditBudget}
              onDelete={deleteMonthlyBudget}
            />
          </div>
        </motion.section>

        {/* Expense Tracker */}
        <section className="flex flex-col h-full" style={{ maxHeight: '500px' }}>
          <ExpenseTracker />
        </section>
      </div>

      {/* General Analytics Section */}
      <section>
        <GeneralAnalytics />
      </section>

      {/* Bills Section */}
      <section>
        <BillsSection />
      </section>

      {/* Envelopes Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>💼</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Budget Envelopes</span>
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 ml-8">Allocate your budget into categories • Click edit to set amounts</p>
          </div>
          
          {/* Add New Category Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              boxShadow: '0 0 20px #a855f740, 0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            <Plus className="size-4" />
            <span>Add Category</span>
          </motion.button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {envelopes.map((e, index) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <EnvelopeCard 
                envelope={e} 
                onEdit={handleEditEnvelope}
                onDelete={handleDeleteEnvelope}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Goals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🎯</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Savings Goals</span>
          </h2>
          
          {/* Add New Goal Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNewGoal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              boxShadow: '0 0 20px #06b6d440, 0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            <Plus className="size-4" />
            <span>Add Goal</span>
          </motion.button>
        </div>

        {goals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g, index) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <GoalCard 
                  goal={g} 
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-300 mb-2">No Savings Goals Yet</h3>
            <p className="text-neutral-600 dark:text-neutral-500 mb-6">Start saving for something special!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNewGoal}
              className="px-6 py-3 rounded-xl font-semibold"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: '0 0 20px #06b6d440',
              }}
            >
              Create Your First Goal
            </motion.button>
          </div>
        )}
      </motion.section>

        {/* Spending Chart */}
        <section>
          <SpendingChart />
        </section>
        </motion.div>
      </AnimatePresence>

      {/* Envelope Modals */}
      <EnvelopeModal
        isOpen={isEnvelopeModalOpen}
        onClose={() => {
          setIsEnvelopeModalOpen(false);
          setEditingEnvelope(undefined);
        }}
        envelope={editingEnvelope}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEnvelope(null);
        }}
        onConfirm={confirmDelete}
        envelope={deletingEnvelope}
      />

      {/* Goal Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(undefined);
        }}
        goal={editingGoal}
      />
      
      <DeleteGoalModal
        isOpen={isDeleteGoalModalOpen}
        onClose={() => {
          setIsDeleteGoalModalOpen(false);
          setDeletingGoal(null);
        }}
        onConfirm={confirmDeleteGoal}
        goal={deletingGoal}
      />

      <BudgetConfigModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        onSave={handleSaveBudget}
        editingBudget={editingBudget}
      />

      {/* Shop Floating Panel */}
      <Shop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />

      {/* Badges Floating Panel */}
      <BadgesPanel isOpen={isBadgesOpen} onClose={() => setIsBadgesOpen(false)} />

      {/* Status Floating Panel */}
      <StatusPanel isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />

      {/* Settings Floating Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}