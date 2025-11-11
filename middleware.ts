import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/lib/security-middleware';
import { createSupabaseMiddlewareClient } from '@/lib/supabase-middleware';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  
  // Simple redirect to /fr for root
  if (pathname === '/') {
    const redirectResponse = NextResponse.redirect(new URL('/fr', request.url));
    return applySecurityHeaders(redirectResponse);
  }
  
  // Handle /en and /ar routes - allow them to work properly
  if (pathname === '/en' || pathname === '/ar') {
    return applySecurityHeaders(response);
  }
  
  // Redirect routes without locale prefix to /fr/[route]
  // Check if pathname doesn't start with a locale prefix
  const localePrefixes = ['/fr', '/en', '/ar'];
  const hasLocalePrefix = localePrefixes.some(prefix => pathname.startsWith(prefix + '/') || pathname === prefix);
  
  if (!hasLocalePrefix && pathname !== '/') {
    // Redirect to /fr/[route]
    const redirectResponse = NextResponse.redirect(new URL(`/fr${pathname}`, request.url));
    return applySecurityHeaders(redirectResponse);
  }
  
  // Check authentication for protected routes (dashboard, settings)
  if (pathname.includes('/dashboard') || pathname.includes('/settings')) {
    try {
      const supabase = createSupabaseMiddlewareClient(request, response);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Extract locale from pathname
        const localeMatch = pathname.match(/^\/(fr|en|ar)/);
        const locale = localeMatch ? localeMatch[1] : 'fr';
        const redirectResponse = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        return applySecurityHeaders(redirectResponse);
      }
    } catch (error) {
      // If Supabase is not configured or there's an error, allow the request to proceed
      // The page component will handle the redirect
      console.warn('Middleware auth check failed:', error);
    }
  }
  
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
