export const prerender = false;

import type { APIRoute } from 'astro';
import { mkdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { jsonError, jsonResponse } from '../../lib/api';

const UPLOADS_DIR = join(process.cwd(), 'public/uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) return jsonError('No file uploaded', 400);
    if (!file.type.startsWith('image/')) return jsonError('Only image uploads are allowed', 400);
    if (file.size > MAX_FILE_SIZE) return jsonError('Image too large', 400);

    const extension = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) return jsonError('Unsupported image format', 400);

    mkdirSync(UPLOADS_DIR, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(join(UPLOADS_DIR, filename), buffer);

    return jsonResponse({ url: `/uploads/${filename}` });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Upload failed', 500);
  }
};
