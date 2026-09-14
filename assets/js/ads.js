import { requireAuth, logout } from './auth.js';

const ADS_KEY = 'affinity_ad_campaigns';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function readCampaigns(userId) {
  try {
    const raw = localStorage.getItem(ADS_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return Array.isArray(all) ? all.filter((c) => c.userId === userId) : [];
  } catch {
    return [];
  }
}

function saveCampaign(userId, name, budget) {
  const raw = localStorage.getItem(ADS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  // Deterministic "demo" stats derived from the budget so numbers feel
  // plausible without pretending to be a live ad platform.
  const impressions = Math.round(budget * 42);
  const clicks = Math.round(impressions * 0.021);
  all.push({
    id: `ad-${Date.now()}`, userId, name, budget,
    status: 'active', impressions, clicks,
  });
  localStorage.setItem(ADS_KEY, JSON.stringify(all));
}

function removeCampaign(id) {
  const raw = localStorage.getItem(ADS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  localStorage.setItem(ADS_KEY, JSON.stringify(all.filter((c) => c.id !== id)));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render(user) {
  const campaigns = readCampaigns(user.id);
  const empty = document.querySelector('[data-ads-empty]');
  const tableWrap = document.querySelector('[data-ads-table-wrap]');
  const tbody = document.querySelector('[data-ads-body]');

  if (campaigns.length === 0) {
    if (empty) empty.hidden = false;
    if (tableWrap) tableWrap.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (tableWrap) tableWrap.hidden = false;
  if (tbody) {
    tbody.innerHTML = campaigns.map((c) => `
      <tr>
        <td>${escapeHtml(c.name)}</td>
        <td>$${Number(c.budget).toFixed(2)}</td>
        <td><span class="status-pill active">${c.status}</span></td>
        <td>${c.impressions.toLocaleString()}</td>
        <td>${c.clicks.toLocaleString()}</td>
        <td><button type="button" class="cart-line-remove" data-remove-ad="${c.id}"><ion-icon name="trash-outline"></ion-icon></button></td>
      </tr>`).join('');
    tbody.querySelectorAll('[data-remove-ad]').forEach((btn) => {
      btn.addEventListener('click', () => { removeCampaign(btn.dataset.removeAd); render(user); });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = user.name; });
  document.querySelectorAll('[data-user-email]').forEach((el) => { el.textContent = user.email; });
  document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = initials(user.name); });
  const adminLink = document.querySelector('[data-admin-link]');
  if (adminLink) adminLink.hidden = user.role !== 'admin';

  render(user);

  const form = document.querySelector('[data-ads-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name');
      const budget = parseFloat(data.get('budget'));
      if (!name || !budget || budget <= 0) return;
      saveCampaign(user.id, name, budget);
      form.reset();
      render(user);
    });
  }

  const logoutBtn = document.querySelector('[data-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = './index.html';
    });
  }
});
