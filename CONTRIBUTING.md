# Contributing to FinanceQuest

First off, thank you for considering contributing to FinanceQuest! 🎉

This is a student-focused, gamified budgeting app, and we welcome contributions that help make financial literacy more accessible and fun.

---

## 🎯 Project Philosophy

1. **Students first**: Features should solve real problems for university students and young professionals
2. **Privacy matters**: Local-first, offline-capable, no tracking without consent
3. **Gamification that educates**: Rewards should teach good financial habits
4. **Accessible by default**: Keyboard navigation, screen reader support, clear copy

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- (Optional) Rust for desktop builds

### Setup
```bash
# Fork the repo on GitHub
git clone https://github.com/YOUR_USERNAME/Practice-Repo.git
cd FinanceQuest_Campus-Edition

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

---

## 🛠️ Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# Examples:
# - feature/recurring-transactions
# - fix/csv-export-bug
# - docs/update-quickstart
```

### 2. Make Changes
- Follow existing code style (TypeScript, React hooks, Tailwind)
- Keep components small and focused
- Add comments for complex logic
- Update types in `src/types.ts` if needed

### 3. Test Locally
- [ ] Run `npm run dev` - no console errors
- [ ] Test on different screen sizes
- [ ] Check keyboard navigation works
- [ ] Verify state persists on reload

### 4. Commit
```bash
git add .
git commit -m "feat: add recurring transaction rules"
```

**Commit Convention** (optional but appreciated):
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting, no code change
- `refactor:` code restructure
- `test:` adding tests
- `chore:` maintenance

### 5. Push & PR
```bash
git push origin feature/your-feature-name
```
Then open a Pull Request on GitHub.

---

## 📂 Project Structure

```
src/
├── components/       # React components
├── store/           # Zustand state management
├── utils/           # Helper functions
├── types.ts         # TypeScript interfaces
├── App.tsx          # Root component
└── main.tsx         # Entry point
```

### Key Files
- **src/store/budget.ts**: Main state (add new actions here)
- **src/types.ts**: TypeScript interfaces (extend as needed)
- **src/components/Dashboard.tsx**: Main view (connects all widgets)

---

## 🎨 Code Style

### TypeScript
```tsx
// ✅ Good
interface Props {
  amount: number;
  onSave: (amount: number) => void;
}

export default function Component({ amount, onSave }: Props) {
  return <div>{amount}</div>;
}

// ❌ Avoid
export default function Component(props: any) { ... }
```

### Zustand Actions
```ts
// ✅ Good
addTransaction: (t) => set((s) => ({
  transactions: [t, ...s.transactions],
  game: awardXP(s.game, 5)
}))

// ❌ Avoid mutating state
addTransaction: (t) => set((s) => {
  s.transactions.push(t); // Don't!
})
```

### Tailwind
```tsx
// ✅ Good (use design system)
<div className="card">
  <button className="btn">Click</button>
</div>

// ❌ Avoid inline styles
<div style={{ background: '#000' }}>
```

---

## 🧪 Testing

### Manual Testing
For now, we rely on manual testing:
1. Test your feature in the browser
2. Check mobile view (responsive)
3. Test keyboard navigation
4. Reload page (state should persist)

### Future: Automated Tests
We plan to add:
- Vitest for unit tests
- Testing Library for component tests
- Playwright for E2E tests

Contributions welcome!

---

## 🐛 Reporting Bugs

**Before opening an issue:**
1. Check [existing issues](https://github.com/Rensjo/Practice-Repo/issues)
2. Try the latest version (`git pull origin main`)
3. Clear browser cache/localStorage

**Good bug report includes:**
- What you expected
- What happened instead
- Steps to reproduce
- Browser/OS version
- Console errors (if any)

**Example:**
```
Title: Safe-to-Spend shows wrong color

Expected: Green when STS > 0
Actual: Shows red even with positive STS

Steps:
1. Add transaction
2. Check dashboard STS widget
3. Color is red despite ₱500 remaining

Browser: Chrome 120, Windows 11
Console: No errors
```

---

## 💡 Feature Requests

We love new ideas! When suggesting features:

1. **Check the roadmap** in [IMPLEMENTATION.md](./IMPLEMENTATION.md)
2. **Explain the problem** you're solving
3. **Describe your solution** (mockups welcome!)
4. **Consider alternatives** (are there other ways?)
5. **Think about complexity** (MVP vs. v1.0 vs. future)

**Good feature request:**
```
Title: Add bulk transaction editing

Problem: Correcting multiple transactions is tedious
Solution: Checkbox select + bulk actions (delete, re-categorize)
Alternatives: Edit modal with prev/next buttons
Complexity: Medium (2-3 days)
Priority: Nice-to-have for v1.1
```

---

## 🎯 Priority Areas for Contribution

### High Impact (v1.0)
- [ ] **Recurring transaction rules** (auto-log bills)
- [ ] **Quest auto-completion logic**
- [ ] **Weekly review workflow**
- [ ] **Streak tracking**
- [ ] **Achievement unlock triggers**

### Medium Impact
- [ ] **Onboarding flow** for first-time users
- [ ] **Settings page** (currency, theme, data export)
- [ ] **Envelope management** (add/edit/delete)
- [ ] **CSV import presets** for Philippine banks

### Low Hanging Fruit
- [ ] **Unit tests** for store logic
- [ ] **Storybook** for component development
- [ ] **Accessibility audit** (WCAG compliance)
- [ ] **Performance optimization** (code splitting)
- [ ] **Documentation improvements**

### Fun/Creative
- [ ] **New reward shop items** (themes, icons, sounds)
- [ ] **Achievement ideas** (badges, titles)
- [ ] **Quest challenges** (No-Spend Weekend, etc.)
- [ ] **Animated celebrations** (level up, goal reached)

---

## 🌍 Internationalization (i18n)

Currently hardcoded for **PHP / en-PH**. Future plans:
- Extract strings to translation files
- Support USD, EUR, other currencies
- Date/number formatting per locale

If you want to help with i18n, open an issue first!

---

## 📄 Documentation

Help improve docs:
- **README.md**: Feature list, installation
- **QUICKSTART.md**: User guide
- **IMPLEMENTATION.md**: Developer status
- **Code comments**: Explain complex logic

---

## 🎓 Learning Resources

New to the stack? Here are great starting points:

- **React**: [react.dev](https://react.dev/learn)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Zustand**: [docs.pmnd.rs/zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Tailwind**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Tauri**: [tauri.app/v2/guides](https://tauri.app/v2/guides/)

---

## ✅ Pull Request Checklist

Before submitting:
- [ ] Code follows existing style
- [ ] No console errors or warnings
- [ ] Tested on mobile/tablet/desktop
- [ ] Updated types if needed
- [ ] Added comments for complex code
- [ ] Updated README/docs if feature is user-facing
- [ ] Branch is up-to-date with `main`

---

## 🤝 Code of Conduct

### Our Pledge
We're committed to a welcoming, harassment-free experience for everyone.

### Expected Behavior
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Publishing others' private information
- Other conduct inappropriate for a professional setting

### Enforcement
Report issues to the maintainers via GitHub. Violations may result in temporary or permanent ban.

---

## 📞 Questions?

- **General help**: [GitHub Discussions](https://github.com/Rensjo/Practice-Repo/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/Rensjo/Practice-Repo/issues)
- **Feature ideas**: Open an issue with `[Feature Request]` tag

---

## 🙏 Recognition

All contributors will be:
- Listed in README credits
- Mentioned in release notes
- Part of a project helping students succeed financially!

Thank you for making FinanceQuest better! 💚

---

**Happy Coding!** 🚀
