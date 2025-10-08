# 🏆 Achievement Quests - Complete List

## Overview
Achievement quests are permanent challenges that track your progress across all months. They automatically update and reward you when completed!

---

## 📊 Original Achievement Quests (6)

### 1. **First Steps** 💸
- **Description**: Log your first expense
- **Target**: 1 expense
- **Rewards**: 50 XP + 25 coins
- **Tracks**: `lifetimeExpenses`

### 2. **Tracking Habit** 💸
- **Description**: Log 10 total expenses
- **Target**: 10 expenses
- **Rewards**: 100 XP + 50 coins
- **Tracks**: `lifetimeExpenses`

### 3. **Week Warrior** 🔥
- **Description**: Maintain a 7-day streak
- **Target**: 7 days
- **Rewards**: 150 XP + 75 coins
- **Tracks**: `streak`

### 4. **Monthly Master** 🔥
- **Description**: Maintain a 30-day streak
- **Target**: 30 days
- **Rewards**: 500 XP + 250 coins
- **Tracks**: `streak`

### 5. **Goal Achieved** 🎯
- **Description**: Complete your first savings goal
- **Target**: 1 goal
- **Rewards**: 200 XP + 100 coins
- **Tracks**: `lifetimeGoalsCompleted`

### 6. **Rising Star** ⭐
- **Description**: Reach Level 5
- **Target**: Level 5
- **Rewards**: 100 XP + 50 coins
- **Tracks**: `level (from XP)`

### 7. **Finance Pro** ⭐
- **Description**: Reach Level 10
- **Target**: Level 10
- **Rewards**: 250 XP + 125 coins
- **Tracks**: `level (from XP)`

---

## 🆕 NEW Achievement Quests (8)

### 8. **Expense Master** 💸
- **Description**: Log 50 total expenses
- **Target**: 50 expenses
- **Rewards**: 300 XP + 150 coins
- **Tracks**: `lifetimeExpenses`

### 9. **Ultimate Tracker** 💸
- **Description**: Log 100 total expenses
- **Target**: 100 expenses
- **Rewards**: 500 XP + 250 coins
- **Tracks**: `lifetimeExpenses`

### 10. **Goal Crusher** 🎯
- **Description**: Complete 5 savings goals
- **Target**: 5 goals
- **Rewards**: 400 XP + 200 coins
- **Tracks**: `lifetimeGoalsCompleted`

### 11. **Bill Master** 📄
- **Description**: Pay 10 bills
- **Target**: 10 bills
- **Rewards**: 300 XP + 150 coins
- **Tracks**: `lifetimeBillPayments`

### 12. **Financial Expert** ⭐
- **Description**: Reach Level 20
- **Target**: Level 20
- **Rewards**: 600 XP + 300 coins
- **Tracks**: `level (from XP)`

### 13. **Two Month Legend** 🔥
- **Description**: Maintain a 60-day streak
- **Target**: 60 days
- **Rewards**: 800 XP + 400 coins
- **Tracks**: `streak`

### 14. **Coin Collector** 💰
- **Description**: Earn 1000 total coins
- **Target**: 1000 coins
- **Rewards**: 350 XP + 150 coins
- **Tracks**: `totalCoinsEarned`

### 15. **Bill Champion** 📄
- **Description**: Pay 50 bills
- **Target**: 50 bills
- **Rewards**: 700 XP + 350 coins
- **Tracks**: `lifetimeBillPayments`

---

## 🎮 How Achievement Quests Work

### Automatic Tracking
Achievement quests automatically track your progress using **lifetime counters**:
- ✅ **Expenses**: Every transaction logged increments `lifetimeExpenses`
- ✅ **Goals**: Every completed goal increments `lifetimeGoalsCompleted`
- ✅ **Bills**: Every bill paid increments `lifetimeBillPayments`
- ✅ **Streak**: Daily login maintains your `streak` counter
- ✅ **Level**: Calculated from total XP earned
- ✅ **Coins**: Total coins earned across all activities

### Auto-Completion
When you reach a quest's target:
1. Quest automatically marks as **done**
2. XP is instantly awarded
3. Coins are added to your balance
4. Quest completion counter increments
5. Visual notification appears

### Persistent Progress
- Achievement quests **never reset**
- Progress persists across months
- Completed quests stay in "Completed Achievements" section
- New quests automatically appear as you unlock them

---

## 📍 Where to Find Achievement Quests

1. Click on your **Adventurer Status** card (top-right)
2. Select **"Achievement Quests"** tab
3. View:
   - **Active Challenges**: In-progress quests
   - **Completed Achievements**: Finished quests
   - **Progress percentage**: Overall completion rate

---

## 💡 Tips for Completing Quests

### Quick Progress
- Log expenses daily → Builds toward expense and streak quests
- Set and complete goals → Multiple goal-related quests
- Pay bills on time → Bill payment quests
- Stay consistent → Streak quests reward daily engagement

### Maximum Rewards
**Total Possible Rewards from All 15 Quests:**
- **Total XP**: 5,300 XP (enough for multiple levels!)
- **Total Coins**: 2,650 coins (buy lots of items!)

### Progression Path
1. Start with **First Steps** (1 expense)
2. Build to **Tracking Habit** (10 expenses)
3. Maintain **Week Warrior** streak (7 days)
4. Complete **Goal Achieved** (1st goal)
5. Reach **Rising Star** (Level 5)
6. Progress through mid-tier quests
7. Aim for ultimate achievements (100 expenses, 60-day streak, Level 20)

---

## 🔧 Technical Implementation

### Files Modified
- ✅ `src/utils/gamification.ts` - Added 8 new quest definitions
- ✅ `src/store/budget.ts` - Created `updateAchievementQuests()` function
- ✅ `src/store/budget.ts` - Integrated quest updates into actions
- ✅ `src/components/Dashboard.tsx` - Added quest check on mount

### Quest Update Triggers
Achievement quests update after:
- Adding a transaction (`addTransaction`)
- Contributing to a goal (`addToGoal`)
- Paying a bill (`markBillPaid`)
- Dashboard component mount (on app load)

### Data Persistence
All quest progress is saved in the Zustand store with `persist` middleware, ensuring:
- Progress saved across browser sessions
- No data loss on page refresh
- Synchronized with monthly data isolation system

---

## 🎉 Status: FULLY FUNCTIONAL ✅

All 15 achievement quests are:
- ✅ Defined and initialized
- ✅ Tracking progress automatically
- ✅ Auto-completing on target reached
- ✅ Awarding XP and coins
- ✅ Displaying in Achievement Quests Panel
- ✅ Persisting across months and sessions

**Ready to play!** 🚀
