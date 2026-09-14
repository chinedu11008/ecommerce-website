import { readWishlist, removeFavourite } from './wishlist.js';
import { getProductById } from './data/products.js';
import { formatMoney } from './cart.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function starsHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<ion-icon name="${i <= (rating || 0) ? 'star' : 'star-outline'}"></ion-icon>`;
  }
  return html;
}

function cardHTML(item) {
  const full = getProductById(item.id);
  const title = full ? full.title : item.title;
  const price = full ? full.price : item.price;
  const img = full ? full.img : item.img;
  const rating = full ? full.rating : 0;
  const href = full ? `./product.html?id=${encodeURIComponent(item.id)}` : '#';

  return `
    <div class="showcase" data-product-id="${escapeHtml(item.id)}">
      <div class="showcase-banner">
        <img src="${img || ''}" alt="${escapeHtml(title)}" width="300" class="product-img default">
        <div class="showcase-actions">
          <button class="btn-action is-active" data-remove-fav title="Remove from favourites">
            <ion-icon name="heart"></ion-icon>
          </button>
        </div>
      </div>
      <div class="showcase-content">
        <a href="${href}"><h3 class="showcase-title">${escapeHtml(title)}</h3></a>
        <div class="showcase-rating">${starsHTML(rating)}</div>
        <div class="price-box">
          <p class="price">${formatMoney(price)}</p>
        </div>
      </div>
    </div>`;
}

function render() {
  const items = readWishlist();
  const emptyEl = document.querySelector('[data-fav-empty]');
  const gridEl = document.querySelector('[data-fav-grid]');
  const countEls = document.querySelectorAll('[data-fav-count]');

  countEls.forEach((el) => { el.textContent = String(items.length); });

  if (items.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (gridEl) gridEl.hidden = true;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;
  if (gridEl) { gridEl.hidden = false; gridEl.innerHTML = items.map(cardHTML).join(''); }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove-fav]');
  if (!btn) return;
  const card = btn.closest('.showcase');
  if (!card) return;
  e.preventDefault();
  removeFavourite(card.dataset.productId);
  render();
});

window.addEventListener('wishlist:change', render);
window.addEventListener('currency:change', render);
document.addEventListener('DOMContentLoaded', render);
