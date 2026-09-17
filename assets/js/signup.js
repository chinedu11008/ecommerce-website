/**
 * signup.js
 * -----------------------------------------------------------------------
 * Powers signup.html's form. Calls signup() from auth.js to create a new
 * local account (name/email/hashed password) and sign the visitor in
 * immediately, then redirects the same way login.js does.
 */

import { signup, getCurrentUser, getPostLoginRedirect } from './auth.js';

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
  const result = await signup({
    name: data.get('fullName'),
    email: data.get('email'),
    password: data.get('password'),
  });

  if (!result.ok) {
    showError(result.error);
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  window.location.href = getPostLoginRedirect();
}

document.addEventListener('DOMContentLoaded', () => {
  if (getCurrentUser()) {
    window.location.href = getPostLoginRedirect();
    return;
  }
  const form = document.querySelector('[data-signup-form]');
  if (form) form.addEventListener('submit', handleSubmit);
});
