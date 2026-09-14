/**
 * compare.js
 * -----------------------------------------------------------------------
 * The repeat-outline icon on product cards didn't do anything. This adds
 * it to a compare list (localStorage, capped at 4) and shows a small
 * floating bar (a new but minimal element, not a change to the existing
 * header/nav) linking to compare.html once something's been added.
 */

import { getProductById, slugify } from './data/products.js';

const COMPARE_KEY = 'affinity_compare';
const MAX_COMPARE = 4;

export function readCompare() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCompare(ids) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('compare:change', { detail: { ids } }));
}

export function isComparing(id) {
  return readCompare().includes(id);
}

export function removeFromCompare(id) {
  writeCompare(readCompare().filter((i) => i !== id));
}

/** Returns {added:boolean, full:boolean} */
export function toggleCompare(id) {
  const ids = readCompare();
  const idx = ids.indexOf(id);
  if (idx >= 0) {
    ids.splice(idx, 1);
    writeCompare(ids);
    return { added: false, full: false };
  }
  if (ids.length >= MAX_COMPARE) {
    return { added: false, full: true };
  }
  ids.push(id);
  writeCompare(ids);
  return { added: true, full: false };
}

function extractIdFromCard(card) {
  if (card.dataset.productId) return card.dataset.productId;
  const titleEl = card.querySelector('.showcase-title');
  return titleEl ? slugify(titleEl.textContent.trim()) : null;
}

function renderBar() {
  let bar = document.querySelector('[data-compare-bar]');
  const ids = readCompare().filter((id) => getProductById(id));

  if (ids.length === 0) {
    if (bar) bar.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.setAttribute('data-compare-bar', '');
    bar.className = 'compare-bar';
    document.body.appendChild(bar);
  }

  bar.innerHTML = `
    <span>${ids.length} item${ids.length > 1 ? 's' : ''} to compare</span>
    <a href="./compare.html" class="btn-solid" style="width:auto; padding:10px 20px;">Compare</a>
    <button type="button" class="compare-bar-clear" data-compare-clear aria-label="Clear compare list">
      <ion-icon name="close-outline"></ion-icon>
    </button>`;

  bar.querySelector('[data-compare-clear]').addEventListener('click', () => {
    writeCompare([]);
  });
}

function syncIcons() {
  document.querySelectorAll('.showcase').forEach((card) => {
    const icon = card.querySelector('.btn-action ion-icon[name="repeat-outline"]');
    if (!icon) return;
    const id = extractIdFromCard(card);
    if (!id) return;
    icon.closest('.btn-action').classList.toggle('is-active', isComparing(id));
  });
}

function showLimitToast() {
  let toast = document.querySelector('.compare-limit-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-added-toast compare-limit-toast';
    toast.innerHTML = `<ion-icon name="information-circle-outline"></ion-icon><span>You can compare up to ${MAX_COMPARE} products at a time.</span>`;
    document.body.appendChild(toast);
  }
  toast.classList.add('is-visible');
  clearTimeout(showLimitToast._t);
  showLimitToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function wireDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action');
    if (!btn || !btn.querySelector('ion-icon[name="repeat-outline"]')) return;
    const card = btn.closest('.showcase');
    if (!card) return;
    e.preventDefault();
    const id = extractIdFromCard(card);
    if (!id) return;
    const result = toggleCompare(id);
    if (result.full) {
      showLimitToast();
      return;
    }
    btn.classList.toggle('is-active', result.added);
  });

  window.addEventListener('compare:change', () => { renderBar(); syncIcons(); });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBar();
  syncIcons();
  wireDelegation();
});
