import { redirect } from "next/navigation";
import { useTranslations } from 'next-intl';
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getLeaveRequests, getApprovedLeavesForCalendar } from "@/app/actions/leave";
import { LeaveManagementTabs } from "@/components/LeaveManagementTabs";

export default async function LeavesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company ID first
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();
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

  return (
    <LeavesContent 
      employees={employees || []}
      leaveRequests={leaveRequests}
      approvedLeaves={approvedLeaves}
    />
  );
}

function LeavesContent({ 
  employees, 
  leaveRequests, 
  approvedLeaves 
}: { 
  employees: any[]; 
  leaveRequests: any[]; 
  approvedLeaves: any[];
}) {
  const t = useTranslations('leaves');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>

      <LeaveManagementTabs 
        employees={employees}
        leaveRequests={leaveRequests}
        approvedLeaves={approvedLeaves}
      />
    </div>
  );
}
