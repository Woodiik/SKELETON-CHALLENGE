<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const token = computed(() => String(route.query.token || ''));

const checking = ref(true);
const tokenValid = ref(false);

const password = ref('');
const confirm = ref('');
const error = ref('');
const loading = ref(false);
const done = ref(false);

onMounted(async () => {
  if (!token.value) {
    checking.value = false;
    return;
  }
  try {
    await auth.checkResetToken(token.value);
    tokenValid.value = true;
  } catch (_err) {
    tokenValid.value = false;
  } finally {
    checking.value = false;
  }
});

async function submit() {
  error.value = '';
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
    // The token was valid on mount but isn't anymore (race or server-side change)
    // — flip back to the invalid-token view so the user gets a clear path forward.
    tokenValid.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-semibold">Set a new password</h1>

    <p v-if="checking" class="mt-4 text-sm text-slate-500">Checking the link…</p>

    <div
      v-else-if="!tokenValid"
      class="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
    >
      This reset link is no longer valid — it may have been used already, or it has expired.
      <RouterLink to="/forgot-password" class="text-slate-900 underline">Request a new one</RouterLink>.
    </div>

    <form v-else-if="!done" class="mt-6 space-y-4" @submit.prevent="submit">
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
