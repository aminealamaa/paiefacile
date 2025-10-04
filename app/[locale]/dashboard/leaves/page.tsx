import { redirect } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getLeaveRequests, getApprovedLeavesForCalendar } from "@/app/actions/leave";
import { LeaveManagementTabs } from "@/components/LeaveManagementTabs";

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

export default async function LeavesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company ID first
  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;
  if (!company) redirect("/dashboard/settings");

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

  const t = await getTranslations('leaves');

  return (
    <LeavesContent 
      employees={employees || []}
      leaveRequests={leaveRequests}
      approvedLeaves={approvedLeaves}
      t={t}
    />
  );
}

function LeavesContent({ 
  employees, 
  leaveRequests, 
  approvedLeaves,
  t
}: { 
  employees: Record<string, unknown>[]; 
  leaveRequests: Record<string, unknown>[]; 
  approvedLeaves: Record<string, unknown>[];
  t: (key: string) => string;
}) {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>

      <LeaveManagementTabs
        employees={employees as Employee[]}
        leaveRequests={leaveRequests as LeaveRequest[]}
        approvedLeaves={approvedLeaves as LeaveRequest[]}
      />
    </div>
  );
}
