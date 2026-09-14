/**
 * i18n.js
 * -----------------------------------------------------------------------
 * Wires up the language <select> that already existed in the header
 * (English / Espa\u00f1ol / Fran\u00e7ais) so picking a language actually
 * re-labels the site instead of just sitting there. Coverage is the site
 * chrome + all new pages — see the comment at the top of
 * assets/js/data/translations.js for what's out of scope for now.
 *
 * Usage on a page: elements to translate get a data-i18n="key" attribute
 * (translates textContent) or data-i18n-placeholder="key" (translates an
 * input's placeholder). This file finds every one of those on load and
 * whenever the language changes.
 */

import { TRANSLATIONS, LANGUAGES, DEFAULT_LANG } from './data/translations.js';

const LANG_KEY = 'affinity_lang';

export function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
}

export function t(key) {
  const lang = getCurrentLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS[DEFAULT_LANG][key] || key;
}

export function applyLanguage(short) {
  const lang = TRANSLATIONS[short] ? short : DEFAULT_LANG;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  // Keep every language <select> on the page (desktop + mobile headers, if
  // more than one is ever present) in sync with the active language.
  document.querySelectorAll('select[name="language"]').forEach((select) => {
    const match = LANGUAGES.find((l) => l.short === lang);
    if (match) select.value = match.code;
  });

  window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang } }));
}

function wireLanguageSelect() {
  document.querySelectorAll('select[name="language"]').forEach((select) => {
    select.addEventListener('change', () => {
      const chosen = LANGUAGES.find((l) => l.code === select.value);
      applyLanguage(chosen ? chosen.short : DEFAULT_LANG);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(getCurrentLang());
  wireLanguageSelect();
});
