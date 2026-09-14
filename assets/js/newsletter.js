/**
 * newsletter.js
 * -----------------------------------------------------------------------
 * No email service is connected, so "subscribing" just saves the address
 * locally and swaps the form for a thank-you message. Good enough to
 * demo the flow; wire it to a real provider (Mailchimp, etc.) later.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-newsletter-form]');
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

    const desc = form.querySelector('[data-newsletter-desc]');
    const submitBtn = form.querySelector('[data-newsletter-submit]');
    const input = form.querySelector('.email-field');
    if (desc) desc.innerHTML = `Thanks \u2014 <b>${email}</b> is on the list.`;
    if (input) input.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
  });
});
