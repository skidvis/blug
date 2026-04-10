<template>
  <div class="overflow-hidden rounded-box border border-base-300 bg-base-100">
    <div class="flex flex-wrap gap-2 border-b border-base-300 bg-base-200 p-3">
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleBold().run()">Bold</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleItalic().run()">Italic</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleBulletList().run()">Bullet</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleOrderedList().run()">Numbered</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleCodeBlock().run()">Code</button>
      <button type="button" class="btn btn-xs" @click="editor?.chain().focus().toggleBlockquote().run()">Quote</button>
      <button type="button" class="btn btn-xs" @click="setLink">Link</button>
      <button type="button" class="btn btn-xs" @click="insertImage">Image</button>
    </div>

    <EditorContent :editor="editor" class="prose prose-lg min-h-96 max-w-none p-4" />
    <p v-if="error" class="border-t border-base-300 bg-base-200 px-4 py-2 text-sm text-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onBeforeUnmount } from 'vue';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const error = ref('');

const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: 'Write your post in markdown-powered rich text…' }),
    Markdown,
  ],
  content: props.modelValue,
  immediatelyRender: false,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.storage.markdown.getMarkdown());
  },
});

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return;
    const current = editor.value.storage.markdown.getMarkdown();
    if (value !== current) {
      editor.value.commands.setContent(value);
    }
  },
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

function setLink() {
  const url = window.prompt('Enter URL');
  if (!url || !editor.value) {
    return;
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

async function insertImage() {
  error.value = '';
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file || !editor.value) {
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

    editor.value.chain().focus().setImage({ src: data.url }).run();
  };
  input.click();
}
</script>
