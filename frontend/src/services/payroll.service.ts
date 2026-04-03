import { api } from './api';
import { SalaryRecord, PayrollSummary, PayslipData } from '@/types/payroll';

export async function getPayrollSummary(): Promise<PayrollSummary> {
  const response = await api.get('/payroll/summary');
  return response.data;
}

export async function getSalaryRecords(filters?: any): Promise<SalaryRecord[]> {
  const response = await api.get('/payroll/records');
  let records = response.data;
  if (filters?.dept) records = records.filter((r: any) => r.employee?.department === filters.dept);
  if (filters?.status) records = records.filter((r: any) => r.status === filters.status);
  return records;
}

export async function processPayroll(recordIds: string[]): Promise<boolean> {
  const response = await api.post('/payroll/records', { recordIds });
  return !!response.data;
}

export async function getPayslip(id: string): Promise<PayslipData> {
  const response = await api.get(`/payroll/records/${id}`);
  const record = response.data;
  return {
    ...record,
    period: record.period || 'Current Period',
    earnings: [
      { name: 'Basic Pay', amount: record.amount },
    ],
    deductions: []
  };
}

export async function updateSalaryStatus(id: string, status: string): Promise<boolean> {
  const response = await api.patch(`/payroll/records/${id}/status`, { status });
  return !!response.data;
}

export async function updateSalaryStructure(id: string, data: any): Promise<boolean> {
  const response = await api.patch(`/payroll/records/${id}`, data);
  return !!response.data;
}
