<template>
  <div class="space-y-5">

    <!--
      Build-required notice — only shown when Pagefind fails to initialise.
      In production (after `astro build`) this is never visible.
    -->
    <div
      v-if="showNotice"
      class="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/6 px-4 py-3.5 text-sm text-warning-content"
      role="status"
      aria-live="polite"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-4 w-4 shrink-0 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>
        Search requires a production build.
        Run <code class="rounded bg-warning/15 px-1.5 py-0.5 font-mono text-xs">astro build</code> to generate the Pagefind index.
      </span>
    </div>

    <!--
      Loading skeleton — shown while Pagefind JS is fetched.
      Replaced by the real UI once onMounted completes.
    -->
    <div v-if="loading && !showNotice" aria-busy="true" aria-label="Loading search…">
      <!-- Input skeleton -->
      <div class="mb-4 h-12 w-full animate-pulse rounded-2xl bg-base-300/50"></div>
      <!-- Result skeletons -->
      <div class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-20 w-full animate-pulse rounded-2xl bg-base-300/40"></div>
      </div>
    </div>

    <!-- Pagefind mount target -->
    <div
      id="search"
      :class="loading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'"
      style="transition: opacity 200ms ease;"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import '@pagefind/default-ui/css/ui.css';

const loading     = ref(true);
const showNotice  = ref(false);

onMounted(async () => {
  try {
    const { PagefindUI } = await import('@pagefind/default-ui');
    new PagefindUI({
      element:        '#search',
      showSubResults: true,
      resetStyles:    false,
      placeholder:    'Search posts…',
    });
    loading.value = false;
  }
  catch {
    loading.value    = false;
    showNotice.value = true;
  }
});
</script>
