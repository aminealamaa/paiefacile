"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function updateDemoRequestStatus(id: string, status: string) {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase
      .from('demo_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating demo request status:', error);
      return { success: false, error: "Erreur lors de la mise à jour" };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating demo request status:', error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
