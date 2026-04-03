import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'List all assets' })
  findAll(@CurrentUser() user: any) {
    return this.assetsService.findAll(user.tenantId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get asset summary analytics' })
  getSummary(@CurrentUser() user: any) {
    return this.assetsService.getSummary(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single asset' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.assetsService.findOne(user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  create(@CurrentUser() user: any, @Body() data: CreateAssetDto) {
    return this.assetsService.create(user.tenantId, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an asset' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: UpdateAssetDto) {
    return this.assetsService.update(user.tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.assetsService.remove(user.tenantId, id);
  }

  @Get('maintenance/history')
  @ApiOperation({ summary: 'Get all maintenance records' })
  findAllMaintenance(@CurrentUser() user: any, @Query('assetId') assetId?: string) {
    return this.assetsService.getMaintenanceHistory(user.tenantId, assetId);
  }
}
