import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getLeaveRequests, getApprovedLeavesForCalendar } from "@/app/actions/leave";
import { LeaveManagementTabs } from "@/components/LeaveManagementTabs";
import { t, type Locale } from "@/lib/translations";

interface Employee extends Record<string, unknown> {
  id: string;
  first_name: string;
  last_name: string;
}

interface LeaveRequest extends Record<string, unknown> {
  id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  status: string;
  reason: string;
  created_at: string;
}

export default async function LeavesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeParam } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = localeParam || 'fr';
  if (!user) redirect(`/${locale}/login`);

  // Get company ID first
  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;
  if (!company) redirect(`/${locale}/settings`);

  // Get employees for the company
  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .eq("company_id", company.id)
    .order("last_name", { ascending: true });

  // Get leave requests
  const leaveRequestsResult = await getLeaveRequests();
  const leaveRequests = (leaveRequestsResult.data || []).map((request: Record<string, unknown>) => ({
    ...request,
    employees: Array.isArray(request.employees) ? request.employees[0] : request.employees
  }));

  // Get approved leaves for calendar
  const approvedLeavesResult = await getApprovedLeavesForCalendar();
  const approvedLeaves = (approvedLeavesResult.data || []).map((leave: Record<string, unknown>) => ({
    ...leave,
    employees: Array.isArray(leave.employees) ? leave.employees[0] : leave.employees
  }));

  return (
    <LeavesContent 
      employees={employees || []}
      leaveRequests={leaveRequests}
      approvedLeaves={approvedLeaves}
      locale={locale}
    />
  );
}

function LeavesContent({ 
  employees, 
  leaveRequests, 
  approvedLeaves,
  locale
}: { 
  employees: Record<string, unknown>[]; 
  leaveRequests: Record<string, unknown>[]; 
  approvedLeaves: Record<string, unknown>[];
  locale: Locale;
}) {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t(locale, "leaves.title")}</h1>
        <p className="text-gray-600 mt-2">{t(locale, "leaves.subtitle")}</p>
      </div>

      <LeaveManagementTabs
        employees={employees as Employee[]}
        leaveRequests={leaveRequests as LeaveRequest[]}
        approvedLeaves={approvedLeaves as LeaveRequest[]}
        locale={locale}
      />
    </div>
  );
}
