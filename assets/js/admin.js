/**
 * admin.js
 * -----------------------------------------------------------------------
 * Powers admin.html. Guarded by requireAdmin() (auth.js) — redirects
 * anyone who isn't signed in as the demo admin account back to
 * index.html. Renders four tab panels from the same in-browser data used
 * everywhere else on the site: orders.js (all orders, any customer),
 * auth.js (all registered users), and the static PRODUCTS catalog.
 *
 * The Products and Customers tabs are READ-ONLY — there's no add/edit/
 * delete here yet. Orders is the one editable bit: the status <select>
 * in each row calls updateOrderStatus() and persists immediately.
 */

import { requireAdmin, logout, getAllUsers } from './auth.js';
import { getAllOrders, updateOrderStatus } from './orders.js';
import { PRODUCTS } from './data/products.js';
import { formatMoney } from './cart.js';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// The four stat cards at the top of the Overview tab.
function renderOverview(orders, users) {
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const customers = users.filter((u) => u.role !== 'admin');
  const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  set('[data-stat-revenue]', formatMoney(revenue));
  set('[data-stat-orders]', String(orders.length));
  set('[data-stat-customers]', String(customers.length));
  set('[data-stat-products]', String(PRODUCTS.length));
}

function renderOrders(orders, users) {
  const tbody = document.querySelector('[data-admin-orders-body]');
  if (!tbody) return;
  const userById = Object.fromEntries(users.map((u) => [u.id, u]));
  const sorted = orders.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = sorted
    .map((o) => {
      const customer = o.userId && userById[o.userId] ? userById[o.userId].email : 'Guest';
      const options = STATUSES.map((s) => `<option value="${s}"${s === o.status ? ' selected' : ''}>${s}</option>`).join('');
      return `
        <tr data-order-row="${o.id}">
          <td>${o.id}</td>
          <td>${escapeHtml(customer)}</td>
          <td>${o.items.reduce((n, i) => n + i.qty, 0)} items</td>
          <td>${formatMoney(o.total)}</td>
          <td><select class="status-select" data-order-status="${o.id}">${options}</select></td>
          <td>${new Date(o.date).toLocaleDateString()}</td>
        </tr>`;
    })
    .join('') || '<tr><td colspan="6">No orders yet.</td></tr>';

  // Changing an order's status writes straight through to localStorage;
  // there's no "save" step and no server round-trip to wait on.
  tbody.querySelectorAll('[data-order-status]').forEach((select) => {
    select.addEventListener('change', () => {
      updateOrderStatus(select.dataset.orderStatus, select.value);
    });
  });
}

// Read-only listing of the static catalog (assets/js/data/products.js).
// There's no admin "add product" flow yet — see the project README for
// why (it means deciding how admin-added products persist alongside the
// static catalog file).
function renderProducts() {
  const tbody = document.querySelector('[data-admin-products-body]');
  if (!tbody) return;
  tbody.innerHTML = PRODUCTS.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.title)}</td>
      <td>${escapeHtml(p.category)}</td>
      <td>${formatMoney(p.price)}</td>
    </tr>`).join('');
}

function renderCustomers(users, orders) {
  const tbody = document.querySelector('[data-admin-customers-body]');
  if (!tbody) return;
  const customers = users.filter((u) => u.role !== 'admin');
  tbody.innerHTML = customers.map((u) => {
    const orderCount = orders.filter((o) => o.userId === u.id).length;
    return `
      <tr>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${orderCount}</td>
      </tr>`;
  }).join('') || '<tr><td colspan="3">No customers yet.</td></tr>';
}

// Simple show/hide tab switcher for the four dashboard panels — no
// routing involved, every panel is already in the DOM (see admin.html).
function wireTabs() {
  const buttons = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('[data-panel]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.forEach((p) => { p.hidden = p.dataset.panel !== target; });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const admin = requireAdmin();
  if (!admin) return; // requireAdmin() already redirected non-admins away

  document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = admin.name; });
  document.querySelectorAll('[data-user-initials]').forEach((el) => {
    el.textContent = admin.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  });

  const orders = getAllOrders();
  const users = getAllUsers();

  renderOverview(orders, users);
  renderOrders(orders, users);
  renderProducts();
  renderCustomers(users, orders);
  wireTabs();

  // Products/orders/revenue all show dollar amounts, so re-paint them
  // (not Customers, which has none) when the currency selector changes.
  window.addEventListener('currency:change', () => {
    renderOverview(orders, users);
    renderOrders(orders, users);
    renderProducts();
  });

  const logoutBtn = document.querySelector('[data-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = './index.html';
    });
  }
});
