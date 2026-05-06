<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/client';

const route = useRoute();

const editing = computed(() => !!route.params.id);
const title = ref('');
const body = ref('');
const error = ref('');
const loading = ref(false);
const fetching = ref(false);

async function loadExisting() {
  if (!editing.value) return;
  fetching.value = true;
  try {
    const { data } = await api.get(`/posts/${route.params.id}`);
    title.value = data.title;
    body.value = data.body;
  } catch (_err) {
    error.value = 'Could not load the post.';
  } finally {
    fetching.value = false;
  }
}

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    if (editing.value) {
      await api.patch(`/posts/${route.params.id}`, { title: title.value, body: body.value });
      window.location.href = `/posts/${route.params.id}`;
    } else {
      const { data } = await api.post('/posts', { title: title.value, body: body.value });
      window.location.href = `/posts/${data.id}`;
    }
  } catch (err) {
    if (err.response?.status === 403) {
      error.value = 'You can only edit posts you wrote.';
    } else if (err.response?.status === 401) {
      error.value = 'Sign in to publish a post.';
    } else {
      error.value = 'Could not save the post.';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadExisting);
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="text-2xl font-semibold">{{ editing ? 'Edit post' : 'New post' }}</h1>
    <p v-if="fetching" class="mt-2 text-sm text-slate-500">Loading current content…</p>
    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="form-label" for="title">Title</label>
        <input id="title" v-model="title" type="text" required maxlength="200" class="form-input" />
      </div>
      <div>
        <label class="form-label" for="body">Body</label>
        <textarea id="body" v-model="body" rows="10" required class="form-input"></textarea>
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Saving…' : editing ? 'Save changes' : 'Publish' }}
        </button>
        <a href="/" class="btn-ghost">Cancel</a>
      </div>
    </form>
  </div>
</template>
