import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { PayrollForm } from "@/components/PayrollForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

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
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de la Paie</h1>
          <p className="text-gray-600 mt-2">Générez et gérez les bulletins de paie de vos employés</p>
        </div>
        <Link href="/fr/dashboard/ai">
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            Suggestions IA
          </Button>
        </Link>
      </div>
      <PayrollForm employees={employees} company={company} />
    </div>
  );
}
