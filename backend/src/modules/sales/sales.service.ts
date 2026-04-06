import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  // --- Customer Operations ---

  async createCustomer(tenantId: string, dto: CreateCustomerDto) {
    const { contacts, ...rest } = dto;
    
    return this.prisma.customer.create({
      data: {
        ...rest,
        tenantId,
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
    if (!tenantId) {
      throw new BadRequestException('shopId (tenantId) is required');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('At least one order item is required');
    }

    const productIds = items.map((item) => item.productId).filter(Boolean);
    if (productIds.length !== items.length) {
      throw new BadRequestException('Each order item must include a productId');
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        tenantId,
        isActive: true,
      },
      select: { id: true, name: true, price: true, tenantId: true },
    });
    if (products.length !== items.length) {
      throw new ForbiddenException('Order items must belong to the selected shop.');
    }
    const priceById = new Map(products.map((product) => [product.id, product.price]));

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
    const normalizedItems = items.map((item) => {
      const rate = priceById.get(item.productId) || 0;
      return {
        productId: item.productId,
        description: item.description || products.find((p) => p.id === item.productId)?.name || 'Product',
        quantity: Number(item.quantity) || 0,
        rate,
      };
    }).filter((item) => item.quantity > 0);

    if (normalizedItems.length === 0) {
      throw new BadRequestException('Order items must have quantity greater than zero');
    }

    const subtotal = normalizedItems.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
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
          create: normalizedItems.map(item => ({
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
    });
    const tenantIds = tenants.map((t) => t.id);

    const [allInvoices, lowStockProducts, shops] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { tenantId: { in: tenantIds } },
        include: { customer: { select: { name: true } }, tenant: { select: { name: true } } },
        orderBy: { date: 'desc' },
      }),
      this.prisma.product.findMany({
        where: { tenantId: { in: tenantIds }, stock: { lte: this.prisma.product.fields.lowStockAlert } as any },
        include: { tenant: { select: { name: true } } },
        take: 5,
      }),
      Promise.all(
        tenants.map(async (tenant) => {
          const tenantInvoices = await this.prisma.invoice.findMany({
            where: { tenantId: tenant.id },
          });
          const totalRevenue = tenantInvoices.reduce((acc, inv) => acc + inv.total, 0);
          const paidAmount = tenantInvoices
            .filter((inv) => inv.status === 'PAID')
            .reduce((acc, inv) => acc + inv.total, 0);

          const productCount = await this.prisma.product.count({
            where: { tenantId: tenant.id },
          });

          return {
            id: tenant.id,
            name: tenant.name,
            totalRevenue,
            paidAmount,
            unpaidAmount: totalRevenue - paidAmount,
            invoiceCount: tenantInvoices.length,
            productCount,
            currency: (tenant as any).currency || 'USD',
            city: (tenant as any).city || 'Unknown',
            taxNumber: (tenant as any).taxNumber || null,
          };
        }),
      ),
    ]);

    const totalRevenue = shops.reduce((acc, shop) => acc + shop.totalRevenue, 0);
    const paidAmount = shops.reduce((acc, shop) => acc + shop.paidAmount, 0);
    const unpaidInvoices = allInvoices.filter((inv) => inv.status !== 'PAID');

    // Simple revenue trend for last 7 days
    const revenueTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayTotal = allInvoices
        .filter((inv) => inv.date.toISOString().split('T')[0] === dateStr)
        .reduce((acc, inv) => acc + inv.total, 0);
      return { date: dateStr, amount: dayTotal };
    });

    return {
      shopCount: tenants.length,
      totalRevenue,
      paidAmount,
      unpaidAmount: totalRevenue - paidAmount,
      totalInvoices: allInvoices.length,
      unpaidInvoiceCount: unpaidInvoices.length,
      recentInvoices: allInvoices.slice(0, 5),
      lowStockProducts,
      revenueTrend,
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
