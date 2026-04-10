import { defineCollection, z as zod } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: zod.object({
    title: zod.string(),
    description: zod.string(),
    publishDate: zod.coerce.date(),
    updatedDate: zod.coerce.date().optional(),
    coverImage: zod.string().optional(),
    tags: zod.array(zod.string()).default([]),
    draft: zod.boolean().default(false),
  }),
});

export const collections = { blog };
