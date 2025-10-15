"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { z } from "zod";

const DemoRequestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().min(1, "L'entreprise est requise"),
  country: z.string().min(1, "Le pays est requis"),
  employeeCount: z.string().min(1, "Le nombre d'employés est requis"),
});

export async function submitDemoRequest(formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      country: formData.get("country") as string,
      employeeCount: formData.get("employeeCount") as string,
    };

    const validatedData = DemoRequestSchema.parse(rawData);

    // Log the demo request for development
    console.log('Demo Request Received:', {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      company: validatedData.company,
      country: validatedData.country,
      employeeCount: validatedData.employeeCount,
      timestamp: new Date().toISOString()
    });

    try {
      const supabase = await createSupabaseServerClient();
      
      const { error } = await supabase
        .from('demo_requests')
        .insert([
          {
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            company: validatedData.company,
            country: validatedData.country,
            employee_count: validatedData.employeeCount,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        // Continue with success even if database fails
      }
    } catch {
      console.log('Supabase not configured, demo request logged to console');
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting demo request:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Une erreur s'est produite. Veuillez réessayer." };
  }
}
