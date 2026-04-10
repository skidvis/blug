export const prerender = false;

import type { APIRoute } from 'astro';
import { byPublishDateDesc, jsonError, jsonResponse, today } from '../../../lib/api';
import { getPosts, savePost, slugify } from '../../../lib/posts';

export const GET: APIRoute = async () => {
  try {
    const posts = getPosts().sort(byPublishDateDesc);
    return jsonResponse(posts);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to read posts', 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const slug = slugify(body.title ?? '');

    if (!slug) {
      return jsonError('Title is required', 400);
    }

    savePost(
      slug,
      {
        title: body.title,
        description: body.description ?? '',
        publishDate: body.publishDate ?? today(),
        coverImage: body.coverImage || undefined,
        tags: Array.isArray(body.tags) ? body.tags : [],
        draft: body.draft ?? true,
      },
      body.body ?? '',
    );

    return jsonResponse({ slug }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to save post', 500);
  }
};
