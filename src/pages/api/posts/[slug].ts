export const prerender = false;

import type { APIRoute } from 'astro';
import { jsonError, jsonResponse, today } from '../../../lib/api';
import { triggerDeployForPost } from '../../../lib/deploy';
import { deletePost, getPost, savePost } from '../../../lib/posts';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Not found', { status: 404 });

  try {
    const post = getPost(slug);
    if (!post) return new Response('Not found', { status: 404 });
    return jsonResponse(post);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to read post', 500);
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const slug = params.slug;
  if (!slug) return new Response('Not found', { status: 404 });

  try {
    const body = await request.json();
    const existing = getPost(slug);
    if (!existing) return new Response('Not found', { status: 404 });

    const nextDraft = body.draft ?? existing.draft;

    savePost(
      slug,
      {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        publishDate: existing.publishDate,
        updatedDate: today(),
        coverImage: body.coverImage ?? existing.coverImage,
        tags: Array.isArray(body.tags) ? body.tags : existing.tags,
        draft: nextDraft,
      },
      body.body ?? existing.body,
    );

    const remainsPublished = existing.draft === false && nextDraft === false;
    const isNowPublishing = existing.draft === true && nextDraft === false;
    const deployResult = isNowPublishing || remainsPublished ? triggerDeployForPost(slug) : null;

    return jsonResponse({
      slug,
      deployTriggered: Boolean(deployResult),
      deployOk: deployResult?.ok ?? null,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to update post', 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Not found', { status: 404 });

  try {
    deletePost(slug);
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to delete post', 500);
  }
};
