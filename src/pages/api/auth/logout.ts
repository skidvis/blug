export const prerender = false;

import type { APIRoute } from 'astro';
import { COOKIE_NAME } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(COOKIE_NAME, { path: '/' });
  return redirect('/admin/login');
};
