/**
 * carousel.js
 * -----------------------------------------------------------------------
 * None of the horizontally-scrolling sections (hero banner, category
 * strip, product showcases, blog strip) had prev/next buttons — only
 * native touch/trackpad scroll. This finds each one and injects a
 * functional pair of buttons without changing the existing markup or
 * CSS of the scrolling content itself.
 */

const SELECTORS = ['.slider-container', '.category-item-container', '.showcase-wrapper', '.blog-container'];

function enhance(container) {
  if (container.dataset.carouselReady) return;
  container.dataset.carouselReady = 'true';

  const parent = container.parentElement;
  if (!parent) return;
  parent.classList.add('carousel-wrapper');

  const isFullSlide = container.classList.contains('slider-container');

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'carousel-btn carousel-prev';
  prevBtn.setAttribute('aria-label', 'Scroll left');
  prevBtn.innerHTML = '<ion-icon name="chevron-back-outline"></ion-icon>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel-btn carousel-next';
  nextBtn.setAttribute('aria-label', 'Scroll right');
  nextBtn.innerHTML = '<ion-icon name="chevron-forward-outline"></ion-icon>';

  parent.appendChild(prevBtn);
  parent.appendChild(nextBtn);

  const scrollAmount = () => (isFullSlide ? container.clientWidth : container.clientWidth * 0.85);

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  function updateState() {
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 4) {
      prevBtn.classList.add('is-hidden');
      nextBtn.classList.add('is-hidden');
      return;
    }
    prevBtn.classList.remove('is-hidden');
    nextBtn.classList.remove('is-hidden');
    prevBtn.disabled = container.scrollLeft <= 4;
    nextBtn.disabled = container.scrollLeft >= maxScroll - 4;
  }

  container.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState);
  updateState();
}

function init() {
  document.querySelectorAll(SELECTORS.join(',')).forEach(enhance);
}

document.addEventListener('DOMContentLoaded', init);
// Re-check after language changes / dynamic content swaps, in case a
// previously single-slide-worth of content becomes scrollable (or not).
window.addEventListener('lang:change', init);
