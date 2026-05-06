import { defineStore } from 'pinia';
import api, { onUnauthorized } from '@/api/client';

const USER_KEY = 'sc.user';

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

function writeUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// Wire a single global 401 listener so any pinia consumer's session goes
// away the moment the server says the cookie is no longer valid.
let unauthorizedHookInstalled = false;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readUser()
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    install() {
      if (unauthorizedHookInstalled) return;
      unauthorizedHookInstalled = true;
      onUnauthorized(() => {
        if (this.user) {
          this.user = null;
          writeUser(null);
        }
      });
    },

    async signup(payload) {
      const { data } = await api.post('/auth/signup', payload);
      this._setUser(data.user);
      return data;
    },

    async login(payload) {
      const { data } = await api.post('/auth/login', payload);
      this._setUser(data.user);
      return data;
    },

    async forgotPassword(email) {
      await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(payload) {
      await api.post('/auth/reset-password', payload);
    },

    async checkResetToken(token) {
      await api.get('/auth/check-reset-token', { params: { token } });
    },

    async checkVerificationToken(token) {
      await api.get('/auth/check-verification-token', { params: { token } });
    },

    async verifyEmail(token) {
      await api.post('/auth/verify-email', { token });
    },

    async resendVerification() {
      await api.post('/auth/resend-verification');
    },

    async refreshMe() {
      const { data } = await api.get('/auth/me');
      this._setUser(data);
      return data;
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (_err) { /* clearing the cookie is best-effort */ }
      this._setUser(null);
    },

    _setUser(user) {
      this.user = user || null;
      writeUser(this.user);
    }
  }
});
