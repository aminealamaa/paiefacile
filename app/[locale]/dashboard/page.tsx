import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Link} from "@/lib/navigation";
import { Users, Calculator, CalendarDays, Settings } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company ID first
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;

  let employeeCount = 0;
  if (company) {
    const { count } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id);
    employeeCount = count || 0;
  }

  const t = await getTranslations('dashboard');
  const tNav = await getTranslations('navigation');

  return (
    <DashboardContent 
      companyName={company?.name || "Votre entreprise"} 
      employeeCount={employeeCount}
      t={t}
      tNav={tNav}
    />
  );
}

function DashboardContent({ 
  companyName, 
  employeeCount,
  t,
  tNav
}: { 
  companyName: string; 
  employeeCount: number;
  t: (key: string) => string;
  tNav: (key: string) => string;
}) {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('welcome')}, {companyName}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalEmployees')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">
              Employés actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('nextPayrollRun')}
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31 Oct</div>
            <p className="text-xs text-muted-foreground">
              Prochaine paie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('companyStatus')}
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Actif</div>
            <p className="text-xs text-muted-foreground">
              Statut de l&apos;entreprise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('payrollProcessing')}
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">En cours</div>
            <p className="text-xs text-muted-foreground">
              Traitement automatique
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/employees">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>{tNav('employees')}</span>
            </Button>
          </Link>
          
          <Link href="/dashboard/payroll">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Calculator className="h-6 w-6" />
              <span>{tNav('payroll')}</span>
            </Button>
          </Link>
          
          <Link href="/dashboard/leaves">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <CalendarDays className="h-6 w-6" />
              <span>{tNav('leaves')}</span>
            </Button>
          </Link>
          
          <Link href="/dashboard/settings">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>{tNav('settings')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
