import { Controller, Post, Get, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateTenantDto } from './dto/tenant.dto';
import { CreateShopUserDto } from './dto/create-user.dto';
import { Param } from '@nestjs/common';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateTenantDto) {
    if (user.role !== 'OWNER') {
      throw new UnauthorizedException('Only owners can create shops.');
    }
    return this.tenantsService.createTenant(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    if (user.role !== 'OWNER') {
      throw new UnauthorizedException('Insufficient permissions. Only owners can list shops.');
    }
    return this.tenantsService.findAllByOwner(user.id);
  }

  @Get(':id/users')
  async getShopUsers(@CurrentUser() user: any, @Param('id') tenantId: string) {
    if (user.role !== 'OWNER') {
      throw new UnauthorizedException('Insufficient permissions.');
    }
    await this.tenantsService.ensureOwnerHasTenant(user.id, tenantId);
    return this.tenantsService.getShopUsers(tenantId);
  }

  @Post(':id/users')
  async createShopUser(
    @CurrentUser() user: any, 
    @Param('id') tenantId: string,
    @Body() dto: CreateShopUserDto
  ) {
    if (user.role !== 'OWNER') {
      throw new UnauthorizedException('Insufficient permissions.');
    }
    await this.tenantsService.ensureOwnerHasTenant(user.id, tenantId);
    return this.tenantsService.createShopUser(tenantId, dto);
  }
}
