<script setup>
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

function logout() {
  auth.logout();
  window.location.href = '/';
}
</script>

<template>
  <nav class="flex items-center gap-4 text-sm text-slate-700">
    <template v-if="auth.isAuthenticated">
      <a href="/posts/new" class="hover:underline">New post</a>
      <span class="text-slate-500">{{ auth.user?.fullName }}</span>
      <button type="button" class="hover:underline" @click="logout">Logout</button>
    </template>
    <template v-else>
      <a href="/login" class="hover:underline">Login</a>
      <a href="/signup" class="hover:underline">Sign up</a>
    </template>
  </nav>
</template>
