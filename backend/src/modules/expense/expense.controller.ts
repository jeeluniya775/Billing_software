import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('expense')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  createExpense(@CurrentUser() user: any, @Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(user.tenantId, dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get expense summary' })
  getExpenseSummary(@CurrentUser() user: any) {
    return this.expenseService.getExpenseSummary(user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List all expenses' })
  findAllExpenses(@CurrentUser() user: any) {
    return this.expenseService.findAllExpenses(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  findOneExpense(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expenseService.findOneExpense(user.tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense' })
  updateExpense(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expenseService.updateExpense(user.tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense' })
  removeExpense(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expenseService.removeExpense(user.tenantId, id);
  }
}
