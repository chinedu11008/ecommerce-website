/**
 * analytics.js
 * -----------------------------------------------------------------------
 * Powers analytics.html (reached from the header's Profile dropdown once
 * signed in). Computes simple stats — order count, total spent, average
 * order, most-ordered category — entirely client-side from the signed-in
 * visitor's own order history (orders.js). There's no real analytics
 * backend; this is just arithmetic over localStorage data, per browser.
 */

import { requireAuth, logout } from './auth.js';
import { getOrdersForUser } from './orders.js';
import { getProductById } from './data/products.js';
import { formatMoney } from './cart.js';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function render(user) {
  document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = user.name; });
  document.querySelectorAll('[data-user-email]').forEach((el) => { el.textContent = user.email; });
  document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = initials(user.name); });

  const adminLink = document.querySelector('[data-admin-link]');
  if (adminLink) adminLink.hidden = user.role !== 'admin';

  const orders = getOrdersForUser(user.id);
  const empty = document.querySelector('[data-analytics-empty]');

  if (orders.length === 0) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const avg = totalSpent / orders.length;

  const categoryCounts = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const product = getProductById(item.id);
      const cat = product ? product.category : null;
      if (!cat) return;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + item.qty;
    });
  });
  let topCategory = '\u2014';
  let topCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > topCount) { topCount = count; topCategory = cat; }
  });

  const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  set('[data-analytics-orders]', String(orders.length));
  set('[data-analytics-spent]', formatMoney(totalSpent));
  set('[data-analytics-avg]', formatMoney(avg));
  set('[data-analytics-top-category]', topCategory);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  render(user);
  window.addEventListener('lang:change', () => render(user));
  window.addEventListener('currency:change', () => render(user));

  const logoutBtn = document.querySelector('[data-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = './index.html';
    });
  }
});
