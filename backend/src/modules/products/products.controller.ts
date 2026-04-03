import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@CurrentUser() user: any, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(user.tenantId, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  findAll(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll(user.tenantId, search, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(user.tenantId, id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.remove(user.tenantId, id);
  }
}
