import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { LandingPage } from "@/components/LandingPage";

export default async function HomePage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  } catch (error) {
    // If Supabase is not configured, continue to show landing page
    console.log('Supabase not configured, showing landing page:', error);
  }

  // Always show the French landing page for now
  return <LandingPage />;
}
