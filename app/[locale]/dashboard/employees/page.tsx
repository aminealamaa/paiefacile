import { redirect } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";

export default async function EmployeesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();
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

function EmployeesContent({ employees }: { employees: any[] }) {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <AddEmployeeDialog />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('firstName')}</TableHead>
              <TableHead>{t('lastName')}</TableHead>
              <TableHead>{t('position')}</TableHead>
              <TableHead>{t('salary')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.first_name}</TableCell>
                <TableCell>{emp.last_name}</TableCell>
                <TableCell>{emp.job_title}</TableCell>
                <TableCell>{emp.base_salary}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" disabled>
                    {tCommon('edit')}
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
