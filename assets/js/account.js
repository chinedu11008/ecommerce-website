import { requireAuth, logout } from './auth.js';
import { getOrdersForUser } from './orders.js';
import { formatMoney } from './cart.js';
import { t } from './i18n.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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
  if (!user) return; // already redirected to login

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
