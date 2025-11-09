import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Simple redirect to /fr for root
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  
  // Handle /en and /ar routes
  if (pathname === '/en') {
    return NextResponse.rewrite(new URL('/fr', request.url));
  }
  
  if (pathname === '/ar') {
    return NextResponse.rewrite(new URL('/fr', request.url));
  }
  
  // Redirect routes without locale prefix to /fr/[route]
  // Check if pathname doesn't start with a locale prefix
  const localePrefixes = ['/fr', '/en', '/ar'];
  const hasLocalePrefix = localePrefixes.some(prefix => pathname.startsWith(prefix + '/') || pathname === prefix);
  
  if (!hasLocalePrefix && pathname !== '/') {
    // Redirect to /fr/[route]
    return NextResponse.redirect(new URL(`/fr${pathname}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
