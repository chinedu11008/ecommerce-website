import { readCompare, removeFromCompare } from './compare.js';
import { getProductById } from './data/products.js';
import { addItem, formatMoney } from './cart.js';

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

function render() {
  const ids = readCompare();
  const products = ids.map((id) => getProductById(id)).filter(Boolean);

  const empty = document.querySelector('[data-compare-empty]');
  const tableWrap = document.querySelector('[data-compare-table-wrap]');

  if (products.length === 0) {
    if (empty) empty.hidden = false;
    if (tableWrap) tableWrap.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (tableWrap) tableWrap.hidden = false;

  const rowsHtml = (label, cellFn) => `
    <tr><th>${label}</th>${products.map(cellFn).join('')}</tr>`;

  const table = document.querySelector('[data-compare-table]');
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th></th>
      ${products.map((p) => `
        <td>
          <img class="compare-col-img" src="${p.img}" alt="${escapeHtml(p.title)}">
          <button type="button" class="compare-remove-btn" data-remove="${p.id}">
            <ion-icon name="trash-outline"></ion-icon> Remove
          </button>
        </td>`).join('')}
    </tr>
    ${rowsHtml('Product', (p) => `<td><a href="./product.html?id=${p.id}">${escapeHtml(p.title)}</a></td>`)}
    ${rowsHtml('Price', (p) => `<td>${formatMoney(p.price)}${p.oldPrice ? ` <del>${formatMoney(p.oldPrice)}</del>` : ''}</td>`)}
    ${rowsHtml('Rating', (p) => `<td><div class="showcase-rating">${starsHTML(p.rating)}</div></td>`)}
    ${rowsHtml('Description', (p) => `<td>${escapeHtml(p.description || '\u2014')}</td>`)}
    ${rowsHtml('', (p) => `<td><button type="button" class="btn-solid" style="width:auto; padding:10px 18px;" data-add-cart="${p.id}"><ion-icon name="bag-add-outline"></ion-icon> Add to cart</button></td>`)}
  `;

  table.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => { removeFromCompare(btn.dataset.remove); render(); });
  });
  table.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = getProductById(btn.dataset.addCart);
      if (p) addItem({ id: p.id, title: p.title, price: p.price, img: p.img }, 1);
    });
  });
}

document.addEventListener('DOMContentLoaded', render);
window.addEventListener('compare:change', render);
window.addEventListener('currency:change', render);
