// Français: Validation spécifique aux entreprises marocaines
// Moroccan business validation utilities

import { z } from 'zod';

/**
 * Moroccan CIN validation schema
 * Français: Schéma de validation CIN marocain
 */
export const MoroccanCINSchema = z.string()
  .regex(/^[A-Z]{1,2}[0-9]{6}$/, 'Format CIN invalide (ex: A123456)')
  .transform(val => val.toUpperCase());

/**
 * Moroccan CNSS validation schema
 * Français: Schéma de validation CNSS marocain
 */
export const MoroccanCNSSSchema = z.string()
  .regex(/^[A-Z]{1,2}[0-9]{8}$/, 'Format CNSS invalide (ex: A12345678)')
  .transform(val => val.toUpperCase());

/**
 * Moroccan ICE validation schema
 * Français: Schéma de validation ICE marocain
 */
export const MoroccanICESchema = z.string()
  .regex(/^[0-9]{15}$/, 'Format ICE invalide (15 chiffres requis)');

/**
 * Moroccan phone number validation
 * Français: Validation numéro de téléphone marocain
 */
export const MoroccanPhoneSchema = z.string()
  .regex(/^(\+212|0)[5-7][0-9]{8}$/, 'Format téléphone marocain invalide')
  .transform(val => val.replace(/\s/g, ''));

/**
 * Moroccan company schema
 * Français: Schéma d'entreprise marocaine
 */
export const MoroccanCompanySchema = z.object({
  name: z.string().min(2, 'Nom de l\'entreprise requis'),
  rc_number: z.string().optional(),
  if_number: z.string().optional(),
  cnss_affiliation_number: z.string().optional(),
  ice: MoroccanICESchema,
  patente: z.string().optional(),
  address: z.string().min(10, 'Adresse complète requise'),
  phone: MoroccanPhoneSchema.optional(),
  email: z.string().email('Email invalide').optional(),
});

/**
 * Moroccan employee schema
 * Français: Schéma d'employé marocain
 */
export const MoroccanEmployeeSchema = z.object({
  first_name: z.string().min(2, 'Prénom requis'),
  last_name: z.string().min(2, 'Nom requis'),
  cin_number: MoroccanCINSchema.optional(),
  cnss_number: MoroccanCNSSSchema.optional(),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide (YYYY-MM-DD)'),
  contract_type: z.enum(['CDI', 'CDD', 'ANAPEC']),
  base_salary: z.coerce.number().min(0, 'Salaire doit être positif'),
  job_title: z.string().min(2, 'Poste requis'),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed']).default('single'),
  children_count: z.coerce.number().min(0).max(6, 'Maximum 6 enfants').default(0),
  phone: MoroccanPhoneSchema.optional(),
  email: z.string().email('Email invalide').optional(),
});

/**
 * Validate Moroccan business registration
 * Français: Valider l'enregistrement d'entreprise marocaine
 */
export function validateMoroccanBusiness(data: unknown) {
  try {
    return MoroccanCompanySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    throw error;
  }
}

/**
 * Validate Moroccan employee data
 * Français: Valider les données d'employé marocain
 */
export function validateMoroccanEmployee(data: unknown) {
  try {
    return {
      success: true,
      data: MoroccanEmployeeSchema.parse(data)
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    throw error;
  }
}

/**
 * Format Moroccan phone number
 * Français: Formater le numéro de téléphone marocain
 */
export function formatMoroccanPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('212')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+212${cleaned.substring(1)}`;
  } else if (cleaned.length === 9) {
    return `+212${cleaned}`;
  }
  
  return phone;
}

/**
 * Validate Moroccan postal code
 * Français: Valider le code postal marocain
 */
export function validateMoroccanPostalCode(code: string): boolean {
  // Moroccan postal codes are 5 digits
  return /^[0-9]{5}$/.test(code);
}

/**
 * Get Moroccan city from postal code
 * Français: Obtenir la ville marocaine à partir du code postal
 */
export function getMoroccanCityFromPostalCode(code: string): string | null {
  const cityMap: Record<string, string> = {
    '10000': 'Rabat',
    '20000': 'Casablanca',
    '30000': 'Fès',
    '40000': 'Marrakech',
    '50000': 'Meknès',
    '60000': 'Agadir',
    '70000': 'Tanger',
    '80000': 'Oujda',
    '90000': 'Tétouan'
  };
  
  return cityMap[code] || null;
}
