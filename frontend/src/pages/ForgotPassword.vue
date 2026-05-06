<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const email = ref('');
const sent = ref(false);
const loading = ref(false);

async function submit() {
  loading.value = true;
  try {
    await auth.forgotPassword(email.value.trim());
    sent.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-semibold">Forgot password</h1>
    <p class="mt-2 text-sm text-slate-600">
      Enter your email and we&rsquo;ll send a reset link if the account exists.
    </p>
    <form v-if="!sent" class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model="email" type="email" required class="form-input" />
      </div>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Sending…' : 'Send reset link' }}
      </button>
    </form>
    <div v-else class="mt-6 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
      If <strong>{{ email }}</strong> is registered, a reset link is on its way.
      In dev the link is also printed in the server console.
    </div>
    <p class="mt-4 text-sm text-slate-600">
      <RouterLink to="/login" class="text-slate-900 underline">Back to sign in</RouterLink>
    </p>
  </div>
</template>
