"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportAttendanceCSV, getAttendanceForCNSSExport } from "@/app/actions/attendance-export";
import { Download, FileText } from "lucide-react";
import { t, type Locale } from "@/lib/translations";

interface CNSSExportProps {
  locale: Locale;
}

export function CNSSExport({ locale }: CNSSExportProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [exportData, setExportData] = useState<unknown>(null);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const result = await getAttendanceForCNSSExport(selectedMonth, selectedYear);
      if (result.success && result.data) {
        setExportData(result.data);
      }
    } catch (error) {
      console.error("Error loading export data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await exportAttendanceCSV(selectedMonth, selectedYear);
      if (result.success && result.csv) {
        // Create download link
        const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", result.filename || `presence_cnss_${selectedYear}_${String(selectedMonth).padStart(2, "0")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting:", error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    t(locale, "months.january"),
    t(locale, "months.february"),
    t(locale, "months.march"),
    t(locale, "months.april"),
    t(locale, "months.may"),
    t(locale, "months.june"),
    t(locale, "months.july"),
    t(locale, "months.august"),
    t(locale, "months.september"),
    t(locale, "months.october"),
    t(locale, "months.november"),
    t(locale, "months.december"),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t(locale, "attendance.cnssExport")}
        </CardTitle>
        <CardDescription>{t(locale, "attendance.cnssExportDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t(locale, "attendance.month")}</label>
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {monthNames[month - 1]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t(locale, "attendance.year")}</label>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handlePreview} disabled={loading} variant="outline" className="flex-1">
            {t(locale, "attendance.preview")}
          </Button>
          <Button onClick={handleExport} disabled={loading} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            {t(locale, "attendance.exportCSV")}
          </Button>
        </div>

        {exportData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold mb-2">{t(locale, "attendance.exportPreview")}</h4>
            <pre className="text-xs overflow-auto max-h-64">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

