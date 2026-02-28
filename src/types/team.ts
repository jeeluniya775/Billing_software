export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';
export type ContractType = 'Full-time' | 'Part-time' | 'Contract';

export interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  departmentName: string;
  email: string;
  phone: string;
  status: EmployeeStatus;
  joinDate: string;
  baseSalary: number;
  reportingManagerId?: string;
  reportingManagerName?: string;
  photoUrl?: string;
  documents?: string[];
  contractType: ContractType;
  performanceScore: number; // 0-100
  tags: string[];
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  description: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  totalWorkHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Annual' | 'Sick' | 'Unpaid' | 'Maternity/Paternity';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface TeamSummary {
  totalEmployees: number;
  activeEmployees: number;
  departmentsCount: number;
  newJoinersMonth: number;
  onLeaveToday: number;
  attendanceRate: number; // percentage
  hiringTrend: { month: string; count: number }[];
  deptDistribution: { name: string; value: number }[];
  attendanceTrend: { day: string; rate: number }[];
  roleDistribution: { role: string; count: number }[];
}

export interface PerformanceMetrics {
  employeeId: string;
  completionRate: number;
  productivityScore: number;
  goals: { title: string; target: number; current: number }[];
  activityTimeline: { date: string; action: string; category: 'Achievement' | 'Warning' | 'Feedback' }[];
}

export interface PayrollPreview {
  employeeId: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  netPay: number;
  currency: string;
}
