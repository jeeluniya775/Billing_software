import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  CreateJournalEntryDto,
  UpdateAccountingSettingsDto,
  CreateRecurringJournalEntryDto,
  UpdateRecurringJournalEntryDto,
} from './dto/accounting.dto';
import { JournalStatus } from '@prisma/client';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async getSettings(tenantId: string) {
    return this.prisma.accountingSettings.upsert({
      where: { tenantId },
      create: { tenantId },
      update: {},
    });
  }

  async updateSettings(tenantId: string, userId: string, dto: UpdateAccountingSettingsDto) {
    const nextLockedAt = dto.periodLocked === undefined ? undefined : dto.periodLocked ? new Date() : null;
    return this.prisma.accountingSettings.upsert({
      where: { tenantId },
      create: {
        tenantId,
        fiscalYear: dto.fiscalYear ?? 'FY 2025-26',
        baseCurrency: dto.baseCurrency ?? 'USD',
        periodLocked: dto.periodLocked ?? false,
        lockedAt: dto.periodLocked ? new Date() : null,
        lockedBy: dto.periodLocked ? userId : null,
      },
      update: {
        ...dto,
        ...(dto.periodLocked !== undefined ? { lockedAt: nextLockedAt, lockedBy: dto.periodLocked ? userId : null } : {}),
      },
    });
  }

  async listRecurringEntries(tenantId: string) {
    return this.prisma.recurringJournalEntry.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRecurringEntry(tenantId: string, userId: string, dto: CreateRecurringJournalEntryDto) {
    return this.prisma.recurringJournalEntry.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        frequency: dto.frequency || 'MONTHLY',
        dayOfMonth: dto.dayOfMonth ?? 1,
        isActive: dto.isActive ?? true,
        template: dto.template || {},
        createdBy: userId,
      },
    });
  }

  async updateRecurringEntry(tenantId: string, id: string, dto: UpdateRecurringJournalEntryDto) {
    const existing = await this.prisma.recurringJournalEntry.findFirst({ where: { id, tenantId } });
    if (!existing) {
      throw new NotFoundException('Recurring entry not found');
    }
    return this.prisma.recurringJournalEntry.update({
      where: { id },
      data: dto,
    });
  }

  // --- Chart of Accounts ---

  async createAccount(tenantId: string, dto: CreateAccountDto) {
    try {
      return await this.prisma.account.create({
        data: {
          ...dto,
          tenantId,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Account code must be unique within this shop.');
      }
      throw error;
    }
  }

  async findAllAccounts(tenantId: string) {
    return this.prisma.account.findMany({
      where: { tenantId },
      orderBy: { code: 'asc' },
    });
  }

  async findOneAccount(tenantId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, tenantId },
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateAccount(tenantId: string, id: string, dto: UpdateAccountDto) {
    await this.findOneAccount(tenantId, id);
    try {
      return await this.prisma.account.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Account code must be unique within this shop.');
      }
      throw error;
    }
  }

  // --- Journal Entries ---

  async createJournalEntry(tenantId: string, dto: CreateJournalEntryDto) {
    const settings = await this.getSettings(tenantId);
    if (settings.periodLocked && dto.status === JournalStatus.POSTED) {
      throw new BadRequestException('Period is locked. New entries cannot be posted.');
    }

    const { items, ...entryData } = dto;
    if (!items || items.length < 2) {
      throw new BadRequestException('Journal entry must contain at least 2 lines.');
    }

    for (const item of items) {
      const hasDebit = item.debit > 0;
      const hasCredit = item.credit > 0;
      if (hasDebit === hasCredit) {
        throw new BadRequestException('Each line must contain either debit or credit.');
      }
    }

    const accountIds = [...new Set(items.map((item) => item.accountId))];
    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: accountIds },
        tenantId,
        isActive: true,
      },
      select: { id: true },
    });
    if (accounts.length !== accountIds.length) {
      throw new BadRequestException('One or more journal line accounts are invalid for this shop.');
    }

    const totalDebit = items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = items.reduce((sum, item) => sum + item.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new BadRequestException(`Journal entry must be balanced. Total Debit: ${totalDebit}, Total Credit: ${totalCredit}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          ...entryData,
          tenantId,
          items: {
            create: items,
          },
        },
        include: {
          items: true,
        },
      });

      // If status is POSTED, update account balances
      if (entry.status === JournalStatus.POSTED) {
        await this.applyEntryToBalances(tx, items);
      }

      return entry;
    });
  }

  async findAllJournalEntries(
    tenantId: string,
    options?: { status?: string; from?: string; to?: string; page?: number; limit?: number },
  ) {
    const dateFilter = this.getDateFilter(options?.from, options?.to);
    const page = Math.max(options?.page || 1, 1);
    const limit = Math.min(Math.max(options?.limit || 20, 1), 100);
    const status =
      options?.status && ['DRAFT', 'POSTED', 'CANCELLED'].includes(options.status)
        ? (options.status as JournalStatus)
        : undefined;

    const where = {
      tenantId,
      status,
      date: dateFilter,
    };

    const [items, total] = await Promise.all([
      this.prisma.journalEntry.findMany({
        where,
        include: {
          items: {
            include: {
              account: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.journalEntry.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async postJournalEntry(tenantId: string, id: string) {
    const settings = await this.getSettings(tenantId);
    if (settings.periodLocked) {
      throw new BadRequestException('Period is locked. Draft entries cannot be posted.');
    }

    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, tenantId },
      include: {
        items: {
          include: {
            account: true,
          },
        },
      },
    });
    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }
    if (entry.status !== JournalStatus.DRAFT) {
      throw new BadRequestException('Only draft entries can be posted.');
    }
    const totalDebit = entry.items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = entry.items.reduce((sum, item) => sum + item.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new BadRequestException('Draft entry is not balanced and cannot be posted.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.journalEntry.update({
        where: { id },
        data: { status: JournalStatus.POSTED },
        include: { items: true },
      });
      await this.applyEntryToBalances(tx, updated.items);
      return updated;
    });
  }

  async cancelJournalEntry(tenantId: string, id: string) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });
    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }
    if (entry.status === JournalStatus.CANCELLED) {
      return entry;
    }
    return this.prisma.$transaction(async (tx) => {
      if (entry.status === JournalStatus.POSTED) {
        await this.applyEntryToBalances(
          tx,
          entry.items.map((item) => ({ ...item, debit: item.credit, credit: item.debit })),
        );
      }
      return tx.journalEntry.update({
        where: { id },
        data: { status: JournalStatus.CANCELLED },
      });
    });
  }

  async getLedger(tenantId: string, accountId: string, options?: { from?: string; to?: string }) {
    await this.findOneAccount(tenantId, accountId);
    const dateFilter = this.getDateFilter(options?.from, options?.to);

    const items = await this.prisma.journalItem.findMany({
      where: {
        accountId,
        journalEntry: {
          tenantId,
          status: JournalStatus.POSTED,
          date: dateFilter,
        },
      },
      include: {
        journalEntry: true,
      },
      orderBy: {
        journalEntry: {
          date: 'asc',
        },
      },
    });

    let runningBalance = 0;
    return items.map((item) => {
      runningBalance += item.debit - item.credit;
      return {
        id: item.id,
        date: item.journalEntry.date,
        entryNo: item.journalEntry.reference || item.journalEntry.id.slice(0, 8),
        description: item.description || item.journalEntry.description,
        debit: item.debit,
        credit: item.credit,
        runningBalance,
        journalId: item.journalEntryId,
      };
    });
  }

  // --- Financial Reports ---

  async getTrialBalance(tenantId: string, options?: { from?: string; to?: string }) {
    const dateFilter = this.getDateFilter(options?.from, options?.to);
    const accountEntries = await this.prisma.journalItem.findMany({
      where: {
        journalEntry: {
          tenantId,
          status: JournalStatus.POSTED,
          date: dateFilter,
        },
      },
      include: { account: true },
      orderBy: { account: { code: 'asc' } },
    });

    const grouped = new Map<string, any>();
    for (const row of accountEntries) {
      const current = grouped.get(row.accountId) || {
        accountId: row.account.id,
        accountCode: row.account.code,
        accountName: row.account.name,
        accountType: row.account.type,
        debit: 0,
        credit: 0,
      };
      current.debit += row.debit;
      current.credit += row.credit;
      grouped.set(row.accountId, current);
    }

    const result = Array.from(grouped.values()).sort((a, b) => a.accountCode.localeCompare(b.accountCode));
    return result;
  }

  async getProfitAndLoss(tenantId: string, options?: { from?: string; to?: string }) {
    const dateFilter = this.getDateFilter(options?.from, options?.to);
    const items = await this.prisma.journalItem.findMany({
      where: {
        journalEntry: {
          tenantId,
          status: JournalStatus.POSTED,
          date: dateFilter,
        },
        account: {
          type: { in: ['REVENUE', 'EXPENSE'] },
        },
      },
      include: {
        account: true,
      },
    });

    const revenueMap = new Map<string, { name: string; amount: number }>();
    const expenseMap = new Map<string, { name: string; amount: number }>();

    for (const item of items) {
      const map = item.account.type === 'REVENUE' ? revenueMap : expenseMap;
      const amount = item.account.type === 'REVENUE' ? item.credit - item.debit : item.debit - item.credit;
      const current = map.get(item.accountId) || { name: item.account.name, amount: 0 };
      current.amount += amount;
      map.set(item.accountId, current);
    }

    const revenue = Array.from(revenueMap.values());
    const expenses = Array.from(expenseMap.values());
    const totalRevenue = revenue.reduce((sum, a) => sum + Math.max(a.amount, 0), 0);
    const totalExpenses = expenses.reduce((sum, a) => sum + Math.max(a.amount, 0), 0);

    return {
      revenue,
      expenses,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }

  async getBalanceSheet(tenantId: string, options?: { from?: string; to?: string }) {
    const dateFilter = this.getDateFilter(options?.from, options?.to);
    const items = await this.prisma.journalItem.findMany({
      where: {
        journalEntry: {
          tenantId,
          status: JournalStatus.POSTED,
          date: dateFilter,
        },
        account: {
          type: { in: ['ASSET', 'LIABILITY', 'EQUITY'] },
        },
      },
      include: { account: true },
    });

    const assetsMap = new Map<string, { name: string; amount: number }>();
    const liabilitiesMap = new Map<string, { name: string; amount: number }>();
    const equityMap = new Map<string, { name: string; amount: number }>();

    for (const item of items) {
      const amount = item.debit - item.credit;
      if (item.account.type === 'ASSET') {
        const current = assetsMap.get(item.accountId) || { name: item.account.name, amount: 0 };
        current.amount += amount;
        assetsMap.set(item.accountId, current);
      } else if (item.account.type === 'LIABILITY') {
        const current = liabilitiesMap.get(item.accountId) || { name: item.account.name, amount: 0 };
        current.amount += -amount;
        liabilitiesMap.set(item.accountId, current);
      } else if (item.account.type === 'EQUITY') {
        const current = equityMap.get(item.accountId) || { name: item.account.name, amount: 0 };
        current.amount += -amount;
        equityMap.set(item.accountId, current);
      }
    }

    const assets = Array.from(assetsMap.values());
    const liabilities = Array.from(liabilitiesMap.values());
    const equity = Array.from(equityMap.values());

    return {
      assets,
      liabilities,
      equity,
      totalAssets: assets.reduce((sum, a) => sum + a.amount, 0),
      totalLiabilities: liabilities.reduce((sum, a) => sum + a.amount, 0),
      totalEquity: equity.reduce((sum, a) => sum + a.amount, 0),
    };
  }

  private getDateFilter(from?: string, to?: string) {
    if (!from && !to) return undefined;
    const dateFilter: any = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }
    return dateFilter;
  }

  private async applyEntryToBalances(tx: any, items: Array<{ accountId: string; debit: number; credit: number }>) {
    for (const item of items) {
      const balanceChange = item.debit - item.credit;
      await tx.account.update({
        where: { id: item.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });
    }
  }
}
