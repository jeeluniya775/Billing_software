import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  // --- Customer Operations ---

  async createCustomer(tenantId: string, dto: CreateCustomerDto) {
    const { contacts, ...customerData } = dto;
    
    return this.prisma.customer.create({
      data: {
        ...customerData,
        tenantId,
        contacts: contacts ? {
          create: contacts,
        } : undefined,
      },
      include: {
        contacts: true,
      },
    });
  }

  async findAllCustomers(tenantId: string, search?: string) {
    return this.prisma.customer.findMany({
      where: {
        tenantId,
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      include: {
        contacts: true,
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOneCustomer(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        contacts: true,
        invoices: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async updateCustomer(tenantId: string, id: string, dto: UpdateCustomerDto) {
    await this.findOneCustomer(tenantId, id);
    const { contacts, ...customerData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // If contacts are provided, we replace them
      if (contacts) {
        await tx.contactPerson.deleteMany({ where: { customerId: id } });
      }

      return tx.customer.update({
        where: { id },
        data: {
          ...customerData,
          contacts: contacts ? {
            create: contacts,
          } : undefined,
        },
        include: {
          contacts: true,
        },
      });
    });
  }

  async removeCustomer(tenantId: string, id: string) {
    await this.findOneCustomer(tenantId, id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  // --- Invoice Operations ---

  async createInvoice(tenantId: string, dto: CreateInvoiceDto) {
    const { items, ...invoiceData } = dto;
    
    return this.prisma.invoice.create({
      data: {
        ...invoiceData,
        tenantId,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });
  }

  async findAllInvoices(tenantId: string, search?: string) {
    return this.prisma.invoice.findMany({
      where: {
        tenantId,
        OR: search ? [
          { invoiceNo: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
        ] : undefined,
      },
      include: {
        customer: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOneInvoice(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async updateInvoice(tenantId: string, id: string, dto: UpdateInvoiceDto) {
    await this.findOneInvoice(tenantId, id);
    const { items, ...invoiceData } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      
      return tx.invoice.update({
        where: { id },
        data: {
          ...invoiceData,
          items: {
            create: items,
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });
    });
  }

  async removeInvoice(tenantId: string, id: string) {
    await this.findOneInvoice(tenantId, id);
    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async getInvoiceSummary(tenantId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
    });

    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const paidAmount = invoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((acc, inv) => acc + inv.total, 0);
    const unpaidAmount = totalRevenue - paidAmount;

    return {
      totalSalesToday: invoices.length,
      totalSalesThisMonth: invoices.length,
      totalRevenue,
      paidAmount,
      unpaidAmount,
      overdueAmount: invoices
        .filter((inv) => inv.status === 'OVERDUE')
        .reduce((acc, inv) => acc + inv.total, 0),
      salesGrowthPercent: 12,
    };
  }

  async getInvoiceAnalytics(tenantId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { date: 'asc' },
    });

    // 1. Revenue Trend (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        name: months[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        revenue: 0,
      });
    }

    invoices.forEach(inv => {
      const invDate = new Date(inv.date);
      const trendItem = last6Months.find(m => m.monthIndex === invDate.getMonth() && m.year === invDate.getFullYear());
      if (trendItem) {
        trendItem.revenue += inv.total;
      }
    });

    const revenueTrend = last6Months.map(({ name, revenue }) => ({ name, revenue }));

    // 2. Sales by Status
    const statusMap: Record<string, { count: number; color: string }> = {
      PAID: { count: 0, color: '#10b981' },
      DRAFT: { count: 0, color: '#94a3b8' },
      SENT: { count: 0, color: '#3b82f6' },
      PARTIAL: { count: 0, color: '#f59e0b' },
      OVERDUE: { count: 0, color: '#ef4444' },
      CANCELLED: { count: 0, color: '#64748b' },
    };

    invoices.forEach(inv => {
      if (statusMap[inv.status]) {
        statusMap[inv.status].count++;
      }
    });

    const salesByStatus = Object.entries(statusMap)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        value: data.count,
        color: data.color,
      }));

    return {
      revenueTrend,
      salesByStatus,
      summary: await this.getInvoiceSummary(tenantId),
    };
  }
}
