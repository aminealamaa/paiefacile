/**
 * AI Compliance Detector - Risk Detection and Anomaly Analysis
 * Detects compliance risks and anomalies in payroll data
 * Français: Détecteur de conformité IA - Détection de risques et analyse d'anomalies
 */

import { calculateMoroccanPayroll } from "./moroccan-taxes";
import { validateMoroccanCNSS, validateMoroccanCIN } from "./moroccan-taxes";

export interface ComplianceIssue {
  type:
    | "missing_cnss"
    | "invalid_cnss"
    | "missing_cin"
    | "invalid_cin"
    | "incorrect_igr"
    | "incorrect_cnss"
    | "salary_anomaly"
    | "missing_family_info"
    | "outdated_tax_rates";
  severity: "high" | "medium" | "low";
  employeeId?: string;
  employeeName?: string;
  message: string;
  recommendation: string;
  currentValue?: unknown;
  expectedValue?: unknown;
}

export interface ComplianceReport {
  overallRiskScore: number; // 0-100, higher = more risk
  issues: ComplianceIssue[];
  summary: {
    high: number;
    medium: number;
    low: number;
  };
  compliant: boolean; // true if no high-severity issues
}

/**
 * Check for missing CNSS numbers
 * Français: Vérifier les numéros CNSS manquants
 */
function checkMissingCNSS(employee: Record<string, unknown>): ComplianceIssue | null {
  const cnssNumber = (employee.cnss_number as string) || "";

  if (!cnssNumber || cnssNumber.trim() === "") {
    return {
      type: "missing_cnss",
      severity: "high",
      employeeId: employee.id as string,
      employeeName: `${employee.first_name} ${employee.last_name}`,
      message: "Numéro CNSS manquant",
      recommendation: "Ajouter le numéro CNSS de l'employé. C'est obligatoire pour la déclaration CNSS.",
      currentValue: null,
      expectedValue: "Format: 1-2 lettres suivies de 8 chiffres (ex: A12345678)",
    };
  }

  return null;
}

/**
 * Check for invalid CNSS number format
 * Français: Vérifier le format du numéro CNSS
 */
function checkInvalidCNSS(employee: Record<string, unknown>): ComplianceIssue | null {
  const cnssNumber = (employee.cnss_number as string) || "";

  if (cnssNumber && cnssNumber.trim() !== "" && !validateMoroccanCNSS(cnssNumber)) {
    return {
      type: "invalid_cnss",
      severity: "high",
      employeeId: employee.id as string,
      employeeName: `${employee.first_name} ${employee.last_name}`,
      message: "Format de numéro CNSS invalide",
      recommendation: "Vérifier le numéro CNSS. Format attendu: 1-2 lettres suivies de 8 chiffres.",
      currentValue: cnssNumber,
      expectedValue: "Format: 1-2 lettres suivies de 8 chiffres (ex: A12345678)",
    };
  }

  return null;
}

/**
 * Check for missing CIN numbers
 * Français: Vérifier les numéros CIN manquants
 */
function checkMissingCIN(employee: Record<string, unknown>): ComplianceIssue | null {
  const cinNumber = (employee.cin_number as string) || "";

  if (!cinNumber || cinNumber.trim() === "") {
    return {
      type: "missing_cin",
      severity: "medium",
      employeeId: employee.id as string,
      employeeName: `${employee.first_name} ${employee.last_name}`,
      message: "Numéro CIN manquant",
      recommendation: "Ajouter le numéro CIN de l'employé. Recommandé pour la conformité.",
      currentValue: null,
      expectedValue: "Format: 1-2 lettres suivies de 6 chiffres (ex: AB123456)",
    };
  }

  return null;
}

/**
 * Check for invalid CIN number format
 * Français: Vérifier le format du numéro CIN
 */
function checkInvalidCIN(employee: Record<string, unknown>): ComplianceIssue | null {
  const cinNumber = (employee.cin_number as string) || "";

  if (cinNumber && cinNumber.trim() !== "" && !validateMoroccanCIN(cinNumber)) {
    return {
      type: "invalid_cin",
      severity: "medium",
      employeeId: employee.id as string,
      employeeName: `${employee.first_name} ${employee.last_name}`,
      message: "Format de numéro CIN invalide",
      recommendation: "Vérifier le numéro CIN. Format attendu: 1-2 lettres suivies de 6 chiffres.",
      currentValue: cinNumber,
      expectedValue: "Format: 1-2 lettres suivies de 6 chiffres (ex: AB123456)",
    };
  }

  return null;
}

/**
 * Check IGR calculation correctness
 * Français: Vérifier l'exactitude du calcul IGR
 */
function checkIGRCalculation(
  employee: Record<string, unknown>,
  payroll?: Record<string, unknown>
): ComplianceIssue | null {
  const baseSalary = Number(employee.base_salary) || 0;
  if (baseSalary === 0) return null;

  const maritalStatus = (employee.marital_status as string) || "single";
  const childrenCount = Number(employee.children_count) || 0;

  // Calculate expected IGR
  const expectedPayroll = calculateMoroccanPayroll(
    baseSalary,
    0, // bonuses
    0, // overtime
    1.25,
    maritalStatus as "single" | "married" | "divorced" | "widowed",
    childrenCount
  );

  // If we have payroll data, compare
  if (payroll) {
    const actualIGR = Number(payroll.igr) || 0;
    const expectedIGR = expectedPayroll.igr;
    const difference = Math.abs(actualIGR - expectedIGR);

    // Allow small rounding differences (0.10 MAD)
    if (difference > 0.10) {
      return {
        type: "incorrect_igr",
        severity: "high",
        employeeId: employee.id as string,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        message: `Calcul IGR incorrect. Différence: ${difference.toFixed(2)} MAD`,
        recommendation: "Vérifier le calcul de l'IGR. Il devrait être calculé sur le salaire net imposable avec les abattements familiaux.",
        currentValue: actualIGR,
        expectedValue: expectedIGR,
      };
    }
  }

  return null;
}

/**
 * Check CNSS calculation correctness
 * Français: Vérifier l'exactitude du calcul CNSS
 */
function checkCNSSCalculation(
  employee: Record<string, unknown>,
  payroll?: Record<string, unknown>
): ComplianceIssue | null {
  const baseSalary = Number(employee.base_salary) || 0;
  if (baseSalary === 0) return null;

  const maritalStatus = (employee.marital_status as string) || "single";
  const maritalStatusTyped = (maritalStatus === "single" || maritalStatus === "married" || maritalStatus === "divorced" || maritalStatus === "widowed")
    ? maritalStatus as "single" | "married" | "divorced" | "widowed"
    : "single";
  
  const expectedPayroll = calculateMoroccanPayroll(
    baseSalary,
    0,
    0,
    1.25,
    maritalStatusTyped,
    Number(employee.children_count) || 0
  );

  if (payroll) {
    const actualCNSS = Number(payroll.cnss) || 0;
    const expectedCNSS = expectedPayroll.cnssEmployee;
    const difference = Math.abs(actualCNSS - expectedCNSS);

    if (difference > 0.10) {
      return {
        type: "incorrect_cnss",
        severity: "high",
        employeeId: employee.id as string,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        message: `Calcul CNSS incorrect. Différence: ${difference.toFixed(2)} MAD`,
        recommendation: "Vérifier le calcul de la CNSS. Taux: 4.48% avec plafond de 6000 MAD.",
        currentValue: actualCNSS,
        expectedValue: expectedCNSS,
      };
    }
  }

  return null;
}

/**
 * Detect salary anomalies
 * Français: Détecter les anomalies de salaire
 */
function checkSalaryAnomalies(
  employees: Record<string, unknown>[],
  payrollData?: Record<string, unknown>[]
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  if (payrollData && payrollData.length > 0) {
    const salaries = payrollData.map((p) => Number(p.gross_salary) || 0).filter((s) => s > 0);
    if (salaries.length === 0) return issues;

    const avgSalary = salaries.reduce((sum, s) => sum + s, 0) / salaries.length;
    const stdDev = Math.sqrt(
      salaries.reduce((sum, s) => sum + Math.pow(s - avgSalary, 2), 0) / salaries.length
    );

    payrollData.forEach((payroll) => {
      const salary = Number(payroll.gross_salary) || 0;
      if (salary === 0) return;

      // Flag if salary is more than 2 standard deviations from mean
      if (Math.abs(salary - avgSalary) > 2 * stdDev && stdDev > 0) {
        const employee = employees.find((e) => e.id === payroll.employee_id);
        issues.push({
          type: "salary_anomaly",
          severity: "medium",
          employeeId: employee?.id as string,
          employeeName: employee ? `${employee.first_name} ${employee.last_name}` : undefined,
          message: `Salaire anormalement ${salary > avgSalary ? "élevé" : "faible"}: ${salary.toFixed(2)} MAD`,
          recommendation: "Vérifier que le salaire est correct. Anomalie détectée par rapport à la moyenne.",
          currentValue: salary,
          expectedValue: `Moyenne: ${avgSalary.toFixed(2)} MAD`,
        });
      }
    });
  }

  return issues;
}

/**
 * Run full compliance check for a company
 * Français: Exécuter une vérification complète de conformité pour une entreprise
 */
export function runComplianceCheck(
  employees: Record<string, unknown>[],
  payrollData?: Record<string, unknown>[]
): ComplianceReport {
  const issues: ComplianceIssue[] = [];

  // Check each employee
  employees.forEach((employee) => {
    // Check CNSS
    const missingCNSS = checkMissingCNSS(employee);
    if (missingCNSS) issues.push(missingCNSS);

    const invalidCNSS = checkInvalidCNSS(employee);
    if (invalidCNSS) issues.push(invalidCNSS);

    // Check CIN
    const missingCIN = checkMissingCIN(employee);
    if (missingCIN) issues.push(missingCIN);

    const invalidCIN = checkInvalidCIN(employee);
    if (invalidCIN) issues.push(invalidCIN);

    // Check calculations if payroll data available
    if (payrollData) {
      const employeePayroll = payrollData.find((p) => p.employee_id === employee.id);
      if (employeePayroll) {
        const igrIssue = checkIGRCalculation(employee, employeePayroll);
        if (igrIssue) issues.push(igrIssue);

        const cnssIssue = checkCNSSCalculation(employee, employeePayroll);
        if (cnssIssue) issues.push(cnssIssue);
      }
    }
  });

  // Check for salary anomalies
  const salaryAnomalies = checkSalaryAnomalies(employees, payrollData);
  issues.push(...salaryAnomalies);

  // Calculate risk score
  const highSeverity = issues.filter((i) => i.severity === "high").length;
  const mediumSeverity = issues.filter((i) => i.severity === "medium").length;
  const lowSeverity = issues.filter((i) => i.severity === "low").length;

  // Risk score: high = 10 points, medium = 5 points, low = 1 point
  const riskScore = Math.min(100, highSeverity * 10 + mediumSeverity * 5 + lowSeverity * 1);

  return {
    overallRiskScore: riskScore,
    issues,
    summary: {
      high: highSeverity,
      medium: mediumSeverity,
      low: lowSeverity,
    },
    compliant: highSeverity === 0,
  };
}

/**
 * Check compliance for a single employee
 * Français: Vérifier la conformité pour un seul employé
 */
export function checkEmployeeCompliance(
  employee: Record<string, unknown>,
  payroll?: Record<string, unknown>
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  const missingCNSS = checkMissingCNSS(employee);
  if (missingCNSS) issues.push(missingCNSS);

  const invalidCNSS = checkInvalidCNSS(employee);
  if (invalidCNSS) issues.push(invalidCNSS);

  const missingCIN = checkMissingCIN(employee);
  if (missingCIN) issues.push(missingCIN);

  const invalidCIN = checkInvalidCIN(employee);
  if (invalidCIN) issues.push(invalidCIN);

  if (payroll) {
    const igrIssue = checkIGRCalculation(employee, payroll);
    if (igrIssue) issues.push(igrIssue);

    const cnssIssue = checkCNSSCalculation(employee, payroll);
    if (cnssIssue) issues.push(cnssIssue);
  }

  return issues;
}

