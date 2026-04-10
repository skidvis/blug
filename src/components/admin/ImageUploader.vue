<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-3">
      <input v-model="urlValue" type="url" class="input input-bordered flex-1" placeholder="/uploads/example.jpg or https://..." />
      <label class="btn btn-outline">
        Upload image
        <input type="file" class="hidden" accept="image/*" @change="onFileChange" />
      </label>
    </div>
    <p v-if="error" class="text-sm text-error">{{ error }}</p>
    <figure v-if="urlValue" class="overflow-hidden rounded-box border border-base-300 bg-base-200">
      <img :src="urlValue" alt="Cover preview" class="max-h-64 w-full object-cover" />
    </figure>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const error = ref('');

const urlValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

async function onFileChange(event: Event) {
  error.value = '';
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  const form = new FormData();
  form.append('file', file);

  const response = await fetch('/api/upload', { method: 'POST', body: form });
  const data = await response.json().catch((e) => { console.warn('Failed to parse response JSON:', e); return {}; });

  if (!response.ok) {
    error.value = data.error ?? 'Upload failed';
    return;
  }

  emit('update:modelValue', data.url ?? '');
  input.value = '';
}
</script>
