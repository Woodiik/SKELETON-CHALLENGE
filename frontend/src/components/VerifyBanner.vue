<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const sending = ref(false);
const sent = ref(false);
const error = ref('');

async function resend() {
  sending.value = true;
  error.value = '';
  sent.value = false;
  try {
    await auth.resendVerification();
    sent.value = true;
  } catch (_err) {
    error.value = 'Could not send right now. Try again in a minute.';
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div
    v-if="auth.isAuthenticated && auth.user && !auth.user.verifiedAt"
    class="border-b border-amber-200 bg-amber-50 text-sm text-amber-900"
  >
    <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-2">
      <span>
        Please verify your email — we sent a link to <strong>{{ auth.user.email }}</strong>.
      </span>
      <span v-if="sent" class="text-emerald-700">Sent. Check your inbox.</span>
      <span v-else-if="error" class="text-red-700">{{ error }}</span>
      <button
        v-else
        type="button"
        class="underline disabled:opacity-50"
        :disabled="sending"
        @click="resend"
      >
        {{ sending ? 'Sending…' : 'Resend' }}
      </button>
    </div>
  </div>
</template>
