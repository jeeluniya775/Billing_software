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

  async findAll(
    tenantId: string,
    options: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      isActive?: boolean;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    },
  ) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = options;

    const where: any = {
      tenantId,
      AND: [],
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (category) {
      where.AND.push({ category });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.AND.push({
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      });
    }

    const [items, total, stats] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
      this.prisma.product.aggregate({
        where: { tenantId }, // Stats are always for the whole tenant, not just current search/filters
        _sum: {
          stock: true,
        },
        _count: {
          id: true,
          isActive: true,
        },
      }),
    ]);

    // Calculate total inventory value manually for the whole tenant
    const allProducts = await this.prisma.product.findMany({
      where: { tenantId },
      select: { price: true, stock: true, isActive: true, lowStockAlert: true },
    });

    const totalActive = allProducts.filter(p => p.isActive).length;
    const totalInventoryValue = allProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const totalLowStock = allProducts.filter(p => p.stock <= p.lowStockAlert).length;

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          total: allProducts.length,
          active: totalActive,
          lowStock: totalLowStock,
          totalValue: totalInventoryValue,
        },
      },
    };
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
