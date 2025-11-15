"use server";

import { requireAuthWithCompany } from "@/lib/auth-utils";

/**
 * Get attendance data for CNSS export
 * Format compatible with CNSS declaration requirements
 * Français: Obtenir les données de présence pour l'export CNSS
 */
export async function getAttendanceForCNSSExport(
  month: number,
  year: number
) {
  try {
    const { supabase, company } = await requireAuthWithCompany();

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    // Get the last day of the month correctly
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    // Get all employees for the company
    const { data: employees, error: employeesError } = await supabase
      .from("employees")
      .select("id, first_name, last_name, cnss_number, cin_number")
      .eq("company_id", company.id);

    if (employeesError) {
      return {
        success: false,
        error: `Erreur lors de la récupération des employés: ${employeesError.message}`,
      };
    }

    // Get attendance records for the month
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("company_id", company.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (attendanceError) {
      return {
        success: false,
        error: `Erreur lors de la récupération des présences: ${attendanceError.message}`,
      };
    }

    // Format data for CNSS export
    const companyData = company as Record<string, unknown>;
    const exportData = {
      company: {
        name: company.name,
        cnss_affiliation_number: companyData.cnss_affiliation_number || companyData.cnss_number || "",
        ice: companyData.ice || "",
      },
      period: {
        month,
        year,
        startDate,
        endDate,
      },
      employees: (employees || []).map((employee) => {
        const employeeRecords = (attendanceRecords || []).filter(
          (r) => r.employee_id === employee.id
        );

        const totalDays = employeeRecords.length;
        const totalHours = employeeRecords.reduce(
          (sum, r) => sum + (Number(r.total_hours) || 0),
          0
        );
        const totalOvertime = employeeRecords.reduce(
          (sum, r) => sum + (Number(r.overtime_hours) || 0),
          0
        );
        const absences = employeeRecords.filter(
          (r) => r.status === "absent"
        ).length;

        return {
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          cnss_number: employee.cnss_number || "",
          cin_number: employee.cin_number || "",
          totalDays,
          totalHours: totalHours.toFixed(2),
          totalOvertime: totalOvertime.toFixed(2),
          absences,
          records: employeeRecords.map((r) => ({
            date: r.date,
            checkIn: r.check_in_time
              ? new Date(r.check_in_time as string).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            checkOut: r.check_out_time
              ? new Date(r.check_out_time as string).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            hours: Number(r.total_hours || 0).toFixed(2),
            status: r.status,
          })),
        };
      }),
    };

    return {
      success: true,
      data: exportData,
    };
  } catch (error: unknown) {
    console.error("Error in getAttendanceForCNSSExport:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

/**
 * Export attendance data as CSV for CNSS
 * Français: Exporter les données de présence en CSV pour la CNSS
 */
export async function exportAttendanceCSV(month: number, year: number) {
  try {
    const result = await getAttendanceForCNSSExport(month, year);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || "Erreur lors de l'export",
      };
    }

    const { data } = result;
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    // CSV Header
    let csv = `Export CNSS - Présence ${monthNames[month - 1]} ${year}\n`;
    csv += `Entreprise: ${data.company.name}\n`;
    csv += `Numéro CNSS: ${data.company.cnss_affiliation_number || "N/A"}\n`;
    csv += `ICE: ${data.company.ice || "N/A"}\n`;
    csv += `Période: ${data.period.startDate} au ${data.period.endDate}\n\n`;

    // CSV Data
    csv += "Nom,Prénom,Numéro CNSS,CIN,Jours travaillés,Heures totales,Heures sup.,Absences\n";

    data.employees.forEach((emp) => {
      const [firstName, ...lastNameParts] = emp.name.split(" ");
      const lastName = lastNameParts.join(" ");
      csv += `${lastName},${firstName},${emp.cnss_number},${emp.cin_number},${emp.totalDays},${emp.totalHours},${emp.totalOvertime},${emp.absences}\n`;
    });

    return {
      success: true,
      csv,
      filename: `presence_cnss_${year}_${String(month).padStart(2, "0")}.csv`,
    };
  } catch (error: unknown) {
    console.error("Error in exportAttendanceCSV:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}





