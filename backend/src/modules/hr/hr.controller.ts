import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HRService } from './hr.service';
import { CreateEmployeeDto, UpdateEmployeeDto, RecordAttendanceDto } from './dto/hr.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('hr')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HRController {
  constructor(private readonly hrService: HRService) {}

  @Post('employees')
  @ApiOperation({ summary: 'Create a new employee' })
  createEmployee(@CurrentUser() user: any, @Body() dto: CreateEmployeeDto) {
    return this.hrService.createEmployee(user.tenantId, dto);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get HR analytics summary' })
  getHRAnalytics(@CurrentUser() user: any) {
    return this.hrService.getHRAnalytics(user.tenantId);
  }

  @Get('employees')
  @ApiOperation({ summary: 'List all employees' })
  findAllEmployees(@CurrentUser() user: any) {
    return this.hrService.findAllEmployees(user.tenantId);
  }

  @Get('employees/:id')
  @ApiOperation({ summary: 'Get employee details' })
  findOneEmployee(@CurrentUser() user: any, @Param('id') id: string) {
    return this.hrService.findOneEmployee(user.tenantId, id);
  }

  @Patch('employees/:id')
  @ApiOperation({ summary: 'Update employee details' })
  updateEmployee(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.hrService.updateEmployee(user.tenantId, id, dto);
  }

  @Post('attendance')
  @ApiOperation({ summary: 'Record attendance for an employee' })
  recordAttendance(@CurrentUser() user: any, @Body() dto: RecordAttendanceDto) {
    return this.hrService.recordAttendance(user.tenantId, dto);
  }

  @Get('attendance-report')
  @ApiOperation({ summary: 'Get attendance report for a date range' })
  @ApiQuery({ name: 'startDate', type: String })
  @ApiQuery({ name: 'endDate', type: String })
  getAttendanceReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.hrService.getAttendanceReport(user.tenantId, startDate, endDate);
  }
}
