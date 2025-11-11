import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { PayrollForm } from "@/components/PayrollForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { t, type Locale } from "@/lib/translations";

export default async function PayrollPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeParam } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = localeParam || 'fr';
  if (!user) redirect(`/${locale}/login`);

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, rc_number, if_number, cnss_affiliation_number, ice, patente, address")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;
  if (!company) redirect(`/${locale}/settings`);

  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name, job_title")
    .eq("company_id", company.id)
    .order("last_name", { ascending: true });

  return (
    <PayrollContent employees={employees || []} company={company} locale={locale} />
  );
}

function PayrollContent({ employees, company, locale }: { employees: Record<string, unknown>[]; company: Record<string, unknown>; locale: Locale }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t(locale, "payroll.title")}</h1>
          <p className="text-gray-600 mt-2">{t(locale, "payroll.subtitle")}</p>
        </div>
        <Link href={`/${locale}/dashboard/ai`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            {t(locale, "payroll.aiSuggestions")}
          </Button>
        </Link>
      </div>
      <PayrollForm employees={employees} company={company} locale={locale} />
    </div>
  );
}
