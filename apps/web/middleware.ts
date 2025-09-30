import { NextResponse } from 'next/server';
import { type NextAuthConfig } from "next-auth";
import NextAuth from 'next-auth';
import type { NextMiddleware } from 'next/server';
import authConfig from './lib/auth.config';

const { auth } = NextAuth(authConfig satisfies NextAuthConfig);

const middleware: NextMiddleware = auth((req) => {
  // Clone the request headers and set pathname header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);

  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
});

export default middleware;

// Don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
