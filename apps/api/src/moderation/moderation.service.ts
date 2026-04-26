import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { AggregatesService } from '../aggregates/aggregates.service';
import type { DrizzleDb } from '../db/client';
import { DRIZZLE } from '../db/db.module';
import { reviews } from '../db/schema';

@Injectable()
export class ModerationService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly aggregates: AggregatesService,
  ) {}

  async approve(reviewId: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(reviews)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(eq(reviews.id, reviewId))
        .returning({ productId: reviews.productId });
      if (!updated) throw new NotFoundException('Review not found');
      await this.aggregates.recompute(tx, updated.productId);
    });
  }

  async reject(reviewId: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const [current] = await tx
        .select({ status: reviews.status, productId: reviews.productId })
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .for('update')
        .limit(1);
      if (!current) throw new NotFoundException('Review not found');

      await tx
        .update(reviews)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(eq(reviews.id, reviewId));

      if (current.status === 'approved') {
        await this.aggregates.recompute(tx, current.productId);
      }
    });
  }
}
