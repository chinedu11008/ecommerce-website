/**
 * checkout.js
 * -----------------------------------------------------------------------
 * Powers checkout.html. Renders the order summary from the current cart,
 * validates the shipping/payment form (native HTML5 validation via
 * form.checkValidity() — no server round-trip), and on submit creates a
 * demo order (orders.js) and clears the cart. IMPORTANT: no payment is
 * actually processed here — there's no payment gateway wired up, the
 * card fields are collected and then simply discarded. Don't point this
 * at real customers/real cards without replacing this step.
 */

import { readCart, getSubtotal, formatMoney, clearCart } from './cart.js';
import { getCurrentUser } from './auth.js';
import { createOrder } from './orders.js';
import { t } from './i18n.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderSummary() {
  const items = readCart();
  const itemsEl = document.querySelector('[data-checkout-items]');
  const totalEls = document.querySelectorAll('[data-checkout-total]');
  const subtotal = getSubtotal();

  if (itemsEl) {
    itemsEl.innerHTML = items.map((i) => `
      <div class="checkout-summary-item">
        <span>${escapeHtml(i.title)} \u00d7 ${i.qty}</span>
        <span>${formatMoney(i.price * i.qty)}</span>
      </div>`).join('');
  }
  totalEls.forEach((el) => { el.textContent = formatMoney(subtotal); });

  const emptyEl = document.querySelector('[data-checkout-empty]');
  const formEl = document.querySelector('[data-checkout-form]');
  const isEmpty = items.length === 0;
  if (emptyEl) emptyEl.hidden = !isEmpty;
  if (formEl) formEl.hidden = isEmpty;

  return items;
}

function showError(message) {
  const el = document.querySelector('[data-checkout-error]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
}

function clearError() {
  const el = document.querySelector('[data-checkout-error]');
  if (!el) return;
  el.textContent = '';
  el.classList.remove('is-visible');
}

function handleSubmit(e) {
  e.preventDefault();
  clearError();

  const form = e.target;
  // Native HTML5 validation only (required fields, email format, etc.) —
  // the browser handles showing which field is wrong via reportValidity().
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const items = readCart();
  if (items.length === 0) {
    showError(t('checkout.emptyCart'));
    return;
  }

  const data = new FormData(form);
  const shipping = {
    fullName: data.get('fullName'),
    email: data.get('email'),
    address: data.get('address'),
    city: data.get('city'),
    state: data.get('state'),
    zip: data.get('zip'),
    country: data.get('country'),
  };

  const user = getCurrentUser();
  const total = getSubtotal();

  // NOTE: this is the entire "payment" step. The card fields above are
  // validated for shape (see checkout.html's input patterns) but never
  // read here — nothing is charged, nothing is sent anywhere. Placing
  // the order and clearing the cart happens unconditionally.
  createOrder({
    userId: user ? user.id : null,
    items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
    total,
    shipping,
  });

  clearCart();

  const formEl = document.querySelector('[data-checkout-form]');
  const emptyEl = document.querySelector('[data-checkout-empty]');
  const successEl = document.querySelector('[data-checkout-success]');
  if (formEl) formEl.hidden = true;
  if (emptyEl) emptyEl.hidden = true;
  if (successEl) successEl.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  const form = document.querySelector('[data-checkout-form]');
  if (form) form.addEventListener('submit', handleSubmit);
});

window.addEventListener('cart:change', renderSummary);
window.addEventListener('lang:change', renderSummary);
window.addEventListener('currency:change', renderSummary);
