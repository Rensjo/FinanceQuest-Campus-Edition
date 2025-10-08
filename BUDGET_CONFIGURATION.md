# Monthly Budget Configuration Feature

## Overview
Added a comprehensive monthly budget management system that allows users to configure their income sources with labels, amounts, frequencies, and source types.

## Features Implemented

### 1. Income Source Types
- **Allowance** 💰 (Emerald theme)
- **Income/Salary** 💼 (Cyan theme)
- **Passive Income** 📈 (Purple theme)
- **Pension** 🏦 (Amber theme)
- **Other** 💵 (Gray theme)

### 2. Income Frequencies
- **Weekly** - Converts to monthly (× 4.33)
- **Biweekly** - Converts to monthly (× 2.17)
- **Monthly** - Direct amount

### 3. Components Created

#### BudgetConfigModal.tsx
Modal for adding/editing budget sources with:
- Source type selector with icons and colors
- Amount input field
- Frequency selector (weekly/biweekly/monthly)
- Custom label field (optional)
- Enable/disable toggle
- Monthly equivalent calculator
- Animated gradient backgrounds
- Form validation

#### BudgetSourceCard.tsx
Display component showing:
- Total monthly budget (sum of all enabled sources)
- List of all budget sources with:
  - Source icon and color
  - Amount and frequency
  - Monthly equivalent calculation
  - Edit and delete buttons (on hover)
  - Disabled state visual feedback
- Empty state with call-to-action

### 4. Type Definitions Added

```typescript
export type IncomeSource = 'allowance'|'income'|'passive-income'|'pension'|'other';
export type IncomeFrequency = 'weekly'|'biweekly'|'monthly';

export interface MonthlyBudgetConfig {
  id: string;
  amount: number;
  source: IncomeSource;
  frequency: IncomeFrequency;
  label?: string;
  enabled: boolean;
}
```

### 5. Store Actions Added

```typescript
addMonthlyBudget(budget: Omit<MonthlyBudgetConfig, 'id'>): void
updateMonthlyBudget(id: string, updates: Partial<MonthlyBudgetConfig>): void
deleteMonthlyBudget(id: string): void
getTotalMonthlyBudget(): number  // Returns sum of all enabled budgets in monthly equivalent
```

### 6. Dashboard Integration

New section added above "Monthly Overview":
- **Monthly Budget** card with emerald gradient
- Shows all configured budget sources
- Add/Edit/Delete functionality
- Real-time total calculation

## Usage

1. **Add Budget Source**
   - Click "+ Add Budget Source" or the plus icon
   - Select income source type
   - Enter amount
   - Choose frequency
   - Optionally add custom label
   - Click "Add Budget"

2. **Edit Budget Source**
   - Hover over a budget source card
   - Click the edit icon (pencil)
   - Modify fields as needed
   - Click "Update Budget"

3. **Delete Budget Source**
   - Hover over a budget source card
   - Click the delete icon (trash)

4. **Enable/Disable**
   - Toggle the switch in the modal
   - Disabled sources are shown grayed out
   - They don't count toward total monthly budget

## Example Scenarios

### Student with Weekly Allowance
- Source: Allowance
- Amount: ₱1,000
- Frequency: Weekly
- Monthly Equivalent: ₱4,330

### Part-time Worker
- Source: Income
- Amount: ₱8,000
- Frequency: Biweekly
- Monthly Equivalent: ₱17,360

### Mixed Income
- Allowance: ₱1,000/week → ₱4,330/month
- Part-time job: ₱5,000/biweekly → ₱10,850/month
- **Total Monthly Budget: ₱15,180**

## Design Features

- **Neon/Gamified Theme**: Consistent with app aesthetic
- **Animated Backgrounds**: Gradient sweeps and shimmer effects
- **Color-Coded Sources**: Each type has unique color and icon
- **Responsive Layout**: Works on all screen sizes
- **Smooth Animations**: Framer Motion throughout
- **Visual Feedback**: Hover states, transitions, glows

## Technical Details

- **State Management**: Zustand with persist
- **Type Safety**: Full TypeScript support
- **Validation**: Required fields, numeric constraints
- **Calculations**: Automatic frequency conversion
- **Performance**: Optimized re-renders with proper hooks

## Future Enhancements

Potential additions:
- Budget vs Actual comparison
- Historical budget tracking
- Budget recommendations based on spending
- Multiple currency support per source
- Tax/deduction calculations
- Import from payroll systems
