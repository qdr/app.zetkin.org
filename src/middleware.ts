import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-requested-path', request.nextUrl.pathname);

  // Development logging (only for important routes)
  if (process.env.NODE_ENV === 'development') {
    const path = request.nextUrl.pathname;
    if (path === '/login' || path === '/' || path.startsWith('/organize')) {
      console.log(`[Middleware] ${request.method} ${path}`);
      if (request.nextUrl.searchParams.toString()) {
        console.log(`[Middleware] Query: ${request.nextUrl.searchParams.toString()}`);
      }
    }
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
