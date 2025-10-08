import { useBudget } from '../store/budget';


export default function Insights(){
const { envelopes, transactions } = useBudget(s=>({ envelopes: s.envelopes, transactions: s.transactions }));
const spendThisMonth = transactions
.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
.reduce((sum, t) => sum + Math.abs(t.amount), 0);


const top = [...envelopes]
.map(e => ({ id: e.id, name: e.name, spent: Math.max(0, e.monthlyBudget - e.balance) }))
.sort((a,b) => b.spent - a.spent)
.slice(0, 5);


return (
<div className="grid md:grid-cols-2 gap-4">
<div className="card">
<div className="text-sm text-neutral-600 dark:text-neutral-400">This Month</div>
<div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Spent {spendThisMonth.toLocaleString()}</div>
<div className="text-xs text-neutral-600 dark:text-neutral-500">(demo calc)
</div>
</div>
<div className="card">
<div className="text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-200">Top Spending Envelopes</div>
<ul className="space-y-2 text-sm">
{top.map(t => (
<li key={t.id} className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
<span>{t.name}</span>
<span className="text-neutral-600 dark:text-neutral-300">{t.spent.toLocaleString()}</span>
</li>
))}
{top.length === 0 && <div className="text-neutral-600 dark:text-neutral-500">No data yet.</div>}
</ul>
</div>
</div>
);
}