"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useActionState, useEffect } from "react";
import { calculatePayroll } from "@/app/actions/payroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayslipPDF } from "@/components/PayslipPDF";
import { EmailPayslipDialog } from "@/components/EmailPayslipDialog";
import { trackPayrollGeneration } from "@/components/MetaPixel";

export function PayrollForm({ employees, company }: { employees: Record<string, unknown>[]; company: Record<string, unknown> }) {
  const initialState: Record<string, unknown> = { };
  const [state, formAction] = useActionState(calculatePayroll, initialState);

  // Track payroll generation when result is available
  useEffect(() => {
    if (state?.result) {
      trackPayrollGeneration({
        employeeId: (state.result as any).employeeId,
        employeeName: (state.result as any).employee_name,
        grossSalary: (state.result as any).gross_salary,
        netSalary: (state.result as any).net_salary,
        month: (state.result as any).month,
        year: (state.result as any).year
      });
    }
  }, [state?.result]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé</Label>
            <select 
              id="employeeId"
              name="employeeId" 
              className="w-full rounded-md border px-3 py-2" 
              required
            >
              <option value="">Sélectionner un employé</option>
              {employees.map((e) => (
                <option key={e.id as string} value={e.id as string}>
                  {e.last_name as string} {e.first_name as string} {e.job_title ? `- ${e.job_title as string}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">Mois</Label>
            <Input 
              id="month"
              type="number" 
              name="month" 
              min="1" 
              max="12" 
              placeholder="1-12"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input 
              id="year"
              type="number" 
              name="year" 
              min="2000" 
              max="2100" 
              placeholder="2024"
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bonuses">Prime</Label>
            <Input 
              id="bonuses"
              type="number" 
              step="0.01" 
              min="0" 
              name="bonuses" 
              defaultValue={0} 
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overtimeHours">Heures supplémentaires</Label>
            <Input 
              id="overtimeHours"
              type="number" 
              step="0.01" 
              min="0" 
              name="overtimeHours" 
              defaultValue={0} 
              placeholder="0.00"
            />
          </div>
        </div>

        <Button type="submit">Calculer la paie</Button>
      </form>

      {state?.error ? (
        <div className="text-red-600 text-sm">{state.error as string}</div>
      ) : null}

      {state?.result ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Résultats</h2>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Montant (MAD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Salaire de base</TableCell><TableCell>{(state.result as any).base_salary as number}</TableCell></TableRow>
                <TableRow><TableCell>Prime</TableCell><TableCell>{(state.result as any).bonuses as number}</TableCell></TableRow>
                <TableRow><TableCell>Heures supplémentaires</TableCell><TableCell>{(state.result as any).overtimePay as number}</TableCell></TableRow>
                <TableRow><TableCell><strong>Salaire brut</strong></TableCell><TableCell><strong>{(state.result as any).gross_salary as number}</strong></TableCell></TableRow>
                <TableRow><TableCell>CNSS</TableCell><TableCell>-{(state.result as any).cnss as number}</TableCell></TableRow>
                <TableRow><TableCell>AMO</TableCell><TableCell>-{(state.result as any).amo as number}</TableCell></TableRow>
                <TableRow><TableCell>Net imposable</TableCell><TableCell>{(state.result as any).net_taxable as number}</TableCell></TableRow>
                {((state.result as any).family_deductions as number) > 0 && (
                  <TableRow><TableCell>Abattements familiaux</TableCell><TableCell>-{(state.result as any).family_deductions as number}</TableCell></TableRow>
                )}
                <TableRow><TableCell>IGR</TableCell><TableCell>-{(state.result as any).igr as number}</TableCell></TableRow>
                <TableRow><TableCell>Autres déductions</TableCell><TableCell>-{(state.result as any).other_deductions as number}</TableCell></TableRow>
                <TableRow><TableCell><strong>Salaire net</strong></TableCell><TableCell><strong>{(state.result as any).net_salary as number}</strong></TableCell></TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap gap-3">
            <PayslipPDF company={company} result={state.result as any} />
            <EmailPayslipDialog 
              employeeId={(state.result as any).employeeId as string}
              employeeName={(state.result as any).employee_name as string}
              month={(state.result as any).month as number}
              year={(state.result as any).year as number}
              payrollData={{
                base_salary: (state.result as any).base_salary as number,
                gross_salary: (state.result as any).gross_salary as number,
                cnss: (state.result as any).cnss as number,
                amo: (state.result as any).amo as number,
                igr: (state.result as any).igr as number,
                net_salary: (state.result as any).net_salary as number,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}