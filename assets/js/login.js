/**
 * login.js
 * -----------------------------------------------------------------------
 * Powers login.html's form. Calls login() from auth.js (which hashes the
 * password and checks it against the stored account) and, on success,
 * sends the visitor wherever they were trying to go before they got
 * bounced here — see getPostLoginRedirect() / the ?next= param that
 * requireAuth()/requireAdmin() and the header profile icon attach.
 */

import { login, getCurrentUser, getPostLoginRedirect } from './auth.js';

function showError(message) {
  const el = document.querySelector('[data-auth-error]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
}

function clearError() {
  const el = document.querySelector('[data-auth-error]');
  if (!el) return;
  el.textContent = '';
  el.classList.remove('is-visible');
}

async function handleSubmit(e) {
  e.preventDefault();
  clearError();

  const form = e.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  const data = new FormData(form);
  const result = await login({ email: data.get('email'), password: data.get('password') });

  if (!result.ok) {
    showError(result.error);
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  window.location.href = getPostLoginRedirect();
}

document.addEventListener('DOMContentLoaded', () => {
  // Already signed in? Skip straight past the login form.
  if (getCurrentUser()) {
    window.location.href = getPostLoginRedirect();
    return;
  }
  const form = document.querySelector('[data-login-form]');
  if (form) form.addEventListener('submit', handleSubmit);
});
