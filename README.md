# Affinity — e-commerce storefront

A front-end e-commerce site built on top of the "Affinity" HTML/CSS
template. It started as a static landing page and has grown into a full
multi-page storefront: browsing, cart, checkout, accounts, an admin
dashboard, search, favourites, and more — all running **without a
backend**. Every bit of "server" data (accounts, cart, orders, saved
products) lives in the visitor's own browser via `localStorage`.

That's the single most important thing to understand about this project
before changing anything — see [How data is stored](#how-data-is-stored)
below.

## Getting started

```bash
npm install
npm run dev       # starts a local dev server (prints the URL to open)
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

No environment variables, API keys, or backend services are required to
run this locally — it's a static site.

**Demo admin login** (to see the admin dashboard): `admin@affinity.test`
/ `admin123`. This account is created automatically the first time the
site runs in a browser (see `ensureDemoAdmin()` in `assets/js/auth.js`).

## Project structure

```
index.html            Landing page (the original template page)
category.html          One template for every product category (?cat=slug)
product.html            One template for every product (?id=product-id)
cart.html / checkout.html
login.html / signup.html
account.html            Signed-in user's profile + order history
analytics.html          Signed-in user's personal shopping stats
ads.html                 Demo ad-campaign manager
admin.html               Admin dashboard (orders/products/customers)
favourites.html           Saved/"favourited" products
search.html                Search results (products + categories)
compare.html                 Side-by-side product comparison
404.html

assets/
  css/
    style.css           The original template's stylesheet — unchanged
    pages.css           Every style added for the pages/features above
  js/
    script.js           Original template JS (modal, toast, mobile menu, accordion)
    data/
      products.js       The product catalog — see below, this is the one
                         file almost everything else reads from
      translations.js   English/Spanish/French text for the i18n system
    cart.js, wishlist.js, compare.js, currency.js, auth.js, orders.js, i18n.js
                         Shared engines, loaded on every page (see each
                         file's own header comment for what it owns)
    category.js, product.js, cart-page.js, checkout.js, search.js,
    favourites.js, compare-page.js, login.js, signup.js, account.js,
    analytics.js, ads.js, admin.js
                         One script per page, rendering that page's
                         content from the shared engines above
    carousel.js, header-search.js, newsletter.js, quickview.js
                         Smaller sitewide features (see below)
  images/                Original template's stock photography
vite.config.js           Lists every .html file above as a build entry —
                          without this, `npm run build` would only output
                          index.html (Vite's default for multi-page sites)
```

Every new page follows the same pattern: the original template's
`<header>`/`<footer>` markup, copied byte-for-byte onto every page, so
navigation and styling stay consistent; a `<main>` specific to that page;
and one JS file that fills it in from the shared data engines.

## Features

- **Categories** — `category.html?cat=<slug>` is one template for all 10
  categories (the original 8, plus Footwear and Jewelry — see the
  comment at the top of `data/products.js` for why those two were
  added). Sort and filter (price range, minimum rating) included. Every
  category link — the header dropdown, the homepage category strip, and
  the sidebar filter list — routes here.
- **Products** — every product across the whole site (including the
  original template's hardcoded homepage demo products, which were
  extracted into the catalog so they'd have somewhere to link to) opens
  a real product page: gallery, price, full description, quantity,
  Add to Cart, and a favourite toggle.
- **Cart & checkout** — `cart.js` is the one source of truth for the
  cart, written to by every "add to cart" button sitewide via a single
  delegated click handler (so new product cards don't need to be wired
  up individually). Checkout creates a demo order — **no real payment is
  processed**, the card fields are validated and then discarded.
- **Accounts** — `auth.js` implements a mock login/signup system:
  passwords are hashed (SHA-256 via `SubtleCrypto`, with a non-crypto
  fallback if that API isn't available) before being stored, but there
  is no real server-side verification, session security, or protection
  against someone reading `localStorage` directly. **Do not reuse this
  for a site with real user accounts without replacing this layer.**
- **Header profile icon** — signed out, it goes straight to
  `login.html`. Signed in, it opens a dropdown (Profile / Analytics /
  Ads / Logout) instead of navigating away.
- **Admin dashboard** — overview stats, all orders (with an editable
  status dropdown), a read-only product list, and a customer list.
  Requires the demo admin account above.
- **Favourites** — the heart icon on any product card saves it to
  `favourites.html`, and visually reflects saved/unsaved state
  everywhere that product's card appears.
- **Compare** — the repeat icon adds a product (up to 4) to
  `compare.html`'s side-by-side table; a floating bar appears once
  you've added something.
- **Quick View** — the eye icon opens a modal with the essentials
  (image, price, description, qty, add to cart) without leaving the
  page you're on.
- **Search** — the header search box matches both product
  names/descriptions and category names.
- **Carousels** — every horizontally-scrolling section (hero banner,
  category strip, product rows, blog strip) got working left/right
  buttons; there were none in the original template.
- **Currency** — the header's USD/EUR selector actually converts and
  redisplays prices everywhere, using a fixed conversion rate (not a
  live feed — see `currency.js`).
- **Language** — the header's English/Spanish/French selector was
  already in the original markup but did nothing; it now translates the
  site chrome and every new page. It does **not** translate the
  original template's homepage marketing copy (individual product blurbs,
  testimonials, blog teasers) — see the comment at the top of
  `data/translations.js` for the reasoning.
- **Newsletter popup** — closing it (X, clicking outside, or
  subscribing) is now remembered in `localStorage`, so it doesn't pop
  back up on every page load like the original template did.

## How data is stored

Everything is `localStorage`, namespaced by key (see each file's header
comment for its own key name — `affinity_cart`, `affinity_wishlist`,
`affinity_users`, `affinity_orders`, and so on). Practically, that means:

- Data is **per-browser, per-device**. Nothing syncs across devices or
  browsers, because there's no server to sync through.
- Clearing browser storage/site data wipes everything — accounts,
  orders, cart, favourites.
- Anyone with the browser's dev tools can read or edit any of it.

This is fine for a prototype/demo and for continuing front-end work, but
none of it should be treated as secure or durable. Turning this into a
real store means adding a real backend behind these same function names
(`login()`, `addItem()`, `createOrder()`, etc.) — the front-end call
sites wouldn't need to change much, only what's behind them.

## Known gaps

Deliberately not built, because each needs either a real backend/service
or is a meaningfully separate chunk of work:

- Real payment processing, real email delivery (newsletter, password
  reset), real inventory sync
- Admin add/edit/delete for products (currently read-only)
- Blog post detail pages (the homepage's blog teasers don't link anywhere)

## Credit

Original template ("Affinity") structure, styling, and stock imagery are
unmodified except where noted above. `assets/js/script.js` and
`assets/css/style.css` are the template's own files; everything else in
`assets/js/` and `assets/css/pages.css` was added on top of it.
