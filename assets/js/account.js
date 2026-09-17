/**
 * account.js
 * -----------------------------------------------------------------------
 * Powers account.html — the signed-in visitor's "Profile" page. Guards
 * the page with requireAuth() (redirects to login.html if nobody's
 * signed in), fills in the visitor's name/email/initials in the sidebar,
 * and lists their real order history (from orders.js — only orders
 * actually placed through checkout.js on this device/browser).
 */

import { requireAuth, logout } from './auth.js';
import { getOrdersForUser } from './orders.js';
import { formatMoney } from './cart.js';

// Escapes user-supplied text (order item titles) before it's dropped into
// innerHTML, so nothing in a saved order can break the page's markup.
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// "Jane Doe" -> "JD", used for the little avatar circle in the sidebar.
function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function orderRowHTML(order) {
  const itemsSummary = order.items.map((i) => `${escapeHtml(i.title)} \u00d7${i.qty}`).join(', ');
  return `
    <tr>
      <td>${order.id}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td>${itemsSummary}</td>
      <td>${formatMoney(order.total)}</td>
      <td><span class="status-pill ${order.status}">${order.status}</span></td>
    </tr>`;
}

function render(user) {
  document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = user.name; });
  document.querySelectorAll('[data-user-email]').forEach((el) => { el.textContent = user.email; });
  document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = initials(user.name); });

  // The "Admin Dashboard" sidebar link only makes sense for the admin
  // account — everyone else keeps it hidden (set via the `hidden` attr
  // in account.html, toggled off here when the role matches).
  const adminLink = document.querySelector('[data-admin-link]');
  if (adminLink) adminLink.hidden = user.role !== 'admin';

  const orders = getOrdersForUser(user.id);
  const tbody = document.querySelector('[data-orders-body]');
  const emptyEl = document.querySelector('[data-orders-empty]');
  const tableWrap = document.querySelector('[data-orders-table-wrap]');

  if (orders.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (tableWrap) tableWrap.hidden = true;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;
  if (tableWrap) tableWrap.hidden = false;
  if (tbody) tbody.innerHTML = orders.map(orderRowHTML).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return; // requireAuth() already redirected to login.html

  render(user);
  // Re-paint on language/currency switch so order totals and dates
  // reflect the newly selected language/currency without a page reload.
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
