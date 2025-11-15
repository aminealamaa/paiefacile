"use server";

import { revalidatePath } from "next/cache";
import { requireAuthWithCompany } from "@/lib/auth-utils";
import { logAuditEvent, AuditAction, ResourceType } from "@/lib/audit";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Calculate total hours from check-in and check-out times
 * Formula: (date de sortie) - (date d'entrée)
 * Handles next-day shifts (when exit time is before entry time)
 * Français: Calculer le total d'heures à partir des heures d'entrée et de sortie
 */
function calculateTotalHours(
  checkInTime: string | null,
  checkOutTime: string | null,
  date: string
): number {
  if (!checkInTime || !checkOutTime) {
    return 0;
  }

  try {
    const entry = new Date(checkInTime);
    const exit = new Date(checkOutTime);
    
    // Calculate difference: (date de sortie) - (date d'entrée)
    let diffMs = exit.getTime() - entry.getTime();
    
    // If the difference is negative, it means exit time is before entry time on the same date
    // This typically means exit is on the next day (night shift)
    // Example: entry at 10:37, exit at 04:37 -> exit is next day at 04:37
    if (diffMs < 0) {
      // Add 24 hours (86400000 ms) to handle next-day shifts
      diffMs = diffMs + (24 * 60 * 60 * 1000);
    }
    
    const hours = diffMs / (1000 * 60 * 60);
    
    // Round to 2 decimal places for precision
    const roundedHours = Math.round(hours * 100) / 100;
    
    console.log("Calculating hours:", {
      checkInTime,
      checkOutTime,
      entryDate: entry.toISOString(),
      exitDate: exit.toISOString(),
      diffMs,
      hours: roundedHours.toFixed(2)
    });
    
    return Math.max(0, roundedHours);
  } catch (error) {
    console.error("Error calculating total hours:", error, { checkInTime, checkOutTime });
    return 0;
  }
}

/**
 * Recalculate and update total_hours for a record if needed
 * Always recalculates if both check-in and check-out times are present
 * Français: Recalculer et mettre à jour total_hours pour un enregistrement si nécessaire
 */
async function recalculateHoursIfNeeded(
  supabase: SupabaseClient,
  record: Record<string, unknown>
): Promise<void> {
  const checkInTime = record.check_in_time as string | null;
  const checkOutTime = record.check_out_time as string | null;
  const date = record.date as string;

  // Always recalculate if both times are present
  if (checkInTime && checkOutTime) {
    const calculatedHours = calculateTotalHours(checkInTime, checkOutTime, date);
    
    // Update if calculated hours differ from stored hours (or if stored hours is 0)
    const currentTotalHours = Number(record.total_hours) || 0;
    if (Math.abs(calculatedHours - currentTotalHours) > 0.01) {
      // Update the record in the database
      await supabase
        .from("attendance_records")
        .update({ total_hours: calculatedHours })
        .eq("id", record.id);
      
      // Update the record object for immediate use
      record.total_hours = calculatedHours;
    }
  }
}

/**
 * Calculate weekly overtime hours
 * Moroccan law: >44 hours/week is overtime
 * Français: Calculer les heures supplémentaires hebdomadaires
 */
async function calculateWeeklyOvertime(
  supabase: SupabaseClient,
  employeeId: string,
  currentDate: string,
  todayHours: number
): Promise<number> {
  try {
    // Get start of week (Monday)
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toISOString().split("T")[0];

    // Get all attendance records for this week
    const { data: weekRecords, error } = await supabase
      .from("attendance_records")
      .select("total_hours, date")
      .eq("employee_id", employeeId)
      .gte("date", weekStart)
      .lte("date", currentDate)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error calculating weekly overtime:", error);
      return 0;
    }

    // Calculate total hours for the week (including today)
    const totalWeekHours = (weekRecords || []).reduce((sum, record) => {
      return sum + (Number(record.total_hours) || 0);
    }, 0);

    // Moroccan law: 44 hours/week is the limit, anything above is overtime
    const weeklyOvertime = Math.max(0, totalWeekHours - 44);

    return weeklyOvertime;
  } catch (error) {
    console.error("Error in calculateWeeklyOvertime:", error);
    return 0;
  }
}

/**
 * Clock in for an employee
 * Français: Pointage d'entrée pour un employé
 */
export async function clockInAction(employeeId: string) {
  try {
    const { user, supabase, company } = await requireAuthWithCompany();

    // Verify employee belongs to company
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .eq("id", employeeId)
      .eq("company_id", company.id)
      .single();

    if (employeeError || !employee) {
      return {
        success: false,
        error: "Employé non trouvé ou non autorisé",
      };
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if attendance record already exists for today
    const { data: existingRecord, error: checkError } = await supabase
      .from("attendance_records")
      .select("id, check_in_time, check_out_time")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is fine
      return {
        success: false,
        error: `Erreur lors de la vérification: ${checkError.message}`,
      };
    }

    if (existingRecord?.check_in_time) {
      return {
        success: false,
        error: "Vous avez déjà pointé aujourd'hui",
      };
    }

    const now = new Date().toISOString();

    // Create or update attendance record
    const { data: attendanceRecord, error: recordError } = await supabase
      .from("attendance_records")
      .upsert({
        employee_id: employeeId,
        company_id: company.id,
        date: today,
        check_in_time: now,
        status: "present",
        is_late: false, // Will be calculated based on work schedule
        late_minutes: 0,
      })
      .select()
      .single();

    if (recordError || !attendanceRecord) {
      return {
        success: false,
        error: `Erreur lors du pointage: ${recordError?.message || "Erreur inconnue"}`,
      };
    }

    // Create check-in event
    const { error: checkInError } = await supabase
      .from("attendance_check_ins")
      .insert({
        attendance_record_id: attendanceRecord.id,
        check_type: "in",
        timestamp: now,
      });

    if (checkInError) {
      console.error("Error creating check-in event:", checkInError);
    }

    // Log audit event
    await logAuditEvent({
      action: AuditAction.DATA_ACCESS,
      userId: user.id,
      resourceType: ResourceType.EMPLOYEE,
      resourceId: employeeId,
      details: {
        action: "clock_in",
        date: today,
        time: now,
      },
    });

    revalidatePath("/dashboard/attendance");
    return {
      success: true,
      message: "Pointage d'entrée enregistré avec succès",
      data: attendanceRecord,
    };
  } catch (error: unknown) {
    console.error("Error in clockInAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Clock out for an employee
 * Français: Pointage de sortie pour un employé
 */
export async function clockOutAction(employeeId: string) {
  try {
    const { user, supabase, company } = await requireAuthWithCompany();

    // Verify employee belongs to company
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .eq("id", employeeId)
      .eq("company_id", company.id)
      .single();

    if (employeeError || !employee) {
      return {
        success: false,
        error: "Employé non trouvé ou non autorisé",
      };
    }

    const today = new Date().toISOString().split("T")[0];

    // Get existing attendance record for today
    const { data: attendanceRecord, error: recordError } = await supabase
      .from("attendance_records")
      .select("id, check_in_time, check_out_time")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (recordError || !attendanceRecord) {
      return {
        success: false,
        error: "Aucun pointage d'entrée trouvé pour aujourd'hui",
      };
    }

    if (attendanceRecord.check_out_time) {
      return {
        success: false,
        error: "Vous avez déjà pointé la sortie aujourd'hui",
      };
    }

    const now = new Date().toISOString();
    const checkInTime = new Date(attendanceRecord.check_in_time);
    const checkOutTime = new Date(now);

    // Calculate total hours (excluding breaks)
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Get work schedule to calculate expected hours and overtime
    const { data: workSchedule } = await supabase
      .from("work_schedules")
      .select("daily_hours, break_duration")
      .eq("employee_id", employeeId)
      .single();

    const breakDuration = workSchedule?.break_duration || 0;
    const breakHours = breakDuration / 60;
    const totalHours = Math.max(0, diffHours - breakHours);
    const expectedHours = workSchedule?.daily_hours || 8;
    
    // Calculate daily overtime (>8h/day) and weekly overtime (>44h/week)
    const dailyOvertime = Math.max(0, totalHours - 8); // Moroccan law: >8h/day is overtime
    const weeklyOvertime = await calculateWeeklyOvertime(supabase, employeeId, today, totalHours);
    
    // Use the maximum of daily or weekly overtime calculation
    const overtimeHours = Math.max(dailyOvertime, weeklyOvertime);

    // Update attendance record
    const { data: updatedRecord, error: updateError } = await supabase
      .from("attendance_records")
      .update({
        check_out_time: now,
        total_hours: totalHours,
        overtime_hours: overtimeHours,
        break_duration: breakDuration,
      })
      .eq("id", attendanceRecord.id)
      .select()
      .single();

    if (updateError || !updatedRecord) {
      return {
        success: false,
        error: `Erreur lors du pointage: ${updateError?.message || "Erreur inconnue"}`,
      };
    }

    // Create check-out event
    const { error: checkOutError } = await supabase
      .from("attendance_check_ins")
      .insert({
        attendance_record_id: attendanceRecord.id,
        check_type: "out",
        timestamp: now,
      });

    if (checkOutError) {
      console.error("Error creating check-out event:", checkOutError);
    }

    // Log audit event
    await logAuditEvent({
      action: AuditAction.DATA_ACCESS,
      userId: user.id,
      resourceType: ResourceType.EMPLOYEE,
      resourceId: employeeId,
      details: {
        action: "clock_out",
        date: today,
        time: now,
        total_hours: totalHours,
        overtime_hours: overtimeHours,
      },
    });

    revalidatePath("/dashboard/attendance");
    return {
      success: true,
      message: "Pointage de sortie enregistré avec succès",
      data: updatedRecord,
    };
  } catch (error: unknown) {
    console.error("Error in clockOutAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Get attendance records for an employee
 * Français: Obtenir les enregistrements de présence pour un employé
 */
export async function getEmployeeAttendance(
  employeeId: string,
  startDate?: string,
  endDate?: string
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

    // Get records
    let query = supabase
      .from("attendance_records")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("company_id", company.id)
      .order("date", { ascending: false });

    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error("Error fetching attendance records:", error);
      console.error("Query details:", { employeeId, startDate, endDate, companyId: company.id });
      return {
        success: false,
        error: error.message,
      };
    }

    // Get employee information
    const { data: employeeInfo, error: employeeInfoError } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .eq("id", employeeId)
      .single();

    if (employeeInfoError) {
      console.error("Error fetching employee info:", employeeInfoError);
    }

    // Enrich records with employee information and recalculate hours if needed
    const enrichedRecords = await Promise.all(
      (records || []).map(async (record) => {
        // Recalculate hours if needed
        await recalculateHoursIfNeeded(supabase, record);
        return {
          ...record,
          employees: employeeInfo || null,
        };
      })
    );

    console.log(`Found ${enrichedRecords?.length || 0} attendance records for employee ${employeeId} between ${startDate} and ${endDate}`);
    if (enrichedRecords && enrichedRecords.length > 0) {
      console.log("Sample records:", enrichedRecords.slice(0, 3).map(r => ({ id: r.id, date: r.date, status: r.status })));
    }

    return {
      success: true,
      data: enrichedRecords || [],
    };
  } catch (error: unknown) {
    console.error("Error in getEmployeeAttendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Get all attendance records for a company with employee names
 * Français: Obtenir tous les enregistrements de présence pour une entreprise avec les noms des employés
 */
export async function getAllAttendanceRecords(
  startDate?: string,
  endDate?: string
) {
  try {
    const { supabase, company } = await requireAuthWithCompany();

    // Get all records
    let query = supabase
      .from("attendance_records")
      .select("*")
      .eq("company_id", company.id)
      .order("date", { ascending: false });

    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error("Error fetching all attendance records:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get all unique employee IDs from records
    const employeeIds = [...new Set((records || []).map(r => r.employee_id))];
    
    // Fetch employee information
    const { data: employees, error: employeesError } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .in("id", employeeIds);

    if (employeesError) {
      console.error("Error fetching employees:", employeesError);
    }

    // Create a map of employee_id to employee info
    const employeeMap = new Map();
    (employees || []).forEach(emp => {
      employeeMap.set(emp.id, emp);
    });

    // Enrich records with employee information and recalculate hours if needed
    const enrichedRecords = await Promise.all(
      (records || []).map(async (record) => {
        // Recalculate hours if needed
        await recalculateHoursIfNeeded(supabase, record);
        return {
          ...record,
          employees: employeeMap.get(record.employee_id) || null,
        };
      })
    );

    return {
      success: true,
      data: enrichedRecords,
    };
  } catch (error: unknown) {
    console.error("Error in getAllAttendanceRecords:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Get monthly attendance summary
 * Français: Obtenir le résumé mensuel de présence
 */
export async function getMonthlyAttendanceSummary(
  employeeId: string,
  year: number,
  month: number
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

    const { data: records, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("company_id", company.id) // Ensure we only get records for this company
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Calculate summary
    const summary = {
      totalDays: records?.length || 0,
      totalHours: records?.reduce((sum, r) => sum + (Number(r.total_hours) || 0), 0) || 0,
      totalOvertime: records?.reduce((sum, r) => sum + (Number(r.overtime_hours) || 0), 0) || 0,
      absences: records?.filter((r) => r.status === "absent").length || 0,
      lateDays: records?.filter((r) => r.is_late).length || 0,
      records: records || [],
    };

    return {
      success: true,
      data: summary,
    };
  } catch (error: unknown) {
    console.error("Error in getMonthlyAttendanceSummary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Get today's attendance status for an employee
 * Français: Obtenir le statut de présence d'aujourd'hui pour un employé
 */
export async function getTodayAttendance(employeeId: string) {
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

    const today = new Date().toISOString().split("T")[0];

    const { data: record, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (error && error.code !== "PGRST116") {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: record || null,
    };
  } catch (error: unknown) {
    console.error("Error in getTodayAttendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Create or update attendance record manually
 * Français: Créer ou mettre à jour un enregistrement de présence manuellement
 */
export async function createAttendanceRecordAction(formData: FormData) {
  try {
    const { user, supabase, company } = await requireAuthWithCompany();

    const employeeId = formData.get("employeeId") as string;
    const date = formData.get("date") as string;
    const entryTime = formData.get("entryTime") as string;
    const exitTime = formData.get("exitTime") as string;
    const status = formData.get("status") as string;

    if (!employeeId || !date || !status) {
      return {
        success: false,
        error: "Veuillez remplir tous les champs obligatoires",
      };
    }

    // Verify employee belongs to company
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .eq("id", employeeId)
      .eq("company_id", company.id)
      .single();

    if (employeeError || !employee) {
      return {
        success: false,
        error: "Employé non trouvé ou non autorisé",
      };
    }

    // Convert entry and exit times to timestamps if provided
    let check_in_time: string | null = null;
    let check_out_time: string | null = null;
    let total_hours = 0;

    if (entryTime) {
      check_in_time = `${date}T${entryTime}:00`;
    }

    if (exitTime) {
      check_out_time = `${date}T${exitTime}:00`;
    }

    // Always calculate total hours if both times are provided
    if (check_in_time && check_out_time) {
      total_hours = calculateTotalHours(check_in_time, check_out_time, date);
    } else if (check_in_time && !check_out_time && status === "present") {
      // If only entry time is provided and status is present, set hours to 0
      // This will be updated when exit time is added
      total_hours = 0;
    } else if (!check_in_time && check_out_time) {
      // If only exit time is provided, we can't calculate hours
      total_hours = 0;
    }

    // Status can be: 'present', 'absent', 'conge', 'late', 'early_leave', 'on_leave'
    const dbStatus = status;

    // Create or update attendance record
    // Use upsert with explicit conflict resolution on employee_id and date
    const { data: attendanceRecord, error: recordError } = await supabase
      .from("attendance_records")
      .upsert(
        {
          employee_id: employeeId,
          company_id: company.id,
          date: date,
          check_in_time: check_in_time,
          check_out_time: check_out_time,
          status: dbStatus,
          total_hours: total_hours,
          is_late: false,
          is_early_leave: false,
          late_minutes: 0,
          early_leave_minutes: 0,
        },
        {
          onConflict: "employee_id,date",
        }
      )
      .select()
      .single();

    if (recordError) {
      console.error("Error saving attendance record:", recordError);
      return {
        success: false,
        error: `Erreur lors de l'enregistrement: ${recordError.message}`,
      };
    }

    if (!attendanceRecord) {
      console.error("No attendance record returned after upsert");
      return {
        success: false,
        error: "Erreur: aucun enregistrement retourné après la sauvegarde",
      };
    }

    console.log("Attendance record saved successfully:", {
      id: attendanceRecord.id,
      employee_id: attendanceRecord.employee_id,
      date: attendanceRecord.date,
      status: attendanceRecord.status,
    });

    // Log audit event
    await logAuditEvent({
      action: AuditAction.DATA_ACCESS,
      userId: user.id,
      resourceType: ResourceType.EMPLOYEE,
      resourceId: employeeId,
      details: {
        action: "manual_attendance_entry",
        date: date,
        status: status,
      },
    });

    revalidatePath("/dashboard/attendance");
    return {
      success: true,
      message: "Pointage enregistré avec succès",
      data: attendanceRecord,
    };
  } catch (error: unknown) {
    console.error("Error in createAttendanceRecordAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

