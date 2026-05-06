import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/login',           name: 'login',           component: () => import('@/pages/Login.vue') },
  { path: '/signup',          name: 'signup',          component: () => import('@/pages/Signup.vue') },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('@/pages/ForgotPassword.vue') },
  { path: '/reset-password',  name: 'reset-password',  component: () => import('@/pages/ResetPassword.vue') },
  { path: '/verify-email',    name: 'verify-email',    component: () => import('@/pages/VerifyEmail.vue') },

  { path: '/posts/new',       name: 'post-new',  component: () => import('@/pages/PostEditor.vue'), meta: { requiresAuth: true } },
  { path: '/posts/:id/edit',  name: 'post-edit', component: () => import('@/pages/PostEditor.vue'), meta: { requiresAuth: true } },
  { path: '/posts/:id',       name: 'post',      component: () => import('@/pages/Post.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (!to.meta || !to.meta.requiresAuth) return true;
  const auth = useAuthStore();
  return auth.isAuthenticated ? true : { name: 'login' };
});

export default router;
