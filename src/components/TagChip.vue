<template>
  <!--
    TagChip — single source of truth for tag pill appearance.

    Variants:
      default  → subtle outline pill  (used in post cards, post header)
      solid    → tinted primary fill  (used in post footer "Filed under")
      large    → larger padding/text  (used in tag index page)

    The base .tag-chip class and variant classes are defined in
    global.css @layer components, keeping all styling in one place.
  -->
  <a
    :href="href"
    :class="chipClass"
    @click.stop
  >
    <!--
      The # is decorative — aria-hidden so screen readers read only the
      label, e.g. "astro" not "#astro".
    -->
    <span class="select-none opacity-30" aria-hidden="true">#</span>{{ label }}
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    href:  string;
    variant?: 'default' | 'solid' | 'large';
  }>(),
  { variant: 'default' },
);

const chipClass = computed(() => {
  switch (props.variant) {
    case 'solid': return 'tag-chip-solid';
    case 'large': return 'tag-chip-lg';
    default:      return 'tag-chip';
  }
});
</script>
