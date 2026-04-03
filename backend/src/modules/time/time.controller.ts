import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TimeService } from './time.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Time Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get('entries')
  @ApiOperation({ summary: 'List all time entries' })
  findAll(@CurrentUser() user: any) {
    return this.timeService.findAll(user.tenantId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get time tracking summary' })
  getSummary(@CurrentUser() user: any) {
    return this.timeService.getSummary(user.tenantId);
  }

  @Post('entries')
  @ApiOperation({ summary: 'Create a new time entry' })
  create(@CurrentUser() user: any, @Body() data: any) {
    return this.timeService.create(user.tenantId, data);
  }
}
