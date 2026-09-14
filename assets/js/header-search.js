/**
 * header-search.js
 * -----------------------------------------------------------------------
 * The header search box (".header-search-container") isn't inside a
 * <form> in the original markup, so this wires the search button click
 * and Enter key directly, on every page, to navigate to search.html.
 */

function goToSearch(container) {
  const input = container.querySelector('.search-field');
  const value = input ? input.value.trim() : '';
  window.location.href = `./search.html?q=${encodeURIComponent(value)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.header-search-container').forEach((container) => {
    const input = container.querySelector('.search-field');
    const btn = container.querySelector('.search-btn');

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSearch(container);
      });
    }
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          goToSearch(container);
        }
      });
      // If we're already on the results page, keep the box showing the
      // current query rather than resetting to empty.
      const params = new URLSearchParams(window.location.search);
      if (window.location.pathname.endsWith('search.html') && params.get('q')) {
        input.value = params.get('q');
      }
    }
  });
});
