import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async createExpense(tenantId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAllExpenses(tenantId: string) {
    return this.prisma.expense.findMany({
      where: { tenantId },
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOneExpense(tenantId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, tenantId },
      include: { employee: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async updateExpense(tenantId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOneExpense(tenantId, id);
    return this.prisma.expense.update({
      where: { id },
      data: dto,
    });
  }

  async removeExpense(tenantId: string, id: string) {
    await this.findOneExpense(tenantId, id);
    return this.prisma.expense.delete({
      where: { id },
    });
  }

  async getExpenseSummary(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const today = new Date(now.setHours(0,0,0,0));

    const expenses = await this.prisma.expense.findMany({
      where: { tenantId },
    });

    const totalToday = expenses
      .filter(e => e.date >= today)
      .reduce((s, e) => s + e.amount, 0);
    
    const totalThisMonth = expenses
      .filter(e => e.date >= startOfMonth)
      .reduce((s, e) => s + e.amount, 0);

    const totalLastMonth = expenses
      .filter(e => e.date >= startOfLastMonth && e.date < startOfMonth)
      .reduce((s, e) => s + e.amount, 0);

    const pendingAmount = expenses
      .filter(e => e.status === 'PENDING')
      .reduce((s, e) => s + e.amount, 0);

    const categories = Array.from(new Set(expenses.map(e => e.category)));
    const categoryBreakdown = categories.map(cat => {
      const amount = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
      return {
        category: cat,
        amount,
        percent: totalThisMonth > 0 ? (amount / totalThisMonth) * 100 : 0
      };
    });

    return {
      totalToday,
      totalThisMonth,
      totalLastMonth,
      growthPercent: totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0,
      pendingAmount,
      recurringMonthly: 0, // Placeholder
      categoryBreakdown
    };
  }
}
