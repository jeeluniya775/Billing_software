import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(TenantsService.name);

  async createTenant(ownerId: string, dto: CreateTenantDto) {
    try {
      return await this.prisma.tenant.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          businessType: dto.businessType,
          description: dto.description,
          logoUrl: dto.logoUrl,
          taxNumber: dto.taxNumber,
          currency: dto.currency || 'USD',
          street: dto.street,
          city: dto.city,
          state: dto.state,
          country: dto.country,
          ownerId,
        }
      });
    } catch (error) {
      this.logger.error(`Failed to create tenant: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllByOwner(ownerId: string) {
    return this.prisma.tenant.findMany({
      where: { ownerId }
    });
  }

  async getShopUsers(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
  }

  async createShopUser(tenantId: string, dto: any) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        tenantId,
      }
    });
  }
}
