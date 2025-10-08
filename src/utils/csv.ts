/**
 * CSV Import/Export utilities for FinanceQuest
 */

import type { Transaction } from '../types';

export function toCSV(transactions: Transaction[]): string {
  const headers = ['date', 'amount', 'type', 'envelope', 'account', 'merchant', 'note', 'tags'];
  const rows = transactions.map(t => [
    t.date,
    t.amount.toString(),
    t.type,
    t.envelopeId || '',
    t.accountId,
    t.merchant || '',
    t.note || '',
    (t.tags || []).join(';')
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

export function parseCSV(text: string): Transaction[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const transactions: Transaction[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    
    // Validate required fields
    if (!row.date || !row.amount || !row.type || !row.account) {
      console.warn(`Skipping invalid row ${i}:`, row);
      continue;
    }
    
    const transaction: Transaction = {
      id: `csv-${Date.now()}-${i}`,
      date: row.date,
      amount: parseFloat(row.amount),
      type: row.type as 'expense' | 'income' | 'transfer',
      accountId: row.account,
      envelopeId: row.envelope || undefined,
      merchant: row.merchant || undefined,
      note: row.note || undefined,
      tags: row.tags ? row.tags.split(';').filter(Boolean) : undefined
    };
    
    transactions.push(transaction);
  }
  
  return transactions;
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Bank-specific CSV parsers (Philippine banks)
 * These are templates - you'll need to adjust based on actual bank formats
 */

export interface BankPreset {
  name: string;
  columnMap: {
    date: string;
    amount: string;
    description: string;
    balance?: string;
  };
  dateFormat?: string; // e.g., 'MM/DD/YYYY'
}

export const BANK_PRESETS: Record<string, BankPreset> = {
  bpi: {
    name: 'BPI',
    columnMap: {
      date: 'Transaction Date',
      amount: 'Amount',
      description: 'Description',
      balance: 'Balance'
    }
  },
  bdo: {
    name: 'BDO',
    columnMap: {
      date: 'Date',
      amount: 'Withdrawal',
      description: 'Transaction Details'
    }
  },
  gcash: {
    name: 'GCash',
    columnMap: {
      date: 'Date',
      amount: 'Amount',
      description: 'Details'
    }
  }
};
