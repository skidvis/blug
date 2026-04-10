<template>
  <form class="space-y-6" @submit.prevent="save">
    <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <label class="form-control">
          <span class="label-text mb-2 block font-medium">Title</span>
          <input v-model="form.title" type="text" class="input input-bordered w-full" required />
        </label>

        <label class="form-control">
          <span class="label-text mb-2 block font-medium">Excerpt</span>
          <textarea v-model="form.description" class="textarea textarea-bordered min-h-24 w-full"></textarea>
        </label>

        <div class="form-control">
          <span class="label-text mb-2 block font-medium">Content</span>
          <PostEditor v-model="form.body" />
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-box border border-base-300 bg-base-200 p-4">
          <h2 class="mb-4 text-lg font-semibold">Post settings</h2>

          <label class="form-control mb-4">
            <span class="label-text mb-2 block font-medium">Tags</span>
            <input v-model="tagsInput" type="text" class="input input-bordered w-full" placeholder="astro, web, tutorial" />
          </label>

          <label class="form-control mb-4">
            <span class="label-text mb-2 block font-medium">Publish date</span>
            <input v-model="form.publishDate" type="date" class="input input-bordered w-full" :disabled="Boolean(slug)" />
            <span v-if="slug" class="mt-2 text-xs text-base-content/60">Publish date stays fixed after creation.</span>
          </label>

          <label class="form-control mb-4">
            <span class="label-text mb-2 block font-medium">Cover image</span>
            <ImageUploader v-model="form.coverImage" />
          </label>

          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="form.draft" type="checkbox" class="checkbox" />
            <span class="label-text">Save as draft</span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button type="button" class="btn btn-outline" @click="saveAs(true)">Save Draft</button>
      <button type="button" class="btn btn-primary" @click="saveAs(false)">
        {{ slug ? 'Update Post' : 'Publish Post' }}
      </button>
      <button v-if="slug" type="button" class="btn btn-error btn-outline ml-auto" @click="deletePost">Delete</button>
    </div>

    <p v-if="error" class="text-sm text-error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImageUploader from './ImageUploader.vue';
import PostEditor from './PostEditor.vue';

function today() {
  return new Date().toISOString().split('T')[0];
}

interface PostPayload {
  title: string;
  description: string;
  publishDate: string;
  coverImage: string;
  body: string;
  draft: boolean;
  tags: string[];
}

const props = defineProps<{
  slug?: string;
  initial?: Partial<PostPayload>;
}>();

const emit = defineEmits<{
  saved: [slug: string];
}>();

const error = ref('');
const tagsInput = ref((props.initial?.tags ?? []).join(', '));
const form = ref<Omit<PostPayload, 'tags'>>({
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  publishDate: props.initial?.publishDate ?? today(),
  coverImage: props.initial?.coverImage ?? '',
  body: props.initial?.body ?? '',
  draft: props.initial?.draft ?? true,
});

function buildPayload(): PostPayload {
  return {
    ...form.value,
    tags: tagsInput.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

async function save() {
  await saveWithDraft(form.value.draft);
}

async function saveAs(draft: boolean) {
  form.value.draft = draft;
  await saveWithDraft(draft);
}

async function saveWithDraft(draft: boolean) {
  error.value = '';
  const payload = { ...buildPayload(), draft };

  const response = props.slug
    ? await fetch(`/api/posts/${props.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    : await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

  const data = await response.json().catch((e) => { console.warn('Failed to parse response JSON:', e); return {}; });

  if (!response.ok) {
    error.value = data.error ?? 'Save failed';
    return;
  }

  emit('saved', data.slug);
  window.location.href = '/admin/posts';
}

async function deletePost() {
  error.value = '';

  if (!props.slug || !window.confirm('Delete this post?')) {
    return;
  }

  const response = await fetch(`/api/posts/${props.slug}`, { method: 'DELETE' });
  if (!response.ok) {
    error.value = 'Delete failed';
    return;
  }

  window.location.href = '/admin/posts';
}
</script>
