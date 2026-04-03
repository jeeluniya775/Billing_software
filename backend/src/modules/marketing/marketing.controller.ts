import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Marketing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('campaigns')
  @ApiOperation({ summary: 'List all campaigns' })
  findAllCampaigns(@CurrentUser() user: any) {
    return this.marketingService.findAllCampaigns(user.tenantId);
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Create a new campaign' })
  createCampaign(@CurrentUser() user: any, @Body() data: any) {
    return this.marketingService.createCampaign(user.tenantId, data);
  }

  @Get('leads')
  @ApiOperation({ summary: 'List all leads' })
  findAllLeads(@CurrentUser() user: any) {
    return this.marketingService.findAllLeads(user.tenantId);
  }

  @Post('leads')
  @ApiOperation({ summary: 'Create a new lead' })
  createLead(@CurrentUser() user: any, @Body() data: any) {
    return this.marketingService.createLead(user.tenantId, data);
  }

  @Patch('leads/:id/status')
  @ApiOperation({ summary: 'Update lead status' })
  updateLeadStatus(@CurrentUser() user: any, @Param('id') id: string, @Body('status') status: string) {
    return this.marketingService.updateLeadStatus(user.tenantId, id, status);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get marketing analytics summary' })
  getAnalytics(@CurrentUser() user: any) {
    return this.marketingService.getMarketingAnalytics(user.tenantId);
  }
}
