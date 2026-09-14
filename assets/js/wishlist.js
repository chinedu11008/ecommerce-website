/**
 * wishlist.js
 * -----------------------------------------------------------------------
 * Same pattern as cart.js: no backend, so favourites live in localStorage
 * on the visitor's own browser. Wires up every heart-outline button
 * site-wide (product cards + the header wishlist icon) so toggling a
 * favourite works the same everywhere, and favourites.html reads from
 * the same store to list them.
 */

import { getProductById, slugify } from './data/products.js';

const WISHLIST_KEY = 'affinity_wishlist';

export function readWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  updateHeaderCount();
  window.dispatchEvent(new CustomEvent('wishlist:change', { detail: { items } }));
}

export function isFavourited(id) {
  return readWishlist().some((i) => i.id === id);
}

/** item: {id, title, price, img} */
export function toggleFavourite(item) {
  const items = readWishlist();
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items.splice(idx, 1);
    writeWishlist(items);
    return false; // now NOT favourited
  }
  items.push(item);
  writeWishlist(items);
  return true; // now favourited
}

export function removeFavourite(id) {
  writeWishlist(readWishlist().filter((i) => i.id !== id));
}

export function getWishlistCount() {
  return readWishlist().length;
}

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

function findHeaderWishlistBadges() {
  const badges = [];
  document.querySelectorAll('.header-user-actions .action-btn').forEach((btn) => {
    if (btn.querySelector('ion-icon[name="heart-outline"]')) {
      const badge = btn.querySelector('.count');
      if (badge) badges.push(badge);
    }
  });
  return badges;
}

export function updateHeaderCount() {
  const count = getWishlistCount();
  findHeaderWishlistBadges().forEach((badge) => { badge.textContent = String(count); });
}

function syncHeartIcons() {
  document.querySelectorAll('.showcase[data-product-id], .showcase').forEach((card) => {
    const btn = card.querySelector('.btn-action ion-icon[name="heart-outline"], .btn-action ion-icon[name="heart"]');
    if (!btn) return;
    const product = extractProductFromCard(card);
    if (!product) return;
    const fav = isFavourited(product.id);
    btn.setAttribute('name', fav ? 'heart' : 'heart-outline');
    btn.closest('.btn-action').classList.toggle('is-active', fav);
  });
}

function wireHeartDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action');
    if (!btn) return;
    const icon = btn.querySelector('ion-icon[name="heart-outline"], ion-icon[name="heart"]');
    if (!icon) return;
    const card = btn.closest('.showcase');
    if (!card) return;

    e.preventDefault();
    const product = extractProductFromCard(card);
    if (!product) return;

    const nowFav = toggleFavourite(product);
    icon.setAttribute('name', nowFav ? 'heart' : 'heart-outline');
    btn.classList.toggle('is-active', nowFav);
  });

  // Header heart icon acts as a link to the favourites page.
  document.querySelectorAll('.header-user-actions .action-btn').forEach((btn) => {
    if (btn.querySelector('ion-icon[name="heart-outline"]')) {
      btn.addEventListener('click', () => { window.location.href = './favourites.html'; });
    }
  });

  window.addEventListener('wishlist:change', syncHeartIcons);
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCount();
  syncHeartIcons();
  wireHeartDelegation();
});
