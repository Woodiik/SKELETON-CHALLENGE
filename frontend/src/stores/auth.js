import { defineStore } from 'pinia';
import api, { setToken, getToken } from '@/api/client';

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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readUser(),
    token: getToken()
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },

  actions: {
    async signup(payload) {
      const { data } = await api.post('/auth/signup', payload);
      this._setSession(data);
      return data;
    },

    async login(payload) {
      const { data } = await api.post('/auth/login', payload);
      this._setSession(data);
      return data;
    },

    async forgotPassword(email) {
      await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(payload) {
      await api.post('/auth/reset-password', payload);
    },

    logout() {
      this._setSession({ token: null, user: null });
    },

    _setSession({ token, user }) {
      this.token = token || null;
      this.user = user || null;
      setToken(this.token);
      writeUser(this.user);
    }
  }
});
