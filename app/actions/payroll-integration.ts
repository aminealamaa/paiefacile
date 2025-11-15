"use server";

import { requireAuthWithCompany } from "@/lib/auth-utils";

/**
 * Get overtime hours from attendance records for payroll calculation
 * Français: Obtenir les heures supplémentaires depuis les enregistrements de présence
 */
export async function getOvertimeHoursFromAttendance(
  employeeId: string,
  month: number,
  year: number
) {
  try {
    const { supabase, company } = await requireAuthWithCompany();

    // Verify employee belongs to company
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id")
      .eq("id", employeeId)
      .eq("company_id", company.id)
      .single();

    if (employeeError || !employee) {
      return {
        success: false,
        error: "Employé non trouvé ou non autorisé",
      };
    }

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    // Get the last day of the month correctly
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    // Get attendance records for the month
    const { data: records, error } = await supabase
      .from("attendance_records")
      .select("overtime_hours, total_hours, date")
      .eq("employee_id", employeeId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Calculate total overtime for the month
    const totalOvertime = (records || []).reduce(
      (sum, r) => sum + (Number(r.overtime_hours) || 0),
      0
    );

    // Calculate total hours for the month
    const totalHours = (records || []).reduce(
      (sum, r) => sum + (Number(r.total_hours) || 0),
      0
    );

    // Calculate days worked
    const daysWorked = records?.length || 0;

    return {
      success: true,
      data: {
        totalOvertimeHours: totalOvertime,
        totalHours: totalHours,
        daysWorked,
        records: records || [],
      },
    };
  } catch (error: unknown) {
    console.error("Error in getOvertimeHoursFromAttendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}





