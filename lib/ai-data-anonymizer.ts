/**
 * Data Anonymization Service for AI Features
 * Strips PII (Personally Identifiable Information) before sending to external LLM APIs
 * Français: Service d'anonymisation des données pour les fonctionnalités IA
 */

export interface AnonymizedEmployee {
  employee_id: string;
  job_title: string;
  base_salary: number;
  marital_status: string;
  children_count: number;
  contract_type: string;
  hire_date_year: number; // Only year, not full date
}

export interface AnonymizedPayrollData {
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  gross_salary: number;
  net_salary: number;
  cnss_employee: number;
  amo_employee: number;
  igr: number;
  marital_status: string;
  children_count: number;
}

export interface AnonymizedCompanyData {
  employee_count: number;
  total_payroll: number;
  average_salary: number;
  sector?: string; // Optional, not PII
}

/**
 * Anonymize employee data by removing PII
 * Français: Anonymiser les données d'employé en supprimant les informations personnelles
 */
export function anonymizeEmployee(employee: Record<string, unknown>): AnonymizedEmployee {
  const hireDate = employee.hire_date as string | undefined;
  const hireYear = hireDate ? new Date(hireDate).getFullYear() : new Date().getFullYear();

  return {
    employee_id: `EMP_${employee.id as string}`,
    job_title: (employee.job_title as string) || "Non spécifié",
    base_salary: Number(employee.base_salary) || 0,
    marital_status: (employee.marital_status as string) || "single",
    children_count: Number(employee.children_count) || 0,
    contract_type: (employee.contract_type as string) || "CDI",
    hire_date_year: hireYear,
  };
}

/**
 * Anonymize payroll data
 * Français: Anonymiser les données de paie
 */
export function anonymizePayrollData(
  payroll: Record<string, unknown>,
  employee: Record<string, unknown>
): AnonymizedPayrollData {
  return {
    employee_id: `EMP_${employee.id as string}`,
    month: Number(payroll.month) || 1,
    year: Number(payroll.year) || new Date().getFullYear(),
    base_salary: Number(payroll.base_salary) || 0,
    gross_salary: Number(payroll.gross_salary) || 0,
    net_salary: Number(payroll.net_salary) || 0,
    cnss_employee: Number(payroll.cnss) || 0,
    amo_employee: Number(payroll.amo) || 0,
    igr: Number(payroll.igr) || 0,
    marital_status: (employee.marital_status as string) || "single",
    children_count: Number(employee.children_count) || 0,
  };
}

/**
 * Anonymize company data
 * Français: Anonymiser les données d'entreprise
 */
export function anonymizeCompanyData(
  company: Record<string, unknown>,
  employees: Record<string, unknown>[],
  payrollData?: Record<string, unknown>[]
): AnonymizedCompanyData {
  const totalPayroll = payrollData
    ? payrollData.reduce((sum, p) => sum + (Number(p.gross_salary) || 0), 0)
    : employees.reduce((sum, e) => sum + (Number(e.base_salary) || 0), 0);

  const avgSalary = employees.length > 0 ? totalPayroll / employees.length : 0;

  return {
    employee_count: employees.length,
    total_payroll: totalPayroll,
    average_salary: avgSalary,
    sector: (company.sector as string) || undefined,
  };
}

/**
 * Create safe payload for external API
 * Removes all PII: names, CIN numbers, CNSS numbers, emails, phone numbers
 * Français: Créer un payload sécurisé pour l'API externe
 */
export function createSafePayload(data: {
  employees?: Record<string, unknown>[];
  payroll?: Record<string, unknown>[];
  company?: Record<string, unknown>;
}): {
  anonymized_employees: AnonymizedEmployee[];
  anonymized_payroll: AnonymizedPayrollData[];
  anonymized_company: AnonymizedCompanyData | null;
} {
  const anonymizedEmployees = (data.employees || []).map(anonymizeEmployee);

  const anonymizedPayroll = (data.payroll || []).map((p) => {
    const employee = data.employees?.find((e) => e.id === p.employee_id) || {};
    return anonymizePayrollData(p, employee);
  });

  const anonymizedCompany = data.company
    ? anonymizeCompanyData(data.company, data.employees || [], data.payroll)
    : null;

  return {
    anonymized_employees: anonymizedEmployees,
    anonymized_payroll: anonymizedPayroll,
    anonymized_company: anonymizedCompany,
  };
}

/**
 * Validate that no PII is present in data
 * Français: Valider qu'aucune information personnelle n'est présente
 */
export function validateNoPII(data: unknown): boolean {
  if (typeof data !== "object" || data === null) {
    return true;
  }

  const piiFields = [
    "first_name",
    "last_name",
    "name",
    "cin_number",
    "cnss_number",
    "email",
    "phone",
    "address",
    "cin",
    "matricule",
  ];

  const dataObj = data as Record<string, unknown>;

  for (const [key, value] of Object.entries(dataObj)) {
    const lowerKey = key.toLowerCase();
    
    // Check if key contains PII
    if (piiFields.some((field) => lowerKey.includes(field))) {
      return false;
    }

    // Recursively check nested objects
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if (!validateNoPII(value)) {
        return false;
      }
    }

    // Check array elements
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "object" && item !== null) {
          if (!validateNoPII(item)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

