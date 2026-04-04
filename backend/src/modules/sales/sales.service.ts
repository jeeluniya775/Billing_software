import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  // --- Customer Operations ---

  async createCustomer(tenantId: string, dto: CreateCustomerDto) {
    const targetTenantId = dto.tenantId || tenantId;
    const { contacts, ...rest } = dto;
    
    return this.prisma.customer.create({
      data: {
        ...rest,
        tenantId: targetTenantId,
        contacts: {
          create: contacts || [],
        },
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
        tenant: true,
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAllGlobalCustomers(ownerId: string, search?: string) {
    const tenants = await this.prisma.tenant.findMany({
      where: { ownerId } as any,
    });
    const tenantIds = tenants.map(t => t.id);

    return this.prisma.customer.findMany({
      where: {
        tenantId: { in: tenantIds },
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      include: {
        contacts: true,
        tenant: true,
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

  async createPortalOrder(userId: string, tenantId: string, items: any[]) {
    // 1. Find or create a customer profile for this user in THIS tenant
    let customer = await this.prisma.customer.findFirst({
      where: { userId, tenantId },
    });

    if (!customer) {
      // Get user info to create profile
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      
      customer = await this.prisma.customer.create({
        data: {
          name: user.name,
          email: user.email,
          userId: user.id,
          tenantId,
        }
      });
    }

    // 2. Create the invoice
    const subtotal = items.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
    const taxTotal = subtotal * 0.1; // 10% default for portal
    const total = subtotal + taxTotal;

    return this.prisma.invoice.create({
      data: {
        tenantId,
        customerId: customer.id,
        invoiceNo: `INV-P-${Date.now()}`,
        status: 'PAID', // Simplified for portal demo
        subtotal,
        taxTotal,
        total,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: {
          create: items.map(item => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            total: item.rate * item.quantity,
          })),
        },
      },
      include: {
        items: true,
        tenant: true,
      }
    });
  }

  async getConsolidatedAnalytics(ownerId: string) {
    const tenants = await this.prisma.tenant.findMany({
      where: { ownerId } as any,
      include: {
        invoices: true
      }
    });

    const shops = tenants.map(tenant => {
      const totalRevenue = tenant.invoices.reduce((acc, inv) => acc + inv.total, 0);
      const paidAmount = tenant.invoices
        .filter((inv) => inv.status === 'PAID')
        .reduce((acc, inv) => acc + inv.total, 0);

      return {
        id: tenant.id,
        name: tenant.name,
        totalRevenue,
        paidAmount,
        unpaidAmount: totalRevenue - paidAmount,
        invoiceCount: tenant.invoices.length,
      };
    });

    const totalRevenue = shops.reduce((acc, shop) => acc + shop.totalRevenue, 0);
    const paidAmount = shops.reduce((acc, shop) => acc + shop.paidAmount, 0);

    return {
      shopCount: tenants.length,
      totalRevenue,
      paidAmount,
      unpaidAmount: totalRevenue - paidAmount,
      totalInvoices: shops.reduce((acc, shop) => acc + shop.invoiceCount, 0),
      shops,
    };
  }

  async getInvoiceAnalytics(tenantId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { date: 'asc' },
    });

    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const paidAmount = invoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((acc, inv) => acc + inv.total, 0);
    const unpaidAmount = totalRevenue - paidAmount;

    return {
      revenueTrend: [], // Simplified for now
      salesByStatus: [],
      summary: {
        totalRevenue,
        paidAmount,
        unpaidAmount,
      }
    };
  }

  async findInvoicesForCustomer(userId: string) {
    const customers = await this.prisma.customer.findMany({
      where: { userId },
    });

    const customerIds = customers.map(c => c.id);
    if (customerIds.length === 0) return [];

    return this.prisma.invoice.findMany({
      where: { customerId: { in: customerIds } },
      include: {
        tenant: true,
      },
      orderBy: { date: 'desc' },
    });
  }
}
