"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { z } from "zod";

const LeaveRequestSchema = z.object({
  employee_id: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  leave_type: z.enum(["annual", "sick", "unpaid", "other"]),
  reason: z.string().optional().default(""),
});

export async function getLeaveBalance(employeeId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get employee hire date
  const { data: employee } = await supabase
    .from("employees")
    .select("hire_date")
    .eq("id", employeeId)
    .single();

  if (!employee) return { error: "Employee not found" };

  const hireDate = new Date(employee.hire_date);
  const currentDate = new Date();
  
  // Calculate months of employment
  const monthsWorked = Math.max(0, 
    (currentDate.getFullYear() - hireDate.getFullYear()) * 12 + 
    (currentDate.getMonth() - hireDate.getMonth())
  );

  // Calculate total leave earned (1.5 days per month)
  const totalLeaveEarned = monthsWorked * 1.5;

  // Get total approved annual leave taken
  const { data: approvedLeaves } = await supabase
    .from("leave_requests")
    .select("start_date, end_date")
    .eq("employee_id", employeeId)
    .eq("leave_type", "annual")
    .eq("status", "approved");

  let totalDaysTaken = 0;
  if (approvedLeaves) {
    for (const leave of approvedLeaves) {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      totalDaysTaken += daysDiff;
    }
  }

  const availableBalance = Math.max(0, totalLeaveEarned - totalDaysTaken);

  return {
    totalEarned: totalLeaveEarned,
    totalTaken: totalDaysTaken,
    availableBalance: availableBalance,
    monthsWorked: monthsWorked
  };
}

export async function submitLeaveRequest(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = LeaveRequestSchema.safeParse({
    employee_id: formData.get("employee_id")?.toString() ?? "",
    start_date: formData.get("start_date")?.toString() ?? "",
    end_date: formData.get("end_date")?.toString() ?? "",
    leave_type: formData.get("leave_type")?.toString() as "annual" | "sick" | "unpaid" | "other",
    reason: formData.get("reason")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("\n") };
  }

  const { data, error } = await supabase
    .from("leave_requests")
    .insert(parsed.data)
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/leaves");
  return { success: true, data };
}

export async function updateLeaveRequestStatus(requestId: string, newStatus: "approved" | "rejected") {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("leave_requests")
    .update({ status: newStatus })
    .eq("id", requestId)
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/leaves");
  return { success: true, data };
}

export async function getLeaveRequests() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company ID first
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .single();

  if (!company) return { error: "Company not found" };

  // Get all leave requests with employee information
  const { data: leaveRequests, error } = await supabase
    .from("leave_requests")
    .select(`
      id,
      start_date,
      end_date,
      leave_type,
      status,
      reason,
      created_at,
      employees!inner (
        id,
        first_name,
        last_name
      )
    `)
    .eq("employees.company_id", company.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: leaveRequests };
}

export async function getApprovedLeavesForCalendar() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company ID first
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .single();

  if (!company) return { error: "Company not found" };

  // Get only approved leave requests for calendar
  const { data: approvedLeaves, error } = await supabase
    .from("leave_requests")
    .select(`
      id,
      start_date,
      end_date,
      leave_type,
      employees!inner (
        first_name,
        last_name
      )
    `)
    .eq("employees.company_id", company.id)
    .eq("status", "approved")
    .order("start_date", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: approvedLeaves };
}
