"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { createAttendanceRecordAction } from "@/app/actions/attendance";
import { t, type Locale } from "@/lib/translations";

interface ClockInOutProps {
  employees: Array<{ id: string; first_name: string; last_name: string }>;
  locale: Locale;
}

export function ClockInOut({ employees, locale }: ClockInOutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    entryTime: "",
    exitTime: "",
    status: "present",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("entryTime", formData.entryTime);
      formDataToSend.append("exitTime", formData.exitTime);
      formDataToSend.append("status", formData.status);

      const result = await createAttendanceRecordAction(formDataToSend);

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Pointage enregistré avec succès" });
        // Reset form but keep selected employee
        setFormData({
          employeeId: formData.employeeId, // Keep selected employee
          date: new Date().toISOString().split("T")[0],
          entryTime: "",
          exitTime: "",
          status: "present",
        });
        // Refresh the page to update attendance records
        router.refresh();
        // Dispatch custom event to refresh AttendanceRecords component
        window.dispatchEvent(new CustomEvent("attendanceRecordSaved", { 
          detail: { employeeId: formData.employeeId, date: formData.date } 
        }));
      } else {
        setMessage({ type: "error", text: result.error || "Erreur lors de l'enregistrement" });
      }
    } catch (err) {
      setMessage({ type: "error", text: t(locale, "common.unexpectedError") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t(locale, "attendance.clockInOut")}
        </CardTitle>
        <CardDescription>
          {t(locale, "attendance.clockInOutDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">{t(locale, "attendance.employee") || t(locale, "employees.title")} *</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t(locale, "attendance.selectEmployee") || t(locale, "employees.selectEmployee") || "Sélectionner un employé"} />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.last_name} {employee.first_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t(locale, "attendance.date")} *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryTime">{t(locale, "attendance.checkIn")}</Label>
              <Input
                id="entryTime"
                type="time"
                value={formData.entryTime}
                onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exitTime">{t(locale, "attendance.checkOut")}</Label>
              <Input
                id="exitTime"
                type="time"
                value={formData.exitTime}
                onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
              />
          </div>
        </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t(locale, "attendance.statusLabel") || t(locale, "attendance.status") || "Statut"} *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">{t(locale, "attendance.status.present")}</SelectItem>
                <SelectItem value="absent">{t(locale, "attendance.status.absent")}</SelectItem>
                <SelectItem value="conge">{t(locale, "attendance.status.conge")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

        {message && (
          <div
            className={`p-3 rounded-md flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t(locale, "common.loading") : t(locale, "attendance.saveAttendance")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
