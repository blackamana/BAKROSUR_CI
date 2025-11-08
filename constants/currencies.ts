export type Currency = 'FCFA' | 'USD' | 'EUR';

export const EXCHANGE_RATES: Record<Currency, number> = {
  FCFA: 1,
  USD: 0.0016,
  EUR: 0.0015,
};

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  
  const amountInFCFA = from === 'FCFA' ? amount : amount / EXCHANGE_RATES[from];
  
  return to === 'FCFA' ? amountInFCFA : amountInFCFA * EXCHANGE_RATES[to];
}

export function formatCurrency(amount: number, currency: Currency): string {
  switch (currency) {
    case 'FCFA':
      return `${amount.toLocaleString('fr-FR')} FCFA`;
    case 'USD':
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'EUR':
      return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
  }
}

export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'FCFA':
      return 'FCFA';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
  }
}
