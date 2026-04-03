import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('records')
  @ApiOperation({ summary: 'List all payroll records' })
  findAll(@CurrentUser() user: any) {
    return this.payrollService.findAllRecords(user.tenantId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get payroll summary' })
  getSummary(@CurrentUser() user: any) {
    return this.payrollService.getSummary(user.tenantId);
  }

  @Post('records')
  @ApiOperation({ summary: 'Create a new payroll record' })
  create(@CurrentUser() user: any, @Body() data: any) {
    return this.payrollService.createRecord(user.tenantId, data);
  }
}
