import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ClockInOut } from "@/components/attendance/ClockInOut";
import { AttendanceRecords } from "@/components/attendance/AttendanceRecords";
import { WorkScheduleForm } from "@/components/attendance/WorkScheduleForm";
import { CNSSExport } from "@/components/attendance/CNSSExport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { t, type Locale } from "@/lib/translations";
import { Clock, Calendar, Settings, FileText } from "lucide-react";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = (localeParam || "fr") as Locale;

  if (!user) redirect(`/${locale}/login`);

  // Get company
  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const company = companies?.[0] || null;
  if (!company) redirect(`/${locale}/settings`);

  // Get employees for this company
  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .eq("company_id", company.id)
    .order("last_name", { ascending: true });

  if (!employees || employees.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-8 w-8 text-blue-600" />
            {t(locale, "attendance.title")}
          </h1>
          <p className="text-gray-600 mt-2">{t(locale, "attendance.subtitle")}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">{t(locale, "attendance.noEmployees")}</p>
        </div>
      </div>
    );
  }

  // Get first employee for records/schedule tabs (default selection)
  const defaultEmployee = employees[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          {t(locale, "attendance.title")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t(locale, "attendance.subtitle")}
        </p>
      </div>

      <Tabs defaultValue="clock" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clock" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t(locale, "attendance.clockInOut")}
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t(locale, "attendance.records")}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t(locale, "attendance.workSchedule")}
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t(locale, "attendance.cnssExport")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clock" className="space-y-4">
          <ClockInOut employees={employees} locale={locale} />
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <AttendanceRecords locale={locale} />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <WorkScheduleForm employeeId={defaultEmployee.id} locale={locale} />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <CNSSExport locale={locale} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

