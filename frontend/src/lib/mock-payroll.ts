import { SalaryRecord, PayrollSummary, TaxConfig } from '@/types/payroll';

export const MOCK_SALARY_RECORDS: SalaryRecord[] = [
  {
    id: 'PY-001',
    employeeId: 'EMP-001',
    employeeName: 'Jeel Uniya',
    department: 'Engineering',
    structure: {
      basic: 8000,
      hra: 1500,
      allowances: 1000,
      bonus: 500,
      tax: 400,
      pf: 300,
      esi: 100,
      otherDeductions: 0
    },
    netSalary: 10200,
    status: 'Paid',
    paymentDate: '2024-02-28'
  },
  {
    id: 'PY-002',
    employeeId: 'EMP-002',
    employeeName: 'Alice Johnson',
    department: 'Design',
    structure: {
      basic: 6000,
      hra: 1200,
      allowances: 800,
      bonus: 0,
      tax: 300,
      pf: 240,
      esi: 60,
      otherDeductions: 0
    },
    netSalary: 7400,
    status: 'Processed',
    paymentDate: '2024-03-01'
  },
  {
    id: 'PY-003',
    employeeId: 'EMP-003',
    employeeName: 'Bob Smith',
    department: 'Engineering',
    structure: {
      basic: 7000,
      hra: 1400,
      allowances: 900,
      bonus: 0,
      tax: 350,
      pf: 280,
      esi: 70,
      otherDeductions: 0
    },
    netSalary: 8600,
    status: 'Draft'
  }
];

export const MOCK_PAYROLL_SUMMARY: PayrollSummary = {
  totalPayroll: 125400,
  totalEmployeesPaid: 42,
  pendingPayroll: 12500,
  totalDeductions: 18400,
  netSalaryPaid: 112900,
  growthPercentage: 4.2,
  monthlyTrend: [
    { month: 'Sep', amount: 110000 },
    { month: 'Oct', amount: 115000 },
    { month: 'Nov', amount: 112000 },
    { month: 'Dec', amount: 118000 },
    { month: 'Jan', amount: 122000 },
    { month: 'Feb', amount: 125400 }
  ],
  salaryDistribution: [
    { bracket: '3k-5k', count: 8 },
    { bracket: '5k-8k', count: 15 },
    { bracket: '8k-12k', count: 12 },
    { bracket: '12k-15k', count: 5 },
    { bracket: '15k+', count: 2 }
  ],
  deptSalaryCost: [
    { dept: 'Engineering', amount: 55000 },
    { dept: 'Sales', amount: 32000 },
    { dept: 'Marketing', amount: 22000 },
    { dept: 'Design', amount: 12000 },
    { dept: 'HR', amount: 4400 }
  ],
  deductionBreakdown: [
    { name: 'Income Tax', value: 8500 },
    { name: 'Provident Fund', value: 5400 },
    { name: 'ESI', value: 1200 },
    { name: 'Professional Tax', value: 3300 }
  ]
};

export const MOCK_TAX_SLABS: TaxConfig[] = [
  { slabName: 'Tier 1', minIncome: 0, maxIncome: 5000, rate: 0 },
  { slabName: 'Tier 2', minIncome: 5001, maxIncome: 10000, rate: 10 },
  { slabName: 'Tier 3', minIncome: 10001, maxIncome: 20000, rate: 20 },
  { slabName: 'Tier 4', minIncome: 20001, maxIncome: 999999, rate: 30 }
];
