export const prerender = false;

import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { COOKIE_NAME, requireAuthEnv, signToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  requireAuthEnv();

  const data = await request.formData();
  const username = data.get('username')?.toString() ?? '';
  const password = data.get('password')?.toString() ?? '';

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH ?? '');

  if (!validUsername || !validPassword) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login?error=1' },
    });
  }

  const token = await signToken(username);
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return redirect('/admin/posts');
};
