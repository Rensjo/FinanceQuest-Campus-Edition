import { useRef, useCallback, useEffect } from 'react';

type WorkerMessageType = 'CALCULATE_BUDGET_STATS' | 'CALCULATE_INSIGHTS' | 'PROCESS_TRANSACTIONS';

interface WorkerMessage {
  type: WorkerMessageType;
  payload: any;
}

interface WorkerResponse {
  type: string;
  result: any;
  error?: string;
}

/**
 * Hook to use Web Worker for heavy calculations
 */
export function useWebWorker() {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (result: any, error?: string) => void>>(new Map());

  // Initialize worker
  useEffect(() => {
    // Create worker from inline script to avoid bundling issues
    const workerCode = `
      self.onmessage = (e) => {
        const { type, payload } = e.data;
        try {
          let result;
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
              throw new Error('Unknown message type: ' + type);
          }
          self.postMessage({ type, result });
        } catch (error) {
          self.postMessage({ type, result: null, error: error.message });
        }
      };

      function calculateBudgetStats(data) {
        const { transactions, envelopes, startDate, endDate } = data;
        const stats = {
          totalIncome: 0,
          totalExpenses: 0,
          netCashFlow: 0,
          envelopeBreakdown: {},
          categoryBreakdown: {},
          dailyAverage: 0,
          monthlyProjection: 0,
        };

        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        transactions.forEach((txn) => {
          const txnDate = new Date(txn.date).getTime();
          if (txnDate >= start && txnDate <= end) {
            if (txn.type === 'income') {
              stats.totalIncome += txn.amount;
            } else if (txn.type === 'expense') {
              stats.totalExpenses += txn.amount;
              if (txn.envelopeId) {
                stats.envelopeBreakdown[txn.envelopeId] =
                  (stats.envelopeBreakdown[txn.envelopeId] || 0) + txn.amount;
              }
            }
          }
        });

        stats.netCashFlow = stats.totalIncome - stats.totalExpenses;
        const daysDiff = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
        stats.dailyAverage = stats.totalExpenses / daysDiff;
        stats.monthlyProjection = stats.dailyAverage * 30;

        return stats;
      }

      function calculateInsights(data) {
        const { transactions, envelopes } = data;
        const insights = {
          topSpendingCategories: [],
          spendingTrend: 'stable',
          largestExpense: null,
          averageTransactionSize: 0,
          transactionFrequency: 0,
        };

        const envelopeSpending = {};
        let totalSpending = 0;

        transactions.forEach((txn) => {
          if (txn.type === 'expense') {
            totalSpending += txn.amount;
            if (txn.envelopeId) {
              envelopeSpending[txn.envelopeId] =
                (envelopeSpending[txn.envelopeId] || 0) + txn.amount;
            }
          }
        });

        insights.topSpendingCategories = Object.entries(envelopeSpending)
          .map(([id, amount]) => {
            const envelope = envelopes.find((e) => e.id === id);
            return {
              name: envelope?.name || 'Unknown',
              amount,
              percentage: (amount / totalSpending) * 100,
            };
          })
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        const expenses = transactions.filter((t) => t.type === 'expense');
        if (expenses.length > 0) {
          insights.largestExpense = expenses.reduce((max, t) =>
            t.amount > max.amount ? t : max
          );
          insights.averageTransactionSize = totalSpending / expenses.length;
        }

        return insights;
      }

      function processTransactions(data) {
        const { transactions } = data;
        const byDate = {};
        const byEnvelope = {};

        transactions.forEach((txn) => {
          const date = new Date(txn.date).toISOString().split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(txn);

          const envId = txn.envelopeId || 'unassigned';
          if (!byEnvelope[envId]) byEnvelope[envId] = [];
          byEnvelope[envId].push(txn);
        });

        return { byDate, byEnvelope, total: transactions.length };
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    try {
      workerRef.current = new Worker(workerUrl);

      workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, result, error } = e.data;
        const callback = callbacksRef.current.get(type);
        if (callback) {
          callback(result, error);
          callbacksRef.current.delete(type);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  // Execute worker task
  const execute = useCallback(
    <T = any>(type: WorkerMessageType, payload: any): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        callbacksRef.current.set(type, (result, error) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        });

        workerRef.current.postMessage({ type, payload } as WorkerMessage);
      });
    },
    []
  );

  // Convenience methods
  const calculateBudgetStats = useCallback(
    (transactions: any[], envelopes: any[], startDate: string, endDate: string) => {
      return execute('CALCULATE_BUDGET_STATS', { transactions, envelopes, startDate, endDate });
    },
    [execute]
  );

  const calculateInsights = useCallback(
    (transactions: any[], envelopes: any[]) => {
      return execute('CALCULATE_INSIGHTS', { transactions, envelopes });
    },
    [execute]
  );

  const processTransactions = useCallback(
    (transactions: any[]) => {
      return execute('PROCESS_TRANSACTIONS', { transactions });
    },
    [execute]
  );

  return {
    execute,
    calculateBudgetStats,
    calculateInsights,
    processTransactions,
  };
}
