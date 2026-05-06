<script setup>
import { useToastsStore } from '@/stores/toasts';

const toasts = useToastsStore();
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
    <transition-group name="toast">
      <div
        v-for="toast in toasts.items"
        :key="toast.id"
        class="pointer-events-auto rounded-md border px-4 py-2 text-sm shadow-md transition"
        :class="{
          'border-emerald-200 bg-emerald-50 text-emerald-900': toast.type === 'success',
          'border-red-200 bg-red-50 text-red-900': toast.type === 'error',
          'border-slate-200 bg-white text-slate-800': toast.type === 'info'
        }"
        @click="toasts.dismiss(toast.id)"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
