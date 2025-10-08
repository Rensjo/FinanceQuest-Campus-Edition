/**
 * CSV Import/Export Component
 */

import { useState } from 'react';
import { useBudget } from '../store/budget';
import { toCSV, parseCSV, downloadCSV } from '../utils/csv';
import { motion } from 'framer-motion';

export default function CSVManager() {
  const { transactions, importTransactions } = useBudget(s => ({
    transactions: s.transactions,
    importTransactions: s.importTransactions,
  }));
  
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const csv = toCSV(transactions);
    const filename = `financequest-export-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, csv);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const txns = parseCSV(text);
      
      if (txns.length > 0) {
        importTransactions(txns);
        alert(`✓ Imported ${txns.length} transactions`);
      } else {
        alert('⚠ No valid transactions found in CSV');
      }
    } catch (error) {
      alert('✗ Failed to import CSV: ' + (error as Error).message);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">💾 Data Management</h2>
      
      <div className="grid sm:grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="btn"
          disabled={transactions.length === 0}
        >
          📤 Export to CSV
        </motion.button>

        <label className="btn cursor-pointer relative">
          📥 Import from CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            disabled={importing}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <div className="mt-4 text-sm text-neutral-400">
        <p>• Export: Download all transactions as CSV</p>
        <p>• Import: Upload CSV with columns: date, amount, type, envelope, account</p>
      </div>
    </div>
  );
}
