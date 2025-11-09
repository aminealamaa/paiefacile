/**
 * AI Optimization Engine - In-house Tax Optimization Analysis
 * Analyzes payroll data to find tax optimization opportunities
 * Français: Moteur d'optimisation IA - Analyse d'optimisation fiscale interne
 */

import { calculateMoroccanPayroll } from "./moroccan-taxes";
import { MOROCCAN_TAX_RATES } from "./moroccan-taxes";

export interface OptimizationOpportunity {
  employeeId: string;
  employeeName: string;
  type: "missing_family_deduction" | "incorrect_family_status" | "tax_bracket_optimization" | "cnss_ceiling";
  priority: "high" | "medium" | "low";
  currentValue: number;
  suggestedValue?: number;
  potentialSavings: number; // Annual savings in MAD
  description: string;
  actionRequired: string;
}

export interface OptimizationAnalysis {
  totalPotentialSavings: number; // Annual savings in MAD
  opportunities: OptimizationOpportunity[];
  summary: {
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  };
}

/**
 * Analyze employee for missing family deductions
 * Français: Analyser l'employé pour les abattements familiaux manquants
 */
function analyzeFamilyDeductions(employee: Record<string, unknown>): OptimizationOpportunity | null {
  const maritalStatus = (employee.marital_status as string) || "single";
  const childrenCount = Number(employee.children_count) || 0;
  const baseSalary = Number(employee.base_salary) || 0;

  if (baseSalary === 0) return null;

  // Calculate current payroll
  const currentPayroll = calculateMoroccanPayroll(
    baseSalary,
    0, // bonuses
    0, // overtime
    1.25, // overtime rate
    maritalStatus as "single" | "married" | "divorced" | "widowed",
    childrenCount
  );

  // Check if employee is married but no children declared
  if (maritalStatus === "married" && childrenCount === 0) {
    // Potential: if they have children, they could save
    // Estimate potential savings if they had 1 child
    const potentialPayroll = calculateMoroccanPayroll(
      baseSalary,
      0,
      0,
      1.25,
      "married",
      1 // Assume 1 child
    );

    const monthlySavings = currentPayroll.igr - potentialPayroll.igr;
    const annualSavings = monthlySavings * 12;

    if (annualSavings > 0) {
      return {
        employeeId: employee.id as string,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        type: "missing_family_deduction",
        priority: "medium",
        currentValue: childrenCount,
        suggestedValue: 1,
        potentialSavings: annualSavings,
        description: "Employé marié sans enfants déclarés. Si des enfants existent, ils peuvent être déclarés pour réduire l'IGR.",
        actionRequired: "Vérifier si l'employé a des enfants à déclarer pour bénéficier des abattements familiaux.",
      };
    }
  }

  // Check if children count is less than maximum (6)
  if (maritalStatus === "married" && childrenCount > 0 && childrenCount < 6) {
    // Check if they might have more children
    // This is informational only, not a direct optimization
    return null;
  }

  return null;
}

/**
 * Analyze tax bracket optimization
 * Français: Analyser l'optimisation des tranches d'imposition
 */
function analyzeTaxBracket(employee: Record<string, unknown>): OptimizationOpportunity | null {
  const baseSalary = Number(employee.base_salary) || 0;
  const maritalStatus = (employee.marital_status as string) || "single";
  const childrenCount = Number(employee.children_count) || 0;

  if (baseSalary === 0) return null;

  const currentPayroll = calculateMoroccanPayroll(
    baseSalary,
    0,
    0,
    1.25,
    maritalStatus as "single" | "married" | "divorced" | "widowed",
    childrenCount
  );

  const monthlyNetTaxable = currentPayroll.netTaxable;
  const annualNetTaxable = monthlyNetTaxable * 12;

  // Check if close to bracket boundary where optimization might help
  const brackets = [
    { threshold: 40000, rate: 0 },
    { threshold: 60000, rate: 0.10 },
    { threshold: 80000, rate: 0.20 },
    { threshold: 100000, rate: 0.30 },
    { threshold: 180000, rate: 0.34 },
  ];

  for (const bracket of brackets) {
    const distance = annualNetTaxable - bracket.threshold;
    
    // If within 10,000 MAD of bracket threshold, suggest review
    if (distance > 0 && distance < 10000) {
      return {
        employeeId: employee.id as string,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        type: "tax_bracket_optimization",
        priority: "low",
        currentValue: annualNetTaxable,
        potentialSavings: 0, // Informational only
        description: `Salaire annuel net imposable (${annualNetTaxable.toLocaleString()} MAD) proche de la tranche ${bracket.threshold.toLocaleString()} MAD.`,
        actionRequired: "Réviser la structure salariale si possible (dans les limites légales).",
      };
    }
  }

  return null;
}

/**
 * Analyze CNSS ceiling optimization
 * Français: Analyser l'optimisation du plafond CNSS
 */
function analyzeCNSSCeiling(employee: Record<string, unknown>): OptimizationOpportunity | null {
  const baseSalary = Number(employee.base_salary) || 0;

  if (baseSalary <= MOROCCAN_TAX_RATES.cnssCeiling) return null;

  // Employee is above CNSS ceiling
  // This is informational - they're already optimized for CNSS
  // But we can note it
  return {
    employeeId: employee.id as string,
    employeeName: `${employee.first_name} ${employee.last_name}`,
    type: "cnss_ceiling",
    priority: "low",
    currentValue: baseSalary,
    potentialSavings: 0,
    description: `Salaire (${baseSalary.toLocaleString()} MAD) supérieur au plafond CNSS (${MOROCCAN_TAX_RATES.cnssCeiling} MAD). La CNSS est déjà optimisée.`,
    actionRequired: "Aucune action requise - déjà optimisé.",
  };
}

/**
 * Analyze all employees for optimization opportunities
 * Français: Analyser tous les employés pour les opportunités d'optimisation
 */
export function analyzeCompanyOptimization(employees: Record<string, unknown>[]): OptimizationAnalysis {
  const opportunities: OptimizationOpportunity[] = [];

  employees.forEach((employee) => {
    // Check family deductions
    const familyDeduction = analyzeFamilyDeductions(employee);
    if (familyDeduction) {
      opportunities.push(familyDeduction);
    }

    // Check tax bracket
    const taxBracket = analyzeTaxBracket(employee);
    if (taxBracket) {
      opportunities.push(taxBracket);
    }

    // Check CNSS ceiling (informational)
    const cnssCeiling = analyzeCNSSCeiling(employee);
    if (cnssCeiling) {
      opportunities.push(cnssCeiling);
    }
  });

  // Calculate total potential savings
  const totalPotentialSavings = opportunities.reduce(
    (sum, opp) => sum + (opp.potentialSavings || 0),
    0
  );

  // Categorize by priority
  const highPriority = opportunities.filter((o) => o.priority === "high").length;
  const mediumPriority = opportunities.filter((o) => o.priority === "medium").length;
  const lowPriority = opportunities.filter((o) => o.priority === "low").length;

  return {
    totalPotentialSavings,
    opportunities,
    summary: {
      highPriority,
      mediumPriority,
      lowPriority,
    },
  };
}

/**
 * Get optimization suggestions for a specific employee
 * Français: Obtenir les suggestions d'optimisation pour un employé spécifique
 */
export function getEmployeeOptimizationSuggestions(
  employee: Record<string, unknown>
): OptimizationOpportunity[] {
  const opportunities: OptimizationOpportunity[] = [];

  const familyDeduction = analyzeFamilyDeductions(employee);
  if (familyDeduction) opportunities.push(familyDeduction);

  const taxBracket = analyzeTaxBracket(employee);
  if (taxBracket) opportunities.push(taxBracket);

  const cnssCeiling = analyzeCNSSCeiling(employee);
  if (cnssCeiling) opportunities.push(cnssCeiling);

  return opportunities;
}

