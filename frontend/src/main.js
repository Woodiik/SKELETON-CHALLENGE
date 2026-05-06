import './styles/app.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import SiteHeader from './components/SiteHeader.vue';
import VerifyBanner from './components/VerifyBanner.vue';
import LoadMorePosts from './components/LoadMorePosts.vue';
import router from './router';

// Single Pinia instance shared across the multiple Vue roots on a page so
// auth state stays consistent between the header and the SPA / load-more apps.
const pinia = createPinia();

const headerEl = document.getElementById('site-header');
if (headerEl) {
  const headerApp = createApp(SiteHeader);
  headerApp.use(pinia);
  headerApp.mount(headerEl);
}

const bannerEl = document.getElementById('verify-banner');
if (bannerEl) {
  const bannerApp = createApp(VerifyBanner);
  bannerApp.use(pinia);
  bannerApp.mount(bannerEl);
}

const appEl = document.getElementById('app');
if (appEl) {
  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  app.mount(appEl);
}

// Home page only — present when the SSR'd first 10 posts don't cover everything.
const moreEl = document.getElementById('more-posts');
if (moreEl) {
  const startPage = parseInt(moreEl.dataset.startPage || '2', 10);
  const pageSize = parseInt(moreEl.dataset.pageSize || '10', 10);
  const app = createApp(LoadMorePosts, { startPage, pageSize });
  app.use(pinia);
  app.mount(moreEl);
}
