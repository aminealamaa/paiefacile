import { redirect } from "next/navigation";
import { useTranslations } from 'next-intl';
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { PayrollForm } from "@/components/PayrollForm";

export default async function PayrollPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, rc_number, if_number, cnss_affiliation_number, ice, patente, address")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;
  if (!company) redirect("/dashboard/settings");

  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name, job_title")
    .eq("company_id", company.id)
    .order("last_name", { ascending: true });

  return (
    <PayrollContent employees={employees || []} company={company} />
  );
}

function PayrollContent({ employees, company }: { employees: Record<string, unknown>[]; company: Record<string, unknown> }) {
  const t = useTranslations('payroll');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>
      <PayrollForm employees={employees} company={company} />
    </div>
  );
}
