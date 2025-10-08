# Changelog

# Changelog

All notable changes to FinanceQuest: Campus Edition will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2025-10-08

### 🎉 Initial Public Release

This is the first public release of FinanceQuest: Campus Edition - a gamified budgeting app for students and young professionals.

### ✨ Added

#### Core Features
- **Envelope Budgeting System** - Allocate funds to custom categories
- **Quick Transaction Logging** - Add expenses/income with category dropdown
- **Savings Goals** - Track progress towards financial goals with visual indicators
- **Bills Management** - Monitor recurring bills with due date tracking
- **Monthly Budget Sources** - Configure income streams with frequency settings
- **Month Navigation** - Browse through financial history month by month
- **CSV Export** - Export all data for backup and analysis

#### Gamification
- **XP & Leveling System** - Earn experience points and level up
- **Streak Tracking** - Build daily habits with streak counter
- **Daily Quests** - Complete daily financial tasks
- **Achievement Quests** - Long-term challenges with rewards
- **Badge System** - Unlock collectible badges for milestones
- **Adventurer Status** - RPG-style interface showing progress
- **Coins & Shop** - Currency system (shop cosmetics coming soon)

#### Analytics & Insights
- **General Analytics** - Financial health overview
- **Monthly Summary** - Current month performance tracking
- **Budget Performance** - Envelope health monitoring
- **Transaction Activity** - Spending patterns and averages
- **Expense Tracker** - Detailed transaction history with filters
- **Budget vs Actual** - Visual comparison with bar charts
- **Spending Breakdown** - Pie chart of category distribution
- **Left to Spend** - Real-time available funds calculation

#### UI/UX
- **Light & Dark Themes** - Seamless theme switching
- **Glass-morphism Design** - Modern translucent UI elements
- **Smooth Animations** - Framer Motion powered animations
- **Responsive Layout** - Works on all screen sizes
- **Accessible Interface** - Keyboard navigation support
- **Beautiful Gradients** - Color-coded categories and status

#### Performance
- **React Memoization** - Components optimized with React.memo
- **Calculation Caching** - useMemo for expensive computations
- **Optimized Animations** - Centralized animation system
- **Efficient Store** - Selective Zustand subscriptions
- **60fps Target** - Smooth performance on modern hardware

### 🛠️ Technical

#### Tech Stack
- React 18.3.1
- TypeScript 5.6.2
- Tailwind CSS 3.4.15
- Framer Motion 11.11.17
- Zustand 5.0.2
- Tauri v2
- Vite 5.4.10

#### Performance Utilities
- Debounce and throttle helpers
- Memoization utilities
- Low-end device detection
- Virtual scrolling helpers
- Idle callback wrappers

#### Documentation
- Comprehensive README with setup instructions
- PERFORMANCE.md with optimization guide
- Contributing guidelines
- Implementation guides for features

### 🎨 Design System
- Custom color palette with semantic naming
- Consistent spacing and typography
- Reusable component library
- Accessible color contrasts (WCAG AA compliant)

### 🔒 Privacy & Security
- Local-first storage (localStorage + Zustand persist)
- No account required
- No data collection or analytics
- Offline-first architecture
- Optional CSV backup

### 📝 Notes
- This is a beta release for testing and feedback
- Some features marked as "Coming Soon" in UI
- Theme customization in settings is a placeholder
- Shop cosmetics system is prepared but not activated

### 🐛 Known Issues
- None reported in initial release

### 🚀 Coming in v1.0
- CSV import with bank presets
- Recurring transaction automation
- Bill due notifications
- Theme customization
- Enhanced quest variety
- Shop cosmetics implementation

---

## Version History

[0.9.0] - 2025-10-08 - Initial public release

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for v1.0
- Recurring transaction rules (auto-log bills/income)
- Quest auto-completion logic
- Weekly review guided workflow
- Bill due reminder notifications
- CSV import bank presets (BPI, BDO, GCash)
- Achievement unlock triggers
- Streak tracking logic
- Settings page (currency, theme, data management)
- Onboarding flow for first-time users

### Planned for v1.1+
- Debt snowball tracker
- Shared budgets (read-only links)
- Multi-currency support
- PWA offline mode
- Cloud sync (opt-in)
- Mobile app

---

## [0.1.0] - 2025-10-04 (MVP Release)

### Added
- **Zero-Based Budgeting System**
  - Envelope allocation with monthly budgets
  - Carryover vs. non-carryover envelope types
  - Student & Young Pro starter templates
  - 6 pre-configured envelopes (Food, Transport, School, Fun, Savings, Buffer)

- **Transaction Management**
  - Quick 3-tap transaction logging
  - Transaction history with timestamps
  - Merchant and note fields
  - Auto-deduction from envelopes
  - Income tracking

- **Safe-to-Spend (STS) Calculator**
  - Real-time calculation: `STS = Σ(carryover_balances) - upcoming_bills(7d)`
  - Color-coded status (green/amber/red)
  - Dashboard widget display

- **Gamification System**
  - XP earning on actions (+5 expense, +15 income)
  - Level progression with formula: `60 × Level^1.35`
  - Coins system (10% of XP earned)
  - Quest display (5 starter quests)
  - Streak counter foundation
  - Reward shop with 6 cosmetic items

- **Goals & Progress Tracking**
  - Create savings goals with target amounts
  - Optional deadline tracking
  - Animated progress bars
  - Percentage completion display
  - "Add to goal" action (+10 XP)

- **Insights Dashboard**
  - Monthly spending totals
  - Top 5 spending envelopes
  - Category breakdown visualization
  - Transaction filtering by date

- **CSV Import/Export**
  - Export all transactions to CSV
  - Import CSV with validation
  - Bank preset templates (BPI, BDO, GCash)
  - Auto-filename generation with date
  - +50 XP bonus on import

- **Data Persistence**
  - Zustand state management
  - LocalStorage persistence (web)
  - Auto-save on every change

- **UI/UX**
  - Dark theme with neon accents (emerald green brand)
  - Framer Motion animations (hover, tap, progress fills)
  - Responsive grid layouts (mobile/tablet/desktop)
  - Custom Tailwind design system
  - Keyboard navigation support

- **Desktop App (Tauri)**
  - Tauri v2 configuration
  - Cross-platform builds (Windows/macOS/Linux)
  - Window settings (1100×720, resizable)
  - Notification plugin config (ready for v1.0)

- **Documentation**
  - Comprehensive README with feature list
  - QUICKSTART guide for first-time users
  - IMPLEMENTATION status for developers
  - SUMMARY overview document
  - CHANGELOG (this file)

### Technical
- React 18 + TypeScript 5
- Vite build system
- Tailwind CSS 3 with custom theme
- Framer Motion 11 for animations
- Zustand 4 with persist middleware
- Tauri v2 for desktop builds
- 20+ files created/enhanced
- ~1,500 lines of code
- 8 React components
- 10 Zustand store actions

---

## [0.0.1] - 2025-10-04 (Initial Commit)

### Added
- Project scaffolding with Vite + React + TypeScript
- Tauri v2 integration
- Basic folder structure
- Initial TypeScript interfaces
- Placeholder components

---

## Version History Summary

| Version | Date | Status | Highlights |
|---------|------|--------|------------|
| 0.1.0 | Oct 4, 2025 | ✅ Released | MVP complete with all core features |
| 0.0.1 | Oct 4, 2025 | 📦 Initial | Project scaffolding |

---

## Upgrade Guide

### From 0.0.1 → 0.1.0
No migration needed - fresh install recommended.

---

## Contributors

- **Joren** (@Rensjo) - Project creator & lead developer
- **GitHub Copilot** - AI pair programmer

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Rensjo/Practice-Repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Rensjo/Practice-Repo/discussions)

---

**[Unreleased]**: https://github.com/Rensjo/Practice-Repo/compare/v0.1.0...HEAD  
**[0.1.0]**: https://github.com/Rensjo/Practice-Repo/releases/tag/v0.1.0
