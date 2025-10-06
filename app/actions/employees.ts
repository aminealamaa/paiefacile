"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { z } from "zod";

const EmployeeSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  cin_number: z.string().optional().default(""),
  cnss_number: z.string().optional().default(""),
  hire_date: z.string().optional().default(""), // yyyy-MM-dd
  contract_type: z.enum(["CDI", "CDD", "ANAPEC"]),
  base_salary: z.coerce.number().min(0),
  job_title: z.string().optional().default(""),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]).optional().default("single"),
  children_count: z.coerce.number().min(0).max(6).optional().default(0)
});

export async function addEmployeeAction(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const parsed = EmployeeSchema.safeParse({
      first_name: formData.get("first_name")?.toString() ?? "",
      last_name: formData.get("last_name")?.toString() ?? "",
      cin_number: formData.get("cin_number")?.toString() ?? "",
      cnss_number: formData.get("cnss_number")?.toString() ?? "",
      hire_date: formData.get("hire_date")?.toString() ?? "",
      contract_type: formData.get("contract_type")?.toString() as "CDI" | "CDD" | "ANAPEC",
      base_salary: formData.get("base_salary")?.toString() ?? "0",
      job_title: formData.get("job_title")?.toString() ?? "",
      marital_status: formData.get("marital_status")?.toString() ?? "single",
      children_count: formData.get("children_count")?.toString() ?? "0",
    });
    
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return { error: parsed.error.flatten().formErrors.join("\n") };
    }

    // Français: Vérifier et récupérer l'entreprise de l'utilisateur
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .select("id, name")
      .eq("user_id", user.id)
      .limit(1);
    
    if (companyError) {
      console.error("Company query error:", companyError);
      return { error: `Erreur de base de données: ${companyError.message}` };
    }
    
    if (!companies || companies.length === 0) {
      console.error("No company found for user:", user.id);
      return { 
        error: "Aucune entreprise trouvée. Veuillez d'abord compléter la configuration de votre entreprise dans les Paramètres.",
        redirectTo: "/settings"
      };
    }
    
    const company = companies[0];
    console.log("Creating employee for company:", company.name, "ID:", company.id);

    // Préparer les données de l'employé
    const payload: Record<string, unknown> = { 
      ...parsed.data, 
      company_id: company.id 
    };
    
    if (payload.hire_date && payload.hire_date !== "") {
      payload.hire_date = new Date(payload.hire_date as string).toISOString();
    } else {
      payload.hire_date = new Date().toISOString(); // Date d'aujourd'hui par défaut
    }

    console.log("Employee payload:", payload);

    // Insérer l'employé
    const { data: newEmployee, error: insertError } = await supabase
      .from("employees")
      .insert(payload)
      .select()
      .single();
    
    if (insertError) {
      console.error("Employee insert error:", insertError);
      return { error: `Erreur lors de la création de l'employé: ${insertError.message}` };
    }

    console.log("Employee created successfully:", newEmployee);
    revalidatePath("/dashboard/employees");
    return { success: true, employee: newEmployee };
    
  } catch (error: unknown) {
    console.error("Unexpected error in addEmployeeAction:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inattendue";
    return { error: `Erreur inattendue: ${errorMessage}` };
  }
}
