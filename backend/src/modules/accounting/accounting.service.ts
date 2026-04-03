import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto, CreateJournalEntryDto } from './dto/accounting.dto';
import { JournalStatus } from '@prisma/client';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  // --- Chart of Accounts ---

  async createAccount(tenantId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...dto,
        tenantId,
      },
    });
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
    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  // --- Journal Entries ---

  async createJournalEntry(tenantId: string, dto: CreateJournalEntryDto) {
    const { items, ...entryData } = dto;
    
    // Basic double-entry validation: Debits must equal Credits
    const totalDebit = items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = items.reduce((sum, item) => sum + item.credit, 0);
    
    // To handle floating point precision issues, we can check with a small epsilon
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

      return entry;
    });
  }

  async findAllJournalEntries(tenantId: string) {
    return this.prisma.journalEntry.findMany({
      where: { tenantId },
      include: {
        items: {
          include: {
            account: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getLedger(tenantId: string, accountId: string) {
    return this.prisma.journalItem.findMany({
      where: {
        accountId,
        journalEntry: {
          tenantId,
          status: JournalStatus.POSTED,
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
  }

  // --- Financial Reports ---

  async getTrialBalance(tenantId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { tenantId },
      orderBy: { code: 'asc' },
    });
    
    return accounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      code: acc.code,
      type: acc.type,
      debit: acc.balance > 0 ? acc.balance : 0,
      credit: acc.balance < 0 ? Math.abs(acc.balance) : 0,
    }));
  }

  async getProfitAndLoss(tenantId: string) {
    const accounts = await this.prisma.account.findMany({
      where: {
        tenantId,
        type: { in: ['REVENUE', 'EXPENSE'] },
      },
    });

    const revenue = accounts.filter(a => a.type === 'REVENUE');
    const expenses = accounts.filter(a => a.type === 'EXPENSE');

    const totalRevenue = revenue.reduce((sum, a) => sum + Math.abs(a.balance), 0);
    const totalExpenses = expenses.reduce((sum, a) => sum + Math.abs(a.balance), 0);

    return {
      revenue: revenue.map(a => ({ name: a.name, amount: Math.abs(a.balance) })),
      expenses: expenses.map(a => ({ name: a.name, amount: Math.abs(a.balance) })),
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }

  async getBalanceSheet(tenantId: string) {
    const accounts = await this.prisma.account.findMany({
      where: {
        tenantId,
        type: { in: ['ASSET', 'LIABILITY', 'EQUITY'] },
      },
    });

    const assets = accounts.filter(a => a.type === 'ASSET');
    const liabilities = accounts.filter(a => a.type === 'LIABILITY');
    const equity = accounts.filter(a => a.type === 'EQUITY');

    return {
      assets: assets.map(a => ({ name: a.name, amount: a.balance })),
      liabilities: liabilities.map(a => ({ name: a.name, amount: Math.abs(a.balance) })),
      equity: equity.map(a => ({ name: a.name, amount: Math.abs(a.balance) })),
      totalAssets: assets.reduce((sum, a) => sum + a.balance, 0),
      totalLiabilities: liabilities.reduce((sum, a) => sum + Math.abs(a.balance), 0),
      totalEquity: equity.reduce((sum, a) => sum + Math.abs(a.balance), 0),
    };
  }
}
