<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const auth = useAuthStore();

const token = computed(() => String(route.query.token || ''));

const checking = ref(true);
const tokenValid = ref(false);
const verifying = ref(false);
const verified = ref(false);
const error = ref('');

onMounted(async () => {
  if (!token.value) {
    checking.value = false;
    return;
  }
  try {
    await auth.checkVerificationToken(token.value);
    tokenValid.value = true;
  } catch (_err) {
    tokenValid.value = false;
  } finally {
    checking.value = false;
  }
});

async function confirmEmail() {
  verifying.value = true;
  error.value = '';
  try {
    await auth.verifyEmail(token.value);
    verified.value = true;
    // If the user is signed in on this device, refresh the cached profile so
    // the verification banner disappears without requiring a re-login.
    if (auth.isAuthenticated) {
      try {
        await auth.refreshMe();
      } catch (_err) { /* non-fatal */ }
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Token is invalid, expired, or already used.';
    tokenValid.value = false;
  } finally {
    verifying.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-semibold">Verify your email</h1>

    <p v-if="checking" class="mt-4 text-sm text-slate-500">Checking the link…</p>

    <div
      v-else-if="!tokenValid"
      class="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
    >
      This verification link is no longer valid — it may have been used already, or it has expired.
      <span v-if="auth.isAuthenticated">
        You can request a fresh one from the banner at the top of the page.
      </span>
      <span v-else>
        Sign in and ask for a new one from the banner at the top of the page.
      </span>
    </div>

    <div
      v-else-if="verified"
      class="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
    >
      Your email is verified. Thanks!
    </div>

    <div v-else class="mt-6 space-y-4">
      <p class="text-sm text-slate-700">Click the button below to confirm your email address.</p>
      <button class="btn-primary w-full" :disabled="verifying" @click="confirmEmail">
        {{ verifying ? 'Confirming…' : 'Confirm email' }}
      </button>
      <p v-if="error" class="form-error">{{ error }}</p>
    </div>

    <p class="mt-4 text-sm text-slate-600">
      <RouterLink to="/" class="text-slate-900 underline">Back to the blog</RouterLink>
    </p>
  </div>
</template>
