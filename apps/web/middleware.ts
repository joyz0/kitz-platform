import { NextResponse } from 'next/server';
import { type NextAuthConfig } from "next-auth";
import NextAuth from 'next-auth';
import authConfig from './lib/auth.config';

export const { auth: middleware }: any = NextAuth(authConfig satisfies NextAuthConfig);
// export const { auth: middleware } = NextAuth(authConfig)

// export { auth as middleware } from '@/lib/auth';
// export default auth((req) => {
//   // Clone the request headers and set a new header `x-hello-from-middleware1`
//   const requestHeaders = new Headers(req.headers);
//   requestHeaders.set('x-referer', req.nextUrl.href);

//   // You can also set request headers in NextResponse.next
//   const response = NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });

//   // https://github.com/vercel/next.js/issues/59301
//   response.headers.set('x-referer', req.nextUrl.href);
//   return response;
// });

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
