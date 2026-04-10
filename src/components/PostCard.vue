<template>
  <!--
    PostCard — three layout variants, chosen by props:

    1. featured  — first post on a page, large horizontal, prominent cover
    2. with-cover — has a cover image, compact 2-col horizontal
    3. text-only  — no image, clean editorial list row with date column

    Tag chips use <TagChip> for full consistency (no inline-# duplication).
  -->
  <article
    :class="[
      'post-card group relative overflow-hidden',
      featured ? 'featured-card' : '',
    ]"
  >

    <!-- ══════ VARIANT 1 — featured (large, image left) ══════════ -->
    <template v-if="featured && coverImage">
      <div class="flex flex-col sm:flex-row">

        <!-- Cover image -->
        <a
          :href="postHref"
          class="block shrink-0 overflow-hidden sm:w-64 lg:w-80 xl:w-96"
          :aria-label="`Read: ${title}`"
          tabindex="-1"
          aria-hidden="true"
        >
          <img
            :src="coverImage"
            alt=""
            class="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-full"
            loading="eager"
          />
        </a>

        <!-- Content -->
        <div class="flex flex-col justify-between gap-5 p-6 lg:p-8">

          <!-- Top: eyebrow + title + description -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="eyebrow">Latest</span>
              <span class="h-px w-5 rounded-full bg-primary/25" aria-hidden="true"></span>
              <time
                :datetime="publishDate"
                class="text-xs font-medium text-base-content/40"
              >{{ formatDate(publishDate) }}</time>
            </div>

            <h2 class="text-xl font-bold leading-snug tracking-tight text-balance text-base-content lg:text-2xl">
              <a
                :href="postHref"
                class="transition-colors duration-150 hover:text-primary focus-visible:text-primary"
              >{{ title }}</a>
            </h2>

            <p class="line-clamp-3 text-sm leading-relaxed text-base-content/55 lg:text-[0.9375rem]">
              {{ description }}
            </p>
          </div>

          <!-- Bottom: tags + read link -->
          <div class="space-y-3.5">
            <div v-if="tags.length" class="flex flex-wrap gap-1.5" role="list" aria-label="Post tags">
              <TagChip
                v-for="tag in tags.slice(0, 4)"
                :key="tag"
                :label="tag"
                :href="`/tags/${encodeURIComponent(tag)}/`"
                role="listitem"
              />
            </div>

            <a
              :href="postHref"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-150 hover:gap-2.5"
              :aria-label="`Read: ${title}`"
            >
              Read post
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════ VARIANT 2 — with cover (compact thumbnail) ════════ -->
    <template v-else-if="coverImage">
      <div class="flex flex-col sm:flex-row">

        <!-- Thumbnail -->
        <a
          :href="postHref"
          class="block shrink-0 overflow-hidden sm:w-40 lg:w-48"
          :aria-label="`Read: ${title}`"
          tabindex="-1"
          aria-hidden="true"
        >
          <img
            :src="coverImage"
            alt=""
            class="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-full"
            loading="lazy"
          />
        </a>

        <!-- Content -->
        <div class="flex flex-col justify-between gap-3 p-5">
          <div class="space-y-2">
            <time
              :datetime="publishDate"
              class="text-xs font-medium text-base-content/40"
            >{{ formatDate(publishDate) }}</time>

            <h2 class="text-lg font-bold leading-snug tracking-tight text-balance text-base-content">
              <a
                :href="postHref"
                class="transition-colors duration-150 hover:text-primary focus-visible:text-primary"
              >{{ title }}</a>
            </h2>

            <p class="line-clamp-2 text-sm leading-relaxed text-base-content/55">
              {{ description }}
            </p>
          </div>

          <!-- Tags + read -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div v-if="tags.length" class="flex flex-wrap gap-1.5" role="list" aria-label="Post tags">
              <TagChip
                v-for="tag in tags.slice(0, 3)"
                :key="tag"
                :label="tag"
                :href="`/tags/${encodeURIComponent(tag)}/`"
                role="listitem"
              />
            </div>
            <a
              :href="postHref"
              class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-all duration-150 hover:gap-2"
              :aria-label="`Read: ${title}`"
            >
              Read
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════ VARIANT 3 — text-only (editorial list row) ════════ -->
    <template v-else>
      <div class="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:gap-6">

        <!-- Date column -->
        <time
          :datetime="publishDate"
          class="shrink-0 text-xs font-medium tabular-nums text-base-content/35 sm:w-28 sm:pt-[5px]"
        >{{ formatDate(publishDate) }}</time>

        <!-- Main content -->
        <div class="flex flex-1 flex-col gap-2.5">
          <h2 class="text-[1.05rem] font-bold leading-snug tracking-tight text-balance text-base-content">
            <a
              :href="postHref"
              class="transition-colors duration-150 hover:text-primary focus-visible:text-primary"
            >{{ title }}</a>
          </h2>

          <p class="line-clamp-2 text-sm leading-relaxed text-base-content/55">
            {{ description }}
          </p>

          <!-- Tags + read -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <div v-if="tags.length" class="flex flex-wrap gap-1.5" role="list" aria-label="Post tags">
              <TagChip
                v-for="tag in tags.slice(0, 4)"
                :key="tag"
                :label="tag"
                :href="`/tags/${encodeURIComponent(tag)}/`"
                role="listitem"
              />
            </div>
            <a
              :href="postHref"
              class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-all duration-150 hover:gap-2"
              :aria-label="`Read: ${title}`"
            >
              Read
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </template>

  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TagChip from './TagChip.vue';

const props = defineProps<{
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  tags: string[];
  coverImage?: string;
  /** Promote as the first/featured post — uses the large layout */
  featured?: boolean;
}>();

const postHref = computed(() => `/posts/${props.slug}/`);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
}
</script>
