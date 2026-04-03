import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { CreateAccountDto, UpdateAccountDto, CreateJournalEntryDto } from './dto/accounting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new account in Chart of Accounts' })
  createAccount(@CurrentUser() user: any, @Body() dto: CreateAccountDto) {
    return this.accountingService.createAccount(user.tenantId, dto);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'Find all accounts for the current tenant' })
  findAllAccounts(@CurrentUser() user: any) {
    return this.accountingService.findAllAccounts(user.tenantId);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get details of a specific account' })
  findOneAccount(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountingService.findOneAccount(user.tenantId, id);
  }

  @Post('accounts/:id')
  @ApiOperation({ summary: 'Update an existing account' })
  updateAccount(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountingService.updateAccount(user.tenantId, id, dto);
  }

  @Post('journal-entries')
  @ApiOperation({ summary: 'Create and optionally post a new journal entry' })
  createJournalEntry(@CurrentUser() user: any, @Body() dto: CreateJournalEntryDto) {
    return this.accountingService.createJournalEntry(user.tenantId, dto);
  }

  @Get('journal-entries')
  @ApiOperation({ summary: 'Find all journal entries for the current tenant' })
  findAllJournalEntries(@CurrentUser() user: any) {
    return this.accountingService.findAllJournalEntries(user.tenantId);
  }

  @Get('ledger/:accountId')
  @ApiOperation({ summary: 'Get the general ledger for a specific account' })
  getLedger(@CurrentUser() user: any, @Param('accountId') accountId: string) {
    return this.accountingService.getLedger(user.tenantId, accountId);
  }

  @Get('reports/trial-balance')
  @ApiOperation({ summary: 'Get trial balance report' })
  getTrialBalance(@CurrentUser() user: any) {
    return this.accountingService.getTrialBalance(user.tenantId);
  }

  @Get('reports/profit-loss')
  @ApiOperation({ summary: 'Get profit and loss report' })
  getProfitAndLoss(@CurrentUser() user: any) {
    return this.accountingService.getProfitAndLoss(user.tenantId);
  }

  @Get('reports/balance-sheet')
  @ApiOperation({ summary: 'Get balance sheet report' })
  getBalanceSheet(@CurrentUser() user: any) {
    return this.accountingService.getBalanceSheet(user.tenantId);
  }
}
