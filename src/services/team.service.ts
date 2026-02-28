import { Employee, Department, TeamSummary, AttendanceRecord, LeaveRequest, PerformanceMetrics, PayrollPreview } from '@/types/team';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS, MOCK_TEAM_SUMMARY, MOCK_LEAVE_REQUESTS, MOCK_PERFORMANCE, MOCK_PAYROLL } from '@/lib/mock-team';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/team/analytics
export async function getTeamSummary(): Promise<TeamSummary> {
  await delay();
  return MOCK_TEAM_SUMMARY;
}

// GET /api/employees
export async function getEmployees(filters?: any): Promise<Employee[]> {
  await delay(800);
  let employees = [...MOCK_EMPLOYEES];
  if (filters?.dept) employees = employees.filter(e => e.departmentId === filters.dept);
  if (filters?.status) employees = employees.filter(e => e.status === filters.status);
  return employees;
}

// POST /api/employees
export async function createEmployee(data: Partial<Employee>): Promise<Employee> {
  await delay(1000);
  const newEmp: Employee = {
    ...MOCK_EMPLOYEES[0],
    ...data,
    id: `EMP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
  } as Employee;
  console.log('API POST /api/employees', newEmp);
  return newEmp;
}

// PUT /api/employees/:id
export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  await delay(800);
  console.log(`API PUT /api/employees/${id}`, data);
  return { ...MOCK_EMPLOYEES[0], ...data, id };
}

// DELETE /api/employees/:id
export async function deleteEmployee(id: string): Promise<boolean> {
  await delay(500);
  console.log(`API DELETE /api/employees/${id}`);
  return true;
}

// GET /api/departments
export async function getDepartments(): Promise<Department[]> {
  await delay();
  return MOCK_DEPARTMENTS;
}

// GET /api/leaves
export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  await delay();
  return MOCK_LEAVE_REQUESTS;
}

// GET /api/performance/:employeeId
export async function getPerformanceMetrics(employeeId: string): Promise<PerformanceMetrics> {
  await delay();
  return MOCK_PERFORMANCE;
}

// GET /api/payroll-preview/:employeeId
export async function getPayrollPreview(employeeId: string): Promise<PayrollPreview> {
  await delay();
  return MOCK_PAYROLL;
}

// POST /api/attendance
export async function markAttendance(data: any): Promise<boolean> {
  await delay(500);
  console.log('API POST /api/attendance', data);
  return true;
}
