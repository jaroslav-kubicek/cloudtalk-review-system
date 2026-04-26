import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { ProductDetailDto } from './dto/product-detail.dto';
import type { ProductListItemDto } from './dto/product-list-item.dto';
import type { ProductStatsDto } from './dto/product-stats.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(): Promise<ProductListItemDto[]> {
    return this.products.list();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProductDetailDto> {
    return this.products.getById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProductStatsDto> {
    return this.products.getStats(id);
  }
}
