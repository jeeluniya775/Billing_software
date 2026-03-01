export type TimesheetStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
export type TimeEntryCategory = 'Development' | 'Design' | 'Meeting' | 'Research' | 'Admin' | 'Support';

export interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  taskId: string;
  taskName: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  duration: number; // in hours
  isBillable: boolean;
  billableRate: number;
  notes: string;
  status: 'In Progress' | 'Completed';
}

export interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string; // Weekly start
  endDate: string;
  totalHours: number;
  billableHours: number;
  status: TimesheetStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface ProjectTimeStats {
  projectId: string;
  projectName: string;
  budgetedHours: number;
  actualHours: number;
  billableHours: number;
  costToDate: number;
  revenueToDate: number;
  utilization: number;
  tasks: {
    id: string;
    name: string;
    hours: number;
    status: 'In Progress' | 'Completed';
  }[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breaks: { start: string; end?: string; type: string }[];
  totalWorkHours: number;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  shiftId: string;
}

export interface TimeSummary {
  totalHoursToday: number;
  totalHoursWeek: number;
  billableHoursWeek: number;
  nonBillableHoursWeek: number;
  overtimeHoursWeek: number;
  productivityScore: number;
  weeklyTrend: { day: string; hours: number; billable: number }[];
  projectDistribution: { project: string; hours: number; color: string }[];
}
