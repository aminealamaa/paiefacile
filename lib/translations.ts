/**
 * Translation System
 * Loads and provides translations based on locale
 * Français: Système de traduction
 */

import type { Locale } from './i18n-utils';

// Import translation files
import frMessages from '@/messages/fr.json';
import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';

const messages: Record<Locale, typeof frMessages> = {
  fr: frMessages,
  en: enMessages,
  ar: arMessages,
};

/**
 * Get translation for a key
 * Supports nested keys like "navigation.overview"
 * Français: Obtenir la traduction pour une clé
 */
export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const localeMessages = messages[locale] || messages.fr;
  
  // Split key by dots to navigate nested object
  const keys = key.split('.');
  let value: unknown = localeMessages;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to French if key not found
      const frValue = getNestedValue(messages.fr, keys);
      return frValue || key;
    }
  }
  
  if (typeof value !== 'string') {
    // Fallback to French
    const frValue = getNestedValue(messages.fr, keys);
    return frValue || key;
  }
  
  // Replace parameters if provided
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
}

/**
 * Get nested value from object
 */
function getNestedValue(obj: Record<string, unknown>, keys: string[]): string | null {
  let value: unknown = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return null;
    }
  }
  return typeof value === 'string' ? value : null;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale) {
  return messages[locale] || messages.fr;
}

/**
 * React hook for translations (client components)
 */
export function useTranslations(locale: Locale) {
  return (key: string, params?: Record<string, string | number>) => t(locale, key, params);
}

