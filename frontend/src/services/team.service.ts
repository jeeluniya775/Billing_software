import { api } from './api';
import { Employee, Department, TeamSummary, AttendanceRecord, LeaveRequest, PerformanceMetrics, PayrollPreview } from '@/types/team';

// GET /hr/analytics (Note: Need to implement in backend or mock for now)
export async function getTeamSummary(): Promise<TeamSummary> {
  try {
    const response = await api.get('/hr/analytics');
    return response.data;
  } catch (err) {
    // Fallback if not implemented
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      departmentsCount: 0,
      newJoinersMonth: 0,
      onLeaveToday: 0,
      attendanceRate: 0,
      hiringTrend: [],
      deptDistribution: [],
      attendanceTrend: [],
      roleDistribution: [],
    };
  }
}

// GET /hr/employees
export async function getEmployees(filters?: any): Promise<Employee[]> {
  const response = await api.get('/hr/employees', { params: filters });
  return response.data.map((e: any) => ({
    ...e,
    name: `${e.firstName} ${e.lastName}`,
    role: e.jobTitle,
    // Map status if needed (e.g. all-caps to Title Case if UI expects it)
    status: e.status === 'ACTIVE' ? 'Active' : e.status === 'ON_LEAVE' ? 'On Leave' : 'Inactive',
  }));
}

// POST /hr/employees
export async function createEmployee(data: any): Promise<Employee> {
  const response = await api.post('/hr/employees', data);
  const e = response.data;
  return {
    ...e,
    name: `${e.firstName} ${e.lastName}`,
    role: e.jobTitle,
  };
}

// PATCH /hr/employees/:id
export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  const response = await api.patch(`/hr/employees/${id}`, data);
  return response.data;
}

// DELETE /hr/employees/:id (Note: Need to implement controller)
export async function deleteEmployee(id: string): Promise<boolean> {
  await api.delete(`/hr/employees/${id}`);
  return true;
}

// GET /hr/departments
export async function getDepartments(): Promise<Department[]> {
  // Mocking for now or implement in backend
  return [
    { id: '1', name: 'Engineering', head: 'John Doe', count: 12 },
    { id: '2', name: 'Marketing', head: 'Jane Smith', count: 5 },
  ];
}

// POST /hr/attendance
export async function markAttendance(data: any): Promise<boolean> {
  await api.post('/hr/attendance', data);
  return true;
}
