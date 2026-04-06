import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  private ensureBackofficeUser(user: any) {
    if (user.role === 'CUSTOMER') {
      throw new UnauthorizedException('Customers cannot access backoffice sales APIs.');
    }
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context is required.');
    }
  }

  // --- Customers ---

  @Post('customers')
  @ApiOperation({ summary: 'Create a new customer' })
  createCustomer(@CurrentUser() user: any, @Body() dto: CreateCustomerDto) {
    this.ensureBackofficeUser(user);
    return this.salesService.createCustomer(user.tenantId, dto);
  }

  @Get('customers')
  @ApiOperation({ summary: 'List all customers' })
  @ApiQuery({ name: 'search', required: false })
  findAllCustomers(@CurrentUser() user: any, @Query('search') search?: string) {
    this.ensureBackofficeUser(user);
    return this.salesService.findAllCustomers(user.tenantId, search);
  }

  @Get('customers/global')
  @ApiOperation({ summary: 'List all customers across all shops (Owner only)' })
  findAllGlobalCustomers(@CurrentUser() user: any, @Query('search') search?: string) {
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      throw new UnauthorizedException('Insufficient permissions.');
    }
    return this.salesService.findAllGlobalCustomers(user.id, search);
  }

  @Get('customers/:id')
  @ApiOperation({ summary: 'Get customer by ID' })
  findOneCustomer(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.salesService.findOneCustomer(user.tenantId, id);
  }

  @Patch('customers/:id')
  @ApiOperation({ summary: 'Update customer' })
  updateCustomer(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    this.ensureBackofficeUser(user);
    return this.salesService.updateCustomer(user.tenantId, id, dto);
  }

  @Delete('customers/:id')
  @ApiOperation({ summary: 'Delete customer' })
  removeCustomer(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.salesService.removeCustomer(user.tenantId, id);
  }

  // --- Invoices ---

  @Post('invoices')
  @ApiOperation({ summary: 'Create a new invoice' })
  createInvoice(@CurrentUser() user: any, @Body() dto: CreateInvoiceDto) {
    this.ensureBackofficeUser(user);
    return this.salesService.createInvoice(user.tenantId, dto);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List all invoices' })
  @ApiQuery({ name: 'search', required: false })
  findAllInvoices(@CurrentUser() user: any, @Query('search') search?: string) {
    this.ensureBackofficeUser(user);
    return this.salesService.findAllInvoices(user.tenantId, search);
  }

  @Get('invoices/summary')
  @ApiOperation({ summary: 'Get invoice summary' })
  getInvoiceSummary(@CurrentUser() user: any) {
    this.ensureBackofficeUser(user);
    return this.salesService.getInvoiceSummary(user.tenantId);
  }

  @Get('invoices/analytics')
  @ApiOperation({ summary: 'Get invoice analytics' })
  getInvoiceAnalytics(@CurrentUser() user: any) {
    this.ensureBackofficeUser(user);
    return this.salesService.getInvoiceAnalytics(user.tenantId);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOneInvoice(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.salesService.findOneInvoice(user.tenantId, id);
  }

  @Patch('invoices/:id')
  @ApiOperation({ summary: 'Update invoice' })
  updateInvoice(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    this.ensureBackofficeUser(user);
    return this.salesService.updateInvoice(user.tenantId, id, dto);
  }

  @Delete('invoices/:id')
  @ApiOperation({ summary: 'Delete invoice' })
  removeInvoice(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.salesService.removeInvoice(user.tenantId, id);
  }

  @Get('consolidated-analytics')
  @ApiOperation({ summary: 'Get consolidated analytics for owner' })
  getConsolidatedAnalytics(@CurrentUser() user: any) {
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      throw new UnauthorizedException('Insufficient permissions.');
    }
    return this.salesService.getConsolidatedAnalytics(user.id);
  }

  @Get('portal/invoices')
  @ApiOperation({ summary: 'Get invoices for customer portal' })
  getCustomerInvoices(@CurrentUser() user: any) {
    if (user.role !== 'CUSTOMER') {
      throw new UnauthorizedException('Only customers can access portal invoices.');
    }
    return this.salesService.findInvoicesForCustomer(user.id);
  }

  @Post('portal/orders')
  @ApiOperation({ summary: 'Place order from customer portal' })
  createPortalOrder(
    @CurrentUser() user: any,
    @Body() dto: { tenantId: string; items: any[] }
  ) {
    if (user.role !== 'CUSTOMER') {
      throw new UnauthorizedException('Only customers can place portal orders.');
    }
    return this.salesService.createPortalOrder(user.id, dto.tenantId, dto.items);
  }
}
