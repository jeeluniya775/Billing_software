import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async findAllRecords(tenantId: string) {
    return this.prisma.payrollRecord.findMany({
      where: { tenantId },
      include: { employee: true },
      orderBy: { period: 'desc' },
    });
  }

  async getSummary(tenantId: string) {
    const records = await this.prisma.payrollRecord.findMany({ where: { tenantId } });
    const totalPaid = records.filter(r => r.status === 'PAID').reduce((acc, r) => acc + r.amount, 0);
    const pendingPaid = records.filter(r => r.status === 'PENDING').reduce((acc, r) => acc + r.amount, 0);

    return {
      totalPayroll: totalPaid + pendingPaid,
      paidAmount: totalPaid,
      pendingAmount: pendingPaid,
      employeeCount: records.length,
      recentHistory: records.slice(0, 5)
    };
  }

  async createRecord(tenantId: string, data: any) {
    return this.prisma.payrollRecord.create({
      data: { ...data, tenantId },
    });
  }
}
