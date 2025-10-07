import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getAnalyticsData } from "@/app/actions/analytics";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export default async function AnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company for the user
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  if (companyError || !company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune entreprise trouvée
          </h2>
          <p className="text-gray-600">
            Veuillez configurer votre entreprise dans les paramètres pour accéder aux analyses.
          </p>
        </div>
      </div>
    );
  }

  // Get analytics data
  const analyticsResult = await getAnalyticsData(company.id, 12);

  if (!analyticsResult.success) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur lors du chargement
          </h2>
          <p className="text-gray-600">
            {analyticsResult.error || "Une erreur inattendue s'est produite."}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analyses & Rapports</h1>
          <p className="text-gray-600 mt-1">
            Tableau de bord analytique pour {company.name}
          </p>
        </div>
      </div>

      <AnalyticsDashboard 
        companyId={company.id}
        initialData={analyticsResult.data}
      />
    </div>
  );
}
