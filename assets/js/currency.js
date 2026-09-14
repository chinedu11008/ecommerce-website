/**
 * currency.js
 * -----------------------------------------------------------------------
 * The header already had a USD/EUR <select> that did nothing. All prices
 * in the catalog are stored in USD; this converts for display only using
 * a fixed rate (there's no live exchange-rate feed here) and re-paints
 * whenever the selection changes. cart/checkout/account/admin all format
 * money through cart.js's formatMoney(), which reads the active currency
 * from here, so switching currency updates the whole site consistently.
 */

const CURRENCY_KEY = 'affinity_currency';
const DEFAULT_CURRENCY = 'usd';

export const CURRENCIES = {
  usd: { symbol: '$', rate: 1 },
  eur: { symbol: '\u20ac', rate: 0.92 },
};

export function getCurrentCurrency() {
  const stored = localStorage.getItem(CURRENCY_KEY);
  return CURRENCIES[stored] ? stored : DEFAULT_CURRENCY;
}

/** Converts a USD amount and formats it with the active currency's symbol. */
export function formatCurrency(usdAmount) {
  const code = getCurrentCurrency();
  const { symbol, rate } = CURRENCIES[code];
  return `${symbol}${(Number(usdAmount) * rate).toFixed(2)}`;
}

export function setCurrency(code) {
  if (!CURRENCIES[code]) return;
  localStorage.setItem(CURRENCY_KEY, code);
  document.querySelectorAll('select[name="currency"]').forEach((select) => { select.value = code; });
  window.dispatchEvent(new CustomEvent('currency:change', { detail: { code } }));
}

document.addEventListener('DOMContentLoaded', () => {
  const current = getCurrentCurrency();
  document.querySelectorAll('select[name="currency"]').forEach((select) => {
    select.value = current;
    select.addEventListener('change', () => setCurrency(select.value));
  });
});
