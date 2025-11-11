/**
 * Security Middleware for Next.js
 * Combines rate limiting, CSRF protection, and security headers
 * Français: Middleware de sécurité pour Next.js
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitConfigs } from './rate-limit';

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate CSRF token
 * Français: Générer un token CSRF
 */
export function generateCSRFToken(): string {
  // Use crypto.randomUUID() if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older Node.js versions
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Validate CSRF token
 * Français: Valider un token CSRF
 */
export function validateCSRFToken(token: string, sessionId: string): boolean {
  const stored = csrfTokens.get(sessionId);
  if (!stored) return false;
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  return stored.token === token;
}

/**
 * Store CSRF token
 * Français: Stocker un token CSRF
 */
export function storeCSRFToken(sessionId: string, token: string): void {
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Get session ID from request
 * Français: Obtenir l'ID de session depuis la requête
 */
function getSessionId(req: NextRequest): string {
  return req.cookies.get('session-id')?.value || req.headers.get('x-session-id') || 'anonymous';
}

/**
 * Security middleware wrapper
 * Applies rate limiting and CSRF protection
 * Français: Wrapper de middleware de sécurité
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimitConfig?: typeof rateLimitConfigs.api;
    requireCSRF?: boolean;
    requireAuth?: boolean;
  } = {}
) {
  return async function securedHandler(req: NextRequest): Promise<NextResponse> {
    // Apply rate limiting
    if (options.rateLimitConfig) {
      const rateLimitResponse = rateLimit(options.rateLimitConfig)(req);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }

    // CSRF protection for state-changing methods
    if (options.requireCSRF && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrfToken = req.headers.get('x-csrf-token') || req.headers.get('csrf-token');
      const sessionId = getSessionId(req);

      if (!csrfToken || !validateCSRFToken(csrfToken, sessionId)) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or missing CSRF token' }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Call the actual handler
    return handler(req);
  };
}

/**
 * Apply security headers to response
 * Français: Appliquer les en-têtes de sécurité à la réponse
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com; frame-ancestors 'none';"
  );

  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Frame options
  response.headers.set('X-Frame-Options', 'DENY');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // Strict Transport Security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
}

