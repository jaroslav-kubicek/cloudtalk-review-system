import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import type { DrizzleDb } from '../db/client';
import { DRIZZLE } from '../db/db.module';
import { products, reviews } from '../db/schema';
import type { CreateReviewDto } from './dto/create-review.dto';
import type { ReviewDto } from './dto/review.dto';

type ReviewRow = typeof reviews.$inferSelect;

const PG_UNIQUE_VIOLATION = '23505';

function toDto(row: ReviewRow): ReviewDto {
  return {
    id: row.id,
    productId: row.productId,
    userId: row.userId,
    rating: row.rating,
    title: row.title,
    body: row.body,
    verifiedPurchase: row.verifiedPurchase,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class ReviewsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async create(userId: string, dto: CreateReviewDto): Promise<ReviewDto> {
    const [product] = await this.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, dto.productId))
      .limit(1);
    if (!product) throw new NotFoundException('Product not found');

    try {
      const inserted = await this.db
        .insert(reviews)
        .values({
          productId: dto.productId,
          userId,
          rating: dto.rating,
          title: dto.title,
          body: dto.body,
        })
        .returning();
      return toDto(inserted[0]!);
    } catch (err) {
      if (isPgError(err) && err.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('You have already reviewed this product');
      }
      throw err;
    }
  }

  async listApproved(productId: string): Promise<ReviewDto[]> {
    await this.assertProductExists(productId);
    const rows = await this.db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')))
      .orderBy(desc(reviews.createdAt));
    return rows.map(toDto);
  }

  async listByAuthor(productId: string, userId: string): Promise<ReviewDto[]> {
    await this.assertProductExists(productId);
    const rows = await this.db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.userId, userId)))
      .orderBy(desc(reviews.createdAt));
    return rows.map(toDto);
  }

  private async assertProductExists(productId: string): Promise<void> {
    const [product] = await this.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (!product) throw new NotFoundException('Product not found');
  }
}

function isPgError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code: unknown }).code === 'string';
}
