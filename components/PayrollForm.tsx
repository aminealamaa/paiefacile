"use client";

import { useActionState } from "react";
import { useTranslations } from 'next-intl';
import { calculatePayroll } from "@/app/actions/payroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayslipDownload } from "@/components/PayslipDownload";

export function PayrollForm({ employees, company }: { employees: Record<string, unknown>[]; company: Record<string, unknown> }) {
  const t = useTranslations('payroll');
  const tCommon = useTranslations('common');
  const initialState: Record<string, unknown> = { };
  const [state, formAction] = useActionState(calculatePayroll, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">{t('employee')}</Label>
            <select 
              id="employeeId"
              name="employeeId" 
              className="w-full rounded-md border px-3 py-2" 
              required
            >
              <option value="">Sélectionner un employé</option>
              {employees.map((e) => (
                <option key={e.id as string} value={e.id as string}>
                  {e.last_name} {e.first_name} {e.job_title ? `- ${e.job_title}` : ""}
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
            <Label htmlFor="bonuses">{t('bonuses')}</Label>
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
            <Label htmlFor="overtimeHours">{t('overtimeHours')}</Label>
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

        <Button type="submit">{t('calculatePayroll')}</Button>
      </form>

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}

      {state?.result && (
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
                <TableRow><TableCell>{t('baseSalary')}</TableCell><TableCell>{state.result.base_salary}</TableCell></TableRow>
                <TableRow><TableCell>{t('bonuses')}</TableCell><TableCell>{state.result.bonuses}</TableCell></TableRow>
                <TableRow><TableCell>Heures supplémentaires</TableCell><TableCell>{state.result.overtimePay}</TableCell></TableRow>
                <TableRow><TableCell><strong>{t('grossSalary')}</strong></TableCell><TableCell><strong>{state.result.gross_salary}</strong></TableCell></TableRow>
                <TableRow><TableCell>CNSS</TableCell><TableCell>-{state.result.cnss}</TableCell></TableRow>
                <TableRow><TableCell>AMO</TableCell><TableCell>-{state.result.amo}</TableCell></TableRow>
                <TableRow><TableCell>Net imposable</TableCell><TableCell>{state.result.net_taxable}</TableCell></TableRow>
                {state.result.family_deductions > 0 && (
                  <TableRow><TableCell>Abattements familiaux</TableCell><TableCell>-{state.result.family_deductions}</TableCell></TableRow>
                )}
                <TableRow><TableCell>IGR</TableCell><TableCell>-{state.result.igr}</TableCell></TableRow>
                <TableRow><TableCell>Autres déductions</TableCell><TableCell>-{state.result.other_deductions}</TableCell></TableRow>
                <TableRow><TableCell><strong>{t('netSalary')}</strong></TableCell><TableCell><strong>{state.result.net_salary}</strong></TableCell></TableRow>
              </TableBody>
            </Table>
          </div>

          <PayslipDownload company={company} result={state.result} />
        </div>
      )}
    </div>
  );
}
