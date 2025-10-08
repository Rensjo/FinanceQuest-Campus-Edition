export function formatCurrency(amount: number, locale = 'en-PH', currency = 'PHP') {
return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}