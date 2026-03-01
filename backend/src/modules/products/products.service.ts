import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string, search?: string, category?: string) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          category ? { category } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(tenantId: string, id: string, dto: UpdateProductDto) {
    // Ensure product exists for this tenant
    await this.findOne(tenantId, id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(tenantId: string, id: string) {
    // Soft delete by setting isActive to false (optional) or hard delete
    // Let's do hard delete for now as per plan
    await this.findOne(tenantId, id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
