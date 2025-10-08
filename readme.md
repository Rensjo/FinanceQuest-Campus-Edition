# 🎮 FinanceQuest: Campus Edition

> **Budget like a boss. Spend like a pro. Level up your finances.**

A cross-platform, offline-first, gamified budgeting app tailored for university students and young professionals. Turn your money into a game—track transactions, manage envelopes, achieve savings goals, and level up through financial quests!

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Tauri](https://img.shields.io/badge/Tauri-v2-ffc131?logo=tauri)](https://tauri.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 💰 Smart Budget Management
- **Envelope System**: Allocate funds to custom categories (Food, Transport, School, Fun, etc.)
- **Monthly Budget Sources**: Configure income streams with weekly/bi-weekly/monthly frequencies
- **Quick Add Transaction**: Log expenses/income in seconds with category dropdown
- **Budget vs Actual**: Visual comparison of planned vs actual spending
- **Spending Breakdown**: Pie chart showing category distribution
- **Bills Tracking**: Monitor recurring bills with due date tracking

### 🎯 Gamification System
- **XP & Levels**: Earn experience points for financial activities and level up
- **Streaks**: Build daily logging habits with streak counter and rewards
- **Daily Quests**: Complete tasks like "Log 3 transactions" or "Review budget"
- **Achievement Quests**: Long-term challenges with significant rewards
- **Badges**: Unlock collectible badges for milestones
- **Adventurer Status**: RPG-style interface showing level, XP, and progress
- **Shop**: Spend earned coins on cosmetics and themes (coming soon)

### 📊 Analytics & Insights
- **General Analytics**: Financial health check with income/expense overview
- **Monthly Summary**: Track current month's financial performance
- **Budget Performance**: See which envelopes are on track or over budget
- **Transaction Activity**: Recent spending patterns and averages
- **Expense Tracker**: Detailed transaction history with filtering and sorting
- **Left to Spend**: Real-time calculation of available funds

### � Modern UI/UX
- **Light & Dark Themes**: Seamless theme switching with beautiful gradients
- **Glass-morphism Design**: Modern, translucent UI elements
- **Smooth Animations**: Optimized Framer Motion animations
- **Responsive Layout**: Works great on all screen sizes
- **Accessible**: WCAG compliant with keyboard navigation support

### 🎓 Student-Focused Features
- **Default Goals**: Pre-configured savings goals (Emergency Fund, Tuition, Gadget)
- **Default Bills**: Common student expenses (Rent, Internet, Mobile, etc.)
- **Budget Presets**: Quick-start templates for students and young professionals
- **Month Navigation**: Time-travel through your financial history

### 🔒 Privacy & Security
- **Local-First Storage**: All data stored locally using Zustand with localStorage
- **No Account Required**: Start using immediately without registration
- **Offline-First**: Fully functional without internet connection
- **Data Export**: CSV export for backups and external analysis
- **Data Import**: Restore from previous backups

### ⚡ Performance Optimized
- **React Memoization**: Components only re-render when needed
- **Calculation Caching**: Expensive computations are memoized
- **Optimized Animations**: Centralized animation system for smooth 60fps
- **Efficient Store**: Selective state subscriptions prevent unnecessary updates
- **Low-End Device Support**: Graceful degradation for older hardware

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/pnpm
- **Rust** (for Tauri desktop builds)

### Web Development
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### Desktop Development
```bash
# Install Tauri CLI (if not installed)
npm install -g @tauri-apps/cli

# Start Tauri dev mode (hot reload)
npm run tauri:dev
```

### Production Build
```bash
# Build for web
npm run build

# Build desktop app (Windows/macOS/Linux)
npm run tauri:build
```

The desktop installer will be in `src-tauri/target/release/bundle/`.

---

## 📂 Project Structure

```
FinanceQuest_Campus-Edition/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx              # Main dashboard with month navigation
│   │   ├── AdventurerStatus.tsx       # RPG-style level/XP display
│   │   ├── MonthlyOverview.tsx        # Budget summary and charts
│   │   ├── GeneralAnalytics.tsx       # Financial health analytics
│   │   ├── QuickAdd.tsx               # Quick transaction logging
│   │   ├── ExpenseTracker.tsx         # Transaction history with filters
│   │   ├── BillsSection.tsx           # Recurring bills management
│   │   ├── EnvelopeCard.tsx           # Budget envelope component
│   │   ├── GoalCard.tsx               # Savings goal progress
│   │   ├── QuestsPanel.tsx            # Daily quests interface
│   │   ├── AchievementQuestsPanel.tsx # Achievement quests
│   │   ├── BadgesPanel.tsx            # Badge collection display
│   │   ├── Shop.tsx                   # Reward shop (cosmetics)
│   │   ├── SettingsPanel.tsx          # App settings and preferences
│   │   ├── StyledDropdown.tsx         # Reusable dropdown component
│   │   ├── CSVManager.tsx             # Import/export tools
│   │   └── ...modals & utilities
│   ├── store/
│   │   └── budget.ts                  # Zustand store with persist
│   ├── utils/
│   │   ├── currency.ts                # Currency formatting
│   │   ├── date.ts                    # Date utilities
│   │   ├── csv.ts                     # CSV parser/generator
│   │   ├── gamification.ts            # XP/level calculations
│   │   ├── seed.ts                    # Default data templates
│   │   ├── animations.ts              # Framer Motion configs
│   │   └── performance.ts             # Performance utilities
│   ├── types.ts                       # TypeScript interfaces
│   ├── App.tsx                        # Root component
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles & themes
├── src-tauri/
│   ├── src/main.rs                    # Rust backend (Tauri)
│   ├── tauri.conf.json                # Tauri configuration
│   └── Cargo.toml                     # Rust dependencies
├── icons/                             # App icons
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── PERFORMANCE.md                     # Performance optimization guide
└── readme.md
```

---

## 🎨 Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| **Frontend**   | React 18 + TypeScript 5 + Vite                  |
| **Styling**    | Tailwind CSS 3 + Custom Design System           |
| **Animation**  | Framer Motion 11                                |
| **State**      | Zustand 4 (with persist middleware)             |
| **Desktop**    | Tauri v2 (Rust backend, WebView2 frontend)      |
| **Storage**    | IndexedDB (web) / SQLite (desktop via Tauri)    |
| **Icons**      | Lucide React                                    |

---

## 🎯 Gameplay Loop

1. **Plan** → Set up envelopes and allocate monthly income
2. **Allocate** → Divide paycheck across envelopes
3. **Spend & Log** → 3-tap transaction entry (amount → category → note)
4. **Review** → Check insights, Safe-to-Spend, and category breakdown
5. **Adjust** → Move funds between envelopes, update goals
6. **Claim Rewards** → Earn XP, complete quests, unlock cosmetics

**XP Events:**
- Add income: **+15 XP**
- Log expense: **+5 XP** (cap 200/day)
- Stay under envelope budget for the week: **+30 XP**
- Complete weekly review: **+40 XP**
- Hit 30-day streak: **+200 XP** (one-time)

**Level Curve:**
```
XP_required = round(60 * Level ^ 1.35)
```

---

## 🧮 Safe-to-Spend (STS) Formula

```
STS = Σ(carryover_envelope_balances) - upcoming_bills_within(7d)
```

**Color Coding:**
- 🟢 **Green**: STS ≥ 0 (you're good!)
- 🟡 **Amber**: STS between 0 and -10% of weekly budget (watch spending)
- 🔴 **Red**: STS < -10% of weekly budget (stop spending!)

---

## 📊 Sample Envelopes

### Student (₱10,000/month)
| Envelope   | Monthly Budget | % of Income |
|------------|----------------|-------------|
| Food       | ₱2,500         | 25%         |
| Transport  | ₱1,000         | 10%         |
| School     | ₱2,000         | 20%         |
| Fun        | ₱1,000         | 10%         |
| Savings    | ₱1,500         | 15%         |
| Buffer     | ₱2,000         | 20%         |

### Young Pro (₱33,500/month)
| Envelope   | Monthly Budget | % of Income |
|------------|----------------|-------------|
| Rent       | ₱10,000        | 30%         |
| Utilities  | ₱2,500         | 8%          |
| Groceries  | ₱4,500         | 15%         |
| Transport  | ₱2,000         | 8%          |
| Fun        | ₱3,000         | 10%         |
| Savings    | ₱7,000         | 20%         |
| Buffer     | ₱2,500         | 9%          |

---

## 🗺️ Roadmap

### ✅ v0.9 - Current Release
- [x] Envelope-based budgeting system
- [x] Quick transaction logging with categories
- [x] Savings goals with progress tracking
- [x] RPG-style gamification (XP, levels, streaks)
- [x] Daily and achievement quest system
- [x] Badge collection and achievements
- [x] Bills tracking and management
- [x] Monthly budget configuration
- [x] Comprehensive analytics dashboard
- [x] Expense tracker with filtering
- [x] Light and dark theme support
- [x] Month-by-month navigation
- [x] CSV export functionality
- [x] Performance optimizations
- [x] Responsive design

### 🚧 v1.0 - Upcoming
- [ ] Theme customization in settings
- [ ] CSV import with bank presets
- [ ] Recurring transaction automation
- [ ] Bill due date notifications
- [ ] Weekly financial review ritual
- [ ] Enhanced quest variety
- [ ] Shop cosmetics implementation
- [ ] Budget templates and presets
- [ ] Search functionality in transactions
- [ ] Transaction notes and tags

### 🔮 v1.1+ - Future Plans
- [ ] Multi-currency support
- [ ] Debt tracking and payoff calculator
- [ ] Split transactions
- [ ] Shared budgets (family/roommates)
- [ ] PWA with offline sync
- [ ] Cloud backup (optional)
- [ ] Mobile app (React Native)
- [ ] Budget forecasting
- [ ] Spending insights with AI
- [ ] Financial education content

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

Built with ❤️ for students and young professionals navigating their financial journey.

**Tech Credits:**
- [React](https://react.dev) · [Tauri](https://tauri.app) · [Zustand](https://zustand-demo.pmnd.rs) · [Tailwind CSS](https://tailwindcss.com) · [Framer Motion](https://www.framer.com/motion)

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/Rensjo/FinanceQuest-Campus-Edition/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Rensjo/FinanceQuest-Campus-Edition/discussions)
- **Documentation**: Check `PERFORMANCE.md` for optimization details

## 📸 Screenshots

*(Coming soon - Add screenshots of your app in action)*

## 🌟 Star History

If you find FinanceQuest helpful, please consider giving it a star! ⭐

---

**Made with 💚 by RenKai Studios**

*Empowering students and young professionals to take control of their finances, one transaction at a time.*