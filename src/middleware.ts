import { defineMiddleware } from 'astro:middleware';
import { jsonError } from './lib/api';
import { COOKIE_NAME, verifyToken } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const isProtected = path.startsWith('/admin') || path.startsWith('/api');
  const isLoginPage = path === '/admin/login';
  const isLoginApi = path === '/api/auth/login';
  const isLogoutApi = path === '/api/auth/logout';

  if (!isProtected || isLoginPage || isLoginApi || isLogoutApi) {
    return next();
  }

  const token = context.cookies.get(COOKIE_NAME)?.value;
  const valid = token ? await verifyToken(token) : false;

  if (!valid) {
    if (path.startsWith('/api')) {
      return jsonError('Unauthorized', 401);
    }
    return context.redirect('/admin/login');
  }

  return next();
});
