<script setup>
import { ref, computed } from 'vue';
import api from '@/api/client';
import PostCard from './PostCard.vue';

const props = defineProps({
  startPage: { type: Number, default: 2 },
  pageSize: { type: Number, default: 10 }
});

const posts = ref([]);
const nextPage = ref(props.startPage);
const totalPages = ref(null);
const loading = ref(false);
const error = ref('');

const hasMore = computed(() => totalPages.value === null || nextPage.value <= totalPages.value);

async function loadNext() {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.get('/posts', {
      params: { page: nextPage.value, perPage: props.pageSize }
    });
    posts.value.push(...data.items);
    totalPages.value = data.totalPages;
    nextPage.value += 1;
  } catch (_err) {
    error.value = 'Could not load more posts.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="posts.length > 0" class="space-y-6">
      <PostCard v-for="p in posts" :key="p.id" :post="p" />
    </div>
    <p v-if="error" class="form-error mt-4">{{ error }}</p>
    <button
      v-if="hasMore"
      type="button"
      class="btn-primary mt-6 w-full"
      :disabled="loading"
      @click="loadNext"
    >
      {{ loading ? 'Loading…' : 'Load more posts' }}
    </button>
  </div>
</template>
