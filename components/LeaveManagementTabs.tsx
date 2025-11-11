"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  List, 
  Plus, 
  Check, 
  X, 
  Clock,
  User
} from "lucide-react";
import { submitLeaveRequest, updateLeaveRequestStatus } from "@/app/actions/leave";
import { format } from "date-fns";
import { t, type Locale } from "@/lib/translations";
import { extractLocaleFromPath } from "@/lib/i18n-utils";

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
  employees: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface ApprovedLeave {
  id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  employees: {
    first_name: string;
    last_name: string;
  };
}

interface LeaveManagementTabsProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[] | Record<string, unknown>[];
  approvedLeaves: ApprovedLeave[] | Record<string, unknown>[];
  locale?: Locale;
}

export function LeaveManagementTabs({ 
  employees, 
  leaveRequests, 
  approvedLeaves,
  locale: propLocale
}: LeaveManagementTabsProps) {
  const pathname = usePathname();
  const locale = propLocale || extractLocaleFromPath(pathname);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />{t(locale, "leaves.approved")}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />{t(locale, "leaves.rejected")}</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t(locale, "leaves.pending")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case "annual":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "unpaid":
        return "bg-gray-100 text-gray-800";
      case "other":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (requestId: string, status: "approved" | "rejected") => {
    const result = await updateLeaveRequestStatus(requestId, status);
    if (result.success) {
      // Refresh the page to show updated data
      window.location.reload();
    } else {
      alert(result.error || "Failed to update status");
    }
  };

  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="requests" className="flex items-center gap-2">
          <List className="w-4 h-4" />
          {t(locale, "leaves.requestsList")}
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {t(locale, "leaves.teamCalendar")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t(locale, "leaves.leaveRequests")}</h2>
          <RequestLeaveDialog employees={employees} locale={locale} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(locale, "leaves.employee")}</TableHead>
                <TableHead>{t(locale, "leaves.leaveType")}</TableHead>
                <TableHead>{t(locale, "leaves.startDate")}</TableHead>
                <TableHead>{t(locale, "leaves.endDate")}</TableHead>
                <TableHead>{t(locale, "leaves.status")}</TableHead>
                <TableHead>{t(locale, "employees.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => {
                const req = request as LeaveRequest;
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {req.employees?.first_name} {req.employees?.last_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLeaveTypeColor(req.leave_type)}>
                        {req.leave_type === "annual" ? t(locale, "leaves.annualLeave") :
                         req.leave_type === "sick" ? t(locale, "leaves.sickLeave") :
                         req.leave_type === "unpaid" ? t(locale, "leaves.unpaidLeave") :
                         t(locale, "leaves.other")}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(req.start_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(req.end_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>
                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleStatusUpdate(req.id, "approved")}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {t(locale, "leaves.approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleStatusUpdate(req.id, "rejected")}
                          >
                            <X className="w-3 h-3 mr-1" />
                            {t(locale, "leaves.reject")}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="calendar" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t(locale, "leaves.teamCalendar")}</h2>
          <p className="text-sm text-gray-600">{t(locale, "leaves.viewApproved")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">{t(locale, "leaves.upcomingLeaves")}</h3>
            <div className="space-y-2">
              {approvedLeaves
                .filter(leave => new Date((leave as ApprovedLeave).start_date) >= new Date())
                .slice(0, 5)
                .map((leave) => {
                  const approvedLeave = leave as ApprovedLeave;
                  return (
                    <div key={approvedLeave.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {approvedLeave.employees?.first_name} {approvedLeave.employees?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(approvedLeave.start_date), "MMM dd")} - {format(new Date(approvedLeave.end_date), "MMM dd")}
                          </p>
                        </div>
                        <Badge className={getLeaveTypeColor(approvedLeave.leave_type)}>
                          {approvedLeave.leave_type === "annual" ? t(locale, "leaves.annualLeave") :
                           approvedLeave.leave_type === "sick" ? t(locale, "leaves.sickLeave") :
                           approvedLeave.leave_type === "unpaid" ? t(locale, "leaves.unpaidLeave") :
                           t(locale, "leaves.other")}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function RequestLeaveDialog({ employees, locale }: { employees: Employee[]; locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await submitLeaveRequest(formData);
    if (result.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      alert(result.error || t(locale, "leaves.submitError"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t(locale, "leaves.requestLeave")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(locale, "leaves.requestLeave")}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">{t(locale, "leaves.employee")}</Label>
            <Select name="employee_id" required>
              <SelectTrigger>
                <SelectValue placeholder={t(locale, "leaves.selectEmployee")} />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">{t(locale, "leaves.startDate")}</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">{t(locale, "leaves.endDate")}</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave_type">{t(locale, "leaves.leaveType")}</Label>
            <Select name="leave_type" required>
              <SelectTrigger>
                <SelectValue placeholder={t(locale, "leaves.selectLeaveType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">{t(locale, "leaves.annualLeave")}</SelectItem>
                <SelectItem value="sick">{t(locale, "leaves.sickLeave")}</SelectItem>
                <SelectItem value="unpaid">{t(locale, "leaves.unpaidLeave")}</SelectItem>
                <SelectItem value="other">{t(locale, "leaves.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">{t(locale, "leaves.reason")}</Label>
            <Input
              id="reason"
              name="reason"
              placeholder={t(locale, "leaves.enterReason")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t(locale, "common.cancel")}
            </Button>
            <Button type="submit">{t(locale, "leaves.submitRequest")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
