import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";

export default async function EmployeesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;
  if (!company) redirect("/dashboard/settings");

  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name, job_title, base_salary")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return (
    <EmployeesContent employees={employees || []} />
  );
}

function EmployeesContent({ 
  employees
}: { 
  employees: Record<string, unknown>[];
}) {

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
          <p className="text-gray-600 mt-2">Gérez les informations de vos employés</p>
        </div>
        <AddEmployeeDialog />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Salaire</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id as string}>
                <TableCell>{emp.first_name as string}</TableCell>
                <TableCell>{emp.last_name as string}</TableCell>
                <TableCell>{emp.job_title as string}</TableCell>
                <TableCell>{emp.base_salary as number} MAD</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" disabled>
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
