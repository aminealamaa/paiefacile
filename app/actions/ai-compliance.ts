"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { runComplianceCheck, checkEmployeeCompliance } from "@/lib/ai-compliance-detector";

/**
 * Run full company compliance check
 * Français: Exécuter une vérification complète de conformité de l'entreprise
 */
export async function runComplianceCheckAction() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/fr/login");
    }

    // Get company
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (companyError || !companies) {
      return {
        success: false,
        error: "Entreprise non trouvée. Veuillez configurer votre entreprise dans les paramètres.",
      };
    }

    // Get all employees
    const { data: employees, error: employeesError } = await supabase
      .from("employees")
      .select("*")
      .eq("company_id", companies.id);

    if (employeesError) {
      return {
        success: false,
        error: `Erreur lors de la récupération des employés: ${employeesError.message}`,
      };
    }

    if (!employees || employees.length === 0) {
      return {
        success: true,
        data: {
          overallRiskScore: 0,
          issues: [],
          summary: {
            high: 0,
            medium: 0,
            low: 0,
          },
          compliant: true,
        },
      };
    }

    // Get recent payroll data (last 3 months) for calculation verification
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: payrollRecords } = await supabase
      .from("payroll_records")
      .select("*")
      .eq("company_id", companies.id)
      .gte("created_at", threeMonthsAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(100);

    // Run compliance check
    const report = runComplianceCheck(
      employees as Record<string, unknown>[],
      payrollRecords as Record<string, unknown>[] | undefined
    );

    return {
      success: true,
      data: report,
    };
  } catch (error: unknown) {
    console.error("Error in runComplianceCheckAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Check compliance for a specific employee
 * Français: Vérifier la conformité pour un employé spécifique
 */
export async function checkEmployeeComplianceAction(employeeId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/fr/login");
    }

    // Get employee
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("*")
      .eq("id", employeeId)
      .single();

    if (employeeError || !employee) {
      return {
        success: false,
        error: "Employé non trouvé",
      };
    }

    // Verify employee belongs to user's company
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .eq("id", employee.company_id)
      .single();

    if (!company) {
      return {
        success: false,
        error: "Accès non autorisé",
      };
    }

    // Get recent payroll for this employee
    const { data: payrollRecord } = await supabase
      .from("payroll_records")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Check compliance
    const issues = checkEmployeeCompliance(
      employee as Record<string, unknown>,
      payrollRecord as Record<string, unknown> | undefined
    );

    return {
      success: true,
      data: {
        issues,
        compliant: issues.filter((i) => i.severity === "high").length === 0,
      },
    };
  } catch (error: unknown) {
    console.error("Error in checkEmployeeComplianceAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

