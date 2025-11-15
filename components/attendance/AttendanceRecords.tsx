"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getEmployeeAttendance, getMonthlyAttendanceSummary, getAllAttendanceRecords } from "@/app/actions/attendance";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { t, type Locale } from "@/lib/translations";

interface AttendanceRecordsProps {
  employeeId?: string; // Make optional - if not provided, show all employees
  locale: Locale;
}

export function AttendanceRecords({ employeeId, locale }: AttendanceRecordsProps) {
  // Track the employee whose records we're currently showing
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | undefined>(employeeId);
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [summary, setSummary] = useState<{
    totalDays: number;
    totalHours: number;
    totalOvertime: number;
    absences: number;
    lateDays: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Update currentEmployeeId when prop changes
  useEffect(() => {
    setCurrentEmployeeId(employeeId);
  }, [employeeId]);

  useEffect(() => {
    loadRecords();
    loadSummary();
  }, [currentEmployeeId, selectedMonth, selectedYear]);

  // Listen for attendance record save events to refresh data
  useEffect(() => {
    const handleAttendanceSave = (event: Event) => {
      const customEvent = event as CustomEvent;
      const savedEmployeeId = customEvent.detail?.employeeId;
      const savedDate = customEvent.detail?.date;
      
      console.log("Attendance record saved event received:", { savedEmployeeId, savedDate, currentEmployeeId });
      
      // Always refresh when a record is saved, but update month/year and employee if needed
      // Check if we need to update the month/year selector to match the saved date
      if (savedDate) {
        const savedDateObj = new Date(savedDate);
        const savedMonth = savedDateObj.getMonth() + 1;
        const savedYear = savedDateObj.getFullYear();
        
        console.log(`Saved date: ${savedDate}, parsed as month ${savedMonth}, year ${savedYear}`);
        console.log(`Current selection: month ${selectedMonth}, year ${selectedYear}`);
        
        // If the saved date is in a different month/year, update the selectors
        // This ensures the new record will be visible
        if (savedMonth !== selectedMonth || savedYear !== selectedYear) {
          console.log(`Updating month/year to ${savedMonth}/${savedYear}`);
          setSelectedMonth(savedMonth);
          setSelectedYear(savedYear);
          // Don't return here - we still need to update the employee if needed
        }
      }
      
      // If a record was saved for a different employee, switch to show that employee's records
      // This ensures the newly saved record is visible
      if (savedEmployeeId && savedEmployeeId !== currentEmployeeId) {
        console.log(`Switching from employee ${currentEmployeeId} to ${savedEmployeeId}`);
        setCurrentEmployeeId(savedEmployeeId);
        // The useEffect with dependencies will trigger loadRecords/loadSummary when currentEmployeeId changes
        return;
      }
      
      // Always refresh to ensure we see new records
      console.log("Refreshing records for current employee");
      loadRecords();
      loadSummary();
    };

    window.addEventListener("attendanceRecordSaved", handleAttendanceSave);
    return () => {
      window.removeEventListener("attendanceRecordSaved", handleAttendanceSave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmployeeId, selectedMonth, selectedYear]); // Include deps so we have access to latest values

  const loadRecords = async () => {
    setLoading(true);
    try {
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
      // Get the last day of the month correctly
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      console.log(`Loading records for ${currentEmployeeId ? `employee ${currentEmployeeId}` : 'all employees'}, month ${selectedMonth}/${selectedYear}, date range: ${startDate} to ${endDate}`);
      
      // If employeeId is provided, get records for that employee, otherwise get all records
      const result = currentEmployeeId 
        ? await getEmployeeAttendance(currentEmployeeId, startDate, endDate)
        : await getAllAttendanceRecords(startDate, endDate);
      
      if (result.success) {
        console.log(`Successfully loaded ${result.data?.length || 0} records`);
        setRecords(result.data as Record<string, unknown>[] || []);
      } else {
        console.error("Error loading records:", result.error);
        setRecords([]);
      }
    } catch (error) {
      console.error("Error loading records:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      // Summary only makes sense for a specific employee, skip if showing all employees
      if (!currentEmployeeId) {
        setSummary(null);
        return;
      }
      const result = await getMonthlyAttendanceSummary(currentEmployeeId, selectedYear, selectedMonth);
      if (result.success && result.data) {
        setSummary(result.data as typeof summary);
      }
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t(locale, "attendance.records")}
        </CardTitle>
        <CardDescription>{t(locale, "attendance.recordsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month/Year Selector */}
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleDateString("fr-FR", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-600">{t(locale, "attendance.totalDays")}</div>
              <div className="text-2xl font-bold text-blue-900">{summary.totalDays}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm text-green-600">{t(locale, "attendance.totalHours")}</div>
              <div className="text-2xl font-bold text-green-900">
                {summary.totalHours.toFixed(1)}h
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-md">
              <div className="text-sm text-orange-600">{t(locale, "attendance.overtime")}</div>
              <div className="text-2xl font-bold text-orange-900">
                {summary.totalOvertime.toFixed(1)}h
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-md">
              <div className="text-sm text-red-600">{t(locale, "attendance.absences")}</div>
              <div className="text-2xl font-bold text-red-900">{summary.absences}</div>
            </div>
          </div>
        )}

        {/* Records Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(locale, "attendance.date")}</TableHead>
                <TableHead>{t(locale, "attendance.employee") || "Employé"}</TableHead>
                <TableHead>{t(locale, "attendance.checkIn")}</TableHead>
                <TableHead>{t(locale, "attendance.checkOut")}</TableHead>
                <TableHead>{t(locale, "attendance.hours")}</TableHead>
                <TableHead>{t(locale, "attendance.statusLabel") || t(locale, "attendance.status") || "Statut"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t(locale, "common.loading")}
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {t(locale, "attendance.noRecords")}
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  // Extract employee name from the record
                  // Supabase returns joined data in different formats, try both
                  const employee = (record as any).employees || (record as any).employee;
                  let employeeName = 'N/A';
                  
                  if (employee) {
                    if (Array.isArray(employee) && employee.length > 0) {
                      employeeName = `${employee[0].last_name || ''} ${employee[0].first_name || ''}`.trim();
                    } else if (typeof employee === 'object') {
                      employeeName = `${employee.last_name || ''} ${employee.first_name || ''}`.trim();
                    }
                  }
                  
                  // Fallback: if no employee data, show employee_id
                  if (employeeName === 'N/A' && record.employee_id) {
                    employeeName = `ID: ${(record.employee_id as string).substring(0, 8)}...`;
                  }
                  
                  return (
                    <TableRow key={record.id as string}>
                      <TableCell>{formatDate(record.date as string)}</TableCell>
                      <TableCell className="font-medium">{employeeName}</TableCell>
                      <TableCell>{formatTime(record.check_in_time as string)}</TableCell>
                      <TableCell>{formatTime(record.check_out_time as string)}</TableCell>
                      <TableCell>
                        {record.total_hours
                          ? `${Number(record.total_hours).toFixed(2)}h`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                                ? "bg-red-100 text-red-800"
                                : record.status === "conge" || record.status === "on_leave"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {t(locale, `attendance.status.${record.status as string}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}




