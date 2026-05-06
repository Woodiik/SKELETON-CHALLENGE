import './styles/app.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import SiteHeader from './components/SiteHeader.vue';
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

const appEl = document.getElementById('app');
if (appEl) {
  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  app.mount(appEl);
}
