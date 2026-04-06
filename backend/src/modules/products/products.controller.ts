import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  private ensureBackofficeUser(user: any) {
    if (user.role === 'CUSTOMER') {
      throw new UnauthorizedException('Customers cannot access backoffice product APIs.');
    }
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context is required.');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@CurrentUser() user: any, @Body() createProductDto: CreateProductDto) {
    this.ensureBackofficeUser(user);
    return this.productsService.create(user.tenantId, createProductDto);
  }

  @Get('global')
  @ApiOperation({ summary: 'List all products across all tenants' })
  findGlobal(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    if (user.role !== 'CUSTOMER') {
      this.ensureBackofficeUser(user);
    }
    if (user.role === 'CUSTOMER') {
      return this.productsService.findGlobal({ search, category, minPrice, maxPrice });
    }
    if (user.role === 'OWNER') {
      return this.productsService.findGlobal({ search, category, minPrice, maxPrice }, user.id);
    }
    if (!user.tenantId) {
      throw new UnauthorizedException('Tenant context is required.');
    }
    return this.productsService.findAll(user.tenantId, {
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: 1,
      limit: 100,
    }).then((result) => result.items);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    this.ensureBackofficeUser(user);
    return this.productsService.findAll(user.tenantId, {
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.productsService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    this.ensureBackofficeUser(user);
    return this.productsService.update(user.tenantId, id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    this.ensureBackofficeUser(user);
    return this.productsService.remove(user.tenantId, id);
  }
}
