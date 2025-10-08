import { useBudget } from '../store/budget';
import { nanoid } from 'nanoid';
import { StyledDropdown } from './StyledDropdown';
import { useState } from 'react';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';


export default function QuickAdd(){
const addTransaction = useBudget(s=>s.addTransaction);
const envelopes = useBudget(s=>s.envelopes);
const [selectedEnvelope, setSelectedEnvelope] = useState('');
const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');


  function submit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    const description = String(data.get('description') || '');


    if (!amount || !selectedEnvelope) return;


    addTransaction({ 
      id: nanoid(), 
      date: new Date().toISOString(), 
      amount, 
      type: transactionType, 
      envelopeId: selectedEnvelope, 
      accountId: 'cash',
      merchant: description || undefined,
      note: description 
    });
    form.reset();
    setSelectedEnvelope('');
  }
return (
<form onSubmit={submit} className="flex items-center gap-3 px-4">
{/* Transaction Type Toggle */}
<div className="flex gap-1 bg-neutral-800/50 dark:bg-neutral-800/50 bg-opacity-0 dark:bg-opacity-50 p-1 rounded-xl border border-neutral-700 dark:border-neutral-700 flex-shrink-0" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}>
  <motion.button
    type="button"
    onClick={() => setTransactionType('expense')}
    className={`p-2 rounded-lg transition-all ${
      transactionType === 'expense' 
        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' 
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <TrendingDown className="w-5 h-5" />
  </motion.button>
  <motion.button
    type="button"
    onClick={() => setTransactionType('income')}
    className={`p-2 rounded-lg transition-all ${
      transactionType === 'income' 
        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <TrendingUp className="w-5 h-5" />
  </motion.button>
</div>

<input 
  name="amount" 
  type="number" 
  step="0.01" 
  placeholder="₱0.00" 
  className="input w-32 text-lg font-semibold bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700 hover:border-cyan-500/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all flex-shrink-0 text-neutral-900 dark:text-neutral-100"
  required 
/>
<input 
  name="description" 
  type="text" 
  placeholder={transactionType === 'income' ? 'Source (e.g., Allowance)' : 'Description (optional)'} 
  className="input flex-[1.5] min-w-0 bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700 hover:border-cyan-500/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
/>
<div className="flex-[1.5] min-w-0">
  <StyledDropdown
    value={selectedEnvelope}
    onChange={setSelectedEnvelope}
    options={envelopes.map(e => ({
      value: e.id,
      label: e.name,
      icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
    }))}
    placeholder="Select Category"
  />
</div>
<motion.button 
  type="submit"
  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
  style={{
    background: transactionType === 'income' 
      ? 'linear-gradient(135deg, #10b981, #059669)' 
      : 'linear-gradient(135deg, #06b6d4, #0891b2)',
    boxShadow: transactionType === 'income'
      ? '0 0 20px #10b98140, 0 4px 12px rgba(0,0,0,0.3)'
      : '0 0 20px #06b6d440, 0 4px 12px rgba(0,0,0,0.3)',
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Log
</motion.button>
</form>
);
}