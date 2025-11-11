/**
 * Authentication Utilities
 * Centralized auth verification for server actions
 * Français: Utilitaires d'authentification
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabaseServer";
import { logAuditEvent, AuditAction } from "./audit";

/**
 * Verify user authentication and return user
 * Throws redirect if not authenticated
 * Français: Vérifier l'authentification de l'utilisateur et retourner l'utilisateur
 */
export async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    await logAuditEvent({
      action: AuditAction.AUTH_FAILED,
      userId: null,
      details: { error: error?.message || 'No user found' },
    });
    redirect("/fr/login");
  }

  return { user, supabase };
}

/**
 * Verify user authentication and company access
 * Français: Vérifier l'authentification et l'accès à l'entreprise
 */
export async function requireAuthWithCompany() {
  const { user, supabase } = await requireAuth();

  const { data: companies, error: companyError } = await supabase
    .from("companies")
    .select("id, name, user_id")
    .eq("user_id", user.id)
    .limit(1);

  if (companyError) {
    await logAuditEvent({
      action: AuditAction.COMPANY_ACCESS_ERROR,
      userId: user.id,
      details: { error: companyError.message },
    });
    throw new Error(`Erreur de base de données: ${companyError.message}`);
  }

  if (!companies || companies.length === 0) {
    await logAuditEvent({
      action: AuditAction.NO_COMPANY_FOUND,
      userId: user.id,
      details: {},
    });
    redirect("/fr/settings");
  }

  const company = companies[0];

  // Verify user owns the company
  if (company.user_id !== user.id) {
    await logAuditEvent({
      action: AuditAction.UNAUTHORIZED_COMPANY_ACCESS,
      userId: user.id,
      details: { companyId: company.id },
    });
    throw new Error("Accès non autorisé à cette entreprise");
  }

  return { user, supabase, company };
}

/**
 * Verify user can access specific company
 * Français: Vérifier que l'utilisateur peut accéder à une entreprise spécifique
 */
export async function requireCompanyAccess(companyId: string) {
  const { user, supabase } = await requireAuth();

  const { data: company, error } = await supabase
    .from("companies")
    .select("id, name, user_id")
    .eq("id", companyId)
    .eq("user_id", user.id)
    .single();

  if (error || !company) {
    await logAuditEvent({
      action: AuditAction.UNAUTHORIZED_COMPANY_ACCESS,
      userId: user.id,
      details: { companyId, error: error?.message },
    });
    throw new Error("Accès non autorisé à cette entreprise");
  }

  return { user, supabase, company };
}

