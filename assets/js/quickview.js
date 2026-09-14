/**
 * quickview.js
 * -----------------------------------------------------------------------
 * The eye-outline icon on every product card didn't do anything. This
 * injects one reusable modal (styled like the existing newsletter modal,
 * but its own element so it doesn't fight that popup's auto-open timer)
 * and wires every eye icon site-wide to open it with that product's
 * details, without leaving the current page.
 */

import { getProductById, getCategory, slugify } from './data/products.js';
import { addItem, formatMoney } from './cart.js';

const MODAL_HTML = `
  <div class="quickview-overlay" data-quickview-overlay>
    <div class="quickview-content">
      <button type="button" class="quickview-close-btn" data-quickview-close>
        <ion-icon name="close-outline"></ion-icon>
      </button>
      <div class="quickview-body">
        <img class="quickview-img" data-quickview-img src="" alt="">
        <div>
          <a href="#" class="showcase-category" data-quickview-category></a>
          <h2 class="quickview-title" data-quickview-title></h2>
          <div class="showcase-rating" data-quickview-rating></div>
          <div class="price-box">
            <p class="price" data-quickview-price></p>
            <del data-quickview-old-price hidden></del>
          </div>
          <p class="quickview-desc" data-quickview-desc></p>
          <div class="quickview-actions">
            <div class="qty-stepper">
              <button type="button" data-quickview-qty-dec aria-label="Decrease quantity">&minus;</button>
              <span data-quickview-qty-value>1</span>
              <button type="button" data-quickview-qty-inc aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn-solid" style="width:auto; padding:14px 24px;" data-quickview-add-cart>
              <ion-icon name="bag-add-outline"></ion-icon> Add to cart
            </button>
            <a href="#" class="btn-outline" data-quickview-view-full>View full details</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;

function extractProductFromCard(card) {
  const dataId = card.dataset.productId;
  if (dataId) {
    const known = getProductById(dataId);
    if (known) return known;
  }
  const titleEl = card.querySelector('.showcase-title');
  const priceEl = card.querySelector('.price-box .price');
  const imgEl = card.querySelector('.product-img.default, .product-img, img');
  if (!titleEl || !priceEl) return null;
  const title = titleEl.textContent.trim();
  const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
  const img = imgEl ? imgEl.getAttribute('src') : '';
  const fallbackId = dataId || slugify(title);
  const known = getProductById(fallbackId);
  return known || { id: fallbackId, title, price, img, rating: 0, description: '' };
}

let currentProduct = null;
let currentQty = 1;

function openModal(product) {
  currentProduct = product;
  currentQty = 1;

  const category = getCategory(product.category);
  document.querySelector('[data-quickview-img]').src = product.img || '';
  document.querySelector('[data-quickview-img]').alt = product.title;
  const catEl = document.querySelector('[data-quickview-category]');
  catEl.textContent = category ? category.name : (product.category || '');
  catEl.href = category ? `./category.html?cat=${category.slug}` : '#';
  document.querySelector('[data-quickview-title]').textContent = product.title;

  const ratingEl = document.querySelector('[data-quickview-rating]');
  let stars = '';
  for (let i = 1; i <= 5; i++) stars += `<ion-icon name="${i <= (product.rating || 0) ? 'star' : 'star-outline'}"></ion-icon>`;
  ratingEl.innerHTML = stars;

  document.querySelector('[data-quickview-price]').textContent = formatMoney(product.price);
  const oldPriceEl = document.querySelector('[data-quickview-old-price]');
  if (product.oldPrice) { oldPriceEl.textContent = formatMoney(product.oldPrice); oldPriceEl.hidden = false; }
  else { oldPriceEl.hidden = true; }

  const descEl = document.querySelector('[data-quickview-desc]');
  descEl.textContent = product.description || '';
  descEl.hidden = !product.description;

  document.querySelector('[data-quickview-qty-value]').textContent = '1';
  document.querySelector('[data-quickview-view-full]').href = `./product.html?id=${encodeURIComponent(product.id)}`;

  document.querySelector('[data-quickview-overlay]').classList.add('is-open');
}

function closeModal() {
  document.querySelector('[data-quickview-overlay]').classList.remove('is-open');
  currentProduct = null;
}

function init() {
  if (document.querySelector('[data-quickview-overlay]')) return;
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  document.querySelector('[data-quickview-overlay]').addEventListener('click', (e) => {
    if (e.target.closest('[data-quickview-close]') || e.target === e.currentTarget) closeModal();
  });

  document.querySelector('[data-quickview-qty-inc]').addEventListener('click', () => {
    currentQty += 1;
    document.querySelector('[data-quickview-qty-value]').textContent = String(currentQty);
  });
  document.querySelector('[data-quickview-qty-dec]').addEventListener('click', () => {
    currentQty = Math.max(1, currentQty - 1);
    document.querySelector('[data-quickview-qty-value]').textContent = String(currentQty);
  });

  document.querySelector('[data-quickview-add-cart]').addEventListener('click', (e) => {
    if (!currentProduct) return;
    addItem({ id: currentProduct.id, title: currentProduct.title, price: currentProduct.price, img: currentProduct.img }, currentQty);
    const btn = e.currentTarget;
    const original = btn.innerHTML;
    btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Added';
    setTimeout(() => { btn.innerHTML = original; }, 1200);
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action');
    if (!btn || !btn.querySelector('ion-icon[name="eye-outline"]')) return;
    const card = btn.closest('.showcase');
    if (!card) return;
    e.preventDefault();
    const product = extractProductFromCard(card);
    if (product) openModal(product);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', init);
