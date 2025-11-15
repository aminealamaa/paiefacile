"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { analyzeCompanyOptimization, getEmployeeOptimizationSuggestions } from "@/lib/ai-optimization-engine";

/**
 * Analyze company for optimization opportunities
 * Français: Analyser l'entreprise pour les opportunités d'optimisation
 */
export async function analyzeCompanyOptimizationAction() {
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
      .limit(1);

    const company = companies?.[0];
    if (companyError || !company) {
      return {
        success: false,
        error: "Entreprise non trouvée. Veuillez configurer votre entreprise dans les paramètres.",
      };
    }

    // Get all employees
    const { data: employees, error: employeesError } = await supabase
      .from("employees")
      .select("*")
      .eq("company_id", company.id);

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
          totalPotentialSavings: 0,
          opportunities: [],
          summary: {
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0,
          },
        },
      };
    }

    // Analyze optimization opportunities
    const analysis = analyzeCompanyOptimization(employees as Record<string, unknown>[]);

    return {
      success: true,
      data: analysis,
    };
  } catch (error: unknown) {
    console.error("Error in analyzeCompanyOptimizationAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Get optimization suggestions for a specific employee
 * Français: Obtenir les suggestions d'optimisation pour un employé spécifique
 */
export async function getEmployeeOptimizationAction(employeeId: string) {
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

    // Get optimization suggestions
    const suggestions = getEmployeeOptimizationSuggestions(employee as Record<string, unknown>);

    return {
      success: true,
      data: suggestions,
    };
  } catch (error: unknown) {
    console.error("Error in getEmployeeOptimizationAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

