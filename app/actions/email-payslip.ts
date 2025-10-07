"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { sendPayslipEmail, sendBulkPayslipEmails, PayslipEmailData } from "@/lib/email-service";
import { z } from "zod";

const EmailPayslipSchema = z.object({
  employeeId: z.string().min(1),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  employeeEmail: z.string().email(),
  downloadUrl: z.string().optional()
});

const BulkEmailPayslipSchema = z.object({
  payslips: z.array(z.object({
    employeeId: z.string(),
    month: z.coerce.number(),
    year: z.coerce.number(),
    employeeEmail: z.string().email(),
    downloadUrl: z.string().optional()
  }))
});

export async function sendPayslipEmailAction(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const parsed = EmailPayslipSchema.safeParse({
      employeeId: formData.get("employeeId")?.toString(),
      month: formData.get("month")?.toString(),
      year: formData.get("year")?.toString(),
      employeeEmail: formData.get("employeeEmail")?.toString(),
      downloadUrl: formData.get("downloadUrl")?.toString()
    });

    if (!parsed.success) {
      return { error: "Données invalides" };
    }

    const { employeeId, month, year, employeeEmail, downloadUrl } = parsed.data;

    // Get employee and company data
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name")
      .eq("user_id", user.id)
      .limit(1);
    
    if (!companies || companies.length === 0) {
      return { error: "Entreprise non trouvée" };
    }

    const { data: employee } = await supabase
      .from("employees")
      .select("first_name, last_name, base_salary")
      .eq("id", employeeId)
      .eq("company_id", companies[0].id)
      .single();

    if (!employee) {
      return { error: "Employé non trouvé" };
    }

    // Get payroll data (you might want to calculate this or get from existing payroll records)
    const payrollData = {
      employee_name: `${employee.first_name} ${employee.last_name}`,
      employee_email: employeeEmail,
      company_name: companies[0].name,
      month,
      year,
      base_salary: employee.base_salary || 0,
      gross_salary: employee.base_salary || 0, // You might want to calculate this properly
      cnss: 0, // Calculate based on salary
      amo: 0, // Calculate based on salary
      igr: 0, // Calculate based on salary
      net_salary: employee.base_salary || 0, // Calculate properly
      download_url: downloadUrl
    };

    const result = await sendPayslipEmail(payrollData);
    
    if (result.success) {
      return { success: true, messageId: result.messageId };
    } else {
      return { error: result.error || "Erreur lors de l'envoi de l'email" };
    }
    
  } catch (error: unknown) {
    console.error("Error sending payslip email:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inattendue";
    return { error: errorMessage };
  }
}

export async function sendBulkPayslipEmailsAction(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const payslipsData = formData.get("payslips")?.toString();
    if (!payslipsData) {
      return { error: "Aucune donnée de bulletin fournie" };
    }

    const parsedPayslips = JSON.parse(payslipsData);
    const parsed = BulkEmailPayslipSchema.safeParse({ payslips: parsedPayslips });

    if (!parsed.success) {
      return { error: "Format de données invalide" };
    }

    // Get company data
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name")
      .eq("user_id", user.id)
      .limit(1);
    
    if (!companies || companies.length === 0) {
      return { error: "Entreprise non trouvée" };
    }

    // Prepare payslip data for each employee
    const payslips: PayslipEmailData[] = [];
    
    for (const payslip of parsed.data.payslips) {
      const { data: employee } = await supabase
        .from("employees")
        .select("first_name, last_name, base_salary")
        .eq("id", payslip.employeeId)
        .eq("company_id", companies[0].id)
        .single();

      if (employee) {
        payslips.push({
          employee_name: `${employee.first_name} ${employee.last_name}`,
          employee_email: payslip.employeeEmail,
          company_name: companies[0].name,
          month: payslip.month,
          year: payslip.year,
          base_salary: employee.base_salary || 0,
          gross_salary: employee.base_salary || 0,
          cnss: 0, // Calculate properly
          amo: 0, // Calculate properly
          igr: 0, // Calculate properly
          net_salary: employee.base_salary || 0,
          download_url: payslip.downloadUrl
        });
      }
    }

    const result = await sendBulkPayslipEmails(payslips);
    
    return {
      success: true,
      sent: result.success,
      failed: result.failed,
      errors: result.errors
    };
    
  } catch (error: unknown) {
    console.error("Error sending bulk payslip emails:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inattendue";
    return { error: errorMessage };
  }
}
