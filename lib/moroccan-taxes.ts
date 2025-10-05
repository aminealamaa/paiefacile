// Français: Calculs fiscaux spécifiques au Maroc - Règles 2025
// Moroccan-specific tax calculations - 2025 Rules

export interface MoroccanTaxRates {
  cnssEmployee: number;      // 4.48%
  cnssEmployer: number;      // 7.96%
  amoEmployee: number;       // 2.26%
  amoEmployer: number;       // 2.26%
  cnssCeiling: number;       // 6000 MAD ceiling for CNSS
  familyDeduction: number;   // 30 MAD per family member
  maxChildren: number;       // 6 children max
}

export const MOROCCAN_TAX_RATES: MoroccanTaxRates = {
  cnssEmployee: 0.0448,      // 4.48%
  cnssEmployer: 0.0796,      // 7.96%
  amoEmployee: 0.0226,       // 2.26%
  amoEmployer: 0.0226,       // 2.26%
  cnssCeiling: 6000,         // 6000 MAD ceiling for CNSS base
  familyDeduction: 30,       // 30 MAD per family member
  maxChildren: 6             // Maximum 6 children for deductions
};

// IGR (Impôt Général sur le Revenu) brackets for 2025 - CORRECTED
export interface IGRBracket {
  min: number;
  max: number;
  rate: number;
  deduction: number;
}

export const IGR_BRACKETS_2025: IGRBracket[] = [
  { min: 0, max: 40000, rate: 0, deduction: 0 },
  { min: 40000, max: 60000, rate: 0.10, deduction: 4000 },
  { min: 60000, max: 80000, rate: 0.20, deduction: 8000 },
  { min: 80000, max: 100000, rate: 0.30, deduction: 14000 },
  { min: 100000, max: 180000, rate: 0.34, deduction: 18000 },
  { min: 180000, max: Infinity, rate: 0.37, deduction: 45200 }
];

/**
 * Round to 2 decimal places for MAD currency
 * Français: Arrondir à 2 décimales pour la monnaie MAD
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate IGR (Income Tax) for Moroccan employees - 2025 Rules
 * Français: Calculer l'IGR pour les employés marocains - Règles 2025
 */
export function calculateIGR(
  monthlyNetTaxable: number,
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed',
  childrenCount: number
): number {
  // Calculate annual taxable income (monthly × 12)
  const annualTaxableIncome = monthlyNetTaxable * 12;
  
  // Calculate family deductions (annual)
  let annualFamilyDeductions = 0;
  
  if (maritalStatus === 'married') {
    annualFamilyDeductions += MOROCCAN_TAX_RATES.familyDeduction * 12; // Spouse deduction
  }
  
  // Children deductions (max 6 children)
  const validChildren = Math.min(childrenCount, MOROCCAN_TAX_RATES.maxChildren);
  annualFamilyDeductions += validChildren * MOROCCAN_TAX_RATES.familyDeduction * 12;
  
  const annualTaxableIncomeAfterDeductions = Math.max(0, annualTaxableIncome - annualFamilyDeductions);
  
  // Calculate annual tax using 2025 brackets
  let annualTax = 0;
  for (const bracket of IGR_BRACKETS_2025) {
    if (annualTaxableIncomeAfterDeductions > bracket.min) {
      const taxableInThisBracket = Math.min(
        annualTaxableIncomeAfterDeductions - bracket.min,
        bracket.max - bracket.min
      );
      annualTax += taxableInThisBracket * bracket.rate;
    }
  }
  
  // Convert back to monthly tax
  const monthlyTax = Math.max(0, annualTax / 12);
  
  return round2(monthlyTax);
}

/**
 * Calculate CNSS contributions with ceiling - 2025 Rules
 * Français: Calculer les cotisations CNSS avec plafond - Règles 2025
 */
export function calculateCNSS(grossSalary: number): {
  employee: number;
  employer: number;
} {
  // Apply ceiling of 6000 MAD for CNSS base
  const cnssBase = Math.min(grossSalary, MOROCCAN_TAX_RATES.cnssCeiling);
  
  return {
    employee: round2(cnssBase * MOROCCAN_TAX_RATES.cnssEmployee),
    employer: round2(cnssBase * MOROCCAN_TAX_RATES.cnssEmployer)
  };
}

/**
 * Calculate AMO contributions - 2025 Rules
 * Français: Calculer les cotisations AMO - Règles 2025
 */
export function calculateAMO(grossSalary: number): {
  employee: number;
  employer: number;
} {
  return {
    employee: round2(grossSalary * MOROCCAN_TAX_RATES.amoEmployee),
    employer: round2(grossSalary * MOROCCAN_TAX_RATES.amoEmployer)
  };
}

/**
 * Calculate complete Moroccan payroll - 2025 Rules
 * Français: Calculer la paie complète marocaine - Règles 2025
 */
export function calculateMoroccanPayroll(
  baseSalary: number,
  bonuses: number = 0,
  overtimeHours: number = 0,
  overtimeRate: number = 1.25,
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' = 'single',
  childrenCount: number = 0
) {
  const hourlyRate = baseSalary / 173.33; // 173.33 hours per month
  const overtimePay = overtimeHours * hourlyRate * overtimeRate;
  const grossSalary = baseSalary + bonuses + overtimePay;
  
  // CNSS calculations (with ceiling)
  const cnss = calculateCNSS(grossSalary);
  const amo = calculateAMO(grossSalary);
  
  // Net taxable (after CNSS and AMO)
  const netTaxable = grossSalary - cnss.employee - amo.employee;
  
  // IGR calculation (using 2025 brackets)
  const igr = calculateIGR(netTaxable, maritalStatus, childrenCount);
  
  // Final net salary
  const netSalary = grossSalary - cnss.employee - amo.employee - igr;
  
  return {
    baseSalary: round2(baseSalary),
    bonuses: round2(bonuses),
    overtimeHours: round2(overtimeHours),
    overtimePay: round2(overtimePay),
    grossSalary: round2(grossSalary),
    cnssEmployee: cnss.employee,
    cnssEmployer: cnss.employer,
    amoEmployee: amo.employee,
    amoEmployer: amo.employer,
    netTaxable: round2(netTaxable),
    igr: igr,
    netSalary: round2(netSalary),
    totalEmployerCost: round2(grossSalary + cnss.employer + amo.employer)
  };
}

/**
 * Format currency in Moroccan Dirhams
 * Français: Formater la monnaie en Dirhams marocains
 */
export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Validate Moroccan CIN number
 * Français: Valider le numéro CIN marocain
 */
export function validateMoroccanCIN(cin: string): boolean {
  // Moroccan CIN format: 1-2 letters followed by 6 digits
  const cinRegex = /^[A-Z]{1,2}[0-9]{6}$/;
  return cinRegex.test(cin.toUpperCase());
}

/**
 * Validate Moroccan CNSS number
 * Français: Valider le numéro CNSS marocain
 */
export function validateMoroccanCNSS(cnss: string): boolean {
  // CNSS format: 1-2 letters followed by 8 digits
  const cnssRegex = /^[A-Z]{1,2}[0-9]{8}$/;
  return cnssRegex.test(cnss.toUpperCase());
}

/**
 * Validate Moroccan ICE number
 * Français: Valider le numéro ICE marocain
 */
export function validateMoroccanICE(ice: string): boolean {
  // ICE format: 15 digits
  const iceRegex = /^[0-9]{15}$/;
  return iceRegex.test(ice);
}
