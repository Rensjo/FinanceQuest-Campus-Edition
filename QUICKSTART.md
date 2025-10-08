# 🚀 Quick Start Guide - FinanceQuest

## First Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
# For web development (recommended for testing)
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Try the Desktop Version (Optional)
```bash
# Make sure you have Rust installed first
npm run tauri:dev
```

---

## 🎯 Your First Budget

### Step 1: Explore Your Starter Envelopes
When you first open FinanceQuest, you'll see pre-configured envelopes:
- 🍔 **Food**: ₱2,500
- 🚗 **Transport**: ₱1,000
- 📚 **School**: ₱2,000
- 🎉 **Fun**: ₱1,000
- 💰 **Savings**: ₱1,500
- 🛡️ **Buffer**: ₱1,000

**Total Budget: ₱10,000/month**

### Step 2: Log Your First Expense
1. Find the **Quick Add Transaction** section
2. Enter an amount (e.g., `150`)
3. Select a category (e.g., `Food`)
4. Click **Log**

🎉 **Congrats!** You just earned **+5 XP**!

### Step 3: Watch Your Stats
- **Safe to Spend** updates in real-time
- **Envelope balance** decreases automatically
- **XP bar** fills up towards Level 2

### Step 4: Set a Goal
1. Scroll down to the **Goals** section
2. You'll see "Laptop Fund" already created
3. Click to add money to your goal as you save!

---

## 🎮 Earning XP & Leveling Up

| Action | XP Earned |
|--------|-----------|
| Log an expense | +5 XP |
| Add income | +15 XP |
| Stay under envelope budget (weekly) | +30 XP |
| Complete weekly review | +40 XP |
| Hit 30-day streak | +200 XP |

**Level Formula:** `XP_required = 60 × Level^1.35`

---

## 💡 Pro Tips

### 1. Use the Safe-to-Spend (STS)
The **Safe to Spend** card tells you exactly how much you can spend today without going over budget.

- 🟢 **Green**: You're good to spend!
- 🟡 **Yellow**: Getting close to your limit
- 🔴 **Red**: Stop spending!

### 2. Check Your Insights
Scroll down to see:
- **This Month's Spending**
- **Top Spending Envelopes**
- Category breakdowns

### 3. Complete Quests
Active quests show at the bottom of the dashboard:
- ✅ Log 3 expenses today
- ✅ Create your first goal
- ✅ Stay under budget for 7 days

### 4. Customize Your Envelopes
Click on any envelope to:
- Change the monthly budget
- Adjust colors
- Enable/disable carryover

### 5. Export Your Data
Scroll to the **Data Management** section:
- 📤 **Export to CSV**: Download all transactions
- 📥 **Import from CSV**: Upload bank statements

---

## 🏪 Reward Shop

Earn **coins** (10% of your XP) to unlock:
- 🌊 Ocean Theme
- 🌅 Sunset Theme
- 🚀 Custom Icons
- 🎉 Confetti Effects

---

## 📊 Understanding Your Budget

### Envelope Types
- **Carryover** (e.g., Food, Savings): Unused budget rolls over to next month
- **Non-carryover** (e.g., Fun): Resets each month ("use it or lose it")

### Transaction Types
- **Expense**: Money going out (decreases envelope)
- **Income**: Money coming in (increases envelope)
- **Transfer**: Moving between envelopes

---

## 🛠️ Advanced Features

### CSV Import
1. Export transactions from your bank (BPI, BDO, GCash)
2. Format: `date, amount, type, envelope, account, merchant, note`
3. Click **Import from CSV** in Data Management
4. Select your CSV file

### Goal Tracking
1. Create a goal (e.g., "Emergency Fund - ₱50,000")
2. Set a target date (optional)
3. Add money to your goal as you save
4. Watch the progress bar fill up! 📈

### Recurring Transactions (Coming Soon)
Set up auto-logging for:
- Monthly rent
- Weekly allowance
- Subscription services

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate between fields |
| `Enter` | Submit transaction |
| `Esc` | Close modals |

---

## 🐛 Troubleshooting

### "Can't see my transactions"
- Check if you selected a category when logging
- Refresh the page (`Ctrl+R` or `Cmd+R`)

### "Safe to Spend is negative"
This means upcoming bills exceed your carryover balances. Consider:
1. Reducing non-essential spending
2. Adding more to your Buffer envelope
3. Reviewing your upcoming bills

### "App won't load"
```bash
# Clear cache and restart
npm run dev
```

---

## 📚 Next Steps

1. **Week 1**: Log all expenses for 7 days
2. **Week 2**: Review your spending patterns in Insights
3. **Week 3**: Adjust envelope budgets based on reality
4. **Week 4**: Complete your first weekly review quest

**Goal:** By the end of month 1, you should know exactly where every peso goes! 💪

---

## 🆘 Need Help?

- 📖 Read the full [README.md](./readme.md)
- 💬 [GitHub Discussions](https://github.com/Rensjo/Practice-Repo/discussions)
- 🐛 [Report a Bug](https://github.com/Rensjo/Practice-Repo/issues)

---

**Happy Budgeting! 🎉**
