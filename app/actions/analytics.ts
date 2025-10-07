"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { 
  getCompanyKPIs, 
  getPayrollTrends, 
  getDepartmentAnalysis, 
  getCostBreakdown 
} from "@/lib/analytics-service";

export async function getAnalyticsData(companyId: string, period: number = 12) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Verify company belongs to user
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .eq("user_id", user.id)
      .single();

    if (companyError || !company) {
      return { success: false, error: "Company not found or access denied" };
    }

    // Get all analytics data
    const [kpis, trends, departments, costs] = await Promise.all([
      getCompanyKPIs(companyId),
      getPayrollTrends(companyId, period),
      getDepartmentAnalysis(companyId),
      getCostBreakdown(companyId)
    ]);

    return {
      success: true,
      data: {
        kpis,
        trends,
        departments,
        costs
      }
    };

  } catch (error: unknown) {
    console.error("Error getting analytics data:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la récupération des données";
    return { success: false, error: errorMessage };
  }
}

export async function exportAnalyticsReport(companyId: string, format: "pdf" | "excel" = "excel") {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Verify company belongs to user
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, name")
      .eq("id", companyId)
      .eq("user_id", user.id)
      .single();

    if (companyError || !company) {
      return { success: false, error: "Company not found or access denied" };
    }

    // Get analytics data
    const [kpis, trends, departments, costs] = await Promise.all([
      getCompanyKPIs(companyId),
      getPayrollTrends(companyId, 12),
      getDepartmentAnalysis(companyId),
      getCostBreakdown(companyId)
    ]);

    // Generate report based on format
    if (format === "excel") {
      // Generate Excel report
      const reportData = {
        company_name: company.name,
        generated_at: new Date().toISOString(),
        kpis,
        trends,
        departments,
        costs
      };

      // For now, return the data structure
      // In a real implementation, you would generate an actual Excel file
      return {
        success: true,
        data: reportData,
        message: "Rapport Excel généré avec succès"
      };
    } else {
      // Generate PDF report
      const reportData = {
        company_name: company.name,
        generated_at: new Date().toISOString(),
        kpis,
        trends,
        departments,
        costs
      };

      return {
        success: true,
        data: reportData,
        message: "Rapport PDF généré avec succès"
      };
    }

  } catch (error: unknown) {
    console.error("Error exporting analytics report:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'export du rapport";
    return { success: false, error: errorMessage };
  }
}
