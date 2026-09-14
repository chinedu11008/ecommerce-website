/**
 * category.js
 * -----------------------------------------------------------------------
 * category.html is one shared template for all 8 categories — the actual
 * category is picked from the URL, e.g. category.html?cat=jacket. That
 * keeps 8 near-identical pages from having to be hand-maintained
 * separately; every category still gets its own real, linkable URL.
 */

import { getCategory, getProductsByCategory, CATEGORIES } from './data/products.js';
import { t } from './i18n.js';
import { formatMoney } from './cart.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function starsHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<ion-icon name="${i <= rating ? 'star' : 'star-outline'}"></ion-icon>`;
  }
  return html;
}

function badgeHTML(badge) {
  if (!badge) return '';
  if (badge === 'sale') return '<p class="showcase-badge angle black">sale</p>';
  if (badge === 'new') return '<p class="showcase-badge angle pink">new</p>';
  return `<p class="showcase-badge">${escapeHtml(badge)}</p>`;
}

function cardHTML(p, categoryName) {
  const href = `./product.html?id=${encodeURIComponent(p.id)}`;
  return `
    <div class="showcase" data-product-id="${p.id}">
      <div class="showcase-banner">
        <a href="${href}">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" width="300" class="product-img default">
          <img src="${p.imgHover || p.img}" alt="${escapeHtml(p.title)}" width="300" class="product-img hover">
        </a>
        ${badgeHTML(p.badge)}
        <div class="showcase-actions">
          <button class="btn-action"><ion-icon name="heart-outline"></ion-icon></button>
          <button class="btn-action"><ion-icon name="eye-outline"></ion-icon></button>
          <button class="btn-action"><ion-icon name="repeat-outline"></ion-icon></button>
          <button class="btn-action"><ion-icon name="bag-add-outline"></ion-icon></button>
        </div>
      </div>
      <div class="showcase-content">
        <a href="./category.html?cat=${p.category}" class="showcase-category">${escapeHtml(categoryName)}</a>
        <a href="${href}"><h3 class="showcase-title">${escapeHtml(p.title)}</h3></a>
        <div class="showcase-rating">${starsHTML(p.rating)}</div>
        <div class="price-box">
          <p class="price">${formatMoney(p.price)}</p>
          ${p.oldPrice ? `<del>${formatMoney(p.oldPrice)}</del>` : ''}
        </div>
      </div>
    </div>`;
}

function sortProducts(products, mode) {
  const list = [...products];
  if (mode === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (mode === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (mode === 'rating') list.sort((a, b) => b.rating - a.rating);
  return list;
}

function render() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('cat') || CATEGORIES[0].slug;
  const category = getCategory(slug) || CATEGORIES[0];
  const products = getProductsByCategory(category.slug);

  document.title = `${category.name} \u2014 Affinity`;
  document.querySelectorAll('[data-category-title]').forEach((el) => { el.textContent = category.name; });
  document.querySelectorAll('[data-category-breadcrumb]').forEach((el) => { el.textContent = category.name; });

  const grid = document.querySelector('[data-category-grid]');
  const emptyState = document.querySelector('[data-category-empty]');
  const countEls = document.querySelectorAll('[data-category-count]');
  const sortSelect = document.querySelector('[data-category-sort]');
  const priceMin = document.querySelector('[data-filter-price-min]');
  const priceMax = document.querySelector('[data-filter-price-max]');
  const ratingFilter = document.querySelector('[data-filter-rating]');
  const clearBtn = document.querySelector('[data-filter-clear]');

  function applyFilters(list) {
    const min = priceMin && priceMin.value !== '' ? parseFloat(priceMin.value) : null;
    const max = priceMax && priceMax.value !== '' ? parseFloat(priceMax.value) : null;
    const minRating = ratingFilter ? parseInt(ratingFilter.value, 10) : 0;

    return list.filter((p) => {
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      if (minRating && p.rating < minRating) return false;
      return true;
    });
  }

  function paint() {
    const filtered = applyFilters(products);
    const sorted = sortProducts(filtered, sortSelect ? sortSelect.value : 'featured');
    countEls.forEach((el) => { el.textContent = String(sorted.length); });

    if (!grid) return;
    if (sorted.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = sorted.map((p) => cardHTML(p, category.name)).join('');
  }

  paint();
  if (sortSelect) sortSelect.addEventListener('change', paint);
  if (priceMin) priceMin.addEventListener('input', paint);
  if (priceMax) priceMax.addEventListener('input', paint);
  if (ratingFilter) ratingFilter.addEventListener('change', paint);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (priceMin) priceMin.value = '';
      if (priceMax) priceMax.value = '';
      if (ratingFilter) ratingFilter.value = '0';
      paint();
    });
  }
  // Re-render text (category name in each card) if the language changes.
  window.addEventListener('lang:change', paint);
  window.addEventListener('currency:change', paint);
}

document.addEventListener('DOMContentLoaded', render);
