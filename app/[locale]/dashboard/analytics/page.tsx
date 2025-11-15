import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getAnalyticsData } from "@/app/actions/analytics";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { t, type Locale } from "@/lib/translations";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = (localeParam || 'fr') as Locale;
  if (!user) redirect(`/${locale}/login`);

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
            {t(locale, "analytics.noCompany")}
          </h2>
          <p className="text-gray-600">
            {t(locale, "analytics.noCompanyDesc")}
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
            {t(locale, "analytics.loadError")}
          </h2>
          <p className="text-gray-600">
            {analyticsResult.error || t(locale, "common.unexpectedError")}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t(locale, "analytics.title")}</h1>
          <p className="text-gray-600 mt-1">
            {t(locale, "analytics.subtitle")} {company.name}
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
