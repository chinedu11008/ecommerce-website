import { defineConfig } from 'vite';
import { resolve } from 'path';

// Plain multi-page setup: every top-level .html file becomes its own
// build entry so `npm run build` outputs all of them (by default Vite's
// production build only bundles index.html unless told otherwise).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        category: resolve(__dirname, 'category.html'),
        product: resolve(__dirname, 'product.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        favourites: resolve(__dirname, 'favourites.html'),
        search: resolve(__dirname, 'search.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        account: resolve(__dirname, 'account.html'),
        admin: resolve(__dirname, 'admin.html'),
        compare: resolve(__dirname, 'compare.html'),
        analytics: resolve(__dirname, 'analytics.html'),
        ads: resolve(__dirname, 'ads.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
});
