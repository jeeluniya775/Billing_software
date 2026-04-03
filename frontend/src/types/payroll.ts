export type PayrollStatus = 'Draft' | 'Processed' | 'Paid';

export interface SalaryStructure {
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  tax: number;
  pf: number;
  esi: number;
  otherDeductions: number;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  structure: SalaryStructure;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
}

export interface PayrollSummary {
  totalPayroll: number;
  totalEmployeesPaid: number;
  pendingPayroll: number;
  totalDeductions: number;
  netSalaryPaid: number;
  growthPercentage: number;
  monthlyTrend: { month: string; amount: number }[];
  salaryDistribution: { bracket: string; count: number }[];
  deptSalaryCost: { dept: string; amount: number }[];
  deductionBreakdown: { name: string; value: number }[];
}

export interface PayslipData extends SalaryRecord {
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  period: string;
}

export interface TaxConfig {
  slabName: string;
  minIncome: number;
  maxIncome: number;
  rate: number;
}
