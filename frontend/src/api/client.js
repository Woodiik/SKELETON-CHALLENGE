import axios from 'axios';

// `withCredentials` makes the browser ship cookies with same-origin requests.
// The auth flow lives on an httpOnly cookie that JS can't read — axios doesn't
// have to know the token at all, the browser handles it.
const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// On 401 the cookie is missing or stale. Notify whoever is interested
// (currently the auth store) so the UI can drop the cached user object.
const listeners = new Set();

export function onUnauthorized(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      for (const handler of listeners) {
        try { handler(); } catch (_) { /* swallow */ }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
