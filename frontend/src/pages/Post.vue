<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const post = ref(null);
const error = ref('');
const loading = ref(true);
const commentBody = ref('');
const commentError = ref('');
const submittingComment = ref(false);

const isAuthor = computed(() => {
  return auth.user && post.value && auth.user.id === (post.value.author && post.value.author.id);
});

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.get(`/posts/${route.params.id}`);
    post.value = data;
  } catch (err) {
    error.value = err.response && err.response.status === 404
      ? 'Post not found.'
      : 'Could not load this post.';
    post.value = null;
  } finally {
    loading.value = false;
  }
}

async function submitComment() {
  if (!commentBody.value.trim()) return;
  submittingComment.value = true;
  commentError.value = '';
  try {
    const { data } = await api.post(`/posts/${post.value.id}/comments`, {
      body: commentBody.value.trim()
    });
    post.value.comments = post.value.comments || [];
    post.value.comments.push(data);
    commentBody.value = '';
  } catch (err) {
    commentError.value = err.response?.status === 401
      ? 'Sign in to comment.'
      : 'Could not post the comment.';
  } finally {
    submittingComment.value = false;
  }
}

async function softDelete() {
  // eslint-disable-next-line no-alert
  if (!confirm('Delete this post? This cannot be undone from the UI.')) return;
  try {
    await api.delete(`/posts/${post.value.id}`);
    window.location.href = '/';
  } catch (_err) {
    error.value = 'Could not delete the post.';
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleString('en-US');
}

onMounted(load);
watch(() => route.params.id, load);
</script>

<template>
  <div v-if="loading" class="text-slate-500">Loading…</div>
  <div v-else-if="error" class="form-error">{{ error }}</div>
  <article v-else-if="post" class="space-y-6">
    <header>
      <h1 class="text-3xl font-semibold">{{ post.title }}</h1>
      <p class="mt-1 text-sm text-slate-500">
        by {{ post.author?.fullName || 'unknown' }}
        &middot; {{ formatDate(post.createdAt) }}
      </p>
    </header>

    <div class="whitespace-pre-line text-slate-800">{{ post.body }}</div>

    <div v-if="isAuthor" class="flex gap-3">
      <button class="btn-ghost" @click="router.push(`/posts/${post.id}/edit`)">Edit</button>
      <button class="btn-ghost text-red-600 hover:bg-red-50" @click="softDelete">Delete</button>
    </div>

    <section>
      <h2 class="text-lg font-medium">Comments</h2>
      <ul class="mt-3 space-y-3">
        <li v-for="c in post.comments" :key="c.id" class="rounded-md border border-slate-200 bg-white p-3">
          <p class="text-sm text-slate-500">
            {{ c.author?.fullName || 'someone' }}
            &middot; {{ formatDate(c.createdAt) }}
          </p>
          <p class="mt-1 whitespace-pre-line text-slate-800">{{ c.body }}</p>
        </li>
        <li v-if="!post.comments || post.comments.length === 0" class="text-sm text-slate-500">
          No comments yet.
        </li>
      </ul>

      <form v-if="auth.isAuthenticated" class="mt-4 space-y-2" @submit.prevent="submitComment">
        <textarea v-model="commentBody" rows="3" class="form-input" placeholder="Add a comment…" required></textarea>
        <p v-if="commentError" class="form-error">{{ commentError }}</p>
        <button type="submit" class="btn-primary" :disabled="submittingComment">
          {{ submittingComment ? 'Posting…' : 'Post comment' }}
        </button>
      </form>
      <p v-else class="mt-4 text-sm text-slate-500">
        <a href="/login" class="underline">Sign in</a> to leave a comment.
      </p>
    </section>
  </article>
</template>
