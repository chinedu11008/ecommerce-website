/**
 * product.js
 * -----------------------------------------------------------------------
 * Powers product.html — reads the ?id= from the URL, looks the product
 * up in the catalog (data/products.js), and fills in the page: gallery,
 * title, price, description, star rating, quantity stepper, Add to Cart
 * (cart.js), and the favourite/heart toggle (wishlist.js). If the id
 * doesn't match anything in the catalog, shows the "not found" state
 * instead of a half-filled page.
 */

import { getProductById, getCategory } from './data/products.js';
import { addItem, formatMoney } from './cart.js';
import { toggleFavourite, isFavourited } from './wishlist.js';

function starsHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<ion-icon name="${i <= rating ? 'star' : 'star-outline'}"></ion-icon>`;
  }
  return html;
}

function render() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = id ? getProductById(id) : null;

  const notFound = document.querySelector('[data-product-not-found]');
  const content = document.querySelector('[data-product-content]');

  if (!product) {
    if (notFound) notFound.hidden = false;
    if (content) content.hidden = true;
    return;
  }
  if (notFound) notFound.hidden = true;
  if (content) content.hidden = false;

  const category = getCategory(product.category);
  document.title = `${product.title} \u2014 Affinity`;

  const imgEl = document.querySelector('[data-product-image]');
  if (imgEl) { imgEl.src = product.img; imgEl.alt = product.title; }

  const gallery = [product.img, product.imgHover].filter((src, i, arr) => src && arr.indexOf(src) === i);
  const thumbsEl = document.querySelector('[data-product-thumbs]');
  if (thumbsEl) {
    if (gallery.length > 1) {
      thumbsEl.hidden = false;
      thumbsEl.innerHTML = gallery.map((src, i) => `
        <button type="button" class="product-thumb${i === 0 ? ' is-active' : ''}" data-thumb-src="${src}">
          <img src="${src}" alt="${product.title} view ${i + 1}">
        </button>`).join('');
      thumbsEl.querySelectorAll('.product-thumb').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (imgEl) imgEl.src = btn.dataset.thumbSrc;
          thumbsEl.querySelectorAll('.product-thumb').forEach((b) => b.classList.toggle('is-active', b === btn));
        });
      });
    } else {
      thumbsEl.hidden = true;
    }
  }

  document.querySelectorAll('[data-product-category]').forEach((el) => {
    el.textContent = category ? category.name : product.category;
    el.href = category ? `./category.html?cat=${category.slug}` : '#';
  });
  document.querySelectorAll('[data-product-category-link]').forEach((el) => {
    el.textContent = category ? category.name : product.category;
    el.href = category ? `./category.html?cat=${category.slug}` : './index.html';
  });
  document.querySelectorAll('[data-product-title]').forEach((el) => { el.textContent = product.title; });
  document.querySelectorAll('[data-product-title-crumb]').forEach((el) => { el.textContent = product.title; });
  document.querySelectorAll('[data-product-rating]').forEach((el) => { el.innerHTML = starsHTML(product.rating); });
  document.querySelectorAll('[data-product-description]').forEach((el) => { el.textContent = product.description || ''; });
  document.querySelectorAll('[data-product-price]').forEach((el) => { el.textContent = formatMoney(product.price); });
  document.querySelectorAll('[data-product-old-price]').forEach((el) => {
    if (product.oldPrice) { el.textContent = formatMoney(product.oldPrice); el.hidden = false; }
    else { el.hidden = true; }
  });

  // Quantity stepper
  const qtyValueEl = document.querySelector('[data-qty-value]');
  let qty = 1;
  const setQtyDisplay = () => { if (qtyValueEl) qtyValueEl.textContent = String(qty); };
  setQtyDisplay();

  document.querySelector('[data-qty-inc]')?.addEventListener('click', () => { qty += 1; setQtyDisplay(); });
  document.querySelector('[data-qty-dec]')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); setQtyDisplay(); });

  // Add to cart
  const addBtn = document.querySelector('[data-product-add-cart]');
  if (addBtn) {
    const label = addBtn.querySelector('span');
    const originalText = label ? label.textContent : '';
    addBtn.addEventListener('click', () => {
      addItem({ id: product.id, title: product.title, price: product.price, img: product.img }, qty);
      if (label) {
        label.textContent = 'Added \u2713';
        setTimeout(() => { label.textContent = originalText; }, 1500);
      }
    });
  }

  // Favourite toggle
  const favBtn = document.querySelector('[data-product-add-fav]');
  if (favBtn) {
    const icon = favBtn.querySelector('ion-icon');
    const syncFavIcon = () => {
      const fav = isFavourited(product.id);
      if (icon) icon.setAttribute('name', fav ? 'heart' : 'heart-outline');
      favBtn.classList.toggle('is-active', fav);
    };
    syncFavIcon();
    favBtn.addEventListener('click', () => {
      toggleFavourite({ id: product.id, title: product.title, price: product.price, img: product.img });
      syncFavIcon();
    });
  }
}

document.addEventListener('DOMContentLoaded', render);
window.addEventListener('currency:change', render);
