<script setup>
defineProps({
  post: { type: Object, required: true }
});

function excerpt(body) {
  if (!body) return '';
  return body.length > 280 ? body.slice(0, 280) + '…' : body;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US');
}
</script>

<template>
  <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <h2 class="text-xl font-semibold">
      <a :href="`/posts/${post.id}`" class="text-slate-900 hover:underline">{{ post.title }}</a>
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      by {{ post.author && post.author.fullName ? post.author.fullName : 'unknown' }}
      &middot; {{ formatDate(post.createdAt) }}
    </p>
    <p class="mt-3 whitespace-pre-line text-slate-700">{{ excerpt(post.body) }}</p>
  </article>
</template>
