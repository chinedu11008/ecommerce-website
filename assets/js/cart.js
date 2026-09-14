/**
 * cart.js
 * -----------------------------------------------------------------------
 * There's no backend, so the cart lives in localStorage on the visitor's
 * own browser (key: "affinity_cart"). That's fine for a demo/prototype —
 * it persists across page loads and tabs on the same device, but it is
 * NOT synced across devices and isn't tied to a real account server-side.
 *
 * This file is included on every page (via the shared header/footer) so
 * that clicking any "add to cart" bag icon anywhere on the site — the
 * existing homepage product cards included — updates the same cart and
 * the header badge.
 */

import { getProductById, slugify } from './data/products.js';
import { formatCurrency } from './currency.js';

const CART_KEY = 'affinity_cart';

export function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateHeaderCount();
  window.dispatchEvent(new CustomEvent('cart:change', { detail: { items } }));
}

/** item: {id, title, price, img} */
export function addItem(item, qty = 1) {
  const items = readCart();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ ...item, qty });
  }
  writeCart(items);
}

export function removeItem(id) {
  writeCart(readCart().filter((i) => i.id !== id));
}

export function setQty(id, qty) {
  const items = readCart();
  const line = items.find((i) => i.id === id);
  if (!line) return;
  if (qty <= 0) {
    writeCart(items.filter((i) => i.id !== id));
    return;
  }
  line.qty = qty;
  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}

export function getCount() {
  return readCart().reduce((sum, i) => sum + i.qty, 0);
}

export function getSubtotal() {
  return readCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function formatMoney(n) {
  return formatCurrency(n);
}

/** Reads a product's id/title/price/img straight off a .showcase card in
 *  the DOM. Cards rendered from products.js carry data-product-id, so we
 *  look those up for accurate data; older hardcoded homepage cards don't,
 *  so we fall back to reading the visible title/price/image directly. */
function extractProductFromCard(card) {
  const dataId = card.dataset.productId;
  if (dataId) {
    const known = getProductById(dataId);
    if (known) return { id: known.id, title: known.title, price: known.price, img: known.img };
  }

  const titleEl = card.querySelector('.showcase-title');
  const priceEl = card.querySelector('.price-box .price');
  const imgEl = card.querySelector('.product-img.default, .product-img, img');
  if (!titleEl || !priceEl) return null;

  const title = titleEl.textContent.trim();
  const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
  const img = imgEl ? imgEl.getAttribute('src') : '';

  return { id: dataId || slugify(title), title, price, img };
}

function findHeaderCountBadges() {
  // The bag icon's sibling <span class="count"> in the header user-actions.
  const badges = [];
  document.querySelectorAll('.header-user-actions .action-btn').forEach((btn) => {
    if (btn.querySelector('ion-icon[name="bag-handle-outline"]')) {
      const badge = btn.querySelector('.count');
      if (badge) badges.push(badge);
    }
  });
  return badges;
}

export function updateHeaderCount() {
  const count = getCount();
  findHeaderCountBadges().forEach((badge) => {
    badge.textContent = String(count);
  });
}

let toastTimer = null;
function showAddedToast(product) {
  let toast = document.querySelector('.cart-added-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-added-toast';
    toast.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon><span class="cart-added-toast-text"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.cart-added-toast-text').textContent = `Added "${product.title}" to cart`;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function wireAddToCartDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action');
    if (!btn || !btn.querySelector('ion-icon[name="bag-add-outline"]')) return;
    const card = btn.closest('.showcase');
    if (!card) return;

    e.preventDefault();
    const product = extractProductFromCard(card);
    if (!product) return;

    addItem(product, 1);
    showAddedToast(product);
  });

  // Also let the header bag icon itself act as a link to the cart page.
  document.querySelectorAll('.header-user-actions .action-btn').forEach((btn) => {
    if (btn.querySelector('ion-icon[name="bag-handle-outline"]')) {
      btn.addEventListener('click', () => { window.location.href = './cart.html'; });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCount();
  wireAddToCartDelegation();
});
