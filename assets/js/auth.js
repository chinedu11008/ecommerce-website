/**
 * auth.js
 * -----------------------------------------------------------------------
 * ⚠️ PROTOTYPE-ONLY AUTH — there is no backend. "Accounts" are a list in
 * localStorage on the visitor's own browser, and "login" just checks a
 * hashed password against that list client-side. Anyone with dev tools
 * can read the user list or fake a session; passwords never leave the
 * browser but are also never verified by anything the visitor doesn't
 * control. This is enough to demo login/signup/user-dashboard/admin-
 * dashboard flows, but it is NOT real authentication — before this site
 * handles real customers, swap this file for real server-side auth
 * (e.g. an auth provider, or your own backend that verifies credentials
 * and issues session tokens).
 */

const USERS_KEY = 'affinity_users';
const SESSION_KEY = 'affinity_session';
const DEMO_ADMIN = { name: 'Store Admin', email: 'admin@affinity.test', password: 'admin123' };

async function hashPassword(password) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const bytes = new TextEncoder().encode(password);
      const digest = await window.crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fall through to the non-crypto fallback below
  }
  // Fallback for non-secure contexts (e.g. opening the file directly)
  // where SubtleCrypto isn't available. Still avoids plain-text storage,
  // though it is not cryptographically secure either.
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  }
  return `fallback-${h}`;
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function ensureDemoAdmin() {
  const users = readUsers();
  if (users.some((u) => u.email === DEMO_ADMIN.email)) return;
  users.push({
    id: 'admin-1',
    name: DEMO_ADMIN.name,
    email: DEMO_ADMIN.email,
    passwordHash: await hashPassword(DEMO_ADMIN.password),
    role: 'admin',
  });
  writeUsers(users);
}

function setSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function stripPassword(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

/** For the admin dashboard's customer list — never includes passwordHash. */
export function getAllUsers() {
  return readUsers().map(stripPassword);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    const user = readUsers().find((u) => u.id === userId);
    return stripPassword(user);
  } catch {
    return null;
  }
}

export async function signup({ name, email, password }) {
  await ensureDemoAdmin();
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    return { ok: false, error: 'Fill in your name, email, and password.' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' };
  }
  if (users.some((u) => u.email === normalizedEmail)) {
    return { ok: false, error: 'An account with that email already exists.' };
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: 'customer',
  };
  users.push(user);
  writeUsers(users);
  setSession(user.id);
  return { ok: true, user: stripPassword(user) };
}

export async function login({ email, password }) {
  await ensureDemoAdmin();
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) return { ok: false, error: 'No account found with that email.' };

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { ok: false, error: 'Incorrect password.' };
  }

  setSession(user.id);
  return { ok: true, user: stripPassword(user) };
}

/** Call at the top of a page that requires a signed-in visitor. */
export function requireAuth(redirectTo = './login.html') {
  const user = getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `${redirectTo}?next=${next}`;
    return null;
  }
  return user;
}

/** Call at the top of a page that requires the signed-in visitor to be an admin. */
export function requireAdmin(redirectTo = './index.html') {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

/** Where login/signup should send the visitor after success — the page
 *  that bounced them here (?next=...) if there was one, else the account page. */
export function getPostLoginRedirect() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  return next ? decodeURIComponent(next) : './account.html';
}

function wireAccountIcon() {
  const wrapper = document.querySelector('[data-account-menu-wrapper]');
  const trigger = document.querySelector('[data-account-trigger]');
  const dropdown = document.querySelector('[data-account-dropdown]');
  if (!wrapper || !trigger || !dropdown) return;

  function closeDropdown() { dropdown.hidden = true; }
  function openDropdown() { dropdown.hidden = false; }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const user = getCurrentUser();
    if (!user) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `./login.html?next=${next}`;
      return;
    }
    if (dropdown.hidden) openDropdown();
    else closeDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeDropdown();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  const logoutBtn = dropdown.querySelector('[data-account-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = './index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', wireAccountIcon);

// Make sure the demo admin account exists as soon as this module loads.
ensureDemoAdmin();
