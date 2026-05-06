<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const fullName = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.signup({
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value
    });
    window.location.href = '/';
  } catch (err) {
    if (err.response?.status === 409) {
      error.value = 'A user with this email already exists.';
    } else {
      error.value = err.response?.data?.error || 'Signup failed. Check the fields and try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-semibold">Create an account</h1>
    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="form-label" for="fullName">Full name</label>
        <input id="fullName" v-model="fullName" type="text" required class="form-input" />
      </div>
      <div>
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="email" class="form-input" />
      </div>
      <div>
        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" type="password" required minlength="8" autocomplete="new-password" class="form-input" />
        <p class="mt-1 text-xs text-slate-500">At least 8 characters.</p>
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Creating…' : 'Sign up' }}
      </button>
    </form>
    <p class="mt-4 text-sm text-slate-600">
      Already have one?
      <RouterLink to="/login" class="text-slate-900 underline">Sign in</RouterLink>
    </p>
  </div>
</template>
