<template>
  <!--
    TagList — renders a horizontal wrapping list of TagChip components.

    Props:
      tags      — array of tag strings
      variant   — passed through to every TagChip ('default' | 'solid' | 'large')
      size      — 'default' (gap-1.5) | 'large' (gap-2)
      ariaLabel — accessible label for the list; defaults to "Post tags"
  -->
  <div
    :class="['flex flex-wrap', size === 'large' ? 'gap-2' : 'gap-1.5']"
    role="list"
    :aria-label="ariaLabel || 'Post tags'"
  >
    <TagChip
      v-for="tag in tags"
      :key="tag"
      :label="tag"
      :href="`/tags/${encodeURIComponent(tag)}/`"
      :variant="variant"
      role="listitem"
    />
  </div>
</template>

<script setup lang="ts">
import TagChip from './TagChip.vue';

withDefaults(
  defineProps<{
    tags: string[];
    variant?:   'default' | 'solid' | 'large';
    size?:      'default' | 'large';
    ariaLabel?: string;
  }>(),
  {
    variant: 'default',
    size:    'default',
  },
);
</script>
