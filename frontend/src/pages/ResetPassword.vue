<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const token = computed(() => String(route.query.token || ''));
const password = ref('');
const confirm = ref('');
const error = ref('');
const loading = ref(false);
const done = ref(false);

async function submit() {
  error.value = '';
  if (!token.value) {
    error.value = 'Reset token is missing from the URL.';
    return;
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.';
    return;
  }
  loading.value = true;
  try {
    await auth.resetPassword({ token: token.value, password: password.value });
    done.value = true;
    setTimeout(() => router.push('/login'), 1500);
  } catch (err) {
    error.value = err.response?.data?.error || 'Token is invalid, expired, or already used.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-semibold">Set a new password</h1>
    <form v-if="!done" class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="form-label" for="password">New password</label>
        <input id="password" v-model="password" type="password" required minlength="8" autocomplete="new-password" class="form-input" />
      </div>
      <div>
        <label class="form-label" for="confirm">Confirm password</label>
        <input id="confirm" v-model="confirm" type="password" required minlength="8" autocomplete="new-password" class="form-input" />
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Saving…' : 'Save password' }}
      </button>
    </form>
    <div v-else class="mt-6 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
      Password updated. Redirecting to sign in&hellip;
    </div>
    <p class="mt-4 text-sm text-slate-600">
      <RouterLink to="/login" class="text-slate-900 underline">Back to sign in</RouterLink>
    </p>
  </div>
</template>
