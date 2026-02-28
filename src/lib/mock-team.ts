import { Employee, Department, TeamSummary, AttendanceRecord, LeaveRequest, PerformanceMetrics, PayrollPreview } from '@/types/team';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Jeel Uniya',
    role: 'Senior Frontend Engineer',
    departmentId: 'DEPT-ENG',
    departmentName: 'Engineering',
    email: 'jeel@example.com',
    phone: '+91 98765 43210',
    status: 'Active',
    joinDate: '2023-01-15',
    baseSalary: 120000,
    reportingManagerId: 'EMP-010',
    reportingManagerName: 'Sarah Connor',
    contractType: 'Full-time',
    performanceScore: 94,
    tags: ['React', 'Next.js', 'Team Lead'],
    photoUrl: 'https://i.pravatar.cc/150?u=EMP-001'
  },
  {
    id: 'EMP-002',
    name: 'Alice Johnson',
    role: 'UX Designer',
    departmentId: 'DEPT-DES',
    departmentName: 'Design',
    email: 'alice@example.com',
    phone: '+91 98765 43211',
    status: 'Active',
    joinDate: '2023-03-10',
    baseSalary: 85000,
    reportingManagerId: 'EMP-011',
    reportingManagerName: 'David Miller',
    contractType: 'Full-time',
    performanceScore: 88,
    tags: ['Figma', 'UI/UX', 'Mobile'],
    photoUrl: 'https://i.pravatar.cc/150?u=EMP-002'
  },
  {
    id: 'EMP-003',
    name: 'Bob Smith',
    role: 'Backend Developer',
    departmentId: 'DEPT-ENG',
    departmentName: 'Engineering',
    email: 'bob@example.com',
    phone: '+91 98765 43212',
    status: 'On Leave',
    joinDate: '2023-05-20',
    baseSalary: 95000,
    reportingManagerId: 'EMP-010',
    reportingManagerName: 'Sarah Connor',
    contractType: 'Full-time',
    performanceScore: 82,
    tags: ['Node.js', 'PostgreSQL', 'API'],
    photoUrl: 'https://i.pravatar.cc/150?u=EMP-003'
  },
  {
    id: 'EMP-004',
    name: 'Charlie Davis',
    role: 'Marketing Specialist',
    departmentId: 'DEPT-MKT',
    departmentName: 'Marketing',
    email: 'charlie@example.com',
    phone: '+91 98765 43213',
    status: 'Active',
    joinDate: '2023-08-01',
    baseSalary: 70000,
    reportingManagerId: 'EMP-012',
    reportingManagerName: 'Elena Gilbert',
    contractType: 'Full-time',
    performanceScore: 90,
    tags: ['SEO', 'Content', 'Social Media'],
    photoUrl: 'https://i.pravatar.cc/150?u=EMP-004'
  },
  {
    id: 'EMP-005',
    name: 'Diana Prince',
    role: 'HR Manager',
    departmentId: 'DEPT-HR',
    departmentName: 'Human Resources',
    email: 'diana@example.com',
    phone: '+91 98765 43214',
    status: 'Active',
    joinDate: '2022-11-15',
    baseSalary: 90000,
    reportingManagerId: 'EMP-013',
    reportingManagerName: 'Arthur Curry',
    contractType: 'Full-time',
    performanceScore: 96,
    tags: ['Recruitment', 'Policy', 'Vibe'],
    photoUrl: 'https://i.pravatar.cc/150?u=EMP-005'
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'DEPT-ENG', name: 'Engineering', managerId: 'EMP-010', managerName: 'Sarah Connor', employeeCount: 25, description: 'Software development and infrastructure' },
  { id: 'DEPT-DES', name: 'Design', managerId: 'EMP-011', managerName: 'David Miller', employeeCount: 8, description: 'Product design and creative assets' },
  { id: 'DEPT-MKT', name: 'Marketing', managerId: 'EMP-012', managerName: 'Elena Gilbert', employeeCount: 12, description: 'Brand awareness and lead generation' },
  { id: 'DEPT-HR', name: 'Human Resources', managerId: 'EMP-013', managerName: 'Arthur Curry', employeeCount: 4, description: 'Talent and culture management' },
  { id: 'DEPT-SAL', name: 'Sales', managerId: 'EMP-014', managerName: 'Bruce Wayne', employeeCount: 15, description: 'Revenue generation and client acquisition' }
];

export const MOCK_TEAM_SUMMARY: TeamSummary = {
  totalEmployees: 64,
  activeEmployees: 58,
  departmentsCount: 5,
  newJoinersMonth: 4,
  onLeaveToday: 3,
  attendanceRate: 94.5,
  hiringTrend: [
    { month: 'Oct', count: 2 },
    { month: 'Nov', count: 5 },
    { month: 'Dec', count: 3 },
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 4 }
  ],
  deptDistribution: [
    { name: 'Engineering', value: 25 },
    { name: 'Sales', value: 15 },
    { name: 'Marketing', value: 12 },
    { name: 'Design', value: 8 },
    { name: 'HR', value: 4 }
  ],
  attendanceTrend: [
    { day: 'Mon', rate: 92 },
    { day: 'Tue', rate: 96 },
    { day: 'Wed', rate: 95 },
    { day: 'Thu', rate: 94 },
    { day: 'Fri', rate: 93 }
  ],
  roleDistribution: [
    { role: 'Developer', count: 18 },
    { role: 'Sales Rep', count: 12 },
    { role: 'Manager', count: 8 },
    { role: 'Designer', count: 6 },
    { role: 'Other', count: 20 }
  ]
};

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'LR-101', employeeId: 'EMP-003', employeeName: 'Bob Smith', type: 'Annual', startDate: '2024-03-01', endDate: '2024-03-05', status: 'Approved', reason: 'Family vacation' },
  { id: 'LR-102', employeeId: 'EMP-002', employeeName: 'Alice Johnson', type: 'Sick', startDate: '2024-02-28', endDate: '2024-02-28', status: 'Pending', reason: 'Flu symptoms' }
];

export const MOCK_PERFORMANCE: PerformanceMetrics = {
  employeeId: 'EMP-001',
  completionRate: 95,
  productivityScore: 88,
  goals: [
    { title: 'Project X Launch', target: 100, current: 90 },
    { title: 'Mentoring Juniors', target: 5, current: 4 },
    { title: 'Code Quality (Unit Test Coverage)', target: 80, current: 85 }
  ],
  activityTimeline: [
    { date: '2024-02-25', action: 'Completed high-priority bug fixes', category: 'Achievement' },
    { date: '2024-02-15', action: 'Missed sync meeting without notification', category: 'Warning' },
    { date: '2024-02-01', action: 'Exceeded project deliverables for Jan', category: 'Achievement' }
  ]
};

export const MOCK_PAYROLL: PayrollPreview = {
  employeeId: 'EMP-001',
  baseSalary: 10000, // Monthly for preview
  allowances: 1500,
  deductions: 800,
  overtime: 500,
  netPay: 11200,
  currency: 'USD'
};
