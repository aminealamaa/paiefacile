"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
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

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
}

interface LeaveRequest {
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
}

export function LeaveManagementTabs({ 
  employees, 
  leaveRequests, 
  approvedLeaves 
}: LeaveManagementTabsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const t = useTranslations('leaves');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />{t('approved')}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />{t('rejected')}</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t('pending')}</Badge>;
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
          {t('requestsList')}
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {t('teamCalendar')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Leave Requests</h2>
          <RequestLeaveDialog employees={employees} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                        {req.leave_type}
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
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleStatusUpdate(req.id, "rejected")}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
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
          <h2 className="text-xl font-semibold">Team Calendar</h2>
          <p className="text-sm text-gray-600">View approved leave requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Upcoming Leaves</h3>
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
                          {approvedLeave.leave_type}
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

function RequestLeaveDialog({ employees }: { employees: Employee[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await submitLeaveRequest(formData);
    if (result.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      alert(result.error || "Failed to submit leave request");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee</Label>
            <Select name="employee_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
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
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave_type">Leave Type</Label>
            <Select name="leave_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              name="reason"
              placeholder="Enter reason for leave"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
