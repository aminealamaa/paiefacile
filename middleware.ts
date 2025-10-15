import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple redirect to /fr for now
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  
  // Handle /en and /ar routes
  if (request.nextUrl.pathname === '/en') {
    return NextResponse.rewrite(new URL('/fr', request.url));
  }
  
  if (request.nextUrl.pathname === '/ar') {
    return NextResponse.rewrite(new URL('/fr', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
