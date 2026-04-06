import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  CreateJournalEntryDto,
  UpdateAccountingSettingsDto,
  CreateRecurringJournalEntryDto,
  UpdateRecurringJournalEntryDto,
} from './dto/accounting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}
  private ensureBackofficeUser(user: any) {
    if (user.role === 'CUSTOMER') {
      throw new UnauthorizedException('Customers cannot access accounting APIs.');
    }
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context is required.');
    }
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new account in Chart of Accounts' })
  createAccount(@CurrentUser() user: any, @Body() dto: CreateAccountDto) {
    this.ensureBackofficeUser(user);
    return this.accountingService.createAccount(user.tenantId, dto);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'Find all accounts for the current tenant' })
  findAllAccounts(@CurrentUser() user: any) {
    this.ensureBackofficeUser(user);
    return this.accountingService.findAllAccounts(user.tenantId);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get details of a specific account' })
  findOneAccount(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.accountingService.findOneAccount(user.tenantId, id);
  }

  @Patch('accounts/:id')
  @ApiOperation({ summary: 'Update an existing account' })
  updateAccount(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    this.ensureBackofficeUser(user);
    return this.accountingService.updateAccount(user.tenantId, id, dto);
  }

  @Post('journal-entries')
  @ApiOperation({ summary: 'Create and optionally post a new journal entry' })
  createJournalEntry(@CurrentUser() user: any, @Body() dto: CreateJournalEntryDto) {
    this.ensureBackofficeUser(user);
    return this.accountingService.createJournalEntry(user.tenantId, dto);
  }

  @Get('journal-entries')
  @ApiOperation({ summary: 'Find all journal entries for the current tenant' })
  findAllJournalEntries(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    this.ensureBackofficeUser(user);
    return this.accountingService.findAllJournalEntries(user.tenantId, {
      status,
      from,
      to,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Patch('journal-entries/:id/post')
  @ApiOperation({ summary: 'Post a draft journal entry' })
  postJournalEntry(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.accountingService.postJournalEntry(user.tenantId, id);
  }

  @Patch('journal-entries/:id/cancel')
  @ApiOperation({ summary: 'Cancel a journal entry' })
  cancelJournalEntry(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.accountingService.cancelJournalEntry(user.tenantId, id);
  }

  @Get('ledger/:accountId')
  @ApiOperation({ summary: 'Get the general ledger for a specific account' })
  getLedger(
    @CurrentUser() user: any,
    @Param('accountId') accountId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    this.ensureBackofficeUser(user);
    return this.accountingService.getLedger(user.tenantId, accountId, { from, to });
  }

  @Get('reports/trial-balance')
  @ApiOperation({ summary: 'Get trial balance report' })
  getTrialBalance(@CurrentUser() user: any, @Query('from') from?: string, @Query('to') to?: string) {
    this.ensureBackofficeUser(user);
    return this.accountingService.getTrialBalance(user.tenantId, { from, to });
  }

  @Get('reports/profit-loss')
  @ApiOperation({ summary: 'Get profit and loss report' })
  getProfitAndLoss(@CurrentUser() user: any, @Query('from') from?: string, @Query('to') to?: string) {
    this.ensureBackofficeUser(user);
    return this.accountingService.getProfitAndLoss(user.tenantId, { from, to });
  }

  @Get('reports/balance-sheet')
  @ApiOperation({ summary: 'Get balance sheet report' })
  getBalanceSheet(@CurrentUser() user: any, @Query('from') from?: string, @Query('to') to?: string) {
    this.ensureBackofficeUser(user);
    return this.accountingService.getBalanceSheet(user.tenantId, { from, to });
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get tenant accounting settings' })
  getSettings(@CurrentUser() user: any) {
    this.ensureBackofficeUser(user);
    return this.accountingService.getSettings(user.tenantId);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update tenant accounting settings' })
  updateSettings(@CurrentUser() user: any, @Body() dto: UpdateAccountingSettingsDto) {
    this.ensureBackofficeUser(user);
    return this.accountingService.updateSettings(user.tenantId, user.id, dto);
  }

  @Get('recurring-entries')
  @ApiOperation({ summary: 'List recurring journal entries' })
  listRecurringEntries(@CurrentUser() user: any) {
    this.ensureBackofficeUser(user);
    return this.accountingService.listRecurringEntries(user.tenantId);
  }

  @Post('recurring-entries')
  @ApiOperation({ summary: 'Create recurring journal entry' })
  createRecurringEntry(@CurrentUser() user: any, @Body() dto: CreateRecurringJournalEntryDto) {
    this.ensureBackofficeUser(user);
    return this.accountingService.createRecurringEntry(user.tenantId, user.id, dto);
  }

  @Patch('recurring-entries/:id')
  @ApiOperation({ summary: 'Update recurring journal entry' })
  updateRecurringEntry(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateRecurringJournalEntryDto) {
    this.ensureBackofficeUser(user);
    return this.accountingService.updateRecurringEntry(user.tenantId, id, dto);
  }
}
