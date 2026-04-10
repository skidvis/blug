import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = join(process.cwd(), 'src/content/blog');

export interface PostData {
  title: string;
  description: string;
  publishDate: string;
  updatedDate?: string;
  coverImage?: string;
  tags: string[];
  draft: boolean;
}

export interface Post extends PostData {
  slug: string;
  body: string;
}

function parsePost(data: Record<string, unknown>, slug: string, content: string): Post {
  return {
    title: typeof data.title === 'string' ? data.title : '',
    description: typeof data.description === 'string' ? data.description : '',
    publishDate: typeof data.publishDate === 'string' ? data.publishDate : '',
    updatedDate: typeof data.updatedDate === 'string' ? data.updatedDate : undefined,
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: typeof data.draft === 'boolean' ? data.draft : false,
    slug,
    body: content.trim(),
  };
}

function ensurePostsDir() {
  mkdirSync(POSTS_DIR, { recursive: true });
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getPosts(): Post[] {
  ensurePostsDir();

  return readdirSync(POSTS_DIR)
    .filter((file: string) => file.endsWith('.md'))
    .map((file: string) => {
      const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      return parsePost(data, file.replace(/\.md$/, ''), content);
    });
}

function assertSafeSlug(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
}

export function getPost(slug: string): Post | null {
  assertSafeSlug(slug);
  const path = join(POSTS_DIR, `${slug}.md`);
  if (!existsSync(path)) {
    return null;
  }

  const raw = readFileSync(path, 'utf-8');
  const { data, content } = matter(raw);
  return parsePost(data, slug, content);
}

export function savePost(slug: string, data: PostData, body: string): void {
  assertSafeSlug(slug);
  ensurePostsDir();

  const path = join(POSTS_DIR, `${slug}.md`);
  const raw = matter.stringify(body.trim(), {
    title: data.title,
    description: data.description,
    publishDate: data.publishDate,
    ...(data.updatedDate ? { updatedDate: data.updatedDate } : {}),
    ...(data.coverImage ? { coverImage: data.coverImage } : {}),
    tags: data.tags,
    draft: data.draft,
  });

  writeFileSync(path, raw, 'utf-8');
}

export function deletePost(slug: string): void {
  assertSafeSlug(slug);
  const path = join(POSTS_DIR, `${slug}.md`);
  if (existsSync(path)) {
    unlinkSync(path);
  }
}
