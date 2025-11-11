/**
 * Internationalization Utilities
 * Helper functions for language and RTL support
 * Français: Utilitaires d'internationalisation
 */

export type Locale = 'fr' | 'en' | 'ar';

export const locales: Locale[] = ['fr', 'en', 'ar'];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

/**
 * Check if a locale is RTL
 * Français: Vérifier si une locale est RTL
 */
export function isRTL(locale: Locale | string): boolean {
  return locale === 'ar';
}

/**
 * Get direction for a locale
 * Français: Obtenir la direction pour une locale
 */
export function getDirection(locale: Locale | string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Get language code for a locale
 * Français: Obtenir le code de langue pour une locale
 */
export function getLangCode(locale: Locale | string): string {
  return locale;
}

/**
 * Extract locale from pathname
 * Français: Extraire la locale du chemin
 */
export function extractLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return 'fr'; // Default
}

/**
 * Remove locale from pathname
 * Français: Supprimer la locale du chemin
 */
export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (locales.includes(segments[0] as Locale)) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname;
}

/**
 * Add locale to pathname
 * Français: Ajouter la locale au chemin
 */
export function addLocaleToPath(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPath(pathname);
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

