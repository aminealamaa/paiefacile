import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { LandingPage } from "@/components/LandingPage";

export default async function HomePage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Only redirect if user exists and no auth error
    if (user && !authError) {
      redirect("/fr/dashboard");
    }
  } catch (error) {
    // If Supabase is not configured or there's an error, continue to show landing page
    console.log('Supabase not configured or error, showing landing page:', error);
  }

  // Always show the French landing page for now
  return <LandingPage />;
}
