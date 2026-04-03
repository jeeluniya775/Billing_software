import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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

  // --- Customers ---

  @Post('customers')
  @ApiOperation({ summary: 'Create a new customer' })
  createCustomer(@CurrentUser() user: any, @Body() dto: CreateCustomerDto) {
    return this.salesService.createCustomer(user.tenantId, dto);
  }

  @Get('customers')
  @ApiOperation({ summary: 'List all customers' })
  @ApiQuery({ name: 'search', required: false })
  findAllCustomers(@CurrentUser() user: any, @Query('search') search?: string) {
    return this.salesService.findAllCustomers(user.tenantId, search);
  }

  @Get('customers/:id')
  @ApiOperation({ summary: 'Get customer by ID' })
  findOneCustomer(@CurrentUser() user: any, @Param('id') id: string) {
    return this.salesService.findOneCustomer(user.tenantId, id);
  }

  @Patch('customers/:id')
  @ApiOperation({ summary: 'Update customer' })
  updateCustomer(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.salesService.updateCustomer(user.tenantId, id, dto);
  }

  @Delete('customers/:id')
  @ApiOperation({ summary: 'Delete customer' })
  removeCustomer(@CurrentUser() user: any, @Param('id') id: string) {
    return this.salesService.removeCustomer(user.tenantId, id);
  }

  // --- Invoices ---

  @Post('invoices')
  @ApiOperation({ summary: 'Create a new invoice' })
  createInvoice(@CurrentUser() user: any, @Body() dto: CreateInvoiceDto) {
    return this.salesService.createInvoice(user.tenantId, dto);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List all invoices' })
  @ApiQuery({ name: 'search', required: false })
  findAllInvoices(@CurrentUser() user: any, @Query('search') search?: string) {
    return this.salesService.findAllInvoices(user.tenantId, search);
  }

  @Get('invoices/summary')
  @ApiOperation({ summary: 'Get invoice summary' })
  getInvoiceSummary(@CurrentUser() user: any) {
    return this.salesService.getInvoiceSummary(user.tenantId);
  }

  @Get('invoices/analytics')
  @ApiOperation({ summary: 'Get invoice analytics' })
  getInvoiceAnalytics(@CurrentUser() user: any) {
    return this.salesService.getInvoiceAnalytics(user.tenantId);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOneInvoice(@CurrentUser() user: any, @Param('id') id: string) {
    return this.salesService.findOneInvoice(user.tenantId, id);
  }

  @Patch('invoices/:id')
  @ApiOperation({ summary: 'Update invoice' })
  updateInvoice(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.salesService.updateInvoice(user.tenantId, id, dto);
  }

  @Delete('invoices/:id')
  @ApiOperation({ summary: 'Delete invoice' })
  removeInvoice(@CurrentUser() user: any, @Param('id') id: string) {
    return this.salesService.removeInvoice(user.tenantId, id);
  }
}
