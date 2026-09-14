import { search } from './data/products.js';
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

function productCardHTML(p) {
  const href = `./product.html?id=${p.id}`;
  return `
    <div class="showcase" data-product-id="${p.id}">
      <div class="showcase-banner">
        <a href="${href}">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" width="300" class="product-img default">
          <img src="${p.imgHover || p.img}" alt="${escapeHtml(p.title)}" width="300" class="product-img hover">
        </a>
        <div class="showcase-actions">
          <button class="btn-action"><ion-icon name="heart-outline"></ion-icon></button>
          <button class="btn-action"><ion-icon name="bag-add-outline"></ion-icon></button>
        </div>
      </div>
      <div class="showcase-content">
        <a href="${href}"><h3 class="showcase-title">${escapeHtml(p.title)}</h3></a>
        <div class="showcase-rating">${starsHTML(p.rating)}</div>
        <div class="price-box"><p class="price">${formatMoney(p.price)}</p></div>
      </div>
    </div>`;
}

function categoryCardHTML(c) {
  return `
    <a class="search-category-card" href="./category.html?cat=${c.slug}">
      <img src="${c.icon}" alt="${escapeHtml(c.name)}" width="28" height="28">
      <span>${escapeHtml(c.name)}</span>
    </a>`;
}

function render() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';

  document.querySelectorAll('[data-search-query]').forEach((el) => { el.textContent = q; });
  const input = document.querySelector('[data-search-input]');
  if (input) input.value = q;

  const { products, categories } = search(q);

  const catSection = document.querySelector('[data-search-categories-section]');
  const catGrid = document.querySelector('[data-search-categories]');
  if (categories.length && catGrid) {
    catSection.hidden = false;
    catGrid.innerHTML = categories.map(categoryCardHTML).join('');
  } else if (catSection) {
    catSection.hidden = true;
  }

  const grid = document.querySelector('[data-search-products]');
  const empty = document.querySelector('[data-search-empty]');
  const countEls = document.querySelectorAll('[data-search-count]');
  countEls.forEach((el) => { el.textContent = String(products.length); });

  if (products.length === 0) {
    if (empty) empty.hidden = false;
    if (grid) grid.innerHTML = '';
  } else {
    if (empty) empty.hidden = true;
    if (grid) grid.innerHTML = products.map(productCardHTML).join('');
  }
}

document.addEventListener('DOMContentLoaded', render);
window.addEventListener('currency:change', render);
