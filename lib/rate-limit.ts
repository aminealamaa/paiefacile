// Français: Système de limitation de taux pour prévenir les abus
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Fenêtre de temps en millisecondes
  maxRequests: number; // Nombre maximum de requêtes par fenêtre
  message: string; // Message d'erreur
}

// Français: Stockage en mémoire pour la limitation de taux (en production, utiliser Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiter middleware
 * Français: Middleware de limitation de taux
 */
export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest): NextResponse | null => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Nettoyer les anciennes entrées
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < now) {
        requestCounts.delete(key);
      }
    }
    
    // Vérifier le nombre de requêtes pour cette IP
    const current = requestCounts.get(ip);
    
    if (!current) {
      requestCounts.set(ip, { count: 1, resetTime: now + config.windowMs });
      return null;
    }
    
    if (current.count >= config.maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: config.message }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
          },
        }
      );
    }
    
    current.count++;
    return null;
  };
}

// Français: Configurations de limitation de taux pour différentes routes
export const rateLimitConfigs = {
  // Limitation générale pour les API
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  
  // Limitation stricte pour l'authentification
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard'
  },
  
  // Limitation pour les uploads de fichiers
  upload: {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxRequests: 10,
    message: 'Trop d\'uploads de fichiers, veuillez réessayer plus tard'
  },
  
  // Limitation pour les calculs de paie
  payroll: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20,
    message: 'Trop de calculs de paie, veuillez réessayer plus tard'
  }
};

/**
 * Middleware de limitation de taux pour les routes API
 * Français: Applique la limitation de taux aux routes API
 */
export function withRateLimit(config: RateLimitConfig) {
  return function(handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>) {
    return async function(req: NextRequest, ...args: unknown[]) {
      const rateLimitResponse = rateLimit(config)(req);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      return handler(req, ...args);
    };
  };
}
