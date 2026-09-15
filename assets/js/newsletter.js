/**
 * newsletter.js
 * -----------------------------------------------------------------------
 * No email service is connected, so "subscribing" just saves the address
 * locally and swaps the form for a thank-you message. Good enough to
 * demo the flow; wire it to a real provider (Mailchimp, etc.) later.
 *
 * The popup itself (open animation, X button, click-outside-to-close) is
 * handled by the original script.js — that part works fine. What it never
 * did is remember that you closed it, so it just pops back up 5 seconds
 * after every page load. This adds that persistence on top, without
 * touching script.js's own open/close logic.
 */

const DISMISS_KEY = 'affinity_newsletter_dismissed';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('[data-modal]');
  const closeBtn = document.querySelector('[data-modal-close]');
  const closeOverlay = document.querySelector('[data-modal-overlay]');
  const form = document.querySelector('[data-newsletter-form]');

  if (modal && localStorage.getItem(DISMISS_KEY) === 'true') {
    modal.classList.add('closed');
  }

  function remember() {
    localStorage.setItem(DISMISS_KEY, 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', remember);
  if (closeOverlay) closeOverlay.addEventListener('click', remember);

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = new FormData(form).get('email');
    if (!email) return;

    try {
      const list = JSON.parse(localStorage.getItem('affinity_newsletter') || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem('affinity_newsletter', JSON.stringify(list));
    } catch {
      // non-critical; ignore storage errors
    }
    remember();

    const desc = form.querySelector('[data-newsletter-desc]');
    const submitBtn = form.querySelector('[data-newsletter-submit]');
    const input = form.querySelector('.email-field');
    if (desc) desc.innerHTML = `Thanks \u2014 <b>${email}</b> is on the list.`;
    if (input) input.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
  });
});
