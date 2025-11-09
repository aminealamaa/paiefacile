/**
 * Main AI Service Layer
 * Coordinates between external LLM (OpenAI ChatGPT) and in-house analysis
 * Français: Couche de service IA principale
 */

import { sendChatMessage, askQuestionWithContext, isAIServiceAvailable } from "./ai-chat-service";
import { createSafePayload, validateNoPII } from "./ai-data-anonymizer";
import type { ChatMessage, ChatResponse } from "./ai-chat-service";

/**
 * Call external LLM (OpenAI ChatGPT) with anonymized data
 * Français: Appeler le LLM externe (OpenAI ChatGPT) avec des données anonymisées
 */
export async function callExternalLLM(
  prompt: string,
  contextData?: {
    employees?: Record<string, unknown>[];
    payroll?: Record<string, unknown>[];
    company?: Record<string, unknown>;
  }
): Promise<ChatResponse> {
  if (!isAIServiceAvailable()) {
    return {
      message: "Le service IA n'est pas disponible. Veuillez configurer la clé API OpenAI.",
      error: "SERVICE_UNAVAILABLE",
    };
  }

  // Anonymize data if provided
  let anonymizedContext: unknown = undefined;
  if (contextData) {
    const safePayload = createSafePayload(contextData);
    
    // Validate no PII leaked
    if (!validateNoPII(safePayload)) {
      console.error("PII detected in anonymized data!");
      return {
        message: "Erreur de sécurité: données personnelles détectées.",
        error: "PII_DETECTED",
      };
    }

    anonymizedContext = safePayload;
  }

  return await askQuestionWithContext(prompt, {
    anonymizedData: anonymizedContext,
  });
}

/**
 * Analyze payroll data (in-house processing)
 * Français: Analyser les données de paie (traitement interne)
 */
export async function analyzePayrollData(data: {
  employees: Record<string, unknown>[];
  payroll?: Record<string, unknown>[];
  company?: Record<string, unknown>;
}): Promise<{
  summary: {
    totalEmployees: number;
    totalPayroll: number;
    averageSalary: number;
  };
  insights: string[];
}> {
  const { employees, payroll, company } = data;

  const totalEmployees = employees.length;
  const totalPayroll = payroll
    ? payroll.reduce((sum, p) => sum + (Number(p.gross_salary) || 0), 0)
    : employees.reduce((sum, e) => sum + (Number(e.base_salary) || 0), 0);
  const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

  const insights: string[] = [];

  // Analyze employee data
  const employeesWithoutCNSS = employees.filter((e) => !e.cnss_number || (e.cnss_number as string).trim() === "");
  if (employeesWithoutCNSS.length > 0) {
    insights.push(`${employeesWithoutCNSS.length} employé(s) sans numéro CNSS`);
  }

  const employeesWithoutFamilyInfo = employees.filter(
    (e) => !e.marital_status || e.marital_status === "single"
  );
  if (employeesWithoutFamilyInfo.length < totalEmployees) {
    const withFamilyInfo = totalEmployees - employeesWithoutFamilyInfo.length;
    insights.push(`${withFamilyInfo} employé(s) avec informations familiales déclarées`);
  }

  return {
    summary: {
      totalEmployees,
      totalPayroll,
      averageSalary,
    },
    insights,
  };
}

/**
 * Detect anomalies in payroll data
 * Français: Détecter les anomalies dans les données de paie
 */
export function detectAnomalies(data: {
  employees: Record<string, unknown>[];
  payroll?: Record<string, unknown>[];
}): Array<{
  type: "missing_cnss" | "salary_anomaly" | "missing_family_info" | "tax_calculation";
  severity: "high" | "medium" | "low";
  message: string;
  employeeId?: string;
}> {
  const anomalies: Array<{
    type: "missing_cnss" | "salary_anomaly" | "missing_family_info" | "tax_calculation";
    severity: "high" | "medium" | "low";
    message: string;
    employeeId?: string;
  }> = [];

  // Check for missing CNSS numbers
  data.employees.forEach((employee) => {
    if (!employee.cnss_number || (employee.cnss_number as string).trim() === "") {
      anomalies.push({
        type: "missing_cnss",
        severity: "high",
        message: "Numéro CNSS manquant",
        employeeId: employee.id as string,
      });
    }
  });

  // Check for salary anomalies (unusual changes)
  if (data.payroll && data.payroll.length > 1) {
    const salaries = data.payroll.map((p) => Number(p.gross_salary) || 0);
    const avgSalary = salaries.reduce((sum, s) => sum + s, 0) / salaries.length;
    const threshold = avgSalary * 0.5; // 50% deviation

    salaries.forEach((salary, index) => {
      if (Math.abs(salary - avgSalary) > threshold && salary > 0) {
        anomalies.push({
          type: "salary_anomaly",
          severity: "medium",
          message: `Salaire anormalement ${salary > avgSalary ? "élevé" : "faible"}: ${salary.toFixed(2)} MAD`,
          employeeId: data.payroll?.[index]?.employee_id as string,
        });
      }
    });
  }

  return anomalies;
}

/**
 * Generate optimization suggestions (in-house calculation)
 * Français: Générer des suggestions d'optimisation (calcul interne)
 */
export function generateOptimizationSuggestions(data: {
  employees: Record<string, unknown>[];
}): Array<{
  type: "family_deduction" | "salary_structure" | "tax_bracket";
  priority: "high" | "medium" | "low";
  message: string;
  potentialSavings?: number;
  employeeId?: string;
}> {
  const suggestions: Array<{
    type: "family_deduction" | "salary_structure" | "tax_bracket";
    priority: "high" | "medium" | "low";
    message: string;
    potentialSavings?: number;
    employeeId?: string;
  }> = [];

  data.employees.forEach((employee) => {
    const maritalStatus = (employee.marital_status as string) || "single";
    const childrenCount = Number(employee.children_count) || 0;
    const baseSalary = Number(employee.base_salary) || 0;

    // Check for missing family deductions
    if (maritalStatus === "married" && childrenCount === 0) {
      suggestions.push({
        type: "family_deduction",
        priority: "medium",
        message: "Employé marié sans enfants déclarés - vérifier si des enfants peuvent être déclarés",
        employeeId: employee.id as string,
      });
    }

    // Check if employee is close to next tax bracket
    if (baseSalary > 0) {
      const monthlyNetTaxable = baseSalary * 0.93; // Approx after CNSS+AMO
      const annualNetTaxable = monthlyNetTaxable * 12;

      // Check if close to bracket boundary
      const brackets = [40000, 60000, 80000, 100000, 180000];
      for (const bracket of brackets) {
        if (annualNetTaxable > bracket * 0.9 && annualNetTaxable < bracket) {
          const distance = bracket - annualNetTaxable;
          if (distance < 50000) {
            suggestions.push({
              type: "tax_bracket",
              priority: "low",
              message: `Proche de la tranche d'imposition ${bracket.toLocaleString()} MAD/an`,
              employeeId: employee.id as string,
            });
          }
        }
      }
    }
  });

  return suggestions;
}

