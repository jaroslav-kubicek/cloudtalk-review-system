import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDb } from '../db/client';
import { productRatingStats, products } from '../db/schema';
import type { ProductDetailDto } from './dto/product-detail.dto';
import type { ProductListItemDto } from './dto/product-list-item.dto';
import type { ProductStatsDto } from './dto/product-stats.dto';

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async list(): Promise<ProductListItemDto[]> {
    const rows = await this.db
      .select({
        id: products.id,
        externalId: products.externalId,
        name: products.name,
        category: products.category,
        imageUrl: products.imageUrl,
        avgRating: productRatingStats.avgRating,
        reviewCount: productRatingStats.reviewCount,
      })
      .from(products)
      .leftJoin(productRatingStats, eq(productRatingStats.productId, products.id))
      .orderBy(products.name);

    return rows.map((r) => ({
      id: r.id,
      externalId: r.externalId,
      name: r.name,
      category: r.category,
      imageUrl: r.imageUrl,
      avgRating: Number(r.avgRating ?? 0),
      reviewCount: r.reviewCount ?? 0,
    }));
  }

  async getById(id: string): Promise<ProductDetailDto> {
    const [row] = await this.db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!row) throw new NotFoundException('Product not found');
    return {
      id: row.id,
      externalId: row.externalId,
      name: row.name,
      description: row.description,
      category: row.category,
      imageUrl: row.imageUrl,
    };
  }

  async getStats(productId: string): Promise<ProductStatsDto> {
    const [product] = await this.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (!product) throw new NotFoundException('Product not found');

    const [stats] = await this.db
      .select()
      .from(productRatingStats)
      .where(eq(productRatingStats.productId, productId))
      .limit(1);

    return {
      productId,
      avgRating: Number(stats?.avgRating ?? 0),
      reviewCount: stats?.reviewCount ?? 0,
      distribution: {
        '1': stats?.rating1Count ?? 0,
        '2': stats?.rating2Count ?? 0,
        '3': stats?.rating3Count ?? 0,
        '4': stats?.rating4Count ?? 0,
        '5': stats?.rating5Count ?? 0,
      },
    };
  }
}
