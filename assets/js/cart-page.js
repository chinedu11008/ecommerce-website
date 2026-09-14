import { readCart, setQty, removeItem, getSubtotal, formatMoney } from './cart.js';
import { t } from './i18n.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function lineHTML(item) {
  return `
    <div class="cart-line" data-line-id="${escapeHtml(item.id)}">
      <img src="${item.img || ''}" class="cart-line-img" alt="${escapeHtml(item.title)}">
      <div>
        <p class="cart-line-title">${escapeHtml(item.title)}</p>
        <p class="cart-line-price">${formatMoney(item.price)} ${t('cart.each')}</p>
      </div>
      <div class="cart-line-actions">
        <p class="cart-line-price"><strong>${formatMoney(item.price * item.qty)}</strong></p>
        <div class="qty-stepper">
          <button type="button" data-qty-dec aria-label="-">\u2212</button>
          <span>${item.qty}</span>
          <button type="button" data-qty-inc aria-label="+">+</button>
        </div>
        <button type="button" class="cart-line-remove" data-remove>
          <ion-icon name="trash-outline"></ion-icon> ${t('common.remove')}
        </button>
      </div>
    </div>`;
}

function render() {
  const items = readCart();
  const emptyEl = document.querySelector('[data-cart-empty]');
  const filledEl = document.querySelector('[data-cart-filled]');
  const listEl = document.querySelector('[data-cart-list]');

  if (items.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (filledEl) filledEl.hidden = true;
    return;
  }

  if (emptyEl) emptyEl.hidden = true;
  if (filledEl) filledEl.hidden = false;
  if (listEl) listEl.innerHTML = items.map(lineHTML).join('');

  const subtotal = getSubtotal();
  document.querySelectorAll('[data-cart-subtotal]').forEach((el) => { el.textContent = formatMoney(subtotal); });
  document.querySelectorAll('[data-cart-total]').forEach((el) => { el.textContent = formatMoney(subtotal); });
}

document.addEventListener('click', (e) => {
  const line = e.target.closest('.cart-line');
  if (!line) return;
  const id = line.dataset.lineId;
  const items = readCart();
  const current = items.find((i) => i.id === id);
  if (!current) return;

  if (e.target.closest('[data-qty-inc]')) {
    setQty(id, current.qty + 1);
    render();
  } else if (e.target.closest('[data-qty-dec]')) {
    setQty(id, current.qty - 1);
    render();
  } else if (e.target.closest('[data-remove]')) {
    removeItem(id);
    render();
  }
});

window.addEventListener('cart:change', render);
window.addEventListener('lang:change', render);
window.addEventListener('currency:change', render);
document.addEventListener('DOMContentLoaded', render);
