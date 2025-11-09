"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { sendChatMessage, askQuestionWithContext } from "@/lib/ai-chat-service";
import { createSafePayload } from "@/lib/ai-data-anonymizer";
import type { ChatMessage } from "@/lib/ai-chat-service";

/**
 * Ask AI a question (chat interface)
 * Français: Poser une question à l'IA (interface de chat)
 */
export async function askAIQuestion(
  question: string,
  conversationHistory: ChatMessage[] = [],
  includeCompanyData: boolean = false
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/fr/login");
    }

    // If user wants to include company data, fetch and anonymize it
    let contextData: {
      employees?: Record<string, unknown>[];
      company?: Record<string, unknown>;
    } | undefined = undefined;

    if (includeCompanyData) {
      // Get company - don't select sector if it doesn't exist
      const { data: companies, error: companyError } = await supabase
        .from("companies")
        .select("id, name")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (companyError) {
        console.error("Error fetching company:", companyError);
      }

      // Get employees (anonymized) - only if company exists
      let employees = null;
      let employeeError = null;
      
      if (companies?.id) {
        const result = await supabase
          .from("employees")
          .select("id, job_title, base_salary, marital_status, children_count, contract_type")
          .eq("company_id", companies.id);
        
        employees = result.data;
        employeeError = result.error;
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn("⚠️ No company ID found, skipping employee fetch");
        }
      }

      if (employeeError) {
        console.error("Error fetching employees:", employeeError);
      }

      // Always set contextData if company exists, even if no employees
      if (companies) {
        contextData = {
          employees: (employees || []) as Record<string, unknown>[],
          company: companies as Record<string, unknown>,
        };
        
        // Debug logging
        if (process.env.NODE_ENV === "development") {
          console.log("📋 Fetched company data:", {
            companyId: companies.id,
            companyName: companies.name,
            employeeCount: employees?.length || 0,
            hasEmployees: (employees?.length || 0) > 0,
            employees: employees ? employees.length : 0,
          });
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn("⚠️ No company found for user:", user.id);
        }
      }
    }

    // Send message to AI
    if (contextData) {
      const safePayload = createSafePayload(contextData);
      
      // Debug: Verify payload structure
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Safe payload created:", {
          hasCompany: !!safePayload.anonymized_company,
          hasEmployees: !!safePayload.anonymized_employees,
          employeeCount: safePayload.anonymized_company?.employee_count || safePayload.anonymized_employees?.length || 0,
          payloadKeys: Object.keys(safePayload),
        });
      }
      
      return await askQuestionWithContext(question, {
        anonymizedData: safePayload,
        conversationHistory: conversationHistory,
      });
    } else {
      // Debug: Log why contextData is not set
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ contextData is undefined - falling back to sendChatMessage without company data");
        console.warn("  includeCompanyData:", includeCompanyData);
      }
      return await sendChatMessage(question, conversationHistory);
    }
  } catch (error: unknown) {
    console.error("Error in askAIQuestion:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);
    }
    
    return {
      message: `Erreur lors de l'envoi de votre question: ${error instanceof Error ? error.message : "Erreur inconnue"}. Veuillez réessayer ou vérifier les logs du serveur.`,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

