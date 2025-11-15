"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { saveWorkScheduleAction, getWorkSchedule } from "@/app/actions/work-schedule";
import { Clock, Save } from "lucide-react";
import { t, type Locale } from "@/lib/translations";

interface WorkScheduleFormProps {
  employeeId: string;
  locale: Locale;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 7, label: "Dimanche" },
];

export function WorkScheduleForm({ employeeId, locale }: WorkScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [scheduleType, setScheduleType] = useState<string>("full_time");
  const [dailyHours, setDailyHours] = useState<string>("8");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [breakDuration, setBreakDuration] = useState<string>("60");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWorkSchedule(employeeId);
      if (result.success && result.data) {
        const schedule = result.data;
        setScheduleType(schedule.schedule_type || "full_time");
        setDailyHours(String(schedule.daily_hours || 8));
        setStartTime(schedule.start_time || "09:00");
        setEndTime(schedule.end_time || "17:00");
        setBreakDuration(String(schedule.break_duration || 60));
        setDaysOfWeek((schedule.days_of_week as number[]) || [1, 2, 3, 4, 5]);
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.set("employeeId", employeeId);
      formData.set("scheduleType", scheduleType);
      formData.set("dailyHours", dailyHours);
      formData.set("startTime", startTime);
      formData.set("endTime", endTime);
      formData.set("breakDuration", breakDuration);
      formData.set("daysOfWeek", daysOfWeek.join(","));

      const result = await saveWorkScheduleAction(formData);

      if (result.success) {
        setMessage({ type: "success", text: result.message || t(locale, "attendance.scheduleSaved") });
      } else {
        setMessage({ type: "error", text: result.error || t(locale, "attendance.scheduleError") });
      }
    } catch (err) {
      setMessage({ type: "error", text: t(locale, "common.unexpectedError") });
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>{t(locale, "common.loading")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t(locale, "attendance.workSchedule")}
        </CardTitle>
        <CardDescription>{t(locale, "attendance.workScheduleDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleType">{t(locale, "attendance.scheduleType")}</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">{t(locale, "attendance.fullTime")}</SelectItem>
                  <SelectItem value="part_time">{t(locale, "attendance.partTime")}</SelectItem>
                  <SelectItem value="flexible">{t(locale, "attendance.flexible")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyHours">{t(locale, "attendance.dailyHours")}</Label>
              <Input
                id="dailyHours"
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">{t(locale, "attendance.startTime")}</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">{t(locale, "attendance.endTime")}</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakDuration">{t(locale, "attendance.breakDuration")} (minutes)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="0"
                max="480"
                value={breakDuration}
                onChange={(e) => setBreakDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t(locale, "attendance.workDays")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={daysOfWeek.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  />
                  <label
                    htmlFor={`day-${day.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? t(locale, "common.saving") : t(locale, "common.save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}





