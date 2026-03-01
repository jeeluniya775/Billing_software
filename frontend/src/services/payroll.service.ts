import { SalaryRecord, PayrollSummary, PayslipData } from '@/types/payroll';
import { MOCK_SALARY_RECORDS, MOCK_PAYROLL_SUMMARY } from '@/lib/mock-payroll';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPayrollSummary(): Promise<PayrollSummary> {
  await delay();
  return MOCK_PAYROLL_SUMMARY;
}

export async function getSalaryRecords(filters?: any): Promise<SalaryRecord[]> {
  await delay(800);
  let records = [...MOCK_SALARY_RECORDS];
  if (filters?.dept) records = records.filter(r => r.department === filters.dept);
  if (filters?.status) records = records.filter(r => r.status === filters.status);
  return records;
}

export async function processPayroll(recordIds: string[]): Promise<boolean> {
  await delay(1500);
  console.log('API POST /api/payroll/process', recordIds);
  return true;
}

export async function getPayslip(id: string): Promise<PayslipData> {
  await delay();
  const record = MOCK_SALARY_RECORDS.find(r => r.id === id) || MOCK_SALARY_RECORDS[0];
  return {
    ...record,
    period: 'February 2024',
    earnings: [
      { name: 'Basic Pay', amount: record.structure.basic },
      { name: 'HRA', amount: record.structure.hra },
      { name: 'Allowances', amount: record.structure.allowances },
      { name: 'Bonus', amount: record.structure.bonus }
    ],
    deductions: [
      { name: 'Income Tax', amount: record.structure.tax },
      { name: 'PF', amount: record.structure.pf },
      { name: 'ESI', amount: record.structure.esi }
    ]
  };
}

export async function updateSalaryStatus(id: string, status: string): Promise<boolean> {
  await delay(500);
  console.log(`API PUT /api/payroll/${id}/status`, status);
  return true;
}

export async function updateSalaryStructure(id: string, data: any): Promise<boolean> {
  await delay(800);
  console.log(`API PUT /api/payroll/${id}`, data);
  return true;
}
