import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Calculator, CalendarDays, Settings } from "lucide-react";
import { CNSSDeclarationDialog } from "@/components/CNSSDeclarationDialog";
import { AIInsightsCard } from "@/components/ai/AIInsightsCard";

export default async function DashboardPage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/fr/login");

    // Get company ID first
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .select("id, name")
      .eq("user_id", user.id)
      .limit(1);
    
    if (companyError) {
      console.error("Error fetching company:", companyError);
    }
    
    const company = companies?.[0] || null;

    let employeeCount = 0;
    if (company) {
      const { count, error: employeeError } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("company_id", company.id);
      
      if (employeeError) {
        console.error("Error fetching employee count:", employeeError);
      } else {
        employeeCount = count || 0;
      }
    }

    return (
      <DashboardContent 
        companyName={company?.name || "Votre entreprise"} 
        employeeCount={employeeCount}
      />
    );
  } catch (error) {
    console.error("Error in DashboardPage:", error);
    // Return a fallback UI instead of crashing
    return (
      <DashboardContent 
        companyName="Votre entreprise" 
        employeeCount={0}
      />
    );
  }
}

function DashboardContent({ 
  companyName, 
  employeeCount
}: { 
  companyName: string; 
  employeeCount: number;
}) {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue, {companyName}
        </p>
      </div>

      {/* Summary Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employés
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
              Prochaine Paie
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
              Statut Entreprise
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
              Traitement Paie
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

      {/* AI Insights Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightsCard />
      </div>

      {/* Quick Actions - Mobile Optimized */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Actions Rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link href="/fr/dashboard/employees">
            <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium">Employés</span>
            </Button>
          </Link>
          
          <Link href="/fr/dashboard/payroll">
            <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3">
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium">Paie</span>
            </Button>
          </Link>
          
          <Link href="/fr/dashboard/leaves">
            <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3">
              <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium">Congés</span>
            </Button>
          </Link>
          
          <Link href="/fr/dashboard/settings">
            <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium">Paramètres</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* CNSS Declaration Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Déclarations CNSS</h2>
        <div className="flex justify-center">
          <CNSSDeclarationDialog />
        </div>
      </div>
    </div>
  );
}
