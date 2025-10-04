// Français: Utilitaires de sécurité pour la validation et la sanitisation des entrées
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Français: Créer une instance DOMPurify pour le serveur
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

/**
 * Sanitize user input to prevent XSS attacks
 * Français: Sanitiser les entrées utilisateur pour prévenir les attaques XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return purify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

/**
 * Validate email format
 * Français: Valider le format d'email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Moroccan format)
 * Français: Valider le format de numéro de téléphone (format marocain)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate CIN number format (Moroccan)
 * Français: Valider le format du numéro CIN (marocain)
 */
export function isValidCIN(cin: string): boolean {
  const cinRegex = /^[A-Z]{1,2}[0-9]{6}$/;
  return cinRegex.test(cin);
}

/**
 * Validate CNSS number format
 * Français: Valider le format du numéro CNSS
 */
export function isValidCNSS(cnss: string): boolean {
  const cnssRegex = /^[A-Z]{1,2}[0-9]{8}$/;
  return cnssRegex.test(cnss);
}

/**
 * Validate ICE number format (Moroccan)
 * Français: Valider le format du numéro ICE (marocain)
 */
export function isValidICE(ice: string): boolean {
  const iceRegex = /^[0-9]{15}$/;
  return iceRegex.test(ice);
}

/**
 * Sanitize and validate text input
 * Français: Sanitiser et valider les entrées texte
 */
export function sanitizeTextInput(input: string, maxLength: number = 255): string {
  const sanitized = sanitizeInput(input);
  return sanitized.substring(0, maxLength);
}

/**
 * Validate salary amount
 * Français: Valider le montant du salaire
 */
export function isValidSalary(amount: number): boolean {
  return amount >= 0 && amount <= 1000000; // Max 1M MAD
}

/**
 * Validate date format (YYYY-MM-DD)
 * Français: Valider le format de date (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  const isoString = date.toISOString().split('T')[0];
  return isoString === dateString && !isNaN(date.getTime());
}

/**
 * Check if date is in the past
 * Français: Vérifier si la date est dans le passé
 */
export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

/**
 * Validate file upload
 * Français: Valider l'upload de fichier
 */
export function isValidFileUpload(file: File, maxSize: number = 5 * 1024 * 1024): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}
