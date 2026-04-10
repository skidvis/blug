// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import node from '@astrojs/node';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: process.env.ASTRO_SITE ?? process.env.SITE_URL ?? 'https://example.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [vue(), pagefind()],
});
