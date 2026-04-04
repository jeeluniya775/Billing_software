import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async createTenant(ownerId: string, dto: CreateTenantDto) {
    const { name, ...rest } = dto;
    return this.prisma.tenant.create({
      data: {
        name,
        ...rest,
        ownerId,
        users: {
          connect: [{ id: ownerId }]
        }
      }
    });
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
