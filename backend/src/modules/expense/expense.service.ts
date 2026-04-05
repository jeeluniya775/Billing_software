import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async createExpense(tenantId: string, role: string, dto: CreateExpenseDto) {
    const status = role === 'OWNER' ? 'APPROVED' : 'PENDING';
    
    return this.prisma.expense.create({
      data: {
        ...dto,
        tenantId,
        status,
      },
    });
  }

  async approveExpense(tenantId: string, id: string) {
    await this.findOneExpense(tenantId, id);
    return this.prisma.expense.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async rejectExpense(tenantId: string, id: string) {
    await this.findOneExpense(tenantId, id);
    return this.prisma.expense.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async findAllExpenses(tenantId: string, query: ExpenseQueryDto) {
    const { 
      search, status, category, dateFrom, dateTo, 
      page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' 
    } = query;

    const where: any = {
      tenantId,
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { vendor: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (status) where.AND.push({ status });
    if (category) where.AND.push({ category });
    
    if (dateFrom || dateTo) {
      where.AND.push({
        date: {
          gte: dateFrom ? new Date(dateFrom) : undefined,
          lte: dateTo ? new Date(dateTo) : undefined,
        },
      });
    }

    const [items, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: { employee: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expenses = await this.prisma.expense.findMany({
      where: { tenantId },
    });

    const totalToday = expenses
      .filter(e => new Date(e.date) >= today)
      .reduce((s, e) => s + e.amount, 0);
    
    const totalThisMonth = expenses
      .filter(e => new Date(e.date) >= startOfMonth)
      .reduce((s, e) => s + e.amount, 0);

    const totalLastMonth = expenses
      .filter(e => new Date(e.date) >= startOfLastMonth && new Date(e.date) <= endOfLastMonth)
      .reduce((s, e) => s + e.amount, 0);

    const pendingAmount = expenses
      .filter(e => e.status === 'PENDING')
      .reduce((s, e) => s + e.amount, 0);

    const recurringMonthly = expenses
      .filter(e => e.isRecurring)
      .reduce((sum, e) => {
        if (e.recurringPeriod === 'YEARLY') return sum + (e.amount / 12);
        if (e.recurringPeriod === 'WEEKLY') return sum + (e.amount * 4.33);
        return sum + e.amount;
      }, 0);

    const categories = Array.from(new Set(expenses.map(e => e.category)));
    const categoryBreakdown = categories.map(cat => {
      const amount = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
      return {
        category: cat,
        amount,
        percent: totalThisMonth > 0 ? (amount / totalThisMonth) * 100 : (expenses.length > 0 ? (amount / expenses.reduce((s, e) => s + e.amount, 0)) * 100 : 0)
      };
    });

    return {
      totalToday,
      totalThisMonth,
      totalLastMonth,
      growthPercent: totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0,
      pendingAmount,
      recurringMonthly,
      categoryBreakdown
    };
  }
}
