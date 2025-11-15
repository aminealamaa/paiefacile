"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { calculatePayroll } from "@/app/actions/payroll";
import { getOvertimeHoursFromAttendance } from "@/app/actions/payroll-integration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayslipPDF } from "@/components/PayslipPDF";
import { EmailPayslipDialog } from "@/components/EmailPayslipDialog";
import { trackPayrollGeneration } from "@/components/MetaPixel";
import { t, type Locale } from "@/lib/translations";
import { extractLocaleFromPath } from "@/lib/i18n-utils";
import { Clock } from "lucide-react";

export function PayrollForm({ employees, company, locale: propLocale }: { employees: Record<string, unknown>[]; company: Record<string, unknown>; locale?: Locale }) {
  const pathname = usePathname();
  const locale = propLocale || extractLocaleFromPath(pathname);
  const initialState: Record<string, unknown> = { };
  const [state, formAction] = useActionState(calculatePayroll, initialState);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [overtimeFromAttendance, setOvertimeFromAttendance] = useState<number | null>(null);
  const [loadingOvertime, setLoadingOvertime] = useState(false);

  // Load overtime hours from attendance when employee, month, and year are selected
  useEffect(() => {
    if (selectedEmployeeId && selectedMonth && selectedYear) {
      loadOvertimeFromAttendance();
    } else {
      setOvertimeFromAttendance(null);
    }
  }, [selectedEmployeeId, selectedMonth, selectedYear]);

  const loadOvertimeFromAttendance = async () => {
    if (!selectedEmployeeId || !selectedMonth || !selectedYear) return;
    
    setLoadingOvertime(true);
    try {
      const result = await getOvertimeHoursFromAttendance(
        selectedEmployeeId,
        Number(selectedMonth),
        Number(selectedYear)
      );
      if (result.success && result.data) {
        setOvertimeFromAttendance(result.data.totalOvertimeHours);
      }
    } catch (error) {
      console.error("Error loading overtime:", error);
    } finally {
      setLoadingOvertime(false);
    }
  };

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
            <Label htmlFor="employeeId">{t(locale, "payroll.employee")}</Label>
            <select 
              id="employeeId"
              name="employeeId" 
              className="w-full rounded-md border px-3 py-2" 
              required
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">{t(locale, "payroll.selectEmployee")}</option>
              {employees.map((e) => (
                <option key={e.id as string} value={e.id as string}>
                  {e.last_name as string} {e.first_name as string} {e.job_title ? `- ${e.job_title as string}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">{t(locale, "payroll.month")}</Label>
            <Input 
              id="month"
              type="number" 
              name="month" 
              min="1" 
              max="12" 
              placeholder="1-12"
              required
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">{t(locale, "payroll.year")}</Label>
            <Input 
              id="year"
              type="number" 
              name="year" 
              min="2000" 
              max="2100" 
              placeholder="2024"
              required
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bonuses">{t(locale, "payroll.bonuses")}</Label>
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
            <Label htmlFor="overtimeHours" className="flex items-center gap-2">
              {t(locale, "payroll.overtimeHours")}
              {loadingOvertime && <span className="text-xs text-gray-500">({t(locale, "common.loading")})</span>}
              {overtimeFromAttendance !== null && !loadingOvertime && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t(locale, "payroll.fromAttendance")}: {overtimeFromAttendance.toFixed(2)}h
                </span>
              )}
            </Label>
            <Input 
              id="overtimeHours"
              type="number" 
              step="0.01" 
              min="0" 
              name="overtimeHours" 
              defaultValue={overtimeFromAttendance !== null ? overtimeFromAttendance : 0}
              placeholder={overtimeFromAttendance !== null ? String(overtimeFromAttendance.toFixed(2)) : "0.00"}
            />
            {overtimeFromAttendance !== null && (
              <p className="text-xs text-gray-500">
                {t(locale, "payroll.overtimeAutoLoaded")}
              </p>
            )}
          </div>
        </div>

        <Button type="submit">{t(locale, "payroll.calculatePayroll")}</Button>
      </form>

      {state?.error ? (
        <div className="text-red-600 text-sm">{state.error as string}</div>
      ) : null}

      {state?.result ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t(locale, "payroll.results")}</h2>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(locale, "payroll.label")}</TableHead>
                  <TableHead>{t(locale, "payroll.amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>{t(locale, "payroll.baseSalary")}</TableCell><TableCell>{(state.result as any).base_salary as number}</TableCell></TableRow>
                <TableRow><TableCell>{t(locale, "payroll.bonuses")}</TableCell><TableCell>{(state.result as any).bonuses as number}</TableCell></TableRow>
                <TableRow><TableCell>{t(locale, "payroll.overtimeHours")}</TableCell><TableCell>{(state.result as any).overtimePay as number}</TableCell></TableRow>
                <TableRow><TableCell><strong>{t(locale, "payroll.grossSalary")}</strong></TableCell><TableCell><strong>{(state.result as any).gross_salary as number}</strong></TableCell></TableRow>
                <TableRow><TableCell>CNSS</TableCell><TableCell>-{(state.result as any).cnss as number}</TableCell></TableRow>
                <TableRow><TableCell>AMO</TableCell><TableCell>-{(state.result as any).amo as number}</TableCell></TableRow>
                <TableRow><TableCell>{t(locale, "payroll.netTaxable")}</TableCell><TableCell>{(state.result as any).net_taxable as number}</TableCell></TableRow>
                {((state.result as any).family_deductions as number) > 0 && (
                  <TableRow><TableCell>{t(locale, "payroll.familyDeductions")}</TableCell><TableCell>-{(state.result as any).family_deductions as number}</TableCell></TableRow>
                )}
                <TableRow><TableCell>IGR</TableCell><TableCell>-{(state.result as any).igr as number}</TableCell></TableRow>
                <TableRow><TableCell>{t(locale, "payroll.otherDeductions")}</TableCell><TableCell>-{(state.result as any).other_deductions as number}</TableCell></TableRow>
                <TableRow><TableCell><strong>{t(locale, "payroll.netSalary")}</strong></TableCell><TableCell><strong>{(state.result as any).net_salary as number}</strong></TableCell></TableRow>
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