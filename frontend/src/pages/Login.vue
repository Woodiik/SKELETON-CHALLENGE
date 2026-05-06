<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login({ email: email.value.trim(), password: password.value });
    window.location.href = '/';
  } catch (err) {
    error.value = err.response?.data?.error || 'Wrong email or password.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-semibold">Sign in</h1>
    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="email" class="form-input" />
      </div>
      <div>
        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" class="form-input" />
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
    <p class="mt-4 text-sm text-slate-600">
      No account?
      <RouterLink to="/signup" class="text-slate-900 underline">Sign up</RouterLink>
    </p>
    <p class="mt-1 text-sm text-slate-600">
      <RouterLink to="/forgot-password" class="text-slate-900 underline">Forgot password?</RouterLink>
    </p>
  </div>
</template>
