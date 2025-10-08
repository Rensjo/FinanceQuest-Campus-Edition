// Web Worker for heavy calculations (budget analytics, statistics, etc.)

interface WorkerMessage {
  type: 'CALCULATE_BUDGET_STATS' | 'CALCULATE_INSIGHTS' | 'PROCESS_TRANSACTIONS';
  payload: any;
}

interface WorkerResponse {
  type: string;
  result: any;
  error?: string;
}

// Listen for messages from main thread
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;

  try {
    let result: any;

    switch (type) {
      case 'CALCULATE_BUDGET_STATS':
        result = calculateBudgetStats(payload);
        break;
      case 'CALCULATE_INSIGHTS':
        result = calculateInsights(payload);
        break;
      case 'PROCESS_TRANSACTIONS':
        result = processTransactions(payload);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    self.postMessage({ type, result } as WorkerResponse);
  } catch (error) {
    self.postMessage({
      type,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as WorkerResponse);
  }
};

// Calculate budget statistics
function calculateBudgetStats(data: any) {
  const { transactions, envelopes, startDate, endDate } = data;

  const stats = {
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0,
    envelopeBreakdown: {} as Record<string, number>,
    categoryBreakdown: {} as Record<string, number>,
    dailyAverage: 0,
    monthlyProjection: 0,
  };

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  // Process transactions
  transactions.forEach((txn: any) => {
    const txnDate = new Date(txn.date).getTime();
    if (txnDate >= start && txnDate <= end) {
      if (txn.type === 'income') {
        stats.totalIncome += txn.amount;
      } else if (txn.type === 'expense') {
        stats.totalExpenses += txn.amount;

        // Breakdown by envelope
        if (txn.envelopeId) {
          stats.envelopeBreakdown[txn.envelopeId] =
            (stats.envelopeBreakdown[txn.envelopeId] || 0) + txn.amount;
        }
      }
    }
  });

  stats.netCashFlow = stats.totalIncome - stats.totalExpenses;

  // Calculate daily average
  const daysDiff = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
  stats.dailyAverage = stats.totalExpenses / daysDiff;
  stats.monthlyProjection = stats.dailyAverage * 30;

  return stats;
}

// Calculate insights
function calculateInsights(data: any) {
  const { transactions, envelopes } = data;

  const insights = {
    topSpendingCategories: [] as Array<{ name: string; amount: number; percentage: number }>,
    spendingTrend: 'stable' as 'increasing' | 'decreasing' | 'stable',
    largestExpense: null as any,
    averageTransactionSize: 0,
    transactionFrequency: 0,
  };

  // Calculate envelope spending
  const envelopeSpending: Record<string, number> = {};
  let totalSpending = 0;

  transactions.forEach((txn: any) => {
    if (txn.type === 'expense') {
      totalSpending += txn.amount;
      if (txn.envelopeId) {
        envelopeSpending[txn.envelopeId] =
          (envelopeSpending[txn.envelopeId] || 0) + txn.amount;
      }
    }
  });

  // Top spending categories
  insights.topSpendingCategories = Object.entries(envelopeSpending)
    .map(([id, amount]) => {
      const envelope = envelopes.find((e: any) => e.id === id);
      return {
        name: envelope?.name || 'Unknown',
        amount,
        percentage: (amount / totalSpending) * 100,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Find largest expense
  const expenses = transactions.filter((t: any) => t.type === 'expense');
  if (expenses.length > 0) {
    insights.largestExpense = expenses.reduce((max: any, t: any) =>
      t.amount > max.amount ? t : max
    );
  }

  // Average transaction size
  if (expenses.length > 0) {
    insights.averageTransactionSize = totalSpending / expenses.length;
  }

  // Transaction frequency (per week)
  if (transactions.length > 0) {
    const dates = transactions.map((t: any) => new Date(t.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const weeks = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24 * 7));
    insights.transactionFrequency = transactions.length / weeks;
  }

  return insights;
}

// Process and aggregate transactions
function processTransactions(data: any) {
  const { transactions } = data;

  // Group by date
  const byDate: Record<string, any[]> = {};
  transactions.forEach((txn: any) => {
    const date = new Date(txn.date).toISOString().split('T')[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(txn);
  });

  // Group by envelope
  const byEnvelope: Record<string, any[]> = {};
  transactions.forEach((txn: any) => {
    const envId = txn.envelopeId || 'unassigned';
    if (!byEnvelope[envId]) byEnvelope[envId] = [];
    byEnvelope[envId].push(txn);
  });

  return {
    byDate,
    byEnvelope,
    total: transactions.length,
  };
}

export {};
