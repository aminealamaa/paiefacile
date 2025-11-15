"use server";

import { revalidatePath } from "next/cache";
import { requireAuthWithCompany } from "@/lib/auth-utils";
import { z } from "zod";

const WorkScheduleSchema = z.object({
  employeeId: z.string().min(1),
  scheduleType: z.enum(["full_time", "part_time", "flexible"]).default("full_time"),
  dailyHours: z.coerce.number().min(1).max(24).default(8),
  startTime: z.string().optional(), // HH:MM format
  endTime: z.string().optional(), // HH:MM format
  breakDuration: z.coerce.number().min(0).max(480).default(0), // in minutes
  daysOfWeek: z.array(z.number().min(1).max(7)).default([1, 2, 3, 4, 5]), // 1=Monday, 7=Sunday
});

/**
 * Create or update work schedule for an employee
 * Français: Créer ou mettre à jour l'horaire de travail d'un employé
 */
export async function saveWorkScheduleAction(formData: FormData) {
  try {
    const { supabase, company } = await requireAuthWithCompany();

    const parsed = WorkScheduleSchema.safeParse({
      employeeId: formData.get("employeeId")?.toString() ?? "",
      scheduleType: formData.get("scheduleType")?.toString() ?? "full_time",
      dailyHours: formData.get("dailyHours")?.toString() ?? "8",
      startTime: formData.get("startTime")?.toString() ?? "",
      endTime: formData.get("endTime")?.toString() ?? "",
      breakDuration: formData.get("breakDuration")?.toString() ?? "0",
      daysOfWeek: formData.get("daysOfWeek")?.toString()?.split(",").map(Number) ?? [1, 2, 3, 4, 5],
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.flatten().formErrors.join("\n"),
      };
    }

    const { employeeId, scheduleType, dailyHours, startTime, endTime, breakDuration, daysOfWeek } = parsed.data;

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

    // Upsert work schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from("work_schedules")
      .upsert({
        employee_id: employeeId,
        schedule_type: scheduleType,
        daily_hours: dailyHours,
        start_time: startTime || null,
        end_time: endTime || null,
        break_duration: breakDuration,
        days_of_week: daysOfWeek,
      })
      .select()
      .single();

    if (scheduleError || !schedule) {
      return {
        success: false,
        error: `Erreur lors de l'enregistrement: ${scheduleError?.message || "Erreur inconnue"}`,
      };
    }

    revalidatePath("/dashboard/attendance");
    return {
      success: true,
      message: "Horaire de travail enregistré avec succès",
      data: schedule,
    };
  } catch (error: unknown) {
    console.error("Error in saveWorkScheduleAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Get work schedule for an employee
 * Français: Obtenir l'horaire de travail d'un employé
 */
export async function getWorkSchedule(employeeId: string) {
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

    const { data: schedule, error } = await supabase
      .from("work_schedules")
      .select("*")
      .eq("employee_id", employeeId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: schedule || null,
    };
  } catch (error: unknown) {
    console.error("Error in getWorkSchedule:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}





